const buildMarketoConsent = (emailAddress, leads, purposes, token) => {
    var globalUnsubscribe = purposes.find(p => p.Name === "Unsubscribe from all personalized emails");

    let questradeSDInvestmentOptOut = !!globalUnsubscribe;
    let qTCommsNewsletterOptOut = !!globalUnsubscribe;
    let qTCommsEducationalOptOut = !!globalUnsubscribe;
    let qTCommsWebinarOptOut = !!globalUnsubscribe;
    let qTCommsProductReleaseOptOut = !!globalUnsubscribe;
    let qTSubsOffersContestsOptOut = !!globalUnsubscribe;
    let qTSubsMilestonesOptOut = !!globalUnsubscribe;
    let qTSubsSurveyOptOut = !!globalUnsubscribe;
    let questweathPortfolioQWPOptOut = !!globalUnsubscribe;
    let qWPCommsNewsletterOptOut = !!globalUnsubscribe;
    let qWPCommsEducationalOptOut = !!globalUnsubscribe;
    let qWPCommsWebinarOptOut = !!globalUnsubscribe;
    let qWPCommsProductReleaseOptOut = !!globalUnsubscribe;
    let qWPSubsOffesContestsOptOut = !!globalUnsubscribe;
    let qWPSubsMilestonesOptOut = !!globalUnsubscribe;
    let qWPSubsSurveyOptOut = !!globalUnsubscribe;
    let QuestMortgage_Marketing_Email_OptOut__c = !!globalUnsubscribe;
    let qMCommsNewsletterOptOut = !!globalUnsubscribe;
    let qMCommsEducationalOptOut = !!globalUnsubscribe;
    let qMCommsWebinarOptOut = !!globalUnsubscribe;
    let qMCommsRateUpdatesOptOut = !!globalUnsubscribe;
    let qMSubsOffersContestsOptOut = !!globalUnsubscribe;
    let qMSubsMilestonesOptOut = !!globalUnsubscribe;
    let qMSubsSurveyOptOut = !!globalUnsubscribe;

    const questradePurpose = purposes.find(p => p.Name === "Questrade");
    if (questradePurpose) {
        qTCommsNewsletterOptOut = false;

        const qtCommunications = questradePurpose.CustomPreferences.find(cp => cp.Name === "Communications");
        if (qtCommunications) {
            qTCommsNewsletterOptOut = !qtCommunications.Options.find(opt => opt.Name === "Newsletters")?.IsConsented;
            qTCommsEducationalOptOut = !qtCommunications.Options.find(opt => opt.Name === "Educational Resources")?.IsConsented;
            qTCommsWebinarOptOut = !qtCommunications.Options.find(opt => opt.Name === "Events & Webinars")?.IsConsented;
            qTCommsProductReleaseOptOut = !qtCommunications.Options.find(opt => opt.Name === "Product Releases & Updates")?.IsConsented;
        }

        const qtSubscriptions = questradePurpose.CustomPreferences.find(cp => cp.Name === "Subscriptions");
        if (qtSubscriptions) {
            qTSubsOffersContestsOptOut = !qtSubscriptions.Options.find(opt => opt.Name === "Offers & Contests")?.IsConsented;
            qTSubsMilestonesOptOut = !qtSubscriptions.Options.find(opt => opt.Name === "Recognition & Milestones")?.IsConsented;
            qTSubsSurveyOptOut = !qtSubscriptions.Options.find(opt => opt.Name === "Surveys & Research")?.IsConsented;            
        }       
    }

    questwealthPurpose = purposes.find(p => p.Name === "Questwealth Portfolios®");
    if (questwealthPurpose) {
        questweathPortfolioQWPOptOut = false;

        const qwCommunications = questwealthPurpose.CustomPreferences.find(cp => cp.Name === "Communications");
        if (qwCommunications) {
            qWPCommsNewsletterOptOut = !qwCommunications.Options.find(opt => opt.Name === "Newsletters")?.IsConsented;
            qWPCommsEducationalOptOut = !qwCommunications.Options.find(opt => opt.Name === "Educational Resources")?.IsConsented;
            qWPCommsWebinarOptOut = !qwCommunications.Options.find(opt => opt.Name === "Events & Webinars")?.IsConsented;
            qWPCommsProductReleaseOptOut = !qwCommunications.Options.find(opt => opt.Name === "Product Releases & Updates")?.IsConsented;
        }

        const qwSubscription = questwealthPurpose.CustomPreferences.find(cp => cp.Name === "Subscriptions");
        if (qwSubscription) {
            qWPSubsOffesContestsOptOut = !qwSubscription.Options.find(opt => opt.Name === "Offers & Contests")?.IsConsented;
            qWPSubsMilestonesOptOut = !qwSubscription.Options.find(opt => opt.Name === "Recognition & Milestones")?.IsConsented;
            qWPSubsSurveyOptOut = !qwSubscription.Options.find(opt => opt.Name === "Surveys & Research")?.IsConsented;
        }
    }

    questMortgagePurpose = purposes.find(p => p.Name === "QuestMortgage");
    if (questMortgagePurpose) {
        QuestMortgage_Marketing_Email_OptOut__c = false;

        const qmCommunication = questMortgagePurpose.CustomPreferences.find(cp => cp.Name === "QuestMortgage Communications");
        if (qmCommunication) {
            qMCommsNewsletterOptOut = !qmCommunication.Options.find(opt => opt.Name === "Newsletters")?.IsConsented;
            qMCommsEducationalOptOut = !qmCommunication.Options.find(opt => opt.Name === "Educational Resources")?.IsConsented;
            qMCommsWebinarOptOut = !qmCommunication.Options.find(opt => opt.Name === "Events and Webinars")?.IsConsented;
            qMCommsRateUpdatesOptOut = !qmCommunication.Options.find(opt => opt.Name === "Rate Updates")?.IsConsented;
        }
        
        const qmSubscription = questMortgagePurpose.CustomPreferences.find(cp => cp.Name === "Subscription");
        if (qmSubscription) {
            qMSubsOffersContestsOptOut = !qmSubscription.Options.find(opt => opt.Name === "Offers & Contests")?.IsConsented;
            qMSubsMilestonesOptOut = !qmSubscription.Options.find(opt => opt.Name === "Recognition & Milestones")?.IsConsented;
            qMSubsSurveyOptOut = !qmSubscription.Options.find(opt => opt.Name === "Surveys & Research")?.IsConsented;
        }

    }

    caslPurpose = purposes.find(p => p.Name === "CASL Consent");
    const caslStatus = caslPurpose.Status === "ACTIVE" ? "Confirm" : caslPurpose.Status === "WITHDRAWN" ? "Withdrawn" : "Not Given";
    const caslDate = new Date(caslPurpose.LastTransactionDate);

    return {
        action: "updateOnly",
        lookupField: "id",
        input: leads.result.map(lead => {

            return {
                Email: emailAddress,
                id: lead.id,
                questradeSDInvestmentOptOut,
                qTCommsNewsletterOptOut,
                qTCommsEducationalOptOut,
                qTCommsWebinarOptOut,
                qTCommsProductReleaseOptOut,
                qTSubsOffersContestsOptOut,
                qTSubsMilestonesOptOut,
                qTSubsSurveyOptOut,
                questweathPortfolioQWPOptOut,
                qWPCommsNewsletterOptOut,
                qWPCommsEducationalOptOut,
                qWPCommsWebinarOptOut,
                qWPCommsProductReleaseOptOut,
                qWPSubsOffesContestsOptOut,
                qWPSubsMilestonesOptOut,
                qWPSubsSurveyOptOut,
                QuestMortgage_Marketing_Email_OptOut__c,
                qMCommsNewsletterOptOut,
                qMCommsEducationalOptOut,
                qMCommsWebinarOptOut,
                qMCommsRateUpdatesOptOut,
                qMSubsOffersContestsOptOut,
                qMSubsMilestonesOptOut,
                qMSubsSurveyOptOut,
                CASL_Consent_Status__c: caslStatus,
                cASLConsentDate: caslDate,
                oneTrustTokenID: token
            }
        })
    }
};

module.exports = { buildMarketoConsent };