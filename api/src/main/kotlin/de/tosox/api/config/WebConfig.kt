package de.tosox.api.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/**
 * Allows the Angular dev server (ng serve on :4200) to call the API directly during local development.
 * In production the frontend is served same-origin behind nginx, so CORS is not needed there.
 */
@Configuration
class WebConfig : WebMvcConfigurer {
	override fun addCorsMappings(registry: CorsRegistry) {
		registry.addMapping("/api/**")
			.allowedOrigins("http://localhost:4200")
			.allowedMethods("GET")
	}
}
