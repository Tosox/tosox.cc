plugins {
	// Lets Gradle auto-download the JDK 21 toolchain if it isn't installed locally.
	id("org.gradle.toolchains.foojay-resolver-convention") version "0.9.0"
}

rootProject.name = "api"
