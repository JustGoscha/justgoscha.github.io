---
layout: post
title:  "Developing Multiplayer Games with the DataChannel API"
date:   2013-12-19 20:17:34
categories: jekyll update
tags: 
- programming 
- web-development 
- games 
- webrtc
---

## Prerequisites: 

Play! Framework
http://www.playframework.com/download
I'm using version Play 2.2.0
(If you don't have Java JDK, install that first!)



for server-side stuff and websocket. Although the main game runs peer to peer and doesn't need the server anymore!

## Step one: Setting up WebSockets

In /conf/routes

add the lines

    ## WebSocket
    GET		/socket						controllers.WebSocketEntrance.index()

That means that your WebSocket will be available under the address `http://localhost:9000/socket`.

Then add a file in `/app/controller` that will implement your WebSocket handling.
I called mine `WebSocketEntrance.java`.

The play tutorial for WebSockets
http://www.playframework.com/documentation/2.1.x/JavaWebSockets

### What do we need this WebSocket for?

+ establish RTCDataChannel connection between users
	(diagram of WebRTC)

+ only establish connection with users in your room

+ room is defined by URL param e.g. /?room_xyz

So with this we can define our **Goals**:

The Story:

+ A user connects to the WebSocket:
	
	1. Look for URL parameter: The value of it will become the `roomname`

		1.1 Check if the room with `roomname` exists:

		1.1.1a If **YES**: 
			Add the user to the room. (e.g. his WebSocket connection).
			// Send notification to the HOST user ?
			{info: user}
		1.1.1b If **NO**:  
			Create the room.
			Add room to rooms.
			Add user. 
			Make user HOST.

+ A user disconnects from a WebSocket:

	1. Check if other players are in the room
		1.1a YES:
			Just remove the user from the room.
		1.1b NO:
			Delete the room from rooms.

+ Establishing of the DataChannel Connection

### Checking the URL param

Change line in /conf/routes to:

	GET		/socket						controllers.WebSocketEntrance.index(roomname: String)


How to find out the URL param in JavaScript?
This function is ok for our humble purposes

	function getURLParameter(name) {
	  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
	}


So here the full code to simply test the websocket: 

	<html>
	    <head>
	        <title>@title</title>
	        <link rel="stylesheet" media="screen" href="@routes.Assets.at("stylesheets/main.css")">
	        <link rel="shortcut icon" type="image/png" href="@routes.Assets.at("images/favicon.png")">
	        <script src="@routes.Assets.at("javascripts/jquery-1.9.0.min.js")" type="text/javascript"></script>
	    </head>
	    <body>
	    	<button class="connect">Connect to WebSocket</button>
	    	<form action="" id="write">
	    		<input type="text" id="msg" />
	    		<input type="submit" />
	    	</form>
	    	
	    	<div class="log"></div>
	    	
	        <script>
	            function getURLParameter(name) {
	              return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
	            }

				var websocket;
				$('.connect').click(function(){
					websocket = new WebSocket("ws://127.0.0.1:9000/socket?roomname="+
	                getURLParameter("roomname"));
					websocket.onopen = function(evt){
						console.log("");
						$('.log').append("Websocket opened <br/>");
					};
					websocket.onclose = function(evt){
						console.log("Websocket closed");
						$('.log').append("Websocket closed <br/>");
					}
					websocket.onmessage = function(evt){console.log(
							"Message arrived: "+ evt.message);
							$('.log').append("Message: "+evt.data+" <br/>");
					}
					websocket.onerror = function(evt){
						console.log("WebSocket Error");
						$('.log').append("WebSocket error <br/>");
						
					}
				});

				$('#write').submit(function(e) {
					e.preventDefault();
					websocket.send($('#msg').val());
				});
				
	        </script>
	    </body>
	</html>


# Establishing DataChannel connection

