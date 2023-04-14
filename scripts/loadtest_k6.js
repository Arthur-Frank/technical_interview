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
      preAllocatedVUs: 5,
      maxVUs: 10,
      stages: [
        { duration: '30s', target: 2 },
        { duration: '88m', target: 2 },
        // { duration: '30s', target: 2},
        // { duration: '3m', target: 2 },
        // { duration: '30s', target: 3 },
        // { duration: '3m', target: 3 },
        // { duration: '30s', target: 4 },
        // { duration: '30m', target: 4 },
        // { duration: '1m', target: 14 },
        // { duration: '5m', target: 14 },
        // { duration: '1m', target: 16 },
        // { duration: '5m', target: 16 },
        // { duration: '1m', target: 18 },
        // { duration: '5m', target: 18 },
        // { duration: '1m', target: 20 },
        // { duration: '35m', target: 20 }
      ],
      exec: 'createIssue' 
    },
    updater: {
      executor: "ramping-arrival-rate",
      startRate: 0,
      timeUnit: '1s',
      preAllocatedVUs: 250,
      maxVUs: 500,
      stages: [
        { duration: '30s', target: 2 },
        { duration: '3m', target: 2 },
        { duration: '30s', target: 4},
        { duration: '3m', target: 4 },
        { duration: '30s', target: 6 },
        { duration: '3m', target: 6 },
        { duration: '30s', target: 8 },
        { duration: '3m', target: 8 },
        { duration: '30s', target: 10 },
        { duration: '3m', target: 10 },
        { duration: '30s', target: 12 },
        { duration: '3m', target: 12 },
        { duration: '30s', target: 14 },
        { duration: '3m', target: 14 },
        { duration: '30s', target: 16 },
        { duration: '3m', target: 16 },
        { duration: '30s', target: 18 },
        { duration: '60m', target: 18 },
        // { duration: '30s', target: 20 },
        // { duration: '20m', target: 20 },
      ],
      exec: 'updateIssueChain'
    },
  }
}



export function createIssue() {
  let issue = new Issue(data)
  describe('create user', (t) => {
  let creater = issue.createUser()
    if (
      !check(creater, {
        "returned json for created user has data": (creater) => creater.json(),
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
  let issue = new Issue(data)
  let users_list

  describe('get users list', (t) => {
    users_list = issue.getUsers().json()
    if (
      !check ( users_list, {
        "returned list of users has data": (users_list) => users_list, 
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
        fail(`user JSON is not updated`)        
      }
    }
  })
    if (__VU%250===0 && __VU>0){
      describe('delete user', (t) => {
        issue.deleteUser(user)
        console.log(`delete used on iter: ${__ITER} for user: ${__VU}`)
      })
  }

}
