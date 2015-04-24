var app = angular.module("RouteApp", ['ngRoute']);

app.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/InTheater', {
            templateUrl: 'movieLib/InTheaters.html',
            controller: 'InTheaterCtrl'
        }).
        when('/MovieSearch', {
            templateUrl: 'movieLib/MovieSearch.html',
            controller: 'MovieSearchCtrl'
        }).
        when('/MovieDetails', {
            templateUrl: 'movieLib/MovieDetails.html',
        }).
        otherwise({
            redirectTo: '/MovieHandle'
        });
  }]);

app.controller("InTheaterCtrl",

    function ($scope, $http,$location,$rootScope) {
        //Use $http.get(url) for JSON and $http.jsonp(url) for jsonp 

           //$scope.searchMovies = function () {
            $http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?page_limit=16&page=1&country=us&apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
            .success(function (response) {
                $scope.movies = response.movies;
                console.log(response);
            })
          //}

          $scope.movieDetails = function(movie) {
            $http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/movies/"+movie.id+".json?apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
             .success(function (response) {
              $rootScope.movie = response;
              console.log(response);
              $location.url("/MovieDetails");
              })
          }
    });

app.controller("MovieSearchCtrl",

    function ($scope, $http,$location,$rootScope) {
        //Use $http.get(url) for JSON and $http.jsonp(url) for jsonp 

        $scope.searchMovies = function () {

            var title = $scope.searchByTitle;
            $http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/movies.json?q=" + title + "&page_limit=10&page=1&apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
            .success(function (response) {
                $scope.movies = response.movies;
                console.log(response);
            })
        }

        $scope.movieDetails = function (movie) {
            $http.jsonp("http://api.rottentomatoes.com/api/public/v1.0/movies/" + movie.id + ".json?apikey=g7rx7yxzn99upr85jtnetmva&callback=JSON_CALLBACK")
             .success(function (response) {
                 $rootScope.movie = response;
                 console.log(response);
                 $location.url("/MovieDetails");
             })
        }
    });