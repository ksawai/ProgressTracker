/* Injects four services ($routeParams, $location, Authentication, and Todos)*/
angular.module('todos', ['ui.bootstrap']);
angular.module('todos').controller('TodosController', ['$scope', '$routeParams', '$location', 'Authentication', 'Todos',
	function($scope, $routeParams, $location, Authentication, Todos) {
		$scope.authentication = Authentication;

		// functions defined on the scope object

		$scope.create = function() {
			var todo = new Todos({
				title: this.title,
				manual: this.manual,
				speechNumber: this.speechNumber,
				completedDate: this.completedDate,
				comment: this.comment
			});

			todo.$save(function(response) {
				$location.path('todos/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.todos = Todos.query();
		};

		$scope.findOne = function() {
			$scope.todo = Todos.get({
				todoId: $routeParams.todoId
			});
		};

		$scope.update = function() {
			$scope.todo.$update(function() {
				$location.path('todos/' + $scope.todo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// figures out whether the user is deleting a todo from a list or directly from the todo view
		$scope.delete = function(todo) {
			if (todo) {
				todo.$remove(function() {
					for (var i in $scope.todos) {
						if ($scope.todos[i] === todo) {
							$scope.todos.splice(i, 1);
						}
					}
				});
			} else {
				$scope.todo.$remove(function() {
					$location.path('todos');
				});
			}
		};

  		// Datepicker
  		$scope.today = function() {
			$scope.dt = new Date();
		};
	  	$scope.today();

	  	$scope.clear = function () {
	    	$scope.dt = null;
	  	};

	  	$scope.open = function($event) {
	    	$scope.status.opened = true;
	  	};

	  	$scope.setDate = function(year, month, day) {
	    	$scope.dt = new Date(year, month, day);
	  	};

	  	$scope.status = {
	    	opened: false
	  	};

	  	$scope.availableManuals = {
	  		selectedManual: {id: 1, name: 'Competent Communication', numSpeeches: 10},
	  		manualOptions: [
	  			{id: 1, name: 'Competent Communication', numSpeeches: 10},
	  			{id: 2, name: 'Communicating on Television', numSpeeches: 5},
	  			{id: 3, name: 'Communicating on Video', numSpeeches: 5},
	  			{id: 4, name: 'Educational Better Speaker Series', numSpeeches: 10},
	  			{id: 5, name: 'Educational Leadership Excellence Series', numSpeeches: 11},
	  			{id: 6, name: 'Educational Successful Club Series', numSpeeches: 11},
	  			{id: 7, name: 'Facilitaing Discussion', numSpeeches: 5},
	  			{id: 8, name: 'High Performance Leadership', numSpeeches: 3},
	  			{id: 9, name: 'Humourously Speaking', numSpeeches: 5},
	  			{id: 10, name: 'Interpersonal Communications', numSpeeches: 5},
	  			{id: 11, name: 'Iterpretive Reading', numSpeeches: 5},
	  			{id: 12, name: 'Persuasive Speaking', numSpeeches: 5},
	  			{id: 13, name: 'Public Relations', numSpeeches: 5},
	  			{id: 14, name: 'Speaking to Inform', numSpeeches: 5},
	  			{id: 15, name: 'Special Occasion Speeches', numSpeeches: 5},
	  			{id: 16, name: 'Speciality Speeches', numSpeeches: 5},
	  			{id: 17, name: 'Speeches by Management', numSpeeches: 5},
	  			{id: 18, name: 'Storytelling', numSpeeches: 5},
	  			{id: 19, name: 'Technical Presentations', numSpeeches: 5},
	  			{id: 20, name: 'The Discussion Leader', numSpeeches: 5},
	  			{id: 21, name: 'The Entertaining Speaker', numSpeeches: 5},
	  			{id: 22, name: 'The Profressional Salesperson', numSpeeches: 5},
	  			{id: 23, name: 'The Professional Speaker', numSpeeches: 5}
	  		]
	  	}; 	
	}
]);