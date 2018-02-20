/**
 * Copyright 2013-2018 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const mkdirp = require('mkdirp');
const cleanup = require('generator-jhipster/generators/cleanup');
const constants = require('generator-jhipster/generators/generator-constants');

/* Constants use throughout */
const INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX;
const DOCKER_DIR = constants.DOCKER_DIR;
const TEST_DIR = constants.TEST_DIR;
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;
const SERVER_TEST_RES_DIR = constants.SERVER_TEST_RES_DIR;

const BASE_DIR = '../../../node_modules/generator-jhipster/generators/server/templates/';

const KOTLIN_VERSION_STR = ['${', 'kotlin.version}'].join('');

const mavenPluginConfiguration = `          <configuration>
                    <args>
                        <arg>-Xjsr305=strict</arg>
                    </args>
                    <compilerPlugins>
                        <plugin>spring</plugin>
                    </compilerPlugins>
                    <jvmTarget>1.8</jvmTarget>
                    </configuration>
                    <executions>
                        <execution>
                            <id>compile</id>
                            <phase>compile</phase>
                            <goals>
                                <goal>compile</goal>
                            </goals>
                        </execution>     
                    </executions>
                    <dependencies>
                        <dependency>
                            <groupId>org.jetbrains.kotlin</groupId>
                            <artifactId>kotlin-maven-allopen</artifactId>
                            <version>${KOTLIN_VERSION_STR}</version>
                        </dependency>
                    </dependencies>`;

module.exports = {
    writeFiles
};

let javaDir;

function writeFiles() {
    return {

        setUpJavaDir() {
            javaDir = this.javaDir = `${constants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        },

        cleanupOldServerFiles() {
            cleanup.cleanupOldServerFiles(this, this.javaDir, this.testDir);
        },

        writeGlobalFiles() {
            this.template(`${BASE_DIR}_README.md`, 'README.md');
            this.template(`${BASE_DIR}gitignore`, '.gitignore');
            this.copy(`${BASE_DIR}gitattributes`, '.gitattributes');
            this.copy(`${BASE_DIR}editorconfig`, '.editorconfig');
        },

        writeDockerFiles() {
            // Create Docker and Docker Compose files
            this.template(`${BASE_DIR}${DOCKER_DIR}_Dockerfile`, `${DOCKER_DIR}Dockerfile`);
            this.template(`${BASE_DIR}${DOCKER_DIR}.dockerignore`, `${DOCKER_DIR}.dockerignore`);
            this.template(`${BASE_DIR}${DOCKER_DIR}_app.yml`, `${DOCKER_DIR}app.yml`);
            if (this.prodDatabaseType === 'mysql') {
                this.template(`${BASE_DIR}${DOCKER_DIR}_mysql.yml`, `${DOCKER_DIR}mysql.yml`);
            }
            if (this.prodDatabaseType === 'mariadb') {
                this.template(`${BASE_DIR}${DOCKER_DIR}_mariadb.yml`, `${DOCKER_DIR}mariadb.yml`);
            }
            if (this.prodDatabaseType === 'postgresql') {
                this.template(`${BASE_DIR}${DOCKER_DIR}_postgresql.yml`, `${DOCKER_DIR}postgresql.yml`);
            }
            if (this.prodDatabaseType === 'mongodb') {
                this.template(`${BASE_DIR}${DOCKER_DIR}_mongodb.yml`, `${DOCKER_DIR}mongodb.yml`);
                this.template(`${BASE_DIR}${DOCKER_DIR}_mongodb-cluster.yml`, `${DOCKER_DIR}mongodb-cluster.yml`);
                this.template(`${BASE_DIR}${DOCKER_DIR}mongodb/MongoDB.Dockerfile`, `${DOCKER_DIR}mongodb/MongoDB.Dockerfile`);
                this.template(`${BASE_DIR}${DOCKER_DIR}mongodb/scripts/init_replicaset.js`, `${DOCKER_DIR}mongodb/scripts/init_replicaset.js`);
            }
            if (this.prodDatabaseType === 'couchbase') {
                this.template(`${BASE_DIR}${DOCKER_DIR}_couchbase.yml`, `${DOCKER_DIR}couchbase.yml`);
                this.template(`${BASE_DIR}${DOCKER_DIR}_couchbase-cluster.yml`, `${DOCKER_DIR}couchbase-cluster.yml`);
                this.template(`${BASE_DIR}${DOCKER_DIR}couchbase/Couchbase.Dockerfile`, `${DOCKER_DIR}couchbase/Couchbase.Dockerfile`);
                this.template(`${BASE_DIR}${DOCKER_DIR}couchbase/scripts/configure-node.sh`, `${DOCKER_DIR}couchbase/scripts/configure-node.sh`);
            }
            if (this.prodDatabaseType === 'mssql') {
                this.template(`${BASE_DIR}${DOCKER_DIR}_mssql.yml`, `${DOCKER_DIR}mssql.yml`);
            }
            if (this.prodDatabaseType === 'oracle') {
                this.template(`${BASE_DIR}${DOCKER_DIR}_oracle.yml`, `${DOCKER_DIR}oracle.yml`);
            }
            if (this.prodDatabaseType === 'cassandra') {
                // docker-compose files
                this.template(`${BASE_DIR}${DOCKER_DIR}_cassandra.yml`, `${DOCKER_DIR}cassandra.yml`);
                this.template(`${BASE_DIR}${DOCKER_DIR}_cassandra-cluster.yml`, `${DOCKER_DIR}cassandra-cluster.yml`);
                this.template(`${BASE_DIR}${DOCKER_DIR}_cassandra-migration.yml`, `${DOCKER_DIR}cassandra-migration.yml`);
                // dockerfiles
                this.template(`${BASE_DIR}${DOCKER_DIR}cassandra/_Cassandra-Migration.Dockerfile`, `${DOCKER_DIR}cassandra/Cassandra-Migration.Dockerfile`);
                // scripts
                this.template(`${BASE_DIR}${DOCKER_DIR}cassandra/scripts/_autoMigrate.sh`, `${DOCKER_DIR}cassandra/scripts/autoMigrate.sh`);
                this.template(`${BASE_DIR}${DOCKER_DIR}cassandra/scripts/_execute-cql.sh`, `${DOCKER_DIR}cassandra/scripts/execute-cql.sh`);
            }
            if (this.cacheProvider === 'hazelcast') {
                this.template(`${BASE_DIR}${DOCKER_DIR}_hazelcast-management-center.yml`, `${DOCKER_DIR}hazelcast-management-center.yml`);
            }
            if (this.searchEngine === 'elasticsearch') {
                this.template(`${BASE_DIR}${DOCKER_DIR}_elasticsearch.yml`, `${DOCKER_DIR}elasticsearch.yml`);
            }
            if (this.messageBroker === 'kafka') {
                this.template(`${BASE_DIR}${DOCKER_DIR}_kafka.yml`, `${DOCKER_DIR}kafka.yml`);
            }
            if (this.serviceDiscoveryType) {
                this.template(`${BASE_DIR}${DOCKER_DIR}config/_README.md`, `${DOCKER_DIR}central-server-config/README.md`);

                if (this.serviceDiscoveryType === 'consul') {
                    this.template(`${BASE_DIR}${DOCKER_DIR}_consul.yml`, `${DOCKER_DIR}consul.yml`);
                    this.copy(`${BASE_DIR}${DOCKER_DIR}config/git2consul.json`, `${DOCKER_DIR}config/git2consul.json`);
                    this.copy(`${BASE_DIR}${DOCKER_DIR}config/consul-config/application.yml`, `${DOCKER_DIR}central-server-config/application.yml`);
                }
                if (this.serviceDiscoveryType === 'eureka') {
                    this.template(`${BASE_DIR}${DOCKER_DIR}_jhipster-registry.yml`, `${DOCKER_DIR}jhipster-registry.yml`);
                    this.copy(`${BASE_DIR}${DOCKER_DIR}config/docker-config/application.yml`, `${DOCKER_DIR}central-server-config/docker-config/application.yml`);
                    this.copy(`${BASE_DIR}${DOCKER_DIR}config/localhost-config/application.yml`, `${DOCKER_DIR}central-server-config/localhost-config/application.yml`);
                }
            }

            if (this.enableSwaggerCodegen) {
                this.template(`${BASE_DIR}${DOCKER_DIR}_swagger-editor.yml`, `${DOCKER_DIR}swagger-editor.yml`);
            }

            this.template(`${BASE_DIR}${DOCKER_DIR}_sonar.yml`, `${DOCKER_DIR}sonar.yml`);

            if (this.authenticationType === 'oauth2') {
                this.template(`${BASE_DIR}${DOCKER_DIR}_keycloak.yml`, `${DOCKER_DIR}keycloak.yml`);
                this.template(`${BASE_DIR}${DOCKER_DIR}config/realm-config/_jhipster-realm.json`, `${DOCKER_DIR}realm-config/jhipster-realm.json`);
                this.copy(`${BASE_DIR}${DOCKER_DIR}config/realm-config/jhipster-users-0.json`, `${DOCKER_DIR}realm-config/jhipster-users-0.json`);
            }
        },

        writeServerBuildFiles() {
            switch (this.buildTool) {
            case 'gradle':
                this.template(`${BASE_DIR}_build.gradle`, 'build.gradle');
                this.template(`${BASE_DIR}_settings.gradle`, 'settings.gradle');
                this.template(`${BASE_DIR}_gradle.properties`, 'gradle.properties');
                this.template(`${BASE_DIR}gradle/_sonar.gradle`, 'gradle/sonar.gradle');
                this.template(`${BASE_DIR}gradle/_docker.gradle`, 'gradle/docker.gradle');
                this.template(`${BASE_DIR}gradle/_profile_dev.gradle`, 'gradle/profile_dev.gradle', this, { interpolate: INTERPOLATE_REGEX });
                this.template(`${BASE_DIR}gradle/_profile_prod.gradle`, 'gradle/profile_prod.gradle', this, { interpolate: INTERPOLATE_REGEX });
                this.template(`${BASE_DIR}gradle/_mapstruct.gradle`, 'gradle/mapstruct.gradle', this, { interpolate: INTERPOLATE_REGEX });
                this.template(`${BASE_DIR}gradle/_graphite.gradle`, 'gradle/graphite.gradle');
                this.template(`${BASE_DIR}gradle/_prometheus.gradle`, 'gradle/prometheus.gradle');
                this.template(`${BASE_DIR}gradle/_zipkin.gradle`, 'gradle/zipkin.gradle');
                if (this.gatlingTests) {
                    this.template(`${BASE_DIR}gradle/_gatling.gradle`, 'gradle/gatling.gradle');
                }
                if (this.databaseType === 'sql') {
                    this.template(`${BASE_DIR}gradle/_liquibase.gradle`, 'gradle/liquibase.gradle');
                }
                if (this.enableSwaggerCodegen) {
                    this.template(`${BASE_DIR}gradle/_swagger.gradle`, 'gradle/swagger.gradle');
                }
                this.copy(`${BASE_DIR}gradlew`, 'gradlew');
                this.copy(`${BASE_DIR}gradlew.bat`, 'gradlew.bat');
                this.copy(`${BASE_DIR}gradle/wrapper/gradle-wrapper.jar`, 'gradle/wrapper/gradle-wrapper.jar');
                this.copy(`${BASE_DIR}gradle/wrapper/gradle-wrapper.properties`, 'gradle/wrapper/gradle-wrapper.properties');
                this.template(`gradle/_kotlin.gradle`, 'gradle/kotlin.gradle');

                this.addGradlePlugin('org.jetbrains.kotlin', 'kotlin-gradle-plugin', '1.2.21');
                this.addGradlePlugin('org.jetbrains.kotlin', 'kotlin-allopen', '1.2.21');

                this.applyFromGradleScript('gradle/kotlin');

                break;
            case 'maven':
            default:
                this.copy(`${BASE_DIR}mvnw`, 'mvnw');
                this.copy(`${BASE_DIR}mvnw.cmd`, 'mvnw.cmd');
                this.copy(`${BASE_DIR}.mvn/wrapper/maven-wrapper.jar`, '.mvn/wrapper/maven-wrapper.jar');
                this.copy(`${BASE_DIR}.mvn/wrapper/maven-wrapper.properties`, '.mvn/wrapper/maven-wrapper.properties');
                this.template(`${BASE_DIR}_pom.xml`, 'pom.xml', null, { interpolate: INTERPOLATE_REGEX });

                this.addMavenProperty('kotlin.compiler.incremental', 'true');
                this.addMavenProperty('kotlin.version', '1.2.21');

                this.addMavenDependency('org.jetbrains.kotlin', 'kotlin-stdlib-jre8', KOTLIN_VERSION_STR);
                this.addMavenDependency('org.jetbrains.kotlin', 'kotlin-reflect', KOTLIN_VERSION_STR);

                this.addMavenPlugin('org.jetbrains.kotlin', 'kotlin-maven-plugin', KOTLIN_VERSION_STR, mavenPluginConfiguration);
            }
        },

        writeServerResourceFiles() {
            // Create Java resource files
            mkdirp(SERVER_MAIN_RES_DIR);
            this.copy(`${SERVER_MAIN_RES_DIR}banner.txt`, `${SERVER_MAIN_RES_DIR}banner.txt`);

            if (this.devDatabaseType === 'h2Disk' || this.devDatabaseType === 'h2Memory') {
                this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}h2.server.properties`, `${SERVER_MAIN_RES_DIR}.h2.server.properties`);
            }

            // Thymeleaf templates
            this.copy(`${BASE_DIR}${SERVER_MAIN_RES_DIR}templates/error.html`, `${SERVER_MAIN_RES_DIR}templates/error.html`);

            this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}_logback-spring.xml`, `${SERVER_MAIN_RES_DIR}logback-spring.xml`, this, { interpolate: INTERPOLATE_REGEX });

            this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/_application.yml`, `${SERVER_MAIN_RES_DIR}config/application.yml`);
            this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/_application-dev.yml`, `${SERVER_MAIN_RES_DIR}config/application-dev.yml`);
            this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/_application-prod.yml`, `${SERVER_MAIN_RES_DIR}config/application-prod.yml`);

            if (this.enableSwaggerCodegen) {
                this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}swagger/_api.yml`, `${SERVER_MAIN_RES_DIR}swagger/api.yml`);
            }

            if (this.databaseType === 'sql') {
                this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}/config/liquibase/changelog/_initial_schema.xml`, `${SERVER_MAIN_RES_DIR}config/liquibase/changelog/00000000000000_initial_schema.xml`, this, { interpolate: INTERPOLATE_REGEX });
                this.copy(`${BASE_DIR}${SERVER_MAIN_RES_DIR}/config/liquibase/master.xml`, `${SERVER_MAIN_RES_DIR}config/liquibase/master.xml`);
            }

            if (this.databaseType === 'mongodb') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/dbmigrations/_package-info.java`, `${javaDir}config/dbmigrations/package-info.java`);
                if (!this.skipUserManagement) {
                    this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/dbmigrations/_InitialSetupMigration.java`, `${javaDir}config/dbmigrations/InitialSetupMigration.java`);
                }
            }

            if (this.databaseType === 'couchbase') {
                this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}/config/couchmove/changelog/_V0__create_indexes.n1ql`, `${SERVER_MAIN_RES_DIR}config/couchmove/changelog/V0__create_indexes.n1ql`);
                if (!this.skipUserManagement || this.authenticationType === 'oauth2') {
                    this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}/config/couchmove/changelog/V0.1__initial_setup/_ROLE_ADMIN.json`, `${SERVER_MAIN_RES_DIR}config/couchmove/changelog/V0.1__initial_setup/ROLE_ADMIN.json`);
                    this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}/config/couchmove/changelog/V0.1__initial_setup/_ROLE_USER.json`, `${SERVER_MAIN_RES_DIR}config/couchmove/changelog/V0.1__initial_setup/ROLE_USER.json`);
                    this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}/config/couchmove/changelog/V0.1__initial_setup/_user__admin.json`, `${SERVER_MAIN_RES_DIR}config/couchmove/changelog/V0.1__initial_setup/user__admin.json`);
                    this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}/config/couchmove/changelog/V0.1__initial_setup/_user__anonymoususer.json`, `${SERVER_MAIN_RES_DIR}config/couchmove/changelog/V0.1__initial_setup/user__anonymoususer.json`);
                    this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}/config/couchmove/changelog/V0.1__initial_setup/_user__system.json`, `${SERVER_MAIN_RES_DIR}config/couchmove/changelog/V0.1__initial_setup/user__system.json`);
                    this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}/config/couchmove/changelog/V0.1__initial_setup/_user__user.json`, `${SERVER_MAIN_RES_DIR}config/couchmove/changelog/V0.1__initial_setup/user__user.json`);
                }
            }

            if (this.databaseType === 'cassandra') {
                this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/cql/_create-keyspace-prod.cql`, `${SERVER_MAIN_RES_DIR}config/cql/create-keyspace-prod.cql`);
                this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/cql/_create-keyspace.cql`, `${SERVER_MAIN_RES_DIR}config/cql/create-keyspace.cql`);
                this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/cql/_drop-keyspace.cql`, `${SERVER_MAIN_RES_DIR}config/cql/drop-keyspace.cql`);
                this.copy(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/cql/changelog/README.md`, `${SERVER_MAIN_RES_DIR}config/cql/changelog/README.md`);

                /* Skip the code below for --skip-user-management */
                if (this.skipUserManagement && this.authenticationType !== 'oauth2') return;
                if (this.applicationType !== 'microservice' && this.databaseType === 'cassandra') {
                    this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/cql/changelog/_create-tables.cql`, `${SERVER_MAIN_RES_DIR}config/cql/changelog/00000000000000_create-tables.cql`);
                    this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/cql/changelog/_insert_default_users.cql`, `${SERVER_MAIN_RES_DIR}config/cql/changelog/00000000000001_insert_default_users.cql`);
                }
            }

            if (this.applicationType === 'uaa') {
                this.generateKeyStore();
            }
        },

        writeServerPropertyFiles() {
            this.template(`${BASE_DIR}../../languages/templates/${SERVER_MAIN_RES_DIR}i18n/_messages_en.properties`, `${SERVER_MAIN_RES_DIR}i18n/messages.properties`);
        },

        writeServerJavaAuthConfigFiles() {
            if (this.databaseType === 'sql' || this.databaseType === 'mongodb' || this.databaseType === 'couchbase') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/_SpringSecurityAuditorAware.java`, `${javaDir}security/SpringSecurityAuditorAware.java`);
            }
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/_SecurityUtils.java`, `${javaDir}security/SecurityUtils.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/_AuthoritiesConstants.java`, `${javaDir}security/AuthoritiesConstants.java`);

            if (this.authenticationType === 'jwt') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/jwt/_TokenProvider.java`, `${javaDir}security/jwt/TokenProvider.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/jwt/_JWTConfigurer.java`, `${javaDir}security/jwt/JWTConfigurer.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/jwt/_JWTFilter.java`, `${javaDir}security/jwt/JWTFilter.java`);
            }

            /* Skip the code below for --skip-user-management */
            if (this.skipUserManagement && (this.applicationType !== 'monolith' || this.authenticationType !== 'oauth2')) {
                if (this.applicationType !== 'microservice' && this.authenticationType === 'jwt') {
                    this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_SecurityConfiguration.java`, `${javaDir}config/SecurityConfiguration.java`);
                }
                return;
            }

            if (this.applicationType === 'uaa') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_UaaWebSecurityConfiguration.java`, `${javaDir}config/UaaWebSecurityConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_UaaConfiguration.java`, `${javaDir}config/UaaConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_UaaProperties.java`, `${javaDir}config/UaaProperties.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/_IatTokenEnhancer.java`, `${javaDir}security/IatTokenEnhancer.java`);
            } else {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_SecurityConfiguration.java`, `${javaDir}config/SecurityConfiguration.java`);
            }

            if (this.authenticationType === 'session') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/domain/_PersistentToken.java`, `${javaDir}domain/PersistentToken.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_PersistentTokenRepository.java`, `${javaDir}repository/PersistentTokenRepository.java`);
            }

            if (this.authenticationType === 'oauth2') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_OAuth2Configuration.java`, `${javaDir}config/OAuth2Configuration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/_OAuth2AuthenticationSuccessHandler.java`, `${javaDir}security/OAuth2AuthenticationSuccessHandler.java`);
            } else {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/_DomainUserDetailsService.java`, `${javaDir}security/DomainUserDetailsService.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/_UserNotActivatedException.java`, `${javaDir}security/UserNotActivatedException.java`);
            }

            if (this.authenticationType === 'jwt') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/vm/_LoginVM.java`, `${javaDir}web/rest/vm/LoginVM.java`);
                this.template(`${SERVER_MAIN_SRC_DIR}package/web/rest/_UserJWTController.kt`, `${javaDir}web/rest/UserJWTController.kt`);
            }

            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/_package-info.java`, `${javaDir}security/package-info.java`);

            if (this.authenticationType === 'session') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/_PersistentTokenRememberMeServices.java`, `${javaDir}security/PersistentTokenRememberMeServices.java`);
            }

            if (this.enableSocialSignIn) {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/social/_package-info.java`, `${javaDir}security/social/package-info.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/social/_SocialConfiguration.java`, `${javaDir}config/social/SocialConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/domain/_SocialUserConnection.java`, `${javaDir}domain/SocialUserConnection.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_CustomSocialConnectionRepository.java`, `${javaDir}repository/CustomSocialConnectionRepository.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_CustomSocialUsersConnectionRepository.java`, `${javaDir}repository/CustomSocialUsersConnectionRepository.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_SocialUserConnectionRepository.java`, `${javaDir}repository/SocialUserConnectionRepository.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/social/_CustomSignInAdapter.java`, `${javaDir}security/social/CustomSignInAdapter.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/social/_package-info.java`, `${javaDir}security/social/package-info.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/_SocialService.java`, `${javaDir}service/SocialService.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/_SocialController.java`, `${javaDir}web/rest/SocialController.java`);
            }
        },

        writeServerJavaGatewayFiles() {
            if (this.applicationType !== 'gateway') return;

            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_GatewayConfiguration.java`, `${javaDir}config/GatewayConfiguration.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/apidoc/_GatewaySwaggerResourcesProvider.java`, `${javaDir}config/apidoc/GatewaySwaggerResourcesProvider.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/gateway/ratelimiting/_RateLimitingFilter.java`, `${javaDir}gateway/ratelimiting/RateLimitingFilter.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/gateway/_TokenRelayFilter.java`, `${javaDir}gateway/TokenRelayFilter.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/gateway/accesscontrol/_AccessControlFilter.java`, `${javaDir}gateway/accesscontrol/AccessControlFilter.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/gateway/responserewriting/_SwaggerBasePathRewritingFilter.java`, `${javaDir}gateway/responserewriting/SwaggerBasePathRewritingFilter.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/vm/_RouteVM.java`, `${javaDir}web/rest/vm/RouteVM.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/_GatewayResource.java`, `${javaDir}web/rest/GatewayResource.java`);
            if (this.authenticationType === 'uaa') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/_AuthResource.java`, `${javaDir}web/rest/AuthResource.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/filter/_RefreshTokenFilter.java`, `${javaDir}web/filter/RefreshTokenFilter.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/filter/_RefreshTokenFilterConfigurer.java`, `${javaDir}web/filter/RefreshTokenFilterConfigurer.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/oauth2/_OAuth2AuthenticationConfiguration.java`, `${javaDir}config/oauth2/OAuth2AuthenticationConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_CookieCollection.java`, `${javaDir}security/oauth2/CookieCollection.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_CookiesHttpServletRequestWrapper.java`, `${javaDir}security/oauth2/CookiesHttpServletRequestWrapper.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_CookieTokenExtractor.java`, `${javaDir}security/oauth2/CookieTokenExtractor.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_OAuth2AuthenticationService.java`, `${javaDir}security/oauth2/OAuth2AuthenticationService.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_OAuth2CookieHelper.java`, `${javaDir}security/oauth2/OAuth2CookieHelper.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_OAuth2Cookies.java`, `${javaDir}security/oauth2/OAuth2Cookies.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_OAuth2TokenEndpointClient.java`, `${javaDir}security/oauth2/OAuth2TokenEndpointClient.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_OAuth2TokenEndpointClientAdapter.java`, `${javaDir}security/oauth2/OAuth2TokenEndpointClientAdapter.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_UaaTokenEndpointClient.java`, `${javaDir}security/oauth2/UaaTokenEndpointClient.java`);
            }
        },

        writeServerMicroserviceFiles() {
            if (this.applicationType !== 'microservice' && !(this.applicationType === 'gateway' && (this.authenticationType === 'uaa' || this.authenticationType === 'oauth2'))) return;

            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_MicroserviceSecurityConfiguration.java`, `${javaDir}config/MicroserviceSecurityConfiguration.java`);
            if (this.authenticationType === 'uaa') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/oauth2/_OAuth2Properties.java`, `${javaDir}config/oauth2/OAuth2Properties.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/oauth2/_OAuth2JwtAccessTokenConverter.java`, `${javaDir}config/oauth2/OAuth2JwtAccessTokenConverter.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_OAuth2SignatureVerifierClient.java`, `${javaDir}security/oauth2/OAuth2SignatureVerifierClient.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_UaaSignatureVerifierClient.java`, `${javaDir}security/oauth2/UaaSignatureVerifierClient.java`);
            }
            if (this.applicationType === 'microservice' && this.authenticationType === 'uaa') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_FeignConfiguration.java`, `${javaDir}config/FeignConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/client/_AuthorizedFeignClient.java`, `${javaDir}client/AuthorizedFeignClient.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/client/_OAuth2InterceptedFeignConfiguration.java`, `${javaDir}client/OAuth2InterceptedFeignConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/client/_AuthorizedUserFeignClient.java`, `${javaDir}client/AuthorizedUserFeignClient.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/client/_UserFeignClientInterceptor.java`, `${javaDir}client/UserFeignClientInterceptor.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/client/_OAuth2UserClientFeignConfiguration.java`, `${javaDir}client/OAuth2UserClientFeignConfiguration.java`);
            }
            if (this.authenticationType === 'oauth2') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_AuthorizationHeaderUtil.java`, `${javaDir}/security/oauth2/AuthorizationHeaderUtil.java`);
                if (this.cacheProvider !== 'no') {
                    this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_CachedUserInfoTokenServices.java`, `${javaDir}/security/oauth2/CachedUserInfoTokenServices.java`);
                }
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_SimplePrincipalExtractor.java`, `${javaDir}/security/oauth2/SimplePrincipalExtractor.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/security/oauth2/_SimpleAuthoritiesExtractor.java`, `${javaDir}/security/oauth2/SimpleAuthoritiesExtractor.java`);
            }
            if (this.authenticationType === 'oauth2' && (this.applicationType === 'microservice' || this.applicationType === 'gateway')) {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_FeignConfiguration.java`, `${javaDir}config/FeignConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/client/_AuthorizedFeignClient.java`, `${javaDir}client/AuthorizedFeignClient.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/client/_OAuth2InterceptedFeignConfiguration.java`, `${javaDir}client/OAuth2InterceptedFeignConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/client/_TokenRelayRequestInterceptor.java`, `${javaDir}client/TokenRelayRequestInterceptor.java`);
            }
            if (this.authenticationType === 'oauth2' && this.applicationType === 'gateway') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_OAuth2SsoConfiguration.java`, `${javaDir}config/OAuth2SsoConfiguration.java`);
            }
            this.copy(`${BASE_DIR}${SERVER_MAIN_RES_DIR}static/microservices_index.html`, `${SERVER_MAIN_RES_DIR}static/index.html`);
        },

        writeServerMicroserviceAndGatewayFiles() {
            if (!this.serviceDiscoveryType) return;

            this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/_bootstrap.yml`, `${SERVER_MAIN_RES_DIR}config/bootstrap.yml`);
            this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/_bootstrap-prod.yml`, `${SERVER_MAIN_RES_DIR}config/bootstrap-prod.yml`);
        },

        writeServerJavaAppFiles() {
            // Create Java files
            // Spring Boot main
            this.template(`${SERVER_MAIN_SRC_DIR}package/_Application.kt`, `${javaDir}/${this.mainClass}.kt`);
        },

        writeServerJavaConfigFiles() {
            this.template(`${SERVER_MAIN_SRC_DIR}package/aop/logging/_LoggingAspect.kt`, `${javaDir}aop/logging/LoggingAspect.kt`);
            this.template(`${SERVER_MAIN_SRC_DIR}package/config/_DefaultProfileUtil.kt`, `${javaDir}config/DefaultProfileUtil.kt`);

            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_package-info.java`, `${javaDir}config/package-info.java`);
            this.template(`${SERVER_MAIN_SRC_DIR}package/config/_AsyncConfiguration.kt`, `${javaDir}config/AsyncConfiguration.kt`);
            if (['ehcache', 'hazelcast', 'infinispan'].includes(this.cacheProvider) || this.applicationType === 'gateway') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_CacheConfiguration.java`, `${javaDir}config/CacheConfiguration.java`);
            }
            if (this.cacheProvider === 'infinispan') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_CacheFactoryConfiguration.java`, `${javaDir}config/CacheFactoryConfiguration.java`);
            }
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_Constants.java`, `${javaDir}config/Constants.java`);
            this.template(`${SERVER_MAIN_SRC_DIR}package/config/_DateTimeFormatConfiguration.kt`, `${javaDir}config/DateTimeFormatConfiguration.kt`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_LoggingConfiguration.java`, `${javaDir}config/LoggingConfiguration.java`);

            if (this.databaseType === 'sql' || this.databaseType === 'mongodb' || this.databaseType === 'couchbase') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_CloudDatabaseConfiguration.java`, `${javaDir}config/CloudDatabaseConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_DatabaseConfiguration.java`, `${javaDir}config/DatabaseConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/audit/_package-info.java`, `${javaDir}config/audit/package-info.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/audit/_AuditEventConverter.java`, `${javaDir}config/audit/AuditEventConverter.java`);
            }

            if (this.databaseType === 'couchbase') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_N1qlCouchbaseRepository.java`, `${javaDir}repository/N1qlCouchbaseRepository.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_CustomN1qlCouchbaseRepository.java`, `${javaDir}repository/CustomN1qlCouchbaseRepository.java`);
            }

            this.template(`${SERVER_MAIN_SRC_DIR}package/config/_ApplicationProperties.kt`, `${javaDir}config/ApplicationProperties.kt`);
            this.template(`${SERVER_MAIN_SRC_DIR}package/config/_JacksonConfiguration.kt`, `${javaDir}config/JacksonConfiguration.kt`);
            this.template(`${SERVER_MAIN_SRC_DIR}package/config/_LocaleConfiguration.kt`, `${javaDir}config/LocaleConfiguration.kt`);
            this.template(`${SERVER_MAIN_SRC_DIR}package/config/_LoggingAspectConfiguration.kt`, `${javaDir}config/LoggingAspectConfiguration.kt`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_MetricsConfiguration.java`, `${javaDir}config/MetricsConfiguration.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_ThymeleafConfiguration.java`, `${javaDir}config/ThymeleafConfiguration.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_WebConfigurer.java`, `${javaDir}config/WebConfigurer.java`);
            if (this.websocket === 'spring-websocket') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_WebsocketConfiguration.java`, `${javaDir}config/WebsocketConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_WebsocketSecurityConfiguration.java`, `${javaDir}config/WebsocketSecurityConfiguration.java`);
            }

            if (this.databaseType === 'cassandra') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/metrics/_package-info.java`, `${javaDir}config/metrics/package-info.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/metrics/_JHipsterHealthIndicatorConfiguration.java`, `${javaDir}config/metrics/JHipsterHealthIndicatorConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/metrics/_CassandraHealthIndicator.java`, `${javaDir}config/metrics/CassandraHealthIndicator.java`);
            }

            if (this.databaseType === 'cassandra') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/cassandra/_CassandraConfiguration.java`, `${javaDir}config/cassandra/CassandraConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/cassandra/_package-info.java`, `${javaDir}config/cassandra/package-info.java`);
            }
            if (this.searchEngine === 'elasticsearch') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_ElasticsearchConfiguration.java`, `${javaDir}config/ElasticsearchConfiguration.java`);
            }
            if (this.messageBroker === 'kafka') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/config/_MessagingConfiguration.java`, `${javaDir}config/MessagingConfiguration.java`);
            }
        },

        writeServerJavaDomainFiles() {
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/domain/_package-info.java`, `${javaDir}domain/package-info.java`);

            if (this.databaseType === 'sql' || this.databaseType === 'mongodb' || this.databaseType === 'couchbase') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/domain/_AbstractAuditingEntity.java`, `${javaDir}domain/AbstractAuditingEntity.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/domain/_PersistentAuditEvent.java`, `${javaDir}domain/PersistentAuditEvent.java`);
            }
        },

        writeServerJavaPackageInfoFiles() {
            if (this.searchEngine === 'elasticsearch') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/search/_package-info.java`, `${javaDir}repository/search/package-info.java`);
            }
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_package-info.java`, `${javaDir}repository/package-info.java`);
        },

        writeServerJavaServiceFiles() {
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/_package-info.java`, `${javaDir}service/package-info.java`);

            /* Skip the code below for --skip-user-management */
            if (this.skipUserManagement) return;

            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/util/_RandomUtil.java`, `${javaDir}service/util/RandomUtil.java`);
        },

        writeServerJavaWebErrorFiles() {
            // error handler code - server side
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/errors/_package-info.java`, `${javaDir}web/rest/errors/package-info.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/errors/_InternalServerErrorException.java`, `${javaDir}web/rest/errors/InternalServerErrorException.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/errors/_BadRequestAlertException.java`, `${javaDir}web/rest/errors/BadRequestAlertException.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/errors/_CustomParameterizedException.java`, `${javaDir}web/rest/errors/CustomParameterizedException.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/errors/_EmailAlreadyUsedException.java`, `${javaDir}web/rest/errors/EmailAlreadyUsedException.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/errors/_EmailNotFoundException.java`, `${javaDir}web/rest/errors/EmailNotFoundException.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/errors/_ErrorConstants.java`, `${javaDir}web/rest/errors/ErrorConstants.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/errors/_ExceptionTranslator.java`, `${javaDir}web/rest/errors/ExceptionTranslator.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/errors/_FieldErrorVM.java`, `${javaDir}web/rest/errors/FieldErrorVM.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/errors/_InvalidPasswordException.java`, `${javaDir}web/rest/errors/InvalidPasswordException.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/errors/_LoginAlreadyUsedException.java`, `${javaDir}web/rest/errors/LoginAlreadyUsedException.java`);
        },

        writeServerJavaWebFiles() {
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/vm/_package-info.java`, `${javaDir}web/rest/vm/package-info.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/vm/_LoggerVM.java`, `${javaDir}web/rest/vm/LoggerVM.java`);

            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/util/_HeaderUtil.java`, `${javaDir}web/rest/util/HeaderUtil.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/util/_PaginationUtil.java`, `${javaDir}web/rest/util/PaginationUtil.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/_package-info.java`, `${javaDir}web/rest/package-info.java`);

            this.template(`${SERVER_MAIN_SRC_DIR}package/web/rest/_LogsResource.kt`, `${javaDir}web/rest/LogsResource.kt`);
            this.template(`${SERVER_MAIN_SRC_DIR}package/web/rest/_ProfileInfoResource.kt`, `${javaDir}web/rest/ProfileInfoResource.kt`);
        },

        writeServerJavaWebsocketFiles() {
            if (this.websocket !== 'spring-websocket') return;

            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/websocket/_package-info.java`, `${javaDir}web/websocket/package-info.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/websocket/_ActivityService.java`, `${javaDir}web/websocket/ActivityService.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/websocket/dto/_package-info.java`, `${javaDir}web/websocket/dto/package-info.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/websocket/dto/_ActivityDTO.java`, `${javaDir}web/websocket/dto/ActivityDTO.java`);
        },

        writeServerTestFwFiles() {
            // Create Test Java files
            const testDir = this.testDir;

            mkdirp(testDir);

            if (this.databaseType === 'cassandra') {
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/_CassandraKeyspaceUnitTest.java`, `${testDir}CassandraKeyspaceUnitTest.java`);
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/_AbstractCassandraTest.java`, `${testDir}AbstractCassandraTest.java`);
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/config/_CassandraTestConfiguration.java`, `${testDir}config/CassandraTestConfiguration.java`);
                this.template(`${BASE_DIR}${SERVER_TEST_RES_DIR}_cassandra-random-port.yml`, `${SERVER_TEST_RES_DIR}cassandra-random-port.yml`);
            }

            if (this.databaseType === 'couchbase') {
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/config/_DatabaseTestConfiguration.java`, `${testDir}config/DatabaseTestConfiguration.java`);
            }

            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/config/_WebConfigurerTest.java`, `${testDir}config/WebConfigurerTest.java`);
            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/config/_WebConfigurerTestController.java`, `${testDir}config/WebConfigurerTestController.java`);
            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/web/rest/_TestUtil.java`, `${testDir}web/rest/TestUtil.java`);
            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/web/rest/_LogsResourceIntTest.java`, `${testDir}web/rest/LogsResourceIntTest.java`);
            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/web/rest/_ProfileInfoResourceIntTest.java`, `${testDir}web/rest/ProfileInfoResourceIntTest.java`);
            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/web/rest/errors/_ExceptionTranslatorIntTest.java`, `${testDir}web/rest/errors/ExceptionTranslatorIntTest.java`);
            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/web/rest/errors/_ExceptionTranslatorTestController.java`, `${testDir}web/rest/errors/ExceptionTranslatorTestController.java`);
            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/web/rest/util/_PaginationUtilUnitTest.java`, `${testDir}web/rest/util/PaginationUtilUnitTest.java`);

            this.template(`${BASE_DIR}${SERVER_TEST_RES_DIR}config/_application.yml`, `${SERVER_TEST_RES_DIR}config/application.yml`);
            this.template(`${BASE_DIR}${SERVER_TEST_RES_DIR}_logback.xml`, `${SERVER_TEST_RES_DIR}logback.xml`);

            // Create Gateway tests files
            if (this.applicationType === 'gateway') {
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/gateway/responserewriting/_SwaggerBasePathRewritingFilterTest.java`, `${testDir}gateway/responserewriting/SwaggerBasePathRewritingFilterTest.java`);
            }
            if (this.serviceDiscoveryType) {
                this.template(`${BASE_DIR}${SERVER_TEST_RES_DIR}config/_bootstrap.yml`, `${SERVER_TEST_RES_DIR}config/bootstrap.yml`);
            }

            if (this.authenticationType === 'uaa') {
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/security/_OAuth2TokenMockUtil.java`, `${testDir}security/OAuth2TokenMockUtil.java`);
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/config/_SecurityBeanOverrideConfiguration.java`, `${testDir}config/SecurityBeanOverrideConfiguration.java`);
                if (this.applicationType === 'gateway') {
                    this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/security/oauth2/_OAuth2CookieHelperTest.java`, `${testDir}security/oauth2/OAuth2CookieHelperTest.java`);
                    this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/security/oauth2/_OAuth2AuthenticationServiceTest.java`, `${testDir}security/oauth2/OAuth2AuthenticationServiceTest.java`);
                    this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/security/oauth2/_CookieTokenExtractorTest.java`, `${testDir}security/oauth2/CookieTokenExtractorTest.java`);
                    this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/security/oauth2/_CookieCollectionTest.java`, `${testDir}security/oauth2/CookieCollectionTest.java`);
                }
            }

            // Create Gatling test files
            if (this.gatlingTests) {
                this.copy(`${BASE_DIR}${TEST_DIR}gatling/conf/gatling.conf`, `${TEST_DIR}gatling/conf/gatling.conf`);
                this.copy(`${BASE_DIR}${TEST_DIR}gatling/conf/logback.xml`, `${TEST_DIR}gatling/conf/logback.xml`);
                mkdirp(`${BASE_DIR}${TEST_DIR}gatling/user-files/data`);
                mkdirp(`${BASE_DIR}${TEST_DIR}gatling/user-files/bodies`);
                mkdirp(`${BASE_DIR}${TEST_DIR}gatling/user-files/simulations`);
            }

            // Create Cucumber test files
            if (this.cucumberTests) {
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/cucumber/_CucumberTest.java`, `${testDir}cucumber/CucumberTest.java`);
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/cucumber/stepdefs/_StepDefs.java`, `${testDir}cucumber/stepdefs/StepDefs.java`);
                this.copy(`${BASE_DIR}${TEST_DIR}features/gitkeep`, `${TEST_DIR}features/.gitkeep`);
            }

            // Create auth config test files
            if (this.applicationType === 'monolith' && this.authenticationType !== 'oauth2') {
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/security/_DomainUserDetailsServiceIntTest.java`, `${testDir}security/DomainUserDetailsServiceIntTest.java`);
            }
        },

        writeJavaUserManagementFiles() {
            const testDir = this.testDir;

            if (this.skipUserManagement) {
                if (this.authenticationType === 'oauth2') {
                    if (this.databaseType === 'sql') {
                        this.copy(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/liquibase/authorities.csv`, `${SERVER_MAIN_RES_DIR}config/liquibase/authorities.csv`);
                        this.copy(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/liquibase/users_authorities.csv`, `${SERVER_MAIN_RES_DIR}config/liquibase/users_authorities.csv`);
                    }
                    this.template(`${SERVER_MAIN_SRC_DIR}package/web/rest/_AccountResource.kt`, `${javaDir}web/rest/AccountResource.kt`);
                    this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/domain/_User.java`, `${javaDir}domain/User.java`);
                    this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/web/rest/_AccountResourceIntTest.java`, `${testDir}web/rest/AccountResourceIntTest.java`);
                    this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/security/_SecurityUtilsUnitTest.java`, `${testDir}security/SecurityUtilsUnitTest.java`);

                    if (this.applicationType === 'monolith') {
                        this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/liquibase/users.csv`, `${SERVER_MAIN_RES_DIR}config/liquibase/users.csv`);
                        this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/domain/_Authority.java`, `${javaDir}domain/Authority.java`);
                        this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/_UserService.java`, `${javaDir}service/UserService.java`);
                        this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/dto/_package-info.java`, `${javaDir}service/dto/package-info.java`);
                        this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/dto/_UserDTO.java`, `${javaDir}service/dto/UserDTO.java`);
                        this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/dto/_PasswordChangeDTO.java`, `${javaDir}service/dto/PasswordChangeDTO.java`);
                        this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/mapper/_package-info.java`, `${javaDir}service/mapper/package-info.java`);
                        this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/mapper/_UserMapper.java`, `${javaDir}service/mapper/UserMapper.java`);
                        this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_UserRepository.java`, `${javaDir}repository/UserRepository.java`);
                        this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_AuthorityRepository.java`, `${javaDir}repository/AuthorityRepository.java`);
                        this.template(`${SERVER_MAIN_SRC_DIR}package/web/rest/_UserResource.kt`, `${javaDir}web/rest/UserResource.kt`);
                        if (this.searchEngine === 'elasticsearch') {
                            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/search/_UserSearchRepository.java`, `${javaDir}repository/search/UserSearchRepository.java`);
                        }
                        this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/vm/_ManagedUserVM.java`, `${javaDir}web/rest/vm/ManagedUserVM.java`);
                        this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/service/_UserServiceIntTest.java`, `${testDir}service/UserServiceIntTest.java`);
                        this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/web/rest/_UserResourceIntTest.java`, `${testDir}web/rest/UserResourceIntTest.java`);

                        if (this.databaseType === 'sql' || this.databaseType === 'mongodb') {
                            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_CustomAuditEventRepository.java`, `${javaDir}repository/CustomAuditEventRepository.java`);
                            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_AuthorityRepository.java`, `${javaDir}repository/AuthorityRepository.java`);
                            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_PersistenceAuditEventRepository.java`, `${javaDir}repository/PersistenceAuditEventRepository.java`);
                            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/_AuditEventService.java`, `${javaDir}service/AuditEventService.java`);
                            this.template(`${SERVER_MAIN_SRC_DIR}package/web/rest/_AuditResource.kt`, `${javaDir}web/rest/AuditResource.kt`);
                            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/repository/_CustomAuditEventRepositoryIntTest.java`, `${testDir}repository/CustomAuditEventRepositoryIntTest.java`);
                            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/web/rest/_AuditResourceIntTest.java`, `${testDir}web/rest/AuditResourceIntTest.java`);
                        }
                    }
                }
                return;
            }

            /* User management resources files */
            if (this.databaseType === 'sql') {
                this.template(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/liquibase/users.csv`, `${SERVER_MAIN_RES_DIR}config/liquibase/users.csv`);
                this.copy(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/liquibase/authorities.csv`, `${SERVER_MAIN_RES_DIR}config/liquibase/authorities.csv`);
                this.copy(`${BASE_DIR}${SERVER_MAIN_RES_DIR}config/liquibase/users_authorities.csv`, `${SERVER_MAIN_RES_DIR}config/liquibase/users_authorities.csv`);
            }

            // Email templates
            this.copy(`${BASE_DIR}${SERVER_MAIN_RES_DIR}mails/activationEmail.html`, `${SERVER_MAIN_RES_DIR}mails/activationEmail.html`);
            this.copy(`${BASE_DIR}${SERVER_MAIN_RES_DIR}mails/creationEmail.html`, `${SERVER_MAIN_RES_DIR}mails/creationEmail.html`);
            this.copy(`${BASE_DIR}${SERVER_MAIN_RES_DIR}mails/passwordResetEmail.html`, `${SERVER_MAIN_RES_DIR}mails/passwordResetEmail.html`);
            if (this.enableSocialSignIn) {
                this.copy(`${BASE_DIR}${SERVER_MAIN_RES_DIR}mails/socialRegistrationValidationEmail.html`, `${SERVER_MAIN_RES_DIR}mails/socialRegistrationValidationEmail.html`);
            }

            /* User management java domain files */
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/domain/_User.java`, `${javaDir}domain/User.java`);

            if (this.databaseType === 'sql' || this.databaseType === 'mongodb' || this.databaseType === 'couchbase') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/domain/_Authority.java`, `${javaDir}domain/Authority.java`);
            }

            /* User management java repo files */
            if (this.databaseType === 'sql' || this.databaseType === 'mongodb' || this.databaseType === 'couchbase') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_CustomAuditEventRepository.java`, `${javaDir}repository/CustomAuditEventRepository.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_AuthorityRepository.java`, `${javaDir}repository/AuthorityRepository.java`);
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_PersistenceAuditEventRepository.java`, `${javaDir}repository/PersistenceAuditEventRepository.java`);
            }
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/_UserRepository.java`, `${javaDir}repository/UserRepository.java`);

            /* User management java service files */
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/_UserService.java`, `${javaDir}service/UserService.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/_MailService.java`, `${javaDir}service/MailService.java`);
            if (this.databaseType === 'sql' || this.databaseType === 'mongodb' || this.databaseType === 'couchbase') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/_AuditEventService.java`, `${javaDir}service/AuditEventService.java`);
            }

            /* User management java web files */
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/dto/_package-info.java`, `${javaDir}service/dto/package-info.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/dto/_UserDTO.java`, `${javaDir}service/dto/UserDTO.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/dto/_PasswordChangeDTO.java`, `${javaDir}service/dto/PasswordChangeDTO.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/vm/_ManagedUserVM.java`, `${javaDir}web/rest/vm/ManagedUserVM.java`);
            this.template(`${SERVER_MAIN_SRC_DIR}package/web/rest/_AccountResource.kt`, `${javaDir}web/rest/AccountResource.kt`);
            this.template(`${SERVER_MAIN_SRC_DIR}package/web/rest/_UserResource.kt`, `${javaDir}web/rest/UserResource.kt`);
            if (this.searchEngine === 'elasticsearch') {
                this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/repository/search/_UserSearchRepository.java`, `${javaDir}repository/search/UserSearchRepository.java`);
            }
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/web/rest/vm/_KeyAndPasswordVM.java`, `${javaDir}web/rest/vm/KeyAndPasswordVM.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/mapper/_package-info.java`, `${javaDir}service/mapper/package-info.java`);
            this.template(`${BASE_DIR}${SERVER_MAIN_SRC_DIR}package/service/mapper/_UserMapper.java`, `${javaDir}service/mapper/UserMapper.java`);

            if (this.databaseType === 'sql' || this.databaseType === 'mongodb' || this.databaseType === 'couchbase') {
                this.template(`${SERVER_MAIN_SRC_DIR}package/web/rest/_AuditResource.kt`, `${javaDir}web/rest/AuditResource.kt`);
            }

            /* User management java test files */
            this.copy(`${BASE_DIR}${SERVER_TEST_RES_DIR}mails/_testEmail.html`, `${SERVER_TEST_RES_DIR}mails/testEmail.html`);
            this.copy(`${BASE_DIR}${SERVER_TEST_RES_DIR}i18n/_messages_en.properties`, `${SERVER_TEST_RES_DIR}i18n/messages_en.properties`);

            if (this.searchEngine === 'elasticsearch') {
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/repository/search/_UserSearchRepositoryMockConfiguration.java`, `${testDir}repository/search/UserSearchRepositoryMockConfiguration.java`);
            }
            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/service/_MailServiceIntTest.java`, `${testDir}service/MailServiceIntTest.java`);
            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/service/_UserServiceIntTest.java`, `${testDir}service/UserServiceIntTest.java`);
            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/web/rest/_UserResourceIntTest.java`, `${testDir}web/rest/UserResourceIntTest.java`);

            if (this.enableSocialSignIn) {
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/repository/_CustomSocialUsersConnectionRepositoryIntTest.java`, `${testDir}repository/CustomSocialUsersConnectionRepositoryIntTest.java`);
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/service/_SocialServiceIntTest.java`, `${testDir}service/SocialServiceIntTest.java`);
            }

            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/web/rest/_AccountResourceIntTest.java`, `${testDir}web/rest/AccountResourceIntTest.java`);
            this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/security/_SecurityUtilsUnitTest.java`, `${testDir}security/SecurityUtilsUnitTest.java`);
            if (this.authenticationType === 'jwt') {
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/security/jwt/_JWTFilterTest.java`, `${testDir}security/jwt/JWTFilterTest.java`);
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/security/jwt/_TokenProviderTest.java`, `${testDir}security/jwt/TokenProviderTest.java`);
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/web/rest/_UserJWTControllerIntTest.java`, `${testDir}web/rest/UserJWTControllerIntTest.java`);
            }

            if (this.databaseType === 'sql' || this.databaseType === 'mongodb' || this.databaseType === 'couchbase') {
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/repository/_CustomAuditEventRepositoryIntTest.java`, `${testDir}repository/CustomAuditEventRepositoryIntTest.java`);
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/web/rest/_AuditResourceIntTest.java`, `${testDir}web/rest/AuditResourceIntTest.java`);
            }
            // Cucumber user management tests
            if (this.cucumberTests) {
                this.template(`${BASE_DIR}${SERVER_TEST_SRC_DIR}package/cucumber/stepdefs/_UserStepDefs.java`, `${testDir}cucumber/stepdefs/UserStepDefs.java`);
                this.copy('src/test/features/user/user.feature', 'src/test/features/user/user.feature');
            }
        }
    };
}