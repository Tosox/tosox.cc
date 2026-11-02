package de.tosox.api.github.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import org.springframework.http.MediaType

// Served at GET /api/github

data class Snapshot(
	val profile: Profile,
	val repos: Map<String, Repo>,
	/** Keyed by org, then repo name; separate from [repos] so same-named repos never collide */
	val orgs: Map<String, Map<String, Repo>>,
	val contributions: List<Contribution>,
	val generatedAt: String,
)

data class Profile(
	val login: String,
	val publicRepos: Int,
	val followers: Int,
)

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
	/** "owner/name" */
	val repo: String,
	val number: Int,
	val state: String,
	val url: String,
	val updatedAt: String,
)

class Avatar(val bytes: ByteArray, val contentType: MediaType)

// Deserialized from api.github.com

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
