![logo](https://github.com/matscus/technical_interview/blob/main/image/logo.png)

# technical_interview
## A project created to test candidates for load testing positions.

### Composition
Simple rest api service(is a target of testing) , postgresdb, prometheus + exporters, grafana

### How to use
#### Get and run
```sh
git clone https://github.com/matscus/technical_interview 
cd technical_interview
docker-compose up --build -d
```
#### Stop and remove data
``` sh
docker-compose down --rmi all -v
```

### The task №1

1. Get project.
2. Сheck your docker network address, if the address is different from 172.17.0.1, make changes to the file ./reconfigure/prometheus/prometheus.yml - target Jmeter
3. Run project (credential from grafana admin\admin)
4. Сreate a script for [Apache Jmeter](https://apache-mirror.rbc.ru/pub/apache//jmeter/binaries/apache-jmeter-5.4.1.tgz). To pass metrics you need to use [jmeter-prometheus-listener-plugin](https://github.com/kolesnikovm/jmeter-prometheus-listener/releases/download/2.0.2/jmeter-prometheus-listener-plugin-2.0.2.jar)
    * Scenario for one user:
        * user creation
            post request by "/api/v1/users/updatemuser" with empty body
        * Get All users
            get request by "/api/v1/users/getusers" and extract random user for update
        * Updating extracts user
            post request by "/api/v1/users/updateuser" with json body, the structure is similar to the received user structure in the request "Get All users", required field only ID
            Restrictions: field ID not is update.
        * Check updating user
            get reuest by "/api/v1/users/getuser" with params ID equal id to users updated in the previous request. 
        * Delete extract user
            post request by "/api/v1/users/deleteuser" with json body of the user structure, including the ID field (other fields are ignored).
5. non-financial requirements:
    * 250 vusers in active
    * Request Create User - 10tps 
    * Requests Get All Users, Update and Check - 300tps
    * Request Delete User - 10tps
    * SLA for all request - 1s
6.  analyze results and save screenshots of the graphs with problems, if any, or do not delete the volumes data when the project is stopped using - docker-compose down 
