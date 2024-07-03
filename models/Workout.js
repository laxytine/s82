const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;


const workoutSchema = new mongoose.Schema({
	userId: {
		type: ObjectId,
		required: true,
		ref: 'User'
	},
	name: {
		type: String,
		required: [true, 'Name is Required']
	},
	duration: {
		type: String,
		required: [true, 'Duration in hours is Required']
	},
	dateAdded: {
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		default: 'pending'
	}

});


module.exports = mongoose.model('Workout', workoutSchema);