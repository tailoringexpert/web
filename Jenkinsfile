pipeline {
    agent {
        docker {
            image "${env.MAVEN_IMAGE}"
            args '''
                --entrypoint='' \
                -u 501:1000 \
                -v $M2_VOLUME:/home/maven \
                -v $PWD:/data
            '''
            reuseNode true
       }
    }

    options {
        buildDiscarder(logRotator(daysToKeepStr: '3', numToKeepStr: '3'))
        disableConcurrentBuilds()
    }

    parameters {
        booleanParam(
            name: 'RELEASE_BUILD',
            defaultValue: false,
            description: 'Create a release')
        booleanParam(
            name: 'DEPLOY',
            defaultValue: false,
            description: 'Execute deployment step')
        gitParameter(
            name: 'BRANCH',
            branch: '',
            defaultValue: 'develop',
            branchFilter: 'origin/(.*)',
            selectedValue: 'NONE',
            sortMode: 'NONE',
            type: 'PT_BRANCH',
            description: 'Select branch')
    }

    environment {
        GIT_REPOSITORY = 'tailoringexpert/web.git' 
        GIT_CREDENTIALS_ID = 'TAILORINGEXPERT_GITHUB_CREDENTIALS'
        GIT_CREDENTIALS = credentials('TAILORINGEXPERT_GITHUB_CREDENTIALS')
        GIT_GPG_SIGNKEY_BASE64 = credentials('GIT_GITHUB_GPG_SIGNKEY_BASE64')
        GIT_GPG_PASSPHRASE  = credentials('GIT_GITHUB_GPG_PASSPHRASE')
        MAVEN_CREDENTIALS = credentials('MAVEN_SONATYPE_CREDENTIALS')
        MAVEN_GPG_SIGNKEY_BASE64 = credentials('MAVEN_SONATYPE_GPG_SIGNKEY_BASE64')
        MAVEN_GPG_PASSPHRASE = credentials('MAVEN_SONATYPE_GPG_PASSPHRASE')

        GIT_WORKSPACE = '/data'
        MAVEN_SETTINGS = "./settings.xml"
        MAVEN_REPOSITORY = "/home/maven"

        MAVEN_CREDENTIALS_USR = "${env.MAVEN_CREDENTIALS_USR}"
        MAVEN_CREDENTIALS_PSW = "${env.MAVEN_CREDENTIALS_PSW}"
        // other (external) defined env vars
        // M2_VOLUME maven      repoository volume
        // GIT_COMMITTER_NAME   name of the git committer
        // GIT_COMMITTER_EMAIL  mail of the git committer
    }

    stages {
        stage('checkout') {
             steps {
                script {
                    checkoutBranch = params.RELEASE_BUILD ? 'develop' : params.BRANCH
                    currentBuild.displayName = "#${env.BUILD_ID} | " + (params.RELEASE_BUILD ?  "RELEASE " : ("${checkoutBranch}" + (params.DEPLOY ? " (deploy)" : "")))
                }
                sh "echo checking out ${checkoutBranch}"             
             
                cleanWs()
                git branch: "${checkoutBranch}", url: env.GIT_URL, credentialsId: GIT_CREDENTIALS_ID
             }
        }

        stage('install') {
            steps {
                sh '''
                    mvn --settings $MAVEN_SETTINGS  \
                        -Dmaven.repo.local=$MAVEN_REPOSITORY \
                        -DskipTests \
                    clean install
                '''                    
            }
        }

        stage('release') {
            when {
                expression { params.RELEASE_BUILD }
            }

            steps {
                sh '''
                    . setup-git.sh            
				    mvn --settings $MAVEN_SETTINGS -B \
                        -Dmaven.repo.local=$MAVEN_REPOSITORY \
                        -Dresume=false \
                        -DargLine='-DprocessAllModules --settings $MAVEN_SETTINGS -Dmaven.repo.local=$MAVEN_REPOSITORY' 
                        -DskipTestProject=true 
                        -DgpgSignTag=true 
                        -DgpgSignCommit=true
                    gitflow:release
                '''
            }                
        }

        stage('deploy') {   
            when {
                anyOf {
                    expression { params.RELEASE_BUILD };
                    expression { params.DEPLOY }
                }
            }
                    
            steps {
                script {
                    if (params.RELEASE_BUILD) {
                        git branch: "main", url: env.GIT_URL, credentialsId: GIT_CREDENTIALS_ID
                    }

                    if (params.DEPLOY || params.RELEASE_BUILD) {
                        sh '''
                            . setup-maven-gpg.sh
						    mvn --settings $MAVEN_SETTINGS \
                                -Dmaven.repo.local=$MAVEN_REPOSITORY \
                                -DskipTests \
                                deploy
                        '''

                        // Optionaler Deploy in ein weiteres Repository via Profil
                        if (params.DEPLOY_TO_CUSTOM_REPOSITORY) {
                            sh '''
                                mvn --settings  $MAVEN_SETTINGS \
                                    -Dmaven.repo.local=$MAVEN_REPOSITORY \
                                    -DskipTests \
                                    -P '!default,custom-maven' \
                                deploy
                            '''                                
                        }
                    } else {
                        sh 'exit 0'
                    }
                }
            }
        }
    }
}
