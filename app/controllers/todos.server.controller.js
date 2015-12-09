var mongoose = require('mongoose'),
	Todo = mongoose.model('Todo');

// iterates over the Mongoose errors and returns the first one
var getErrorMessage = function(err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Unknown server error';
	}
};

exports.create = function(req, res) {
	// creates a new Todo model instance using the HTTP request body
	var todo = new Todo(req.body);

	// adds the authenticated Passport user as the todo creator
	todo.creator = req.user;

	// saves the todo document using the Mongoose instance save method
	todo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(todo);
		}
	});
};

exports.list = function(req, res) {
	// gets the collection of todo documents by using the Mongoose instance 'find' method, sorts them by created property, and adds name and username fields to the creator property
	Todo.find().sort('-created').populate('creator', 'name username').exec(function(err, todos) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(todos);
		}
	});
};

// outputs the todo object as json
exports.read = function(req, res) {
	res.json(req.todo);
};

// gets the todo document by using the Mongoose instance findById method
exports.todoByID = function(req, res, next, id) {
	Todo.findById(id).populate('creator', 'name username').exec(function(err, todo) {
		if (err)
			return next(err);

		if (!todo)
			return next(new Error('Failed to load todo ' + id));

		req.todo = todo;
		next();
	});
};

// updates the todo document which was previously fetched with the todoById middleware
exports.update = function(req, res) {
	var todo = req.todo;
	todo.title = req.body.title;
	todo.manual = req.body.manual;
	todo.speechNumber = req.body.speechNumber;
	todo.completedDate = req.body.completedDate;
	todo.comment = req.body.comment;
	todo.completed = req.body.completed;
	
	todo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(todo);
		}
	});
};

// deletes the todo document which was previously fetched with the todoById middleware
exports.delete = function(req, res) {
	var todo = req.todo;
	todo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(todo);
		}
	});
};

// middleware that uses the req.todo and req.user objects to verify that the current user is the createor of the current todo
exports.hasAuthorization = function(req, res, next) {
	if (req.todo.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};