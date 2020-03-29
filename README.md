# Smirkyisms Quote Book

A little Project I put together to learn some more Java, NodeJS, VueJS, Backend & Frontend Servers. The bot just came along for the ride.

Fully Dockerized and utilizing PM2 where applicable. 

## Usage
### Development

Run the docker-compose file in the root to boot the mongoDB Server and then manually boot each individual app you need. Instructions on each app are in each directory.

### Build

To build the docker images Docker buildx is required. Once installed, initiate the proper arm archs for compiling the images;

```
	docker run --rm --privileged docker/binfmt:820fdd95a9972a5308930a2bdfb8573dd4447ad3 
	docker run --privileged linuxkit/binfmt:v0.7 
	export DOCKER_CLI_EXPERIMENTAL=enabled 
	systemctl restart systemd-binfmt
```

Then run ```make build```.


## Deployment

Deploy the stack using the docker-compose file in the docker directory. A Traefik Loadbalancer is required.

## Bot Usage

```.smirketpin <messageid``` This will initiate a vote. Once passed it will upload the quote to https://smirkyisms.com