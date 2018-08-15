var exportedFunctions = module.exports = {}

exportedFunctions.contactSet = (email, unixDate)=> {
	return {
		user_email: email,
		dateOfPurchase: unixDate,
		dateToContact: (unixDate + Math.floor(5 * 365 * 24 * 60 * 60)),
	}
}

exportedFunctions.massFind =(contact, orders, users, res)=>{
	contact.aggregate([
		{$match: { $and: [{ dateToContact: { $gt: (Date.now() / 1000) } }, {contactedYet: { $exists: false  }} ] }},
		{$lookup:{ from: "kitorders", localField: "dateOfPurchase", foreignField: "date", as: "order" }},    
		{$unwind: "$order"},{$project: {"order.user_email": 0,"order.date": 0,"order._id": 0}},
		{$lookup: {from: "users",localField: "user_email",foreignField: "email",as: "user"}},
		{$unwind: "$user"},
	]).toArray(function (documents) {
		res.json({ data: documents })
    
	})
}