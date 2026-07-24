package de.tosox.api.github

import de.tosox.api.config.GithubProperties
import de.tosox.api.github.model.Contribution
import de.tosox.api.github.model.GhIssue
import de.tosox.api.github.model.GhRepo
import de.tosox.api.github.model.Profile
import de.tosox.api.github.model.Repo
import de.tosox.api.github.model.Snapshot
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.Instant

/**
 * Holds the cached GitHub [Snapshot] and refreshes it on a schedule. On refresh failure (e.g. a rate
 * limit or GitHub outage) the previous snapshot is retained as last-known-good.
 */
@Service
class GithubService(
	private val client: GithubClient,
	private val props: GithubProperties,
) {

	private val log = LoggerFactory.getLogger(javaClass)

	@Volatile
	private var snapshot: Snapshot? = null

	/** Current cached snapshot, or null until the first successful refresh. */
	fun current(): Snapshot? = snapshot

	/** Runs immediately at startup, then every `github.refresh-interval-ms`. */
	@Scheduled(initialDelay = 0, fixedDelayString = "\${github.refresh-interval-ms}")
	fun refresh() {
		try {
			val user = client.fetchProfile()
			// Forks aren't the user's own work and are never shown on the site.
			val repos = client.fetchRepos()
				.filterNot { it.fork }
				.associate { it.name to it.toRepo() }
			val orgs = fetchOrgs()
			val contributions = client.fetchContributions().map { it.toContribution() }

			snapshot = Snapshot(
				profile = Profile(user.login, user.avatarUrl, user.publicRepos, user.followers),
				repos = repos,
				orgs = orgs,
				contributions = contributions,
				generatedAt = Instant.now().toString(),
			)
			log.info(
				"GitHub snapshot refreshed: {} repos, {} orgs, {} contributions",
				repos.size, orgs.size, contributions.size,
			)
		} catch (e: Exception) {
			if (snapshot == null) {
				log.error("Initial GitHub refresh failed; no snapshot available yet: {}", e.message)
			} else {
				log.warn("GitHub refresh failed; keeping previous snapshot: {}", e.message)
			}
		}
	}

	/**
	 * Repositories for each configured organization, keyed by org login then repo name. A single org
	 * failing (renamed, deleted, rate-limited) is logged and yields an empty map for that org rather
	 * than failing the whole refresh and discarding the otherwise-good snapshot.
	 */
	private fun fetchOrgs(): Map<String, Map<String, Repo>> =
		props.organizations.associateWith { org ->
			try {
				client.fetchOrgRepos(org)
					.filterNot { it.fork }
					.associate { it.name to it.toRepo() }
			} catch (e: Exception) {
				log.warn("Failed to fetch repos for org '{}': {}", org, e.message)
				emptyMap()
			}
		}

	private fun GhRepo.toRepo(): Repo =
		Repo(
			description = description,
			stars = stars,
			forks = forks,
			language = language,
			url = url,
			archived = archived,
		)

	private fun GhIssue.toContribution(): Contribution {
		val resolvedState = if (pullRequest?.mergedAt != null) "merged" else state
		// repository_url looks like https://api.github.com/repos/owner/name -> "owner/name"
		val repo = repositoryUrl.substringAfter("/repos/", repositoryUrl)
		return Contribution(
			title = title,
			repo = repo,
			number = number,
			state = resolvedState,
			url = url,
			updatedAt = updatedAt,
		)
	}
}
