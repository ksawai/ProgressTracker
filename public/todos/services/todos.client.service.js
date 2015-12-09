/* Todos service */
// uses the $resource factory which has three parameters:
// 1. base URL for the resource endpoint
// 2. a routing parameter assignment using the todos document _id field
// 3. actions argument extending the resource methods with an update method that uses the PUT HTTP method
angular.module('todos').factory('Todos', ['$resource',
	function($resource) {
		return $resource('api/todos/:todoId', {
			todoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);