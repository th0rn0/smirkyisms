build:
	docker build --file=docker/bot.Dockerfile . -t th0rn0/smirkyisms-bot:latest
	docker build --file=docker/server.Dockerfile . -t th0rn0/smirkyisms-server:latest
	docker build --file=docker/client.Dockerfile . -t th0rn0/smirkyisms-client:latest
