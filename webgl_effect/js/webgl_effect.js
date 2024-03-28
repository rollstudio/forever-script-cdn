var params = {
  webGLCanvasID: "webGl-canvas",
  planeElementID: "plane",

  // TWEAK THOSE VALUES TO CHANGE OVERALL EFFECT

  // size of the effect (0: no effect, 1: full window)
  pointerSize: 0.025,
  // how much to increase/decrease opacity on each frame
  opacitySpeed: 0.005,
  // strength of the velocity of the mouse effect
  velocityStrength: 0.05,
  // the bigger the more displacement
  displacementStrength: 0.08,
  // does not change anything visually, but the smaller the scale the better the performance
  canvasScale: 0.125,
};

// look at window.onload on line 315

// Constructor function
function MouseEffect(params) {
  // Init the effect
  this.init(params);

  return this;
}

/*
 * Init everything
 */
MouseEffect.prototype.init = function (params) {

  this.curtains = new Curtains({
    container: params.webGLCanvasID,
    watchScroll: false,
  });

  this.plane = null;

  // get our plane element
  this.planeElement = document.getElementById(params.planeElementID);

  this.pixelRatio = this.curtains.pixelRatio || 1;

  // mouse positions history
  this.mouse = {
    position: {
      x: 0,
      y: 0,
    },
    attributes: [],
  };

  // params
  this.params = {
    pointerSize: params.pointerSize || 0.25,
    opacitySpeed: params.opacitySpeed || 0.0125,
    velocityStrength: params.velocityStrength || 0.25,
    displacementStrength: params.displacementStrength || 0.25,
    canvasScale: params.canvasScale || 0.125,
  };

  this.canvas = null;
  this.canvasContext = null;

  if (
    !document.getElementById(params.webGLCanvasID) ||
    !document.getElementById(params.planeElementID)
  ) {
    console.warn(
      "You must specify a valid ID for the WebGL canvas and the plane element"
    );
    return false;
  }
};

/*
 * Resize the mouse canvas
 */
MouseEffect.prototype.resize = function () {
  if (this.canvas && this.canvasContext) {
    this.canvas.width =
      this.planeElement.clientWidth * this.pixelRatio * this.params.canvasScale;
    this.canvas.height =
      this.planeElement.clientHeight *
      this.pixelRatio *
      this.params.canvasScale;

    this.canvasContext.width =
      this.planeElement.clientWidth * this.pixelRatio * this.params.canvasScale;
    this.canvasContext.height =
      this.planeElement.clientHeight *
      this.pixelRatio *
      this.params.canvasScale;

    this.canvasContext.scale(
      (this.pixelRatio * 1) / this.params.canvasScale,
      (this.pixelRatio * 1) / this.params.canvasScale
    );
    //this.mouse.canvasContext.imageSmoothingEnabled = true;
  }
};


let interpolate = true;

/*
 * Handle mouse/touch moves and push the positions into an array
 */
MouseEffect.prototype.handleMovement = function (e) {
  this.mouse.position.x =
    e.clientX - this.planeElement.getBoundingClientRect().left;
  this.mouse.position.y =
    e.clientY - this.planeElement.getBoundingClientRect().top;

  // touch event
  if (e.targetTouches) {
    this.mouse.position.x =
      e.targetTouches[0].clientX -
      this.planeElement.getBoundingClientRect().left;
    this.mouse.position.y =
      e.targetTouches[0].clientY -
      this.planeElement.getBoundingClientRect().top;
  }

  // always check that the plane is still here
  if (this.planeElement && this.plane) {

    if (this.mouse.attributes.length > 0) {
      const previousX = this.mouse.attributes[this.mouse.attributes.length - 1].initialPosition.x;
      const previousY = this.mouse.attributes[this.mouse.attributes.length - 1].initialPosition.y;

      const currentX = this.mouse.position.x;
      const currentY = this.mouse.position.y;

      if (!interpolate) {
        var mouseAttributes = {
          x: currentX * Math.pow(this.params.canvasScale, 2),
          y: currentY * Math.pow(this.params.canvasScale, 2),

          scale: 0.1,
          opacity: 1,
          velocity: {
            x: 0,
            y: 0,
          },
        };
        mouseAttributes.initialPosition = {
          x: currentX,
          y: currentY,
        };

        this.mouse.attributes.push(mouseAttributes);


      } else {

        const numInterpolations = 4; // Number of intermediate points to interpolate
        const deltaX = Math.round((currentX - previousX) / numInterpolations);
        const deltaY = Math.round((currentY - previousY) / numInterpolations);

        for (let i = numInterpolations; i >= 0; i--) {
          const interpolatedX = (currentX - deltaX * i);
          const interpolatedY = (currentY - deltaY * i);

          var mouseAttributes = {
            x: interpolatedX * Math.pow(this.params.canvasScale, 2),
            y: interpolatedY * Math.pow(this.params.canvasScale, 2),

            scale: 0.1,
            opacity: 1,
            velocity: {
              x: 0,
              y: 0,
            },
          };

          const alreadyExists = this.mouse.attributes.some(attr => attr.initialPosition.x === interpolatedX && attr.initialPosition.y === interpolatedY);
          if (alreadyExists) {
            continue;
          }

          // keep tracks of the initial position of the mouse to calculate velocity
          mouseAttributes.initialPosition = {
            x: interpolatedX,
            y: interpolatedY,
          };

          // handle velocity based on past values
          if (i < numInterpolations) {
            // Skip velocity calculation for the last interpolated point
            mouseAttributes.velocity = {
              x: Math.max(
                -this.params.canvasScale * 1.25,
                Math.min(
                  this.params.canvasScale * 1.25,
                  mouseAttributes.initialPosition.x -
                  this.mouse.attributes[this.mouse.attributes.length - 1]
                    .initialPosition.x
                )
              ),
              y: Math.max(
                -this.params.canvasScale * 1.25,
                Math.min(
                  this.params.canvasScale * 1.25,
                  mouseAttributes.initialPosition.y -
                  this.mouse.attributes[this.mouse.attributes.length - 1]
                    .initialPosition.y
                )
              ),
            };
          }

          // push our coords to our mouse coords array
          this.mouse.attributes.push(mouseAttributes);
        }
      }

    } else {
      // If this is the first mouse move
      console.log("enable drawing");
      this.curtains.enableDrawing();

      // Create mouse attributes for the initial position
      var initialMouseAttributes = {
        x: this.mouse.position.x * Math.pow(this.params.canvasScale, 2),
        y: this.mouse.position.y * Math.pow(this.params.canvasScale, 2),
        scale: 0.1,
        opacity: 1,
        velocity: { x: 0, y: 0 },
        initialPosition: { x: this.mouse.position.x, y: this.mouse.position.y }
      };
      this.mouse.attributes.push(initialMouseAttributes);
    }

    interpolate = true;

    // convert our mouse/touch position to coordinates relative to the vertices of the plane
    var mouseCoords = this.plane.mouseToPlaneCoords(
      this.mouse.position.x,
      this.mouse.position.y
    );
    // update our mouse position uniform
    this.plane.uniforms.mousePosition.value = [mouseCoords.x, mouseCoords.y];
  }
};

/*
 * This draws a gradient circle based on mouse attributes positions
 */
MouseEffect.prototype.drawGradientCircle = function (
  pointerSize,
  circleAttributes
) {
  this.canvasContext.beginPath();

  var gradient = this.canvasContext.createRadialGradient(
    circleAttributes.x,
    circleAttributes.y,
    0,
    circleAttributes.x,
    circleAttributes.y,
    pointerSize * circleAttributes.scale * this.params.canvasScale
  );

  // our gradient could go from opaque white to transparent white or from opaque white to transparent black
  // it changes the effect a bit
  gradient.addColorStop(
    0,
    "rgba(255, 255, 255, " + circleAttributes.opacity + ")"
  );

  // use another gradient stop if we want to add more transparency
  //gradient.addColorStop(0.85, 'rgba(255, 255, 255, 0.05)');

  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  this.canvasContext.fillStyle = gradient;

  this.canvasContext.arc(
    circleAttributes.x,
    circleAttributes.y,
    pointerSize * circleAttributes.scale * this.params.canvasScale,
    0,
    2 * Math.PI,
    false
  );
  this.canvasContext.fill();
  this.canvasContext.closePath();
};

/*
 * Drawing onto our canvas
 */
MouseEffect.prototype.animateCanvas = function () {
  // here we will handle our canvas texture animation
  var pointerSize = 4;

  // clear scene
  this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

  // draw a background black rectangle
  this.canvasContext.beginPath();
  this.canvasContext.fillStyle = "black";

  this.canvasContext.rect(0, 0, this.canvas.width, this.canvas.height);
  this.canvasContext.fill();
  this.canvasContext.closePath();

  // draw all our mouse coords
  for (var i = 0; i < this.mouse.attributes.length; i++) {
    this.drawGradientCircle(pointerSize, this.mouse.attributes[i]);
  }
};

/*
 * Once the plane is ready we set the event listeners and handle the render loop
 */
MouseEffect.prototype.handlePlane = function () {
  var self = this;

  self.plane
    .onReady(function () {
      // on resize, update the resolution uniform
      window.addEventListener("resize", self.resize.bind(self), false);

      document.body.addEventListener(
        "mousemove",
        self.handleMovement.bind(self),
        false
      );

      document.body.addEventListener(
        "touchmove",
        self.handleMovement.bind(self),
        false
      );

      document.body.addEventListener(
        "touchstart",
        () => {
          if (self.mouse.attributes.length > 0) {
            interpolate = false;
          }
          else {
            interpolate = true;
          }
        }
      );

      // for performance purpose, disable the drawing for now
      self.curtains.disableDrawing();
      // render the first frame only to display the picture
      self.curtains.needRender();
    })
    .onRender(function () {
      for (var i = 0; i < self.mouse.attributes.length; i++) {
        // decrease opacity
        self.mouse.attributes[i].opacity -= self.params.opacitySpeed;

        // // apply velocity
        // self.mouse.attributes[i].x +=
        //   self.mouse.attributes[i].velocity.x * self.params.velocityStrength;
        // self.mouse.attributes[i].y +=
        //   self.mouse.attributes[i].velocity.y * self.params.velocityStrength;

        // change scale
        if (self.mouse.attributes[i].opacity >= 0.5) {
          self.mouse.attributes[i].scale += self.params.opacitySpeed * 2;
        } else {
          self.mouse.attributes[i].scale -= self.params.opacitySpeed * 5;
          if (self.mouse.attributes[i].scale < 0)
            self.mouse.attributes[i].scale = 0;
        }

        if (
          self.mouse.attributes[i].opacity <= 0 ||
          self.mouse.attributes[i].scale <= 0
        ) {
          // if element is fully transparent, remove it
          self.mouse.attributes.splice(i, 1);

          // if this was our last mouse move, disable drawing again
          if (self.mouse.attributes.length == 0) {
            self.curtains.disableDrawing();
          }
        }
      }

      // draw our mouse coords arrays
      self.animateCanvas();
    });
};


/*
 * Adds the plane and starts the effect
 */
MouseEffect.prototype.addPlane = function (vertex, fragment) {
  // parameters to apply to our WebGL plane
  this.planeParams = {
    vertexShader: vertex,
    fragmentShader: fragment,
    // imageCover: true,
    uniforms: {
      mousePosition: {
        name: "uMousePosition",
        type: "2f",
        value: [this.mouse.position.x, this.mouse.position.y],
      },
      mouseEffect: {
        name: "uDisplacementStrength",
        type: "1f",
        value: this.params.displacementStrength,
      },
      canvasScale: { name: "uCanvasScale", type: "1f", value: 1.0 },
    },
  };

  // create our plane
  this.plane = new Plane(this.curtains, this.planeElement, this.planeParams);

  // if the plane was created successfully we can go on
  if (this.plane) {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "webGl-canvas";
    this.canvas.setAttribute("data-sampler", "canvasTexture");

    this.canvasContext = this.canvas.getContext("2d", { alpha: false });

    // load our canvas texture
    this.plane.loadCanvases([this.canvas]);

    // first we resize our mouse canvas
    this.resize();

    // then we handle the plane
    this.handlePlane();
  } else {
    console.log("plane failed to be created!");
  }
};

function hideElement(element) {
  /* 
   * Helper function to remove element and the space it reserves
   */
  element.style.visibility = 'hidden';
  element.style.display = 'none';
}

function showElement(element) {
  /* 
   * Helper function to (re-)add element and take up tha space it should
   */
  element.style.visibility = 'visible';
  element.style.display = 'block';
}


function initElementsStyle() {

  // Avoid changing elements' style initilization in css file
  document.getElementById('forever_section').style.backgroundColor = '#f5f5f5';
  const svgElement = document.getElementById('forever_mask_svg').getElementsByTagName('svg')[0];
  hideElement(svgElement);

  const frontImage = document.getElementById('plane').getElementsByTagName('img')[0];
  let backgroundTexture = document.getElementById('webgl-video');
  if (backgroundTexture) {
    console.log('webglBackgroudnVideo', backgroundTexture)
    // set the webgl effect video to the reel video of the website
    const video_src = document.getElementById('svg_bg_video_source').getAttribute('data-video-urls').split(',')[0];
    backgroundTexture.src = video_src;
    backgroundTexture.addEventListener("canplay", StartEffect);
  } else {
    console.log('no video element?', backgroundTexture);
    backgroundTexture = document.getElementById('plane').getElementsByTagName('img')[1];
    console.log('scrollY inside o nLoad')
    StartEffect();
  }


  const cssFrontImageStyle = `
    width: 100vw;
    position: relative;
    z-index: 1; 
    object-fit: cover;
    visibility: hidden;
  `;

  const cssbackgroundImageStyle = `
    position: absolute;
    width: 100vw;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 0;
    object-fit: cover;
    z-index: 0;
    visibility: hidden;
  `;

  frontImage.style.cssText = cssFrontImageStyle;
  backgroundTexture.style.cssText = cssbackgroundImageStyle;
}

window.onload = function () {

  if (window.scrollY !== 0) {
    return null;
  }

  initElementsStyle();
};

// start the effect
function StartEffect() {
  document.getElementById('webgl-video')?.removeEventListener("canplay", StartEffect);

  // load shaders and start effect
  ShaderLoader(
    "https://cdn.jsdelivr.net/gh/rollstudio/forever-script-cdn@feature/logo-webgl-effect/webgl_effect/shaders/vertex.vert",
    "https://cdn.jsdelivr.net/gh/rollstudio/forever-script-cdn@feature/logo-webgl-effect/webgl_effect/shaders/fragment.frag",
    // "shaders/vertex.vert",
    // "shaders/fragment.frag",
    function (vertex, fragment) {
      // init everything
      var mouseEffect = new MouseEffect(params);

      let error = false

      // if there's an error during the WebGL context creation
      mouseEffect.curtains.onError(function () {
        document.body.classList.add("no-webgl");
        document.body.classList.add("no-curtains");
        console.log('curtains error', error)
        error = true;
      });

      if (!error) {
        // add the plane to start the effect
        mouseEffect.addPlane(vertex, fragment);
        error = false;
      }

      mouseEffect.curtains.onContextLost(function () {
        console.log('context lost')
        mouseEffect.curtains.restoreContext();
      })

      mouseEffect.curtains.onAfterResize(function () {
        console.log('after resize here')
      })
    }
  );
}

function ShaderLoader(vertex_url, fragment_url, onLoad, onProgress, onError) {
  var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
  vertex_loader.setResponseType("text");
  vertex_loader.load(
    vertex_url,
    function (vertex_text) {
      var fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
      fragment_loader.setResponseType("text");
      fragment_loader.load(fragment_url, function (fragment_text) {
        onLoad(vertex_text, fragment_text);

        console.log("Shaders loaded successfully!");
      });
    },
    onProgress,
    onError
  );
}

window.addEventListener("scroll", (event) => {
  /*
   * When we reach the top of the window while scrolling, show the webGL cannvas and the plane containing the two images
   * and when scrolling bellow that, show the svg and hide the effect 
   */
  const svgElement = document.getElementById('forever_mask_svg').getElementsByTagName('svg')[0];
  const webGlCanvas = document.getElementById('webGl-canvas');
  const plane = document.getElementById('plane');
  const webGlCanvasBackground = document.getElementById('forever_section');
  const backgroundVideo = document.getElementById('svg_bg_video');

  const curtainsCanvas = document.getElementById("webGl-canvas").getElementsByTagName('canvas')[0];
  const curtainsCanvases = document.getElementById("webGl-canvas").getElementsByTagName('canvas');

  if (curtainsCanvas?.clientWidth !== 0 && curtainsCanvases.length === 0 && window.scrollY <= 0) {
    initElementsStyle();
  }

  if (window.scrollY <= 0) {

    /*
     * Our images are not fullscreen, thus when the canvas shows up again, the rest of the screen 
     * shows the background video (the one zooming in on scroll). So, we hdie it and show it momentarily. 
     * If fullscreen images get provided, remove
     */
    backgroundVideo.style.visibility = "hidden";
    hideElement(svgElement);
    showElement(webGlCanvas);
    showElement(plane);

    /* 
     * Plane and images only cover part of the screen and the overall background
     * does not have a color. We get the  element being directly on the back of the plane and canvas
     * add give it the same color as the svg's background, in order to appear as a whole
     */
    webGlCanvasBackground.style.backgroundColor = '#f5f5f5';
  } else {
    backgroundVideo.style.visibility = 'visible';
    showElement(svgElement);
    hideElement(webGlCanvas);
    hideElement(plane);

    /*
     * In continuation of the above comment, when the svg comes back to view, 
     * we remove the element's background color to get the svg and video background animation
     */
    webGlCanvasBackground.style.backgroundColor = 'black';
  }
});