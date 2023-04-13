import {   check, fail } from 'k6'
import { Issue } from "./issue_class.js"
import { Counter } from 'k6/metrics'
import { randomIntBetween, randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js'

const errorCounter = new Counter('error_counter')
const api_url = 'https://localhost:9443'

let data = {
    api_url : api_url,
    errorCounter: errorCounter
}

function changeParam(param) { //remove
  if (param=="female") {
    return "male"
  } 
  return 'female'
}

export const options = {
  insecureSkipTLSVerify: true,
  scenarios: {
    creater: {
      executor: "ramping-arrival-rate",
      startRate: 0,
      timeUnit: '2s',
      preAllocatedVUs: 20,
      maxVUs: 20,
      stages: [
        { duration: '1m', target: 20 },
        { duration: '65m', target: 20 },
        // { duration: '1m', target: 60 },
        // { duration: '5m', target: 60 },
        // { duration: '1m', target: 70 },
        // { duration: '5m', target: 70 },
        // { duration: '1m', target: 80 },
        // { duration: '5m', target: 80 },
        // { duration: '1m', target: 90 },
        // { duration: '5m', target: 90},
        // { duration: '1m', target: 100 },
        // { duration: '35m', target: 100 }
      ],
      exec: 'createIssue'
    },
    updater: {
      executor: "ramping-arrival-rate",
      startRate: 0,
      timeUnit: '3s',
      preAllocatedVUs: 100,
      maxVUs: 1200,
      stages: [
        { duration: '1m', target: 50 },
        { duration: '5m', target: 50 },
        // { duration: '1m', target: 150 },
        // { duration: '5m', target: 150 },
        { duration: '1m', target: 250 },
        { duration: '5m', target: 250 },
        { duration: '1m', target: 500 },
        { duration: '5m', target: 500 },
        { duration: '1m', target: 750 },
        { duration: '5m', target: 750 },
        { duration: '1m', target: 900 },
        { duration: '41m', target: 900 },
      ],
      exec: 'updateIssueChain'
    },
  }
}

let issue = new Issue(data)

export function createIssue() {
  describe('create user', (t) => {
    const creater = issue.createUser()
    if (
      !check(creater, {
        "returned json for created user is not empty": (creater) => creater.json(),
      }, {
        task: "user creation failed"
      })
    ) {
      console.log(creater)
      this.errorCounter.add(1, {
        status: creater.status,
        status_text: creater.status_text,
        error: creater.error,
        error_code: creater.error_code,
        method: creater.request.method,
        endpoint: this.tags.endpoint,
        check_error: "no JSON for created user"
      })
      if (Boolean(!__ENV.DEBUG)) {
        fail(`No JSON returned for creaeted user`)
      }
    }
  })
}

export function updateIssueChain() {
  let iter = 0
  let users_list
  describe('get users list', (t) => {
    users_list = issue.getUsers().json()
    if (
      !check ( users_list, {
        "returned list of users is not empty --- ok": (users_list) => users_list, 
      }) 
    ){
      if (Boolean(!__ENV.DEBUG)) {
        fail("could not return list of users or it's empty ")
      }
    }
  })

  let user = randomItem(users_list)
  user.gender = changeParam(user.gender)
  describe('update user', (t) => {
      issue.updateUser(user)
  })

  describe('get updated user', (t) => {
    let get_user = issue.getUser(user.id).json()
    if (
      !check ( get_user, {
// for some reason direct comparison of JSONs object doesn't work  (get_user != user by interpreter)
        "user updated correctly": (get_user) => get_user.id == user.id && get_user.gender == user.gender, 
      }) 
    ){
      if (Boolean(!__ENV.DEBUG)) {
        fail(`user JSON is not updated ${user.id}`)        
      }
    }
  })
  if ((__ITER%3)==0) {
    if ((__VU % 30) == 0 && (__VU > 0)) {
      console.log(`VU: ${__VU}, ITER: ${__ITER}`)
      describe('delete user', (t) => {
        issue.deleteUser(user)
      })
    }
  }
}
