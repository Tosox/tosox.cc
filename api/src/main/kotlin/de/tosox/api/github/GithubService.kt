package de.tosox.api.github

import de.tosox.api.github.model.Contribution
import de.tosox.api.github.model.GhIssue
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
class GithubService(private val client: GithubClient) {

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
				.associate {
					it.name to Repo(
						description = it.description,
						stars = it.stars,
						forks = it.forks,
						language = it.language,
						url = it.url,
						archived = it.archived,
					)
				}
			val contributions = client.fetchContributions().map { it.toContribution() }

			snapshot = Snapshot(
				profile = Profile(user.login, user.avatarUrl, user.publicRepos, user.followers),
				repos = repos,
				contributions = contributions,
				generatedAt = Instant.now().toString(),
			)
			log.info("GitHub snapshot refreshed: {} repos, {} contributions", repos.size, contributions.size)
		} catch (e: Exception) {
			if (snapshot == null) {
				log.error("Initial GitHub refresh failed; no snapshot available yet: {}", e.message)
			} else {
				log.warn("GitHub refresh failed; keeping previous snapshot: {}", e.message)
			}
		}
	}

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
