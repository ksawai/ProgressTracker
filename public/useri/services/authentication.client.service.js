angular.module('users').factory('Authentication', [
	function() {
		// window.user object from the AngularJS service
		this.user = window.user;
		return {
			user: this.user
		};
	}
]);