package de.tosox.api.github

import de.tosox.api.github.model.Snapshot
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class GithubController(private val service: GithubService) {

	/**
	 * Returns the cached GitHub snapshot. Responds 503 only while the very first refresh is still
	 * in progress (no snapshot yet).
	 */
	@GetMapping("/api/github")
	fun github(): ResponseEntity<Snapshot> =
		service.current()
			?.let { ResponseEntity.ok(it) }
			?: ResponseEntity.status(503).build()
}
