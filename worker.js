const {parentPort,workerData} = require('worker_threads');

function factorial(num){
    var res=1;
    for(let i=1;i<=num;i++){
        res*=i;
    }
    return res;
}

const result=factorial(workerData);

parentPort.postMessage(`Factorial of ${workerData} is ${result}`);