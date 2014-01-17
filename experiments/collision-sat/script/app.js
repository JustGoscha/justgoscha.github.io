var app = angular.module('app', []);

app.directive('game', function(MainLoop){
  return {
    restrict: 'A',
    link: function(scope, element){
      MainLoop.setElement(element[0]);
    }
  };
});

// main loop
app.factory('MainLoop', function(Rectangles, CollisionDetection){
  var MainLoop = new Object();

  // the 2D context of the canvas
  var canvas = null;

  // the canvas element
  var canvasElement = null;

  MainLoop.setElement = function(element){
    canvas = element.getContext('2d');
    canvasElement = element;

    // make it crispy!  
    canvas['imageSmoothingEnabled'] = false;
    canvas['mozImageSmoothingEnabled'] = false;
    canvas['webkitImageSmoothingEnabled'] = false;

  }

  var clearCanvas = function(){
    canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);
    //canvas.width = canvas.width;
  }

  var showFPS = function(time){
    var FPS = Math.round(1000/time);
    canvas.font = "bold 18px sans-serif";
    canvas.fillStyle = "#333";
    canvas.fillText(FPS, canvasElement.width-40, canvasElement.height-20);
  }


  
  
  var lastTime = new Date();

  MainLoop.elapsedTime = 0;

  // main drawing loop
  var redraw = function(timestamp){
    // before starting to draw, always clean the canvas first
    clearCanvas();

    // compute elapsed time
    var currentTime = timestamp;
    if(!currentTime)
      currentTime = new Date();

    // draw white background
    canvas.fillStyle = "#fff";
    canvas.rect(0,0, canvasElement.width, canvasElement.height);
    canvas.fill();

    // draw rectangles on canvas
    Rectangles.updatePosition();
    Rectangles.draw(canvas);

    CollisionDetection.detectCollisions(canvas);


    var elapsedTime = currentTime - lastTime;

    // draw FPS
    showFPS(elapsedTime);

    lastTime = currentTime;
  }

  MainLoop.startDrawCycle = function(){
    var animFrame = window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          null ;

    var recursiveAnim = function(timestamp) {
      redraw(timestamp);
      animFrame(recursiveAnim);
    }

    animFrame(recursiveAnim);
  }

  MainLoop.startDrawCycle();

  return MainLoop;
});



app.factory('Rectangles', function(Controls){
  var Rectangles = new Object();

  function Rect(x,y,w,h,color,input){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.realColor = this.color;

    this.rotation = 0; // in radians

    this.controls = Controls.getControls(input);
    this.state = {
      up: false,
      down: false,
      left: false,
      right: false,
      rotate: false
    } 
    Controls.listenForKeyInput(this.controls, this.state);
    
    this.sinA = Math.sin(this.rotation);
    this.cosA = Math.cos(this.rotation);

    this.points = {
      a: null,
      b: null,
      c: null,
      d: null
    }


    this.calculatePoints = function(){
      this.sinA = Math.sin(this.rotation);
      this.cosA = Math.cos(this.rotation);
      var hw = this.w/2;
      var hh = this.h/2;

      // top left
      this.points.a = { 
        x:  (this.sinA*hh) - (this.cosA * hw) + this.x, 
        y:  -(this.cosA*hh) - (this.sinA * hw) +this.y
      }

      // top right
      this.points.b = {
        x:  (this.sinA*hh) + (this.cosA * hw) + this.x, 
        y:  -(this.cosA*hh) + (this.sinA * hw) +this.y
      }

      // bottom right
      this.points.c = { 
        x:  -(this.sinA*hh) + (this.cosA * hw) + this.x, 
        y:  (this.cosA*hh) + (this.sinA * hw) +this.y
      }

      // bottom left
      this.points.d = {
        x:  -(this.sinA*hh) - (this.cosA * hw) + this.x, 
        y:  (this.cosA*hh) - (this.sinA * hw) +this.y
      }
    }


    

  }

  var r1 = new Rect(100,200,60,50,"#9b4","WASD");
  var r2 = new Rect(0,0,200,160,"#175","arrowkeys");
  var r3 = new Rect(300,50,30,30,"#175","WASD");



  var rectList = [r1,r2];

  Rectangles.getRectlist = function(){
    return rectList;
  }

  var showPositions = function(canvas){
    for(var i in rectList){
      var rect = rectList[i];
      canvas.font = "100 11px sans-serif";
      canvas.fillStyle = "#333";
      var text = "Rectangle ["+i+"] Position: ("+rect.x+" | "+rect.y+")";
      canvas.fillText(text, 400, 10+80*i);
      text = "Point A: ("+Math.round(rect.points.a.x)+" | "+Math.round(rect.points.a.y)+")";
      canvas.fillText(text, 400, 25+80*i);
      text = "Point B: ("+Math.round(rect.points.b.x)+" | "+Math.round(rect.points.b.y)+")";
      canvas.fillText(text, 400, 40+80*i);
      text = "Point C: ("+Math.round(rect.points.c.x)+" | "+Math.round(rect.points.c.y)+")";
      canvas.fillText(text, 400, 55+80*i);
      text = "Point D: ("+Math.round(rect.points.d.x)+" | "+Math.round(rect.points.d.y)+")";
      canvas.fillText(text, 400, 70+80*i);
    }
  }

  Rectangles.updatePosition = function(){
    for(var i in rectList){
      var rect = rectList[i];
      if (rect.state.down){
        rect.y = rect.y + 2;
      } else if (rect.state.up){ 
        rect.y = rect.y - 2;
      } 
 
      if (rect.state.left){
        rect.x = rect.x - 2;
      }
      if (rect.state.right){
        rect.x = rect.x + 2;
      }

      if (rect.state.rotate){
        rect.rotation = (rect.rotation + 0.01)%(2*Math.PI);
      }

      rect.calculatePoints();
    }

  }

  Rectangles.draw = function(canvas){
    for(var i in rectList){
      var rect = rectList[i];

      // save the canvas state
      canvas.save();

      // do the rotation hokus pokus
      canvas.translate(rect.x, rect.y);
      canvas.rotate(rect.rotation);

      canvas.translate(-rect.w/2, -rect.h/2);

      canvas.fillStyle = rect.color;

      if(rect.hit)
        canvas.fillStyle = "rgba(230,35,49,0.7)";

      canvas.fillRect(
        0,
        0,
        rect.w, 
        rect.h
        );

      // restore the pre-rotation canvas state
      canvas.restore();
      canvas.beginPath();
      canvas.fillStyle = "#333";
      canvas.arc(rect.x, rect.y, 5, 0, 2 * Math.PI, false);
      canvas.fill();
      canvas.closePath();
    }

    showPositions(canvas);
  }

  return Rectangles;
});

app.factory("CollisionDetection", function(Rectangles){
  var CollisionDetection = new Object();

  var axisP = {
    x: 1,
    y: 0
  }

  var axisOrigin = {x: 300, y: 180};

  function dotProduct(a, b){
    return a.x*b.x + a.y*b.y;
  }

  CollisionDetection.detectCollisions = function(canvas){
    var rectangles = Rectangles.getRectlist();

    var collisions = new Array(rectangles.length);
    // go through all rectangles
    for(var i = 0; i<rectangles.length-1; i++){
      for(var j=i+1; j<rectangles.length; j++){
        var r1 = rectangles[i];
        var r2 = rectangles[j];

        var axis1 = {x: r1.points.a.x-r1.points.b.x , y: r1.points.a.y-r1.points.b.y}
        var axis2 = {x: r1.points.b.x-r1.points.c.x , y: r1.points.b.y-r1.points.c.y}
        var axis3 = {x: r2.points.a.x-r2.points.b.x , y: r2.points.a.y-r2.points.b.y}
        var axis4 = {x: r2.points.b.x-r2.points.c.x , y: r2.points.b.y-r2.points.c.y}

        CollisionDetection.drawAxis(canvas, axis1);
        CollisionDetection.drawAxis(canvas, axis2);
        CollisionDetection.drawAxis(canvas, axis3);
        CollisionDetection.drawAxis(canvas, axis4);


        var orthogonal = Math.PI/2;
        var hit = false;

        var ax1hit;
        var ax2hit;
        var ax3hit;
        var ax4hit;

        // if(ax1hit){
        //   ax2hit = checkAxis(r1,r2,axis2, canvas, r1.height);
        //   if(r1.rotation%orthogonal == r2.rotation%orthogonal && ax2hit){
        //     hit = true;
        //   } else if(ax2hit){
        //     ax3hit = checkAxis(r1,r2,axis3, canvas, r2.width);
        //     if(ax3hit){

        //     }
        //   }
        // }


        // this segment is so beautiful I don't want to delete it!
        switch(true){
          case !(ax1hit=checkAxis(r1,r2,axis1, canvas, r1.w)):
            break;
          case !(ax2hit=checkAxis(r1,r2,axis2, canvas, r1.h)):
            break;
          case r1.rotation%orthogonal == r2.rotation%orthogonal:
            hit = true;
            break;
          case !(ax3hit=checkAxis(r1,r2,axis3, canvas, r2.w)):
            break;
          case !(ax4hit=checkAxis(r1,r2,axis4, canvas, r2.h)):
            break;
          default:
            hit = true;
        }

        // TODO problem: who hit whom?
        if(hit){
          r1.hit = true;
          r2.hit = true;
        } else {
          r1.hit = false;
          r2.hit = false;
        }


      }
    }
  }

    function checkAxis(r1, r2, axis, canvas, axisLength){

        var dot1a = dotProduct(r1.points.a, axis);
        var dot1b = dotProduct(r1.points.b, axis);
        var dot1c = dotProduct(r1.points.c, axis);
        var dot1d = dotProduct(r1.points.d, axis);

        var max1 = Math.max(dot1a,dot1b,dot1c,dot1d);
        var min1 = Math.min(dot1a,dot1b,dot1c,dot1d);

        var dot2a = dotProduct(r2.points.a, axis);
        var dot2b = dotProduct(r2.points.b, axis);
        var dot2c = dotProduct(r2.points.c, axis);
        var dot2d = dotProduct(r2.points.d, axis);

        var max2 = Math.max(dot2a,dot2b,dot2c,dot2d);
        var min2 = Math.min(dot2a,dot2b,dot2c,dot2d);



        // CollisionDetection.drawProjection(canvas, max1, 6);
        // CollisionDetection.drawProjection(canvas, min1, 10);

        // CollisionDetection.drawProjection(canvas, max2, 20);
        // CollisionDetection.drawProjection(canvas, min2, 24);

        if(!(min1 > max2 || min2 > max1)){
          // maybe better to return axis penetration
          // divide by axislength to normalize
        CollisionDetection.drawProjection(canvas, min1/axisLength, max1/axisLength, 
          {x: axis.x/axisLength, y: axis.y/axisLength}, 5, r1.color);
        CollisionDetection.drawProjection(canvas, min2/axisLength, max2/axisLength, 
          {x: axis.x/axisLength, y: axis.y/axisLength}, 5, r2.color);


        var defmin = Math.min(max2-min1, max1-min2)/axisLength;
        var defmax = Math.max(min2-max1, min1-max2)/axisLength;

        CollisionDetection.drawProjection(canvas, Math.max(min2,min1)/axisLength, Math.min(max1,max2)/axisLength, 
          {x: axis.x/axisLength, y: axis.y/axisLength}, 5, "#d36");
      

          return Math.min(max2-min1, max1-min2)/axisLength; 
        } else {
          return false;
        }
    }

    // var r1 = rectangles[1];
    // var dp0 = dotProduct(r1.points.a, axisP);
    // var dp1 = dotProduct(r1.points.b, axisP);
    // var dp2 = dotProduct(r1.points.c, axisP);
    // var dp3 = dotProduct(r1.points.d, axisP);

    // //CollisionDetection.draw(canvas);
    // CollisionDetection.drawProjection(canvas, dp0, 6);
    // CollisionDetection.drawProjection(canvas, dp1, 10);
    // CollisionDetection.drawProjection(canvas, dp2, 14);
    // CollisionDetection.drawProjection(canvas, dp3, 18);


  

  CollisionDetection.draw = function(canvas){
    canvas.beginPath();
    canvas.moveTo(axisOrigin.x,axisOrigin.y);
    canvas.lineTo(axisOrigin.x+axisP.x,axisOrigin.y+axisP.y);
    canvas.lineWidth = 1;
    canvas.strokeStyle = "#222";
    canvas.stroke();
    canvas.closePath();
  }

  CollisionDetection.drawAxis = function(canvas, axis){
    canvas.beginPath();
    canvas.moveTo(axisOrigin.x,axisOrigin.y);
    canvas.lineTo(axisOrigin.x+axis.x*100,axisOrigin.y+axis.y*100);
    canvas.lineWidth = 1;
    canvas.strokeStyle = "#222";
    canvas.stroke();
    canvas.closePath();
  }

  CollisionDetection.drawProjection = function(canvas, from, to, axis, offset, color){
    canvas.beginPath();
    canvas.moveTo(from*axis.x,from*axis.y);
    canvas.lineTo(
      to*axis.x,
      to*axis.y
    );
    canvas.lineWidth = 10;
    canvas.strokeStyle = color;
    canvas.stroke();
    canvas.closePath();
  }

  return CollisionDetection;
});



// CONTROLS
app.factory('Controls', function(){
  var Controls = new Object();

  var standardControls = {
    "WASD": {
      "up":  87,
      "down": 83,
      "left": 65,
      "right": 68,
      "handbreak": 71 // "G"
    }, 
    "arrowkeys": {
      "up": 38,
      "down": 40,
      "left": 37,
      "right": 39,
      "handbreak": 32
    }
  }

  // input listen function
  Controls.listenForKeyInput = function(controls, state){
    angular.element(document).bind('keydown', function(event){
      switch (event.which){
        case controls.up: {
          event.preventDefault();
          state.up = true;
        }
        break;
        case controls.down: {
          event.preventDefault();
          state.down = true;
        }
        break;
        case controls.left: {
          event.preventDefault();
          state.left = true;
        }
        break;
        case controls.right: {
          event.preventDefault();
          state.right = true;
        }
        break;
        case controls.handbreak:{
          event.preventDefault();
          state.rotate = true;
        }
        break;
      }
    })

    angular.element(document).bind('keyup', function(event){
      switch (event.which){
        case controls.up: {
          event.preventDefault();
          state.up = false;
        }
        break;
        case controls.down: {
          event.preventDefault();
          state.down = false;
        }
        break;
        case controls.left: {
          event.preventDefault();
          state.left = false;
        }
        break;
        case controls.right: {
          event.preventDefault();
          state.right = false;
        }
        break;
        case controls.handbreak:{
          event.preventDefault();
          state.rotate = false;
        }
        break;
      }
    })
  }

  Controls.getControls = function(name){
    return standardControls[name];
  }

  return Controls;
});

