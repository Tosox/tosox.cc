package de.tosox.api.github.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

/* ─────────────────────────  API output (served at GET /api/github)  ───────────────────────── */

/** The full cached snapshot returned to the frontend in a single request. */
data class Snapshot(
	val profile: Profile,
	/** Keyed by repository name (e.g. "Autocomplete-Tasks"). */
	val repos: Map<String, Repo>,
	/**
	 * Repositories of the configured organizations, keyed by org login and then by repository name.
	 * Kept separate from [repos] so an org repo and a user repo of the same name never collide.
	 */
	val orgs: Map<String, Map<String, Repo>>,
	val contributions: List<Contribution>,
	/** ISO-8601 timestamp of when this snapshot was built. */
	val generatedAt: String,
)

data class Profile(
	val login: String,
	val avatarUrl: String,
	val publicRepos: Int,
	val followers: Int,
)

/**
 * Live facts about a repository. Everything here comes from GitHub — the frontend supplies only the
 * editorial layer (which repos to show, in which group, under which title).
 */
data class Repo(
	val description: String?,
	val stars: Int,
	val forks: Int,
	val language: String?,
	val url: String,
	val archived: Boolean,
)

data class Contribution(
	val title: String,
	/** "owner/name" of the target repository. */
	val repo: String,
	val number: Int,
	/** "merged", "open" or "closed". */
	val state: String,
	val url: String,
	val updatedAt: String,
)

/* ─────────────────────────  GitHub API DTOs (deserialized from api.github.com)  ───────────────────────── */

@JsonIgnoreProperties(ignoreUnknown = true)
data class GhUser(
	val login: String,
	@JsonProperty("avatar_url") val avatarUrl: String,
	@JsonProperty("public_repos") val publicRepos: Int,
	val followers: Int,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class GhRepo(
	val name: String,
	val description: String? = null,
	@JsonProperty("stargazers_count") val stars: Int,
	@JsonProperty("forks_count") val forks: Int,
	val language: String?,
	@JsonProperty("html_url") val url: String,
	val archived: Boolean = false,
	val fork: Boolean = false,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class GhSearchResponse(
	val items: List<GhIssue> = emptyList(),
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class GhIssue(
	val title: String,
	val number: Int,
	val state: String,
	@JsonProperty("html_url") val url: String,
	@JsonProperty("repository_url") val repositoryUrl: String,
	@JsonProperty("updated_at") val updatedAt: String,
	@JsonProperty("pull_request") val pullRequest: GhPullRequestRef? = null,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class GhPullRequestRef(
	@JsonProperty("merged_at") val mergedAt: String? = null,
)
