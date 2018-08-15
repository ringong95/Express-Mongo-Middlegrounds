
var twilioFunctions = module.exports = {}


var twilio = require("twilio")
var client = new twilio(process.env.accountSid, process.env.TwilioAPI)

twilioFunctions.send = () =>{
	client.messages.create({
		body: "Hello from Node",
		to: "+6043677778",  // Text this number // we have to use Sineado's number until we have a full Twilio account
		from: "16043371502" // From a valid Twilio number
	})
		.then((message) => console.log(message.sid))
}

twilioFunctions.checkCondition = (contact) =>{
	contact.aggregate([
		{
			$match: { $and: [{ contactedWhen: { $gt: (Date.now() / 1000) } }, {contactedYet: true} ] }
		},
		{$lookup:{ from: "kitorders", localField: "dateOfPurchase", foreignField: "date", as: "order" }},    
		{$unwind: "$order"},{$project: {"order.user_email": 0,"order.date": 0,"order._id": 0}},
		{$lookup: {from: "users",localField: "user_email",foreignField: "email",as: "user"}},
		{$unwind: "$user"},
	]).toArray(function (err, documents) {
		console.log({ data: documents })
    
	})
}
