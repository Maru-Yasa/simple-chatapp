const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({

	sender: {
	 	type:String,
	 	required:true,
	},
	msg:{
		type:String,
		required:true
	}

}, { timestamps: true });



const Message = mongoose.model('message', messageSchema);
module.exports = Message;

