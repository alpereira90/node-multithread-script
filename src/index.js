const { fork } = require("child_process");
const { config } = require('./config');
const { getProfiles } = require('./onetrust-client');

const dateFrom = new Date(2023,8,22,8,0,0).toISOString().slice(0, -5);

async function fetchAllRecords() {
    
  const records = [];  

  let pageNumber = 0;
  let totalPages = 0;
  let pageSize = 50; 

  do {
    console.info(`Collecting page ${pageNumber}`);
    const paginatedData = await getProfiles(dateFrom, pageNumber, pageSize);
 
    if (paginatedData.numberOfElements > 0) {
      records.push(...paginatedData.content);
    }

    pageNumber++;
    totalPages = paginatedData.totalPages;
  } while (pageNumber < totalPages);

  return records;
}

async function startProcessing() {
  const startTime = new Date();
  const records = await fetchAllRecords(); 

  console.log(`Starting to process: ${records.length} records`);

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
        // Process result
      });

      processedWorkers++;

      if (processedWorkers === config.numberOfThreads) {
        const endTime = new Date();
        const elapsedTime = endTime - startTime;

        console.info(`Processing complete in: ${Math.round(elapsedTime/1000, 2)}s \nProcessed records: ${success} \nFailed records: ${fail}`);
      }
    });
  }
}

startProcessing();