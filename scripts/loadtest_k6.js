import {   check, fail, sleep } from 'k6'
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
    // creater: {
    //   executor: "ramping-arrival-rate",
    //   startRate: 0,
    //   timeUnit: '30s',
    //   preAllocatedVUs: 10,
    //   maxVUs: 10,
    //   stages: [
    //     { duration: '1m', target: 30 },
    //     { duration: '355m', target: 30 },
    //     // { duration: '30s', target: 2},
    //     // { duration: '3m', target: 2 },
    //     // { duration: '30s', target: 3 },
    //     // { duration: '3m', target: 3 },
    //     // { duration: '30s', target: 4 },
    //     // { duration: '30m', target: 4 },
    //     // { duration: '30s', target: 14 },
    //     // { duration: '5m', target: 14 },
    //     // { duration: '30s', target: 16 },
    //     // { duration: '5m', target: 16 },
    //     // { duration: '30s', target: 18 },
    //     // { duration: '5m', target: 18 },
    //     // { duration: '30s', target: 20 },
    //     // { duration: '35m', target: 20 }
    //   ],
    //   exec: 'createIssue' 
    // },
    updateIssueChain: {
      executor: "ramping-arrival-rate",
      startRate: 0,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 500,
      stages: [
        { duration: '30s', target: 5 },
        { duration: '1m', target: 5 },
        // { duration: '30s', target: 8 },
        // { duration: '5m', target: 8 },
        // { duration: '30s', target: 12 },
        // { duration: '5m', target: 12 },
        // { duration: '30s', target: 14 },
        // { duration: '5m', target: 14 },
        // { duration: '30s', target: 16 },
        // { duration: '5m', target: 16 },
        // { duration: '30s', target: 20 },
        // { duration: '5m', target: 20 },
        // { duration: '30s', target: 24 },
        // { duration: '5m', target: 24 },
        // { duration: '30s', target: 28 },
        // { duration: '5m', target: 28 },
        // { duration: '30s', target: 32 },
        // { duration: '5m', target: 32 },
        // { duration: '30s', target: 36 },
        // { duration: '5m', target: 36 },
        // { duration: '30s', target: 40 },
        // { duration: '5m', target: 40 },
        // { duration: '30s', target: 44 },
        // { duration: '5m', target: 44 },
        // { duration: '30s', target: 48 },
        // { duration: '5m', target: 48 },
        // { duration: '30s', target: 52 },
        // { duration: '5m', target: 52 },
        // { duration: '30s', target: 56 },
        // { duration: '5m', target: 56 },
        // { duration: '30s', target: 60 },
        // { duration: '5m', target: 60 },
        // { duration: '30s', target: 64 },
        // { duration: '5m', target: 64 },
        // { duration: '30s', target: 68 },
        // { duration: '5m', target: 68 },
        // { duration: '30s', target: 72 },
        // { duration: '5m', target: 72 },
        // { duration: '30s', target: 76 },
        // { duration: '5m', target: 76 },
        // { duration: '30s', target: 80 },
        // { duration: '5m', target: 80 },
        // { duration: '30s', target: 84 },
        // { duration: '5m', target: 84 },
        // { duration: '30s', target: 88 },
        // { duration: '5m', target: 88 },
        // { duration: '30s', target: 92 },
        // { duration: '5m', target: 92 },
        // { duration: '30s', target: 96 },
        // { duration: '5m', target: 96 },
        // { duration: '30s', target: 100 },
        // { duration: '5m', target: 100 },
        // { duration: '30s', target: 104 },
        // { duration: '5m', target: 104 },
        // { duration: '30s', target: 108 },
        // { duration: '5m', target: 108 },
        // { duration: '30s', target: 112 },
        // { duration: '5m', target: 112 },
        // { duration: '30s', target: 116 },
        // { duration: '5m', target: 116 },
        // { duration: '30s', target: 120 },
        // { duration: '5m', target: 120 },
        // { duration: '30s', target: 124 },
        // { duration: '5m', target: 124 },
        // { duration: '180m', target: 124 },
      ],
      // exec: 'updateIssueChain'
    },
  }
}

// export function createIssue() {
//   let issue = new Issue(data)
//   let creater
//   describe('create user', (t) => {
//     creater = issue.createUser()
//     creater = creater.json()
//     //creater used twice to check if it affects the way it is shown on monitoring dahsboard. check removed. 
//   })
//   sleep(7)
//   describe('delete user', (t) => {
//     issue.deleteUser(creater)
//   //moved delted to creation in order to not affect update phase. 
//   })
// }

export default function updateIssueChain() {
  let issue = new Issue(data)
  let users_list

  describe('get users list', (t) => {
    users_list = issue.getUsers()
    users_list = users_list.json()
    // if (
    //   !check ( users_list, {
    //     "returned list of users has data": (users_list) => users_list, 
    //   }) 
    // ){
    //   if (Boolean(!__ENV.DEBUG)) {
    //     fail("could not return list of users or it's empty ")
    //   }
    // }
  })

  // let user = randomItem(users_list)
  // user.gender = changeParam(user.gender)
  // let user = {
  //   "id": "152ea4c3-5297-4f31-a080-7b5b02f0ba91",
  //   "firstname": "Arvel",
  //   "lastname": "Goldner",
  //   "phone": "9634774916",
  //   "email": "mohamedgusikowski@ebert.name",
  //   "gender": "female"
  // }
  // describe('update user', (t) => {
  //     issue.updateUser(user)
  // })

  // describe('get updated user', (t) => {
  //   let get_user = issue.getUser("152ea4c3-5297-4f31-a080-7b5b02f0ba91").json()
//     if (
//       !check ( get_user, {
// // for some reason direct comparison of JSONs object doesn't work  (get_user != user by interpreter)
//         "user updated correctly": (get_user) => get_user.id == user.id && get_user.gender == user.gender, 
//       }) 
//     ){
//       if (Boolean(!__ENV.DEBUG)) {
//         fail(`user JSON is not updated`)        
//       }
//     }
//  })
}
