shell:
	docker-compose exec -it marketplace-app /bin/sh

up:
	docker-compose up -d --build

stop:
	docker-compose stop

down:
	docker-compose down

