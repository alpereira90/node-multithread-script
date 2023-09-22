const axios = require("axios");
const { config } = require("./config");

let authToken = null;
let tokenExpiresAt = null;

const getLeads = async (emailAddress) => {
    if (!authToken || isTokenExpired()) {
        await authenticate();
    }

    const headers = {
        Authorization: `Bearer ${authToken}`
    }

    const params = {
        filterType: "Email",
        filterValues: emailAddress
    }
    
    try {    
        const { data } = await axios.get(config.marketo.baseUrl + config.marketo.getLeadUrl, { headers, params });   
        
        return { ...data }
    } catch (error) {
        console.error("Fail to get Leads from Marketo", error.message);
        return { error: error.message, ...record };
    }
};

const updateLeads = async (payload) => {
    if (!authToken || isTokenExpired()) {
        await authenticate();
    }

    const headers = {
        Authorization: `Bearer ${authToken}`
    }
    
    try {    
        const { data } = await axios.post(config.marketo.baseUrl + config.marketo.updateLeadUrl, payload, { headers });   
        
        return { ...data }
    } catch (error) {
        console.error("Fail to update Leads on Marketo", error.message);
        return { error: error.message, ...record };
    }
};

const isTokenExpired = () => {
    if (!tokenExpiresAt) {
        return true;
    }
    return tokenExpiresAt < Date.now();
};

const authenticate = async () => {
    const params = {
        grant_type: config.marketo.auth.grantType,
        client_id: config.marketo.auth.clientId,
        client_secret: config.marketo.auth.clientSecret
    }
    
    try {    
        const { data } = await axios.get(config.marketo.baseUrl + config.marketo.authUrl, { params });   
        
        authToken = data.access_token;
        tokenExpiresAt = Date.now() + data.expires_in * 1000; 
    } catch (error) {
        console.error("Fail to authenticate on Marketo", error.message);
        return { error: error.message, ...record };
    }
};

module.exports = { getLeads, updateLeads }