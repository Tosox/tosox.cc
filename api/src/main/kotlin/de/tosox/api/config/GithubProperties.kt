package de.tosox.api.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "github")
data class GithubProperties(
	val username: String,
	val organizations: List<String>,
	val token: String,
	val excludedUsers: List<String>,
	val refreshIntervalMs: Long,
	val searchLimit: Int,
)
