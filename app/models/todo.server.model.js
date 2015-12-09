/* Creates a Mongoose Todo model */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var TodoSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: "Title can't be blank"
	},
	manual: {
		type: String,
		default: '',
		trim: true,
		required: "Manual can't be blank"
	},
	speechNumber: {
		type: Number,
		default: '',
		trim: true
	},
	completedDate: {
		type: Date,
		default: Date.now
	},
	comment: {
		type: String,
		default: '',
		trim: true
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	completed: {
		type: Boolean,
		default: false
	}
});
mongoose.model('Todo', TodoSchema);