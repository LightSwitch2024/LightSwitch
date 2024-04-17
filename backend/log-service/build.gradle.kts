import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "3.2.4"
	id("io.spring.dependency-management") version "1.1.4"
	kotlin("jvm") version "1.9.23"
	kotlin("plugin.spring") version "1.9.23"
	kotlin("plugin.jpa") version "1.9.23"
	kotlin("plugin.allopen") version "1.9.23"
	kotlin("plugin.noarg") version "1.9.23"
	id("jacoco")
	id("org.sonarqube") version "4.4.1.3373"
	id("io.gitlab.arturbosch.detekt") version "1.23.6"
}

allOpen {
	annotation("javax.persistence.Entity")
}

noArg {
	annotation("javax.persistence.Entity")
}

group = "com.lightswitch"
version = "0.0.1-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_17
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("com.google.code.gson:gson:2.7")
	implementation("org.springframework.boot:spring-boot-starter-data-mongodb")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs += "-Xjsr305=strict"
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}


jacoco {
	toolVersion = "0.8.8"
}

tasks.jacocoTestReport {
	reports {
		xml.required.set(true)
		csv.required.set(false)
		html.required.set(false)
	}
}

plugins.withType<JacocoPlugin> {
	tasks["test"].finalizedBy("jacocoTestReport")
}
tasks.jacocoTestCoverageVerification {
	violationRules {
		rule {
			enabled = true // 이 rule을 적용할 것이다.
			element = "CLASS" // class 단위로

			// 브랜치 커버리지 최소 50%
			limit {
				counter = "BRANCH"
				value = "COVEREDRATIO"
				minimum = "0.50".toBigDecimal()
			}

			// 라인 커버리지 최소한 80%
			limit {
				counter = "LINE"
				value = "COVEREDRATIO"
				minimum = "0.80".toBigDecimal()
			}

			// 빈 줄을 제외한 코드의 라인수 최대 300라인
			limit {
				counter = "LINE"
				value = "TOTALCOUNT"
				maximum = "300".toBigDecimal()
			}
		}
	}
}

sonarqube {
	properties {
		property ("sonar.projectKey", "s202-log")
		property ("sonar.projectName", "s202-log")
		property ("sonar.host.url", "https://sonarqube.ssafy.com")
		property ("sonar.login", "09278b006215cacb3954a4b23687aaba2dd2356d")
		property ("sonar.language", "java")
		property ("sonar.sourceEncoding", "UTF-8")
		property ("sonar.profile", "Sonar way")
		property ("sonar.test.inclusions", "**/*Test.java")
		property ("sonar.coverage.jacoco.xmlReportPaths", "${layout.buildDirectory}/reports/jacoco/test/jacocoTestReport.xml")
	}
}
