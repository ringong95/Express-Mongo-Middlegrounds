var exportedFunctions = module.exports = {};

exportedFunctions.contactSet = (email, unixDate)=> {
    return {
        user_email: email,
        dateOfPurchase: unixDate,
        dateToContact: (unixDate + Math.floor(5 * 365 * 24 * 60 * 60)),
        contactedYet: false,
        contactedWhen: null
    }
  };