# Commands for Development Environment
start-dev:
	docker-compose -f docker-compose.dev.yml up --build -d
start-dev-backend:
	docker-compose -f docker-compose.dev.yml up -d mysql phpmyadmin backend
start-dev-frontend:
	docker-compose -f docker-compose.dev.yml up -d frontend
down-dev:
	docker-compose -f docker-compose.dev.yml down --rmi all

# Commands for Production Environment
start-prod:
	sudo chmod -R 777 db && docker-compose -f docker-compose.prod.yml up --build -d --remove-orphans

down-prod:
	docker-compose -f docker-compose.prod.yml down --rmi all