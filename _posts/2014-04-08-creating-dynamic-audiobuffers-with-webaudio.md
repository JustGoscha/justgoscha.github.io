---
layout: post
title: "Dynamically creating AudioBuffers with the WebAudio API"
date: 2014-04-08 14:24:33
categories: programming
tags:
- programming
- audio
- webaudio
- html5
- javascript
summary: "How to create AudioBuffers and fill them with your own data. And why it might be useful. Also a little demo application, I made to demonstrate what you can do with it."
---

There this great thing in HTML5 called WebAudio API, great for games and audio applications. One great thing about it is that you can create your own wave forms on-the-fly and play them back. This is useful because you don't need to download sounds; instead you can just generate them when they are needed or before the app is started. The applications for this are ranging from games to synthesizers to physical modeling of sound in the browser.

Okay enough intro, let's start actually doing it. It's pretty simple. At first you need to get the `AudioContext`, watch out for the browser prefixes:

```javascript
var AudioContext = AudioContext || webkitAudioContext || mozAudioContext;
var context = new AudioContext();
```

Now we need to create a `BufferSource` and a `Buffer` and then we get the channel data of the created buffer. 

```javascript
var node = context.createBufferSource()
	// createBuffer(channels, samples, sampleRate)
  , buffer = context.createBuffer(1, 4096, context.sampleRate)
  , data = buffer.getChannelData(0);
```

The `BufferSource` is actually a BufferSourceNode, it can be used only once. When it finished playing or when you stopped it you have to create a new one. The `Buffer` actually holds the raw audio data in its channels.

Now fill the buffer with your data. In this example it is filled with random numbers, which creates noise.

```javascript
for (var i = 0; i < 4096; i++) {
 data[i] = Math.random();
}
```

Now with the last step you set the buffer of the `BufferSourceNode` to your previously created buffer. You can make it loop, when you set the loop attribute of the `node` to `true`. Then you connect the `node` to the output, which is `context.destination`. And last but not least, make it start as soon as possible.

```javascript
node.buffer = buffer;
node.loop = true;
node.connect(context.destination);
node.start(0);
```

Put everything together and you have:

```javascript
var AudioContext = AudioContext || webkitAudioContext || mozAudioContext;
var context = new AudioContext();
var node = context.createBufferSource()
  , buffer = context.createBuffer(1, 4096, context.sampleRate)
  , data = buffer.getChannelData(0);
 
for (var i = 0; i < 4096; i++) {
 data[i] = Math.random();
}
node.buffer = buffer;
node.loop = true;
node.connect(context.destination);
node.start(0);
```

You can take this code and post it into the Chrome console, and it should immediately start playing that annoying noise sound that everybody loves. Just open your console with **CMD+ALT+i** ( *F12* or *CTRL+SHIFT+I* on Windows/Ubuntu) and copy paste it there.

Here is also a running [demo][plunk] on Plunker and a [gist][gist].

# Demo Application - WaveGenerator

I also did a little demo application to demonstrate one of many use cases for the dynamic creation of buffers. In this application you can draw a signal in the canvas and then you can play it back. [Here it is][exp]

![WavCreator - Screenshot](/img/posts/wavcreator/wavcreator-screenshot.png)

Now I is not hard to imagine that even software like Audacity could be build in a browser. The only think that is lacking right now for WebAudio is the browser support. But it is also getting better with support in Safari & probably Opera (but haven't tested that).


[plunk]: http://run.plnkr.co/plunks/vS2eUt/
[gist]: https://gist.github.com/JustGoscha/10104318
[exp]: /experiments/wavcreator/