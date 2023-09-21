const { parentPort, workerData } = require('worker_threads');
const { createReceipt } = require('./onetrust');

async function execute(records, child) {
    const results = [];
    let processedCount = 0;

    for (const record of records) {
        const startTime = new Date();

        const endTime = new Date();
        const elapsedTime = endTime - startTime;
        console.log(`[${child}] - Elapsed Time: ${elapsedTime}`);
        results.push(result);

        processedCount++;
    }
    return results;
}

process.on("message", async (message) => {
    console.log(`Starting process for ${message.child}`);
    const results = await execute(message.records, message.child);

    process.send(results);
});
  