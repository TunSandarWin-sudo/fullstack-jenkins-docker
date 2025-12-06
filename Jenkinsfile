pipeline {
    agent any

    environment {
        // 项目名称
        COMPOSE_PROJECT_NAME = "fs_project"
        
        // 数据库连接环境变量 (覆盖 .env 文件，以连接到 Docker Compose 网络中的 'db' 服务)
        DB_HOST = "db" 
        DB_USER = "fs_user" 
        DB_PASS = "fs_pass" 
        DB_NAME = "fs_db" 
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out code from SCM..."
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building backend and frontend Docker images..."
                // 构建后端镜像
                sh 'docker build -t fs-backend ./backend'
                // 构建前端镜像
                sh 'docker build -t fs-frontend ./frontend'
            }
        }

        stage('Deploy Services') {
            steps {
                echo "Stopping and removing existing services..."
                // 停止并移除现有服务，如果失败则忽略错误
                sh 'docker compose down || true' 

                echo "Starting all services (db, backend, frontend) in detached mode..."
                // 启动所有服务，不进行重新构建（因为Build阶段已完成）
                sh 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                echo "Starting backend API Health Check..."
                // 健壮的 Health Check 逻辑，给予 DB 和 Backend 充足的启动时间
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
                            echo "Health check succeeded! Backend is ready."
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
            echo "✅ Pipeline deployment succeeded! App is available at http://[Jenkins IP]:3000"
        }
        failure {
            echo "❌ Pipeline failed during one of the stages."
        }
        
    }
}