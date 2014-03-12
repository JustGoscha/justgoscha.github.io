---
layout: post
title:  "Simple & straight-forward WebRTC DataChannel establishment"
date:   2014-03-07 15:58:31
categories: programming
tags:
- programming
- webrtc
- datachannel
- javascript
- web-development
summary: "As I stumbled through the Internet trying to find any good tutorial for establishing a DataChannel connection in the Browser, I thought that there were not many good tutorials on this topic. Some old ones, where you didn't knew if they still apply, and some vague ones that were more about P2P video & audio. So I decided to make my own tutorial, just focussing on the DataChannel and make it simple and straight-forward."
---

![Data Channel]({{site.url}}/img/posts/datachannel/dc.jpg)

As I stumbled through the Internet trying to find any good tutorial for establishing a DataChannel connection in the Browser, I thought that there were not many good tutorials on this topic. Some old ones, where you didn't knew if they still apply, and some vague ones that were more about P2P video & audio. So I decided to make my own tutorial, just focussing on the DataChannel and make it simple and straight-forward.

# Prerequisites

A Websocket server or other channel to transport messages from one browser to another browser.

# Step-by-Step Instructions

So here are the instructions broken down to most simple chunks.

## Browser A: Offerer

### 1. Create PeerConnection with connection and config parameters:

```javascript
var config = {"iceServers":[{"url":"stun:stun.l.google.com:19302"}]};
var connection = { 
	'optional': 
		[{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }] 
};
var peerConnection = new webkitRTCPeerConnection(config, connection);
```

#### 1.1 Set PeerConnection onIceCandidate event handler:

To gather ice candidates and send them to the other user

```javascript
peerConnection.onicecandidate = function(e){
    if (!peerConnection || !e || !e.candidate) return;
    sendNegotiation("candidate", event.candidate);
}
```

### 2. Create DataChannel: 
	
```javascript
var dataChannel = peerConnection.createDataChannel("datachannel", {reliable: false});
```

#### 2.1 Set DataChannel event handling.

```javascript
dataChannel.onmessage = function(e){console.log("DC message:" +e.data);};
dataChannel.onopen = function(){console.log("------ DATACHANNEL OPENED ------");};
dataChannel.onclose = function(){console.log("------- DC closed! -------")};
dataChannel.onerror = function(){console.log("DC ERROR!!!")};
```

### 3. Create sdp constraints for the offer. 
We don't need any audio or video for this:

```javascript		
var sdpConstraints = {'mandatory':
  {
    'OfferToReceiveAudio': false,
    'OfferToReceiveVideo': false
  }
};
``` 

### 4. Create offer, set LocalDescription and send it:

Creates the offer, then sets the local description and sends the offer. 

```javascript
peerConnection.createOffer(function (sdp) {
	peerConnection.setLocalDescription(sdp);
	sendNegotiation("offer", sdp);
	console.log("------ SEND OFFER ------");
}, null, sdpConstraints);
```

Now the offer is sent out as soon as it is ready, now we need to think about handling the **ANSWER** and the incoming **ICE CANDIDATES**.

### 5. Process Ice Candidates:

Incoming ice candidates should be handled by this function.

```javascript
function processIce(iceCandidate){
  peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
}
```

### 6. Process Answer:

Incoming answers should be handled by this function.

```javascript
function processAnswer(answer){
  peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  console.log("------ PROCESSED ANSWER ------");
};
```

If everything worked well, the DataChannel onopen event should fire and you are good to go!
You can now send messages with `dataChannel.send("Hello World!")`.

At least, if the answerer side did everything right. What to do on the receiving end, you will see in the next section.

------------------------------------------------------------------------------------

## Browser B: Answerer

The answerer waits for incoming offer. When an offer arrives he first does the same as the Offerer in steps 1-2. So you can actually put these in the same function and call it for both, but I still write it down here. But let's already put them into a single function


### Step 1-2
#### Create PeerConnection with connection and config parameters
##### Set PeerConnection onIceCandidate event handler
#### Create DataChannel
##### Set DataChannel event handling.


```javascript


function openDataChannel (){
	var config = {"iceServers":[{"url":"stun:stun.l.google.com:19302"}]};
	var connection = { 'optional': [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }] };

	peerConnection = new webkitRTCPeerConnection(config, connection);
	peerConnection.onicecandidate = function(e){
    if (!peerConnection || !e || !e.candidate) return;
    var candidate = event.candidate;
    sendNegotiation("candidate", candidate);
	}

	dataChannel = peerConnection.createDataChannel(
		"datachannel", {reliable: false});

	dataChannel.onmessage = function(e){
    console.log("DC from ["+user2+"]:" +e.data);
	}
	dataChannel.onopen = function(){
    console.log("------ DATACHANNEL OPENED ------")
    $("#sendform").show();
	};
	dataChannel.onclose = function(){console.log("------ DC closed! ------")};
	dataChannel.onerror = function(){console.log("DC ERROR!!!")};

	peerConnection.ondatachannel = function () {
    console.log('peerConnection.ondatachannel event fired.');
	};
}
```

### 3. Set RemoteDescription

Sets the remoteDescription to the offer sdp. 

```javascript
peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
```

### 4. Set SDP constraints

Same as for offerer.

```javascript
var sdpConstraints = {'mandatory':
  {
    'OfferToReceiveAudio': false,
    'OfferToReceiveVideo': false
  }
};
```

### 5. Create Answer, set LocalDescription and send

Almost the same as above, but with createAnswer method.

```javascript
peerConnection.createAnswer(function (sdp) {
  peerConnection.setLocalDescription(sdp);
  sendNegotiation("answer", sdp);
  console.log("------ SEND ANSWER ------");
}, null, sdpConstraints);
```

### 6. Handle IceCandidates

Same function as for offerer. 

```javascript
function processIce(iceCandidate){
  peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
}
```

-------------------------------------------------------------------------------------

# Actual Flow of Actions 

or WTF is really happening if you put it in sequential order?

Let's assume we have to users. User A is the offerer and user B ist the answerer. So the actual flow of actions looks something like this.

The Simple overview version:

```
          A            |    signaling    |          B              
-----------------------|:---------------:|-------------------------
creates peerconnection |                 |                         
creates datachannel    |                 |                         
creates offer          |                 |                         
                       |---- offer ----> |                         
                       |                 |creates peerconnection   
                       |                 |creates datachannel      
                       |                 |creates answer with offer
                       |<---- answer ----|                         
processing Answer      |                 |                         
datachannel opens      |                 |datachannel opens        

```

Slightly more complex (probably nobody needs this, because it's already becoming confusing):

```
           A              |    signaling    |          B                 
--------------------------|:---------------:|----------------------------
create peerconnection     |                 |                            
create datachannel        |                 |                            
create offer              |                 |                            
(callback) offer created  |                 |                            
setLocalDescription(offer)|                 |                            
                          |---- offer ----> |                            
                          |                 |create peerconnection       
                          |                 |create datachannel          
                          |                 |setRemoteDescription(offer) 
                          |                 |create answer               
                          |                 |(callback) answer created   
                          |                 |setRemoteDescription(answer)
                          |<---- answer ----|                            
processing Answer         |                 |                            
                          |                 |(event) onicecandidate      
                          |<-ice candidate--|                            
                          |<-ice candidate--|                            
                          |<-ice candidate--|                            
processIce                |                 |                            
                          |                 |                            
(event) onicecandidate    |                 |                            
                          |--ice candidate->|                            
                          |--ice candidate->|                            
                          |--ice candidate->|                            
                          |                 |processIce                  
                          |                 |                            
datachannel opens         |                 |datachannel opens           
```

-------------------------------------------------------------------------------
# Don't get it? Don't panic.

So if this guide didn't help you, [try this one][source1]. 
There are tons of tutorials out there how to setup WebRTC PeerConnections or DataChannels. I had to read through tons of tutorials to get it. And then the one above helped me, but I decided to do one for myself, to remind me how it works, because in about a week I'll probably forget. 

-------------------------------------------------------------------------------
# APPENDIX: The Protocol and Signaling

I didn't specifically described yet what `sendNegotiation()` does, what protocol I'm using and what signaling channel. Mainly this is because the tutorial should be simply to provide an overview of the DataChannel initialization, because the other thing already seemed trivial.

## The Protocol

A simple protocol is used, consisting of 4 parameters:

```javascript
{
	from: "a",
	to: "b",
	action: "offer",
	data: {
		// action specific
	}
}
```

About the parameters:

`from`: Sender of the message

`to`: Recipient of the message

`action`: Specific action. For the simple datachannel establishment `"offer"`, `"answer"` and `"candidate"`is used

`data`: Depending on the action. For `offer` and `answer` this is an SDP. And for `candidate` it's an ice candidate.

This protocol can be easily extended with new actions, if you want to control or message other things with it.

## The Signaling

The best thing to use is a Websocket, but you could also use something like AJAX or socket.io. You just need to make sure that it comes to the other side. The easiest way would be to make a Websocket chat-server that just sends every message to everyone in a chat room.

The sendNegotiation function that I use looks like this:

```javascript
function sendNegotiation(type, sdp){
    var json = { from: user, to: user2, action: type, data: sdp};
    ws.send(JSON.stringify(json));
    console.log("Sending ["+user+"] to ["+user2+"]: " + JSON.stringify(sdp));
}
```

And the whole Websocket establishment and message handling looks like that:

```javascript
$("#ws-connect").click(function(){
	ws = new WebSocket("ws://127.0.0.1:9000/socket?roomname="+getURLParameter("roomname"));

	ws.onopen = function(e){    
    console.log("Websocket opened");
    $("#idform").show();
	}
	ws.onclose = function(e){   
	    console.log("Websocket closed");
	}
	ws.onmessage = function(e){ 
	  console.log("Websocket message received: " + e.data);

	  var json = JSON.parse(e.data);

	  if(json.action == "candidate"){
      if(json.to == user){
        processIce(json.data);
      }
	  } else if(json.action == "offer"){
      // incoming offer
      if(json.to == user){
        user2 = json.from;
        processOffer(json.data)
      }
	  } else if(json.action == "answer"){
      // incoming answer
      if(json.to == user){
          processAnswer(json.data);
      }
	  }
	}
}
```

I hope this helps. I will upload a demo soon to GitHub, if you have any questions just leave a comment below.

[source1]: http://vip24.ezday.co.kr/docs/rtc-datachannel-for-beginners.html
