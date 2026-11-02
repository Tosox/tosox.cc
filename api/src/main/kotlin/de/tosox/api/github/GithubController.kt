package de.tosox.api.github

import de.tosox.api.github.model.Snapshot
import org.springframework.http.CacheControl
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Duration

@RestController
class GithubController(private val service: GithubService) {

	// Both endpoints answer 503 until the first refresh has succeeded

	@GetMapping("/api/github")
	fun github(): ResponseEntity<Snapshot> =
		service.current()
			?.let { ResponseEntity.ok(it) }
			?: ResponseEntity.status(503).build()

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
