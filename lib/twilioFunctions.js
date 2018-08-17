
var twilioFunctions = module.exports = {}


var twilio = require("twilio")
var client = new twilio(process.env.accountSid, process.env.TwilioAPI)

twilioFunctions.processPhoneNumber = (number) =>{
	return number.replace(/|-|\)|\(/g, "")
}

twilioFunctions.send = (data) =>{
	
	client.messages.create({
		body: `Hello ${data.user.name}, your ${data.order.product[0].name} has expired. Please reorder it at link here and use code Blankhere for a blank discount`,
		to: `+${twilioFunctions.processPhoneNumber(data.user.phone_number)}`,  // Text this number // we have to use Sineado's number until we have a full Twilio account
		from: "16043371502" // From a valid Twilio number
	})	
		.then((message) => console.log(message.sid))
}

twilioFunctions.checkCondition = (contact) =>{
	const waitPeriod = 604800
	contact.aggregate([
		{$match: { $and: [{ contactedWhen: { $lt: (Date.now()/1000 - waitPeriod) } }, {texted: {$exists: false}} ] } },	
		// the Date.now() - 604800 is to ensure there is two week grace period before we send them a SMS
		{$lookup:{ from: "kitorders", localField: "dateOfPurchase", foreignField: "date", as: "order" }},    
		{$unwind: "$order"},{$project: {"order.user_email": 0,"order.date": 0,"order._id": 0}},
		{$lookup: {from: "users",localField: "user_email",foreignField: "email",as: "user"}},
		{$unwind: "$user"},
	]).toArray(function (err, documents) {
		console.log({ data: documents })
		return documents
	})
}
