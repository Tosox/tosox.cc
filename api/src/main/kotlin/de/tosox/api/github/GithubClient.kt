package de.tosox.api.github

import de.tosox.api.config.GithubProperties
import de.tosox.api.github.model.Avatar
import de.tosox.api.github.model.GhIssue
import de.tosox.api.github.model.GhRepo
import de.tosox.api.github.model.GhSearchResponse
import de.tosox.api.github.model.GhUser
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import org.springframework.web.client.body

@Component
class GithubClient(private val props: GithubProperties) {
	private val client: RestClient = run {
		val builder = RestClient.builder()
			.baseUrl(BASE_URL)
			.defaultHeader(HttpHeaders.ACCEPT, "application/vnd.github+json")
			.defaultHeader("X-GitHub-Api-Version", "2022-11-28")
		if (props.token.isNotBlank()) {
			builder.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer ${props.token.trim()}")
		}
		builder.build()
	}

	// No base URL and, deliberately, no auth token: this talks to the avatar CDN
	private val avatarClient: RestClient = RestClient.create()

	fun fetchProfile(): GhUser =
		client.get()
			.uri("/users/{username}", props.username)
			.retrieve()
			.body<GhUser>()
			?: error("Empty profile response for ${props.username}")

	fun fetchRepos(): List<GhRepo> = fetchPaged("/users/{name}/repos", props.username, "type" to "owner")

	fun fetchOrgRepos(org: String): List<GhRepo> = fetchPaged("/orgs/{name}/repos", org)

	private fun fetchPaged(path: String, name: String, vararg params: Pair<String, String>): List<GhRepo> {
		val all = mutableListOf<GhRepo>()
		for (page in 1..MAX_REPO_PAGES) {
			val batch = client.get()
				.uri { b ->
					params.forEach { (k, v) -> b.queryParam(k, v) }
					b.path(path)
						.queryParam("per_page", PER_PAGE)
						.queryParam("sort", "updated")
						.queryParam("page", page)
						.build(name)
				}
				.retrieve()
				.body<Array<GhRepo>>()
				.orEmpty()
			all += batch
			if (batch.size < PER_PAGE) break
		}
		return all
	}

	// PRs authored by the user in repositories they don't own
	fun fetchContributions(): List<GhIssue> {
		val excludes = props.excludedUsers.joinToString(" ") { "-user:$it" }
		val query = "is:pr author:${props.username} $excludes".trim()
		return client.get()
			.uri { b ->
				b.path("/search/issues")
					.queryParam("q", query)
					.queryParam("sort", "updated")
					.queryParam("order", "desc")
					.queryParam("per_page", props.searchLimit)
					.build()
			}
			.retrieve()
			.body<GhSearchResponse>()
			?.items
			.orEmpty()
	}

	fun fetchAvatar(avatarUrl: String): Avatar {
		val separator = if ('?' in avatarUrl) '&' else '?'
		val response = avatarClient.get()
			.uri("$avatarUrl${separator}s=$AVATAR_SIZE")
			.retrieve()
			.toEntity(ByteArray::class.java)
		val bytes = response.body ?: error("Empty avatar response")
		val contentType = response.headers.contentType ?: MediaType.IMAGE_PNG
		require(contentType.type == "image") { "Avatar has unexpected content type $contentType" }
		return Avatar(bytes, contentType)
	}

	companion object {
		private const val BASE_URL = "https://api.github.com"
		private const val PER_PAGE = 100
		private const val MAX_REPO_PAGES = 10
		private const val AVATAR_SIZE = 200 // displayed at 100 px, 2x for high-DPI
	}
}
