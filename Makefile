shell:
	docker-compose exec -it marketplace-app /bin/sh

up:
	docker-compose up -d --build

init:
	docker exec -it marketplace-app sh -c "cd /var/www && composer install && php artisan migrate"

stop:
	docker-compose stop

down:
	docker-compose down

