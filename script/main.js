var app = angular.module('app', []);

app.controller("ProjectCtrl", ["$scope", "Projects","$timeout", function($scope, Projects, $timeout){
	$scope.projects = Projects.projects;
	$scope.experiments = Projects.experiments;
	$scope.work = Projects.work;
	$scope.callback = function(newFilter){
		$timeout(function(){
			console.log("callback called");
			$scope.search = newFilter;
		}, 0);
	}

	$scope.all = Projects.projects.concat(Projects.experiments.concat(Projects.work))

}]);

app.directive("projects", [ function(){
	return {
		restrict: 'E',
		template: '<section ng-if="projects && projects.length>0" class="projects">' +
			'	<article class="project" ng-repeat="project in projects | filter: filter">' +
			'		<div class="logo-wrap">' +
			'			<a href="{{project.link}}"><img src="{{project.logo}}" alt=""></a>' +
			'		</div>' +
			'		<div class="title-wrapper">' +
			'			<a href="{{project.link}}"><h1 class="title">{{project.name}}</h1></a>' +
			'			<div class="short-description">' +
			'				{{project.short_description}}' +
			'			</div>' +
			'			<span class="tag" ng-repeat="tag in project.tags" ng-click="callback(tag)">' +
			'				{{tag}}' +
			'			</span>' +
			'		</div>' +
			'	</article>' +
			'</section>',
		scope: {
			projects: "=data",
			filter: "=?filter",
			filterChanged: "=filterChanged"
		},
		link: function(scope){
			console.log("Link function, Callback ->" + scope.filterChanged);
			scope.callback = scope.filterChanged;
		}
	};
}]);

app.factory('Projects', function(){

	var Projects = new Object();

	Projects.projects = [
		{
			name: '#100DaysOfWalkcycles',
			logo: '/img/projects/100walkcycles.jpg',
			link: 'https://medium.com/@justgoscha/100daysofwalkcycles-134ae1ca91ac#.rxhskx76r',
			alternative_links: [],
			images: [],
			tags: ['animation','writing'],
			short_description: "100 Walkcycles in 100 days. Selling on Gumroad!"
		},
		{
			name: 'WatchNext',
			logo: '/img/projects/watchnext-logo.png',
			link: 'http://watch-next.herokuapp.com',
			alternative_links: [],
			images: [],
			tags: ['web', 'design', 'html/css', 'javascript','REST'],
			short_description: "Browse new Movie Releases by Genre, Rating or everything else!"
		},
		{
			name: 'Aureality',
			logo: '/img/projects/aureality-logo.png',
			link: 'https://soundcloud.com/justgoscha/sets/aureality-berlin-recordings',
			alternative_links: [],
			images: [],
			tags: ['audio', 'podcast', 'design'],
			short_description: "Binaural Audio Trips through Berlin."
		}
	];

	Projects.experiments = [
		{
			name: '@AnimatorsPal - A Twitter Bot',
			logo: '/img/projects/animatorspal.jpg',
			link: 'http://twitter.com/animatorsPal',
			alternative_links: [],
			images: [],
			tags: ['nodejs', 'javascript', 'twitter', 'bot'],
			short_description: "A Twitter Bot that retweets relevant animation content - Or tries to!"
		},
		{
			name: 'Allmighty-Autocomplete',
			logo: '/img/projects/autocomplete.png',
			link: 'http://justgoscha.github.io/allmighty-autocomplete/',
			alternative_links: [],
			images: [],
			tags: ['web', 'angularjs', 'html/css', 'javascript'],
			short_description: "An AngularJS directive for autocompletion."
		},
		{
			name: 'Procedural Skyline',
			logo: '/img/projects/skyline.png',
			link: 'http://justgoscha.github.io/skyline/',
			alternative_links: [],
			images: [],
			tags: ['gamedev', 'javascript', 'procedural'],
			short_description: "A procedurally genrated skyline on HTML5 with a parallax effect and a particle effect."
		},
		{
			name: 'WebAudio Binaural Positioning',
			logo: '/img/projects/webaudio1.png',
			link: 'http://justgoscha.github.io/binaural-webaudio/',
			alternative_links: [],
			images: [],
			tags: ['audio', 'webaudio', 'javascript'],
			short_description: "Listener positioning with WebAudio in 3D space and dynamical addition and movement of sound sources."
		},
		{
			name: 'WebAudio - Wavegenerator',
			logo: '/img/projects/wavcreator.png',
			link: 'http://justgoscha.github.io/wavcreator/',
			alternative_links: [],
			images: [],
			tags: ['audio', 'webaudio', 'html5', 'javascript'],
			short_description: "Draw your own signals and then play them back with the WebAudio API."
		},
		{
			name: 'Collision Detection with SAT',
			logo: '/img/projects/collision.png',
			link: '/experiments/collision-sat/',
			alternative_links: [],
			images: [],
			tags: ['gamedev', 'javascript'],
			short_description: "Collision Detection with the Seperating Axis Theorem in 2D space."
		},
    {
			name: 'Blank Page',
			logo: '/img/projects/blankpage.jpg',
			link: 'https://github.com/JustGoscha/blank-page',
			alternative_links: [],
			images: [],
			tags: ['gamedev', 'javascript', 'es6','typography'],
			short_description: "An interactive story language & engine, for the web"
		}

	];

	Projects.work = [
		{
			name: 'FOKUS WebRTC Telco Stack',
			logo: '/img/projects/webrtc.jpg',
			link: 'https://www.youtube.com/watch?v=LgniuJ-En7g',
			alternative_links: [],
			images: [],
			tags: ['webrtc', 'angularjs', 'html', 'javascript'],
			short_description: "A Conferencing Client in the browser with modular features, like Map Sharing and Overlay Drawing."
		},
		{
			name: 'Bachelor Thesis',
			logo: '/img/projects/bachelor.png',
			link: '/resources/BachelorThesisGeorgGraf.pdf',
			alternative_links: ['https://www.researchgate.net/publication/257654648_Enabling_Browser-Based_Real-Time_Communication_for_Future_Internet_Services_WebRTC_and_OAuth_Capabilities_for_FOKUS_Broker'],
			images: [],
			tags: ['webrtc', 'oauth', 'javascript', 'java', 'sip'],
			short_description: "Enabling Browser-Based Real-Time Communication for Future Internet Services - WebRTC and OAuth Capabilities"
		}
	];

	return Projects;
});