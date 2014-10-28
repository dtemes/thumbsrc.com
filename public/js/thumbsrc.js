var thumbsrc = angular.module('thumbsrc', []);

thumbsrc.controller('ThumbCtrl', ['$scope', function($scope) {
	var base = 'http://www.thumbsrc.com/'
	  , loadImagePath = '/img/ajax-loader.gif'
	  , baseUrl = 'http'
	  , imageTarget = $('#image-holder');

	$scope.getImageUrl = function(url) {
		return base + $scope.size + '/' + url;
	}

	$scope.submit = function() {
		var imageUrl = $scope.getImageUrl($scope.url);
		imageTarget.find('img').attr('src', loadImagePath);
		$('<img/>').attr('src', imageUrl).load(function(){
			imageTarget.find('img').remove();
			$(this).appendTo(imageTarget);
		});
	}

	$scope.fixUrl = function(){
		if ($scope.url === undefined) return;
		for (var i = 0; i < baseUrl.length && i < $scope.url.length; i++){
			if ($scope.url[i] != baseUrl[i]) {
				$scope.url = 'http://' + $scope.url;
				return;
			}
		}
	}

	$scope.init = function() {
		$scope.url = 'http://www.reddit.com/';
		$scope.size = 640;
		$scope.submit();
	}

	$scope.init();
}]);
