package de.tosox.api.github

import de.tosox.api.config.GithubProperties
import de.tosox.api.github.model.Avatar
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

/** Caches the GitHub [Snapshot]; a failed refresh keeps the previous one. */
@Service
class GithubService(
	private val client: GithubClient,
	private val props: GithubProperties,
) {

	private val log = LoggerFactory.getLogger(javaClass)

	@Volatile
	private var snapshot: Snapshot? = null

	@Volatile
	private var avatar: Avatar? = null

	fun current(): Snapshot? = snapshot

	fun avatar(): Avatar? = avatar

	@Scheduled(initialDelay = 0, fixedDelayString = "\${github.refresh-interval-ms}")
	fun refresh() {
		try {
			val user = client.fetchProfile()
			refreshAvatar(user.avatarUrl)
			val repos = client.fetchRepos()
				.filterNot { it.fork }
				.associate { it.name to it.toRepo() }
			val orgs = fetchOrgs()
			val contributions = client.fetchContributions().map { it.toContribution() }

			snapshot = Snapshot(
				profile = Profile(user.login, user.publicRepos, user.followers),
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

	private fun refreshAvatar(avatarUrl: String) {
		try {
			avatar = client.fetchAvatar(avatarUrl)
		} catch (e: Exception) {
			log.warn("Failed to fetch avatar; keeping previous one: {}", e.message)
		}
	}

	// One failing org yields an empty map instead of discarding the whole snapshot
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
		// https://api.github.com/repos/owner/name -> "owner/name"
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
