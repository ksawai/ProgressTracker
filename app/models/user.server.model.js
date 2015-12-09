/* Used for Passport authentication*/

var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

// Mongoose schema
var UserSchema = new Schema({
	name: String,
	email: String,
	username: {
		type: String,
		trim: true,
		unique: true
	},
	password: String,
	provider: String, // strategy used to register the user
	providerId: String, // user id for the authentication strategy
	providerData: {}, // user to store user object retrieved from OAuth providers
	todos: {}//we will use this in the next tutorial to store TODOs
});

UserSchema.pre('save', 
	function(next) {
		if (this.password) {
			var md5 = crypto.createHash('md5');
			this.password = md5.update(this.password).digest('hex');
		}

		next();
	}
);

// Accepts a string password, hashes and compares to current users hashed password
UserSchema.methods.authenticate = function(password) {
	var md5 = crypto.createHash('md5');
	md5 = md5.update(password).digest('hex');

	return this.password === md5;
};

// Finds available unique username for new users
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne(
		{username: possibleUsername},
		function(err, user) {
			if (!err) {
				if (!user) {
					callback(possibleUsername);
				}
				else {
					return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
				}
			}
			else {
				callback(null);
			}
		}
	);
};

mongoose.model('User', UserSchema);