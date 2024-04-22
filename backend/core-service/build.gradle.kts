import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

group = "com.lightswitch"
version = "0.0.1-SNAPSHOT"

plugins {
	id("org.springframework.boot") version "3.2.4"
	id("io.spring.dependency-management") version "1.1.4"
	id("jacoco")
	id("org.sonarqube") version "4.4.1.3373"
	kotlin("jvm") version "1.9.23"
	kotlin("plugin.spring") version "1.9.23"
	kotlin("plugin.jpa") version "1.9.23"
	kotlin("plugin.allopen") version "1.9.23"
	kotlin("plugin.noarg") version "1.9.23"
	kotlin("kapt") version "1.9.23"
	id("io.gitlab.arturbosch.detekt") version "1.23.6"
	idea
}

allOpen {
	annotation("jakarta.persistence.Entity")
	annotation("jakarta.persistence.MappedSuperclass")
	annotation("jakarta.persistence.Embeddable")
}

noArg {
	annotation("jakarta.persistence.Entity")
}

// build시 불필요한 jar파일 생성하지 않도록 함.
// reference : https://www.devkuma.com/docs/gradle/bootjar-jar/
tasks.getByName("bootJar") {
	enabled = false
}

tasks.getByName("jar") {
	enabled = true
}


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
	// spring mail
	implementation("org.springframework.boot:spring-boot-starter-mail")

	// spring framework
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-validation")

	// kotlin
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

	// database
	runtimeOnly("org.postgresql:postgresql") // 추가
//	runtimeOnly("com.mysql:mysql-connector-j")
	runtimeOnly("com.h2database:h2")

	// queryDsl
	implementation ("com.querydsl:querydsl-jpa:5.0.0:jakarta")
	kapt ("com.querydsl:querydsl-apt:5.0.0:jakarta")
	kapt ("jakarta.annotation:jakarta.annotation-api")
	kapt ("jakarta.persistence:jakarta.persistence-api")

	// lombok
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")

	// test
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
	jvmArgs("-Xshare:off")
}

idea {
	module {
		val kaptMain = file("build/generated/source/kapt/main")
		sourceDirs.add(kaptMain)
		generatedSourceDirs.add(kaptMain)
	}
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
		property ("sonar.projectKey", "s202-core")
		property ("sonar.projectName", "s202-core")
		property ("sonar.host.url", "https://sonarqube.ssafy.com")
		property ("sonar.login", "2e8a55857b93867d8387040731ce81621da959ac")
		property ("sonar.language", "java")
		property ("sonar.sourceEncoding", "UTF-8")
		property ("sonar.profile", "Sonar way")
		property ("sonar.test.inclusions", "**/*Test.java")
		property ("sonar.coverage.jacoco.xmlReportPaths", "${layout.buildDirectory}/reports/jacoco/test/jacocoTestReport.xml")
	}
}
