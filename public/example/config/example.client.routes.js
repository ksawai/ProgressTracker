// with angular.module('example') method you fetch the example module
// execute the config() method which you apply dependency injection to inject
// the $routeProvider (from ngRoute module)
// when() method defines new route plus the route URL and template URL
// otherwise() method defines behavior of the router when user navigates
// to unknown URL
angular.module('example').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'example/views/example.client.view.html'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);