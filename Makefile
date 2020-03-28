run:
	docker-compose -f prod.docker-compose.yml up

build: build-bot build-client build-api

build-bot:
# 	docker build --file=docker/bot/Dockerfile . -t th0rn0/smirkyisms-bot:latest
	docker buildx build --platform linux/amd64,linux/arm/v7 --no-cache --push -t th0rn0/smirkyisms-bot:latest --file=docker/bot/Dockerfile .

build-client:
# 	docker build --file=docker/client/Dockerfile . -t th0rn0/smirkyisms-client:latest
	docker buildx build --platform linux/amd64,linux/arm/v7 --no-cache --push -t th0rn0/smirkyisms-client:latest --file=docker/client/Dockerfile .

build-api:
# 	docker build --file=docker/api/Dockerfile . -t th0rn0/smirkyisms-api:latest
	docker buildx build --platform linux/amd64,linux/arm/v7 --no-cache --push -t th0rn0/smirkyisms-api:latest --file=docker/api/Dockerfile .

push:
	docker push th0rn0/smirkyisms-api:latest th0rn0/smirkyisms-bot:latest th0rn0/smirkyisms-client:latest