pipeline {
    tools {
        nodejs "nodejs"
    }
    agent any
    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run-script build'
            }
        }
        stage('Upload to S3 Bucket') {
            steps {
                dir('/var/lib/jenkins/workspace/Manager-UI/dist/manager-ui') {
                    withAWS(region:'us-east-2',credentials:'aws-ecr-creds') {
                        s3Delete(bucket:"manager.stacklunch.com", path:'');
                        s3Upload(bucket:"manager.stacklunch.com", path:'', includePathPattern:'**/*');
                    }   
                } 
            }
        }
    }
    post {
        always {
            sh 'rm -rf dist'
        }
    }
}