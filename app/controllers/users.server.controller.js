var User = require('mongoose').model('User'),
	passport = require('passport');

var getErrorMessage = function(err) {
	var message = '';
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message)
				message = err.errors[errName].message;
		}
	}

	return message;
};

exports.renderLogin = function(req, res, next) {
	if (!req.user) {
		res.render('login', {
			title: 'Log-in Form',
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.redirect('/');
	}
};

exports.renderRegister = function(req, res, next) {
	if (!req.user) {
		res.render('register', {
			title: 'Register Form',
			messages: req.flash('error')
		});
	} else {
		return res.redirect('/');
	}
};

// Creates new users with the User model
// After login operation completed, user object will be in teh req.user object
exports.register = function(req, res, next) {
	if (!req.user) {
		// Create user object from HTTP request body
		var user = new User(req.body);
		var message = null;
		user.provider = 'local';
		// Tries to save it to MongoDb
		user.save(function(err) {
			// If error occurs, register method uses the getErrorMessage method to get the errors
			if (err) {
				var message = getErrorMessage(err);
				// Allows you to create and retrieve flash messages
				req.flash('error', message);
				return res.redirect('/register');
			}

			// If user created sucessfully, user session created using req.login() method from Passport module
			req.login(user, function(err) {
				if (err)
					return next(err);

				return res.redirect('/');
			});
		});
	} else {
		return res.redirect('/');
	}
};

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

exports.saveOAuthUserProfile = function(req, profile, done) {
	User.findOne({
			provider: profile.provider,
			providerId: profile.providerId
		},
		function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						profile.username = availableUsername;
						user = new User(profile);

						user.save(function(err) {
							if (err) {
								var message = _this.getErrorMessage(err);
								req.flash('error', message);
								return res.redirect('/register');
							}

							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		}
	);
};


// Users controller that handles all requests for user related operates
exports.create = function(req, res, next) {
	var user = new User(req.body);
	user.save(function(err) {
		if (err) {
			return next(err);
		} else {
			res.json(user);
		}
	});
};

// Method that finds all users
exports.list = function(req, res, next) {
	User.find({}, function(err, users) {
		if (err) {
			return next(err);
		} else {
			res.json(users);
		}
	});
};

// Just responds with JSON representation of req.user object
exports.read = function(req, res) {
	res.json(req.user);
};

// Method that finds one user and populates the req.user object
exports.userByID = function(req, res, next, id) {
	// findOne is a method from the Mongoose model
	User.findOne({
			_id: id
		},
		function(err, user) {
			if (err) {
				return next(err);
			} else {
				req.user = user;
				next();
			}
		}
	);
};

// Method that updates the user
exports.update = function(req, res, next) {
	// findByIdAndUpdate is a method from the Mongoose model
	User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
		if (err) {
			return next(err);
		} else {
			res.json(user);
		}
	});
};

exports.delete = function(req, res, next) {
	req.user.remove(function(err) {
		if (err) {
			return next(err);
		} else {
			res.json(req.user);
		}
	})
};

// middleware that uses the Passport initiated req.isAuthenticated method to check whether a user is currently authenticated
exports.requiresLogin = function(req, res, next) {
	// user is not signed in, responds with an authentication error and HTTP error code
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}
	// if user is signed in, calls next middleware in the chain
	next();
};