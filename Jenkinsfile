pipeline {
  agent any

  environment {
    COMPOSE_PROJECT_NAME = "fs_project"
    DB_HOST = "db" 
    DB_USER = "fs_user" 
    DB_PASS = "fs_pass" 
    DB_NAME = "fs_db" 
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        // 安装依赖并构建前端、后端镜像
        sh 'docker build -t fs-backend ./backend'
        sh 'docker build -t fs-frontend ./frontend'
      }
    }

    stage('Deploy') {
      steps {
        // 使用 docker compose 启动（假设 jenkins 有权限与 docker daemon 通信）
        sh 'docker compose down || true'
        sh 'docker compose up -d'
      }
    }

    stage('Health Check') {
    steps {
        sh '''
            set -e
            MAX_ATTEMPTS=15
            DELAY=5
            URL="http://localhost:4000/items"
            EXPECTED_TEXT="Sample"

            echo "Starting Health Check on $URL. Max attempts: $MAX_ATTEMPTS, Delay: $DELAY seconds."

            for i in $(seq 1 $MAX_ATTEMPTS); do
              echo "Attempt $i/$MAX_ATTEMPTS: Checking backend..."
              
              # curl --fail 确保只有 HTTP 状态码为 2xx 时才算成功
              if curl -sS --fail --max-time 5 $URL | grep -q "$EXPECTED_TEXT"; then
                echo "Health check succeeded!"
                exit 0
              fi

              echo "Check failed, sleeping..."
              sleep $DELAY
            done

            echo "ERROR: Health check failed after $MAX_ATTEMPTS attempts."
            exit 1
        '''
    }
}
  }

  post {
    success {
      echo "Pipeline succeeded"
    }
    failure {
      echo "Pipeline failed"
    }
  }
}
