import {   check, fail, sleep } from 'k6'
import { Issue } from "./issue_class.js"
import { Counter } from 'k6/metrics'
import { describe } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js'
import { randomIntBetween, randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'

const errorCounter = new Counter('error_counter')
const apiUrl = 'https://localhost:9443'

let data = {
    api_url : apiUrl,
    errorCounter: errorCounter
}

const issue = new Issue(data) 

let stagesArr  = []
let stagesNum = 5
let startLoad = 200
let targetLoad = 1000
let targetLoadTime = '90m'
let mode = 1

function makeLOadParams(mode, stages_num, startLoad, targetLoad, targetLoadTime){
    if (mode == 1) {
        for (let i=1; i <= stages_num; i++){
            stagesArr.push({duration: '30s', target: startLoad})
            stagesArr.push({duration: '3m', target: startLoad})
            startLoad=startLoad+200
        }
    }
    stagesArr.push({duration: targetLoadTime, target: targetLoad})
    return stagesArr
}

export function setup(){
    let ids = issue.getUsers().json()
    return ids
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

export default function getUser(ids){
    let user = randomItem(ids)
    describe ('get single user', (t)=> {
        let userParams = issue.getUser(user.id).json()
        if (
            !check (userParams, {
                "returned id is coorect" : userParams => user.id == userParams.id
            })
            ){
                if (Boolean(!__ENV.DEBUG)) {
                    fail(`user JSON is not updated`)
                }
            }
        })
        // if (__ITER%53 == 0 && __ITER>0 && __VU==2 ) {
        //     console.log(`id sent is ${user.id} returned id is ${userParams.id}`)
        //}
    }