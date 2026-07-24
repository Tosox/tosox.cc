package de.tosox.api.config

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 * Configuration for the GitHub data fetch/cache, bound from the `github.*` keys in application.yml.
 */
@ConfigurationProperties(prefix = "github")
data class GithubProperties(
	/** GitHub username whose profile, repos and PRs are shown. */
	val username: String = "Tosox",
	/**
	 * Organizations whose repositories are fetched for the "Frameworks & SDKs" showcase, keyed by
	 * org login. Their repos are stored separately from the user's own (see `Snapshot.orgs`), so a
	 * repo that exists under both an org and the user account never collides.
	 */
	val organizations: List<String> = listOf("rpc4games", "CoHModSDK", "CodeSparkApp"),
	/** Optional personal access token; blank = unauthenticated (60 req/hr). */
	val token: String = "",
	/** Users/orgs excluded from the "external contributions" search (e.g. the user's own account). */
	val excludedUsers: List<String> = listOf("Tosox", "CoHModSDK", "rpc4games"),
	/** How often the cached snapshot is refreshed, in milliseconds. */
	val refreshIntervalMs: Long = 1_800_000,
	/** Max number of contribution PRs to fetch. */
	val searchLimit: Int = 40,
)
