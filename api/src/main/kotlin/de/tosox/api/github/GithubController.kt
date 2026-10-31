package de.tosox.api.github

import de.tosox.api.github.model.Snapshot
import org.springframework.http.CacheControl
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Duration

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


	/**
	 * The mirrored GitHub avatar, so the site never makes visitors' browsers contact GitHub.
	 * Responds 503 until it has been fetched once; the frontend then falls back to a bundled copy.
	 */
	@GetMapping("/api/github/avatar")
	fun avatar(): ResponseEntity<ByteArray> =
		service.avatar()
			?.let {
				ResponseEntity.ok()
					.contentType(it.contentType)
					.cacheControl(CacheControl.maxAge(Duration.ofHours(1)).cachePublic())
					.body(it.bytes)
			}
			?: ResponseEntity.status(503).build()
}
