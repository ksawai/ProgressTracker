var users = require('../../app/controllers/users.server.controller'),
	todos = require('../../app/controllers/todos.server.controller');

module.exports = function(app) {
	// post method uses the users.requiresLogin middleware
	app.route('/api/todos')
		.get(todos.list)
		.post(users.requiresLogin, todos.create);

	// put and delete method use the users.requiresLogin and todos.hasAuthorization middleware to make sure authenticated users create new todos and only users who are the actual creators of the todo can delete or update it
	app.route('/api/todos/:todoId')
		.get(todos.read)
		.put(users.requiresLogin, todos.hasAuthorization, todos.update)
		.delete(users.requiresLogin, todos.hasAuthorization, todos.delete);

	// app.param method makes sure every route that has the todoId parameter will first call the todos.todoById middleware
	app.param('todoId', todos.todoByID);
};