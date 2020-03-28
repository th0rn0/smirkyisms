build: build-bot build-client build-api

build-bot:
	docker build --file=docker/bot/Dockerfile . -t th0rn0/smirkyisms-bot:latest

build-client:
	docker build --file=docker/client/Dockerfile . -t th0rn0/smirkyisms-client:latest

build-api:
	docker build --file=docker/api/Dockerfile . -t th0rn0/smirkyisms-api:latest

push:
	docker push th0rn0/smirkyisms-api:latest th0rn0/smirkyisms-bot:latest th0rn0/smirkyisms-client:latest