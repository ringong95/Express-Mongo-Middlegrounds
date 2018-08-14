
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
