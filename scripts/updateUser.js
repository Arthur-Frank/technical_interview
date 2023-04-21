import {   check, fail } from 'k6'
import { Issue } from "./issue_class.js"
import { Counter } from 'k6/metrics'
import { randomIntBetween, randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js'

const errorCounter = new Counter('error_counter')
const apiUrl = 'https://localhost:9443'

let data = {
    api_url : apiUrl,
    errorCounter: errorCounter
}

let stagesArr  = []
let stagesNum = 3
let startLoad = 1
let targetLoad = 20
let targetLoadTime = '90s'
let mode = 0

function changeParam(param) { 
    if (param=="female") {
      return "male"
    } 
    return 'female'
  }

function makeLOadParams(mode, stages_num, startLoad, targetLoad, targetLoadTime){
    if (mode == 1) {
        for (let i=startLoad; i <= stages_num; i++){
            stagesArr.push({duration: '10s', target: i})
            stagesArr.push({duration: '10s', target: i})
        }
    }
    stagesArr.push({duration: targetLoadTime, target: targetLoad})
    return stagesArr
}

export const options = {
    insecureSkipTLSVerify: true,
    scenarios: {   
        getUsers: {
        executor: "ramping-arrival-rate",
        startRate: 0,
        timeUnit: '1s',
        preAllocatedVUs: targetLoad,
        maxVUs: targetLoad*5,
        stages: makeLOadParams(mode, stagesNum, startLoad, targetLoad, targetLoadTime)
      },
    }
}

const issue = new Issue(data) 
let users_list = issue.getUsers().json()
let user = randomItem(users_list)

export default function getUsers(){
    user.gender = changeParam(user.gender)

      // describe('update user', (t) => {
  //     issue.updateUser(user)
  // })
}