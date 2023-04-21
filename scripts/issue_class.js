import http from 'k6/http'
import { 
    check,
    fail 
} from 'k6'

class Issue{
    constructor(data) {
        if (!data) {
            fail('data is nil')
        }
        this.api_url = String(data.api_url || '')
        this.headers = (data.headers || {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        })
        this.tags = (data.tags || {
            transaction: '',
            parent_transaction: '',
            endpoint: ''
        })
        //this.responseCallback = (data.responseCallback || http.expectedStatuses(200 ))
        this.errorCounter = (data.errorCounter)
        this.searchParams = (data.searchParams || {})
    }

    getUser(id) {
        this.tags.endpoint = "/api/v1/users/getuser"
        const url = `${this.api_url}${this.tags.endpoint}?id=${id}`
        const res = http.get(url.toString(), {
            headers: this.headers,
            tags: this.tags,
            responseCallback: this.responseCallback
        })
        if (
            !check(res, {
                "get user --- ok": (res) => res.status == 200,
            }, {
                endpoint: this.tags.endpoint
            })
        ) {
            this.errorCounter.add(1, {
                status: res.status,
                status_text: res.status_text,
                error: res.error,
                error_code: res.error_code,
                method: res.request.method,
                endpoint: this.tags.endpoint,
                check_error: "could not get user after update"
            })
            if (Boolean(!__ENV.DEBUG)) {
                fail(`could not get user`)
            }
        }
        return res
    }

    createUser() {
        this.tags.endpoint = "/api/v1/users/createrandomuser"
        const url = `${this.api_url}${this.tags.endpoint}`
        const res = http.post(url.toString(), {
            headers: this.headers,
            tags: this.tags,
            responseCallback: this.responseCallback
        })
        if (
            !check(res, {
                "user created": (res) => res.status == 200,
            }, {
                endpoint: this.tags.endpoint
            })
        ) {
            this.errorCounter.add(1, {
                status: res.status,
                status_text: res.status_text,
                error: res.error,
                error_code: res.error_code,
                method: res.request.method,
                endpoint: this.tags.endpoint,
                check_error: "could not create user"
            })
            if (Boolean(!__ENV.DEBUG)) {
                fail(`could not create user. Err: ${res.error}, \n Status: ${res.status}`)
            }
        }
        return res
    }

    getUsers() {
        this.tags.endpoint = "/api/v1/users/getusers"
        const url = (`${this.api_url}${this.tags.endpoint}`)
        const res = http.get(url.toString(), {
            headers: this.headers,
            tags: this.tags,
            responseCallback: this.responseCallback
        })
        if (res.status == 500){
            console.log(`get users is 500 ${res.body}`)
        }
        if (
            !check(res, {
                "got users list": (res) => res.status == 200,
            }, {
                endpoint: this.tags.endpoint
            })
        ) {
            this.errorCounter.add(1, {
                status: res.status,
                status_text: res.status_text,
                error: res.error,
                error_code: res.error_code,
                method: res.request.method,
                endpoint: this.tags.endpoint,
                check_error: "could not get users list"
            })
            if (Boolean(!__ENV.DEBUG)) {
                fail(`Could not get all users list. Status is ${res.status}`)
            }
        }
        return res
    }

    updateUser(id) {
        this.tags.endpoint = "/api/v1/users/updateuser"
        if (id === 'undefined') {
            fail(`id to update is ${id}. Is it empty?`)
        }
        const url = this.api_url+this.tags.endpoint
        const res = http.post(url.toString(), JSON.stringify(id), {
            headers: this.headers,
            tags: this.tags,
            responseCallback: this.responseCallback
        })
        if (

            !check(res, {
                "update request sent --- ok": (res) => res.status == 200,
            }, {
                endpoint: this.tags.endpoint
            })
        ) {
            this.errorCounter.add(1, {
                status: res.status,
                status_text: res.status_text,
                error: res.error,
                error_code: res.error_code,
                method: res.request.method,
                endpoint: this.tags.endpoint,
                check_error: "could not sent update request for a user"
            })
            if (Boolean(!__ENV.DEBUG)) {
                fail(`Could not sent update request for`)
            }
        }
        return res
    }

    deleteUser(id) {
        this.tags.endpoint = "/api/v1/users/deleteuser"
        if (id === 'undefined') {
            fail(`provided id is ${id}. Is it empty?`)
        }
        const url = this.api_url+this.tags.endpoint
        const res = http.post(url.toString(), JSON.stringify(id), {
            headers: this.headers,
            tags: this.tags,
            responseCallback: this.responseCallback
        })
        if (
            !check(res, {
                "status == 200, user deleted" : (res) => res.status == 200,
            }, {
                endpoint: this.tags.endpoint
            })
        ) {
            this.errorCounter.add(1, {
                status: res.status,
                status_text: res.status_text,
                error: res.error,
                error_code: res.error_code,
                method: res.request.method,
                endpoint: this.tags.endpoint,
                check_error: "could not delete user"
            })
            if (Boolean(!__ENV.DEBUG)) {
                fail(`Could not delete user`)
            }
        }
        return res
    }
}
export {
    Issue,
}