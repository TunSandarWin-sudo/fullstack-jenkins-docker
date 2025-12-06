pipeline {
  agent any

  environment {
    COMPOSE_PROJECT_NAME = "fs_project"
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
        sh 'docker compose up -d --build'
      }
    }

    stage('Health Check') {
      steps {
        // 简单的 health check：访问后端 /items endpoint
        sh '''
          set -e
          for i in 1 2 3 4 5; do
            if curl -sS http://localhost:4000/items | grep -q "Sample"; then
              echo "health ok"
              exit 0
            fi
            sleep 2
          done
          echo "health check failed"
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
