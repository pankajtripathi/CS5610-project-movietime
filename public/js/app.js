var app = angular.module("MyApp", ["ngRoute"]);

app.config(function($routeProvider, $httpProvider) {
	$routeProvider
	.when('/home', {
		templateUrl: 'views/home/home.html'
	})
	.when('/InTheater', {
        templateUrl: 'movieLib/InTheaters.html',
        controller: 'InTheaterCtrl'
    })
    .when('/BoxOffice', {
        templateUrl: 'movieLib/BoxOffice.html',
        controller: 'BoxOfficeCtrl'
    })
    .when('/OpeningMovies', {
        templateUrl: 'movieLib/OpeningMovies.html',
        controller: 'OpeningMoviesCtrl'
    })
    .when('/UpcomingMovies', {
        templateUrl: 'movieLib/UpcomingMovies.html',
        controller: 'UpcomingMoviesCtrl'
    })
    .when('/MovieSearch', {
        templateUrl: 'movieLib/MovieSearch.html',
        controller: 'SearchCtrl'
    })
    .when('/MovieDetails', {
            templateUrl: 'movieLib/MovieDetails.html',
            controller: 'MovieDetailCtrl'
     })
    .when('/MovieReviews', {
            templateUrl: 'movieLib/MovieReviews.html',
     })
    .when('/contact', {
		templateUrl: 'views/contact/contact.html'
	})
	.when('/profile', {
		templateUrl: 'views/profile/profile.html',
		controller: 'profileCtrl',
		resolve: {
			loggedin: checkLoggedin
		}
	})
	.otherwise({
		redirectTo: '/home'
	});
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
{
	var deferred = $q.defer();

	$http.get('/loggedin').success(function(user)
			{
		$rootScope.errorMessage = null;
		console.log(user);
		// User is Authenticated
		if (user !== '0')
		{
			$rootScope.currentUser = user;
			deferred.resolve();
		}
		// User is Not Authenticated
		else
		{
			$rootScope.errorMessage = 'You need to log in.';
			deferred.reject();
			$location.url('/index');
		}
			});

	return deferred.promise;
};

app.controller("IndexCtrl", function($scope, $http, $location, $rootScope){
	$scope.login = function(user){
		//console.log(user);
		$http.post("/login", user)
		.success(function(response){
			$scope.profile="user";
			$scope.logerr=null;
			console.log(response);
			$rootScope.currentUser = response;
			$location.url("/profile");
			angular.element('#modalClose').trigger('click');
		})
        .error(function (err){
        	$scope.logerr="err";
	    });
		
	}

	$scope.logout = function(){
		//console.log(user);
		$http.post("/logout")
		.success(function(response){
			$scope.profile=null;
			console.log(response);
			$rootScope.currentUser = response;
			$location.url("/home");
		});
	}

	$scope.register = function(user){
		console.log(user);
		if(user.password != user.password2 || !user.password || !user.password2)
		{
			$rootScope.message = "Your passwords don't match";
			$scope.regError = "Your passwords don't match";
			$scope.errmsg = "no-match"
		}
		else
		{
			$scope.regError = null;
			$http.post("/register", user)
			.success(function(response){
				console.log(response);
				if(response != null)
				{
					$rootScope.currentUser = response;
					angular.element('#modalClose').trigger('click');
					$location.url("/profile");
					$scope.profile = "user";
				}else{
					$scope.regError = "Some issue in registration. Please try again";
				}
			});
		}
	}
	
	$scope.searchMovies = function(){
		var title = $scope.searchByTitle;
        $http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/movies.json?q=" + title + "&page_limit=10&page=1&apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
        .success(function (response) {
            $rootScope.movies = response.movies;
            console.log(response);
            $location.url("/MovieSearch");
        })
	}
});

app.filter('changeUrl', function () {
    return function (input, splitChar, splitIndex) {
        //fetch the part of the url after /movie/
        var movieId = input.split(splitChar)[1];
        //append this movie id to the flixter url
        var newUrl = "http://content6.flixster.com/movie/" + movieId;
        //if a poster for a movie is not present return No image found poster.
        if (movieId != null) {
            return newUrl;
        } else {
            return "http://d18i5l0cp5i5h1.cloudfront.net/static/images/movie.none.det.gif";
        }
    }
});

app.controller("InTheaterCtrl",

		function ($scope, $http,$location,$rootScope) {
	//Use $http.get(url) for JSON and $http.jsonp(url) for jsonp 

	$http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?page_limit=16&page=1&country=us&apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
	.success(function (response) {
		$scope.movies = response.movies;
		console.log(response);
	})

	$scope.movieDetails = function(movie) {
		$http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/movies/"+movie.id+".json?apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
		.success(function (response) {
			$rootScope.movie = response;
			console.log(response);
			$location.url("/MovieDetails");
		})
	}
	
});

app.controller("BoxOfficeCtrl",

		function ($scope, $http,$location,$rootScope) {
	//Use $http.get(url) for JSON and $http.jsonp(url) for jsonp 

	$http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?limit=16&country=us&apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
	.success(function (response) {
		$scope.movies = response.movies;
		console.log(response);
	})

	$scope.movieDetails = function(movie) {
		$http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/movies/"+movie.id+".json?apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
		.success(function (response) {
			$rootScope.movie = response;
			console.log(response);
			$location.url("/MovieDetails");
		})
	}
	
});

app.controller("OpeningMoviesCtrl",

		function ($scope, $http,$location,$rootScope) {
	//Use $http.get(url) for JSON and $http.jsonp(url) for jsonp 

	$http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?limit=16&country=us&apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
	.success(function (response) {
		$scope.movies = response.movies;
		console.log(response);
	})

	$scope.movieDetails = function(movie) {
		$http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/movies/"+movie.id+".json?apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
		.success(function (response) {
			$rootScope.movie = response;
			console.log(response);
			$location.url("/MovieDetails");
		})
	}
	
});

app.controller("UpcomingMoviesCtrl",

		function ($scope, $http,$location,$rootScope) {
	//Use $http.get(url) for JSON and $http.jsonp(url) for jsonp 

	$http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/lists/movies/upcoming.json?page_limit=16&page=1&country=us&apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
	.success(function (response) {
		$scope.movies = response.movies;
		console.log(response);
	})

	$scope.movieDetails = function(movie) {
		$http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/movies/"+movie.id+".json?apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
		.success(function (response) {
			$rootScope.movie = response;
			console.log(response);
			$location.url("/MovieDetails");
		})
	}
	
});

app.controller("SearchCtrl",
	
	function ($scope, $http,$location,$rootScope) {
	$scope.movieDetails = function (movie) {
		$http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/movies/" + movie.id + ".json?apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
		.success(function (response) {
			$rootScope.movie = response;
			console.log(response);
			$location.url("/MovieDetails");
		})
	}
});

app.controller("MovieDetailCtrl",

		function ($scope, $http,$location,$rootScope) {
	//Use $http.get(url) for JSON and $http.jsonp(url) for jsonp 

	$scope.movieReview = function (movie) {
		$http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/movies/"+ movie.id+ "/reviews.json?review_type=top_critic&page_limit=20&page=1&country=us&apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
		.success(function (response) {
			$rootScope.movie = response;
			console.log(response);
			$location.url("/MovieReviews");
		})
	}
	
	$scope.watchbtn = $scope.currentUser;
	
    $scope.addToFav = function (m) {
               var data = {
              		 favMovies: m,
              		 username: $scope.currentUser.username
               }

               $http.post("/favMovies", data)
               .success(function (response) {
          	   $scope.fav="err";
               $rootScope.favMovies = response; 
               $location.url("/profile");
               });
    }
	
});

app.controller("profileCtrl",
		
		function ($scope, $http,$location,$rootScope) {
	
	    var user = $rootScope.currentUser.username;    
		
		$http.get("/favMovies/"+user)
		.success(function (response) {
			$rootScope.favMovies = response;
			console.log(response);
			$scope.fav="err";
			if(response.length == 0){
				$scope.fav=null;
			}
		});
		
	    $scope.removeFavMovie = function (m) {  
	      	 var data = m._id;
	      	 console.log(data);
	           $http.delete("/favMovies/"+user+"/"+data)
	           .success(function (response) {
	           $rootScope.favMovies = response;  
	           console.log(response);
	           })
	       }
	
	$scope.editbtn = "true";
	$scope.editDetails = function(){	
		$scope.edit = "edit";
		$scope.editbtn = null;
	}
	
	$scope.cancelUpdate = function(){	
		$scope.edit = null;
		$scope.editbtn = "true";
	}
	
	$scope.saveDetails = function(currentUser){
		
		$http.put("update/",currentUser)
		.success(function (response) {
			console.log(response);
			$rootScope.currentUser = response;
			$scope.edit = null;
		})	
	}
	       
});





