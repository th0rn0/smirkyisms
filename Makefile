build:
	docker build server/ -t th0rn0/smirkyisms-server
	docker build client/ -t th0rn0/smirkyisms-client
	docker build bot/ -t th0rn0/smirkyisms-bot
