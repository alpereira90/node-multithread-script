const config = {
    numberOfThreads: 2,

    oneTrust: {
        baseUrl: "https://app-ca.onetrust.com/api",
        authUrl: "/access/v1/oauth/token",
        getProfilesUrl: "/consentmanager/v1/datasubjects/profiles",
        getLinkTokenUrl: "/consentmanager/v1/linktokens",
        auth: {
            grantType: "client_credentials",
            clientId: "",
            clientSecret: ""
        }
    },

    marketo: {
        baseUrl: "https://463-ATS-282.mktorest.com",
        authUrl: "/identity/oauth/token",
        getLeadUrl: "/rest/v1/leads.json",
        updateLeadUrl: "/rest/v1/leads.json",
        auth: {
            grantType: "client_credentials",
            clientId: "",
            clientSecret: ""
        }        
    }
};

module.exports = { config }