const axios = require("axios");
const FormData = require("form-data");
const { config } = require("./config");

let authToken = null;
let tokenExpiresAt = null;

const getProfiles = async (dateFrom, offset, limit) => {
    if (!authToken || isTokenExpired()) {
        await authenticate();
    }

    const headers = {
        Authorization: `Bearer ${authToken}`
    }

    const params = {
        updatedSince: dateFrom,
        properties: "includeAllPreferences",
        page: offset,
        size: limit
    }; 
    
    try {    
        const { data } = await axios.get(config.oneTrust.baseUrl + config.oneTrust.getProfilesUrl, { params, headers });                
        return { ...data };
    } catch (error) {
        console.error('Fail to get Profiles', error.message);
        return { error: error.message };
    }
};

const getLinkToken = async (identifier) => {
    if (!authToken || isTokenExpired()) {
        await authenticate();
    }

    const headers = {
        Authorization: `Bearer ${authToken}`,
        identifier
    }
    
    try {    
        const { data } = await axios.get(config.oneTrust.baseUrl + config.oneTrust.getLinkTokenUrl, { headers });  
                
        return data.content[0]?.UrlEncodedLinkToken;
    } catch (error) {
        console.error('Fail to get Profiles from One Trust', error.message)
        return { error: error.message };
    }
};

const isTokenExpired = () => {
    if (!tokenExpiresAt) {
        return true;
    }
    return tokenExpiresAt < Date.now();
};

const authenticate = async () => {
    const form = new FormData();
    form.append("grant_type", config.oneTrust.auth.grantType);
    form.append("client_id", config.oneTrust.auth.clientId);
    form.append("client_secret", config.oneTrust.auth.clientSecret);  
    
    try {    
        const { data } = await axios.post(config.oneTrust.baseUrl + config.oneTrust.authUrl, form);   
        
        authToken = data.access_token;
        tokenExpiresAt = Date.now() + data.expires_in * 1000; 
    } catch (error) {
        console.error("Fail to authenticate on OneTrust", error.message);
        return { error: error.message, ...record };
    }
};

module.exports = { getProfiles, getLinkToken }