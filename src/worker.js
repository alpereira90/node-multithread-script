const { getLinkToken } = require('./onetrust-client');
const { getLeads, updateLeads } = require('./marketo-client');
const { buildMarketoConsent } = require('./builder');

async function execute(records, child) {
    const results = [];
    const reprocess = [];
    let hasReprocessed = false;

    let processedCount = 0;

    for (const record of records) {
        console.log(`[${child}][Record=${processedCount+1}] - Starting`);
        const startTime = new Date();   

        const emailAddress = record.DataElements.find(de => de.Name === "Email Address")?.Value;        
        if (emailAddress === undefined)  {
            continue;        
        }
            

        const hasCasl = record.Purposes.find(p => p.Name === "CASL Consent");
        if (!hasCasl) {
            continue;
        };

        const identifier = record.Identifier;
        const token = await getLinkToken(identifier);
        
        const leads = await getLeads(emailAddress);
        if (leads.success === false && leads.errors?.find(err => err.code === "1003")) continue;        
        if ((leads.success === true && leads.result.lengt) === 0 || !leads.result) {
            console.log("Pushing to reprocess");
            reprocess.push(record);
            continue;
        };
        
        const consent = buildMarketoConsent(emailAddress, leads, record.Purposes, token);
      
        const updateResult = await updateLeads(consent);
        const updated = updateResult.result?.find(r => r.status === "updated");

        if (!updated) {
            console.log("Pushing to reprocess");
            reprocess.push(record);
            continue;
        }

        const endTime = new Date();
        const elapsedTime = endTime - startTime;
        console.log(`[${child}][Record=${processedCount}] - Elapsed Time: ${elapsedTime}`);
        results.push(updated);

        processedCount++;
    }

    let reprocessResults = [];
    if (reprocess.length > 0 && !hasReprocessed) {
        hasReprocessed = true; 
        setTimeout(async () => {
          console.log(`[${child}] - Initiating reprocessing after 20 minutes...`);
          reprocessResults = await execute(reprocess, child);         
  
          console.log(`[${child}] - Reprocessing completed.`);
        }, 20 * 60 * 1000); 
      }

    return results.concat(reprocessResults);
}

process.on("message", async (message) => {
    console.log(`Starting process for ${message.child}`);
    const results = await execute(message.records, message.child);

    process.send(results);
});
  