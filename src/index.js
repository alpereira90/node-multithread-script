const fs = require('fs');
const csvParser = require('csv-parser');
const { fork } = require("child_process");
const { config } = require('./config');

const records = [];

const chunkSize = Math.ceil(records.length / config.numberOfThreads);

let success = 0;
let fail = 0;
let processedWorkers = 0;

for (let i = 0; i < config.numberOfThreads; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;

    const workerData = records.slice(start, end);
    const worker = fork('./src/worker.js');

    worker.send({ records: workerData, child: `worker-${i+1}` });

    worker.on('message', (results) => {
        const flattenedResults = results.flat();    

        flattenedResults.forEach((result) => {
            //process result
        });

        processedWorkers++;

        if (processedWorkers === config.numberOfThreads) {
            const endTime = new Date();
            const elapsedTime = endTime - startTime;

            console.info(`Processing complete in: ${Math.round(elapsedTime/1000, 2)}s \nProcessed records: ${success} \nFailed records: ${fail}`);    
        }        
    });
}