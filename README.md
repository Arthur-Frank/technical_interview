![logo](https://github.com/matscus/technical_interview/blob/main/images/logo.png)

# technical_interview
## A project created to test candidates for load testing positions.

### Composition
Simple services(is a targets of testing) , postgresdb, prometheus + exporters, grafana

### How to use

#### Get and run
```sh
git clone https://github.com/matscus/technical_interview 
cd technical_interview/{TASK NUMBER}
docker-compose up --build -d
```
#### Stop and remove data
``` sh
docker-compose down --rmi all -v
```

#### Alternatively you can use make commands
```sh
# Run unit test
make unittest

# Build binary
make engine

# Build docker image and run
make run

# Stop containers
make stop

# Stop containers, remove all image and volumes
make stop

# Remove binary file
make clean
```

### The tasks
* [The task №1](https://github.com/matscus/technical_interview/blob/main/first_task/README.md)
