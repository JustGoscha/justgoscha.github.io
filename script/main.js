var app = angular.module('app', []);

app.controller("ProjectCtrl", ["$scope", "Projects", function($scope, Projects){
	$scope.projects = Projects.projects;
	$scope.experiments = Projects.experiments;
	$scope.work = Projects.work;

}]);

app.factory('Projects', function(){

	var Projects = new Object();

	Projects.projects = [
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
			name: 'Allmighty-Autocomplete',
			logo: '/img/projects/autocomplete.png',
			link: 'http://justgoscha.github.io/allmighty-autocomplete/',
			alternative_links: [],
			images: [],
			tags: ['web', 'angularjs', 'html/css', 'javascript'],
			short_description: "An AngularJS directive for autocompletion."
		},
		{
			name: 'WebAudio Experiment 1',
			logo: '/img/projects/webaudio1.png',
			link: '/experiments/webaudio1/',
			alternative_links: [],
			images: [],
			tags: ['audio', 'webaudio', 'javascript'],
			short_description: "Listener positioning with WebAudio in 3D space and dynamical addition and movement of sound sources."
		},
		{
			name: 'Collision Detection with SAT',
			logo: '/img/projects/collision.png',
			link: '/experiments/collision-sat/',
			alternative_links: [],
			images: [],
			tags: ['game-development', 'javascript'],
			short_description: "Collision Detection with the Seperating Axis Theorem in 2D space."
		}
	];

	Projects.work = [
		{
			name: 'FOKUS WebRTC Telco Stack',
			logo: '/img/projects/webrtc.jpg',
			link: 'http://www.fokus.fraunhofer.de/en/fokus_testbeds/sc-playground/Software/webrtc_telco_stack/index.html',
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