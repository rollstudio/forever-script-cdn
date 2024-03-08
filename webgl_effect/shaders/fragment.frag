#ifdef GL_ES
precision mediump float;
#endif

// get our varying variables
varying vec2 vTextureCoord;

// our texture sampler (this is the lib default name, but it could be changed)
uniform sampler2D baseTexture;
uniform sampler2D overlayTexture;

// custom uniforms
uniform float uDisplacementStrength;

// our textures samplers
uniform sampler2D canvasTexture;

void main() {
  // our texture coords
  vec2 textureCoords = vTextureCoord;

  vec4 initialBaseTexture = texture2D(baseTexture, textureCoords);

  // get our canvas texture
  vec4 mouseEffect = texture2D(canvasTexture, textureCoords);

  // apply displacement to the texture coords based on our canvas texture RGB
  textureCoords = vTextureCoord + mouseEffect.r * uDisplacementStrength;

  // get our image texture
  vec4 finalBase = texture2D(baseTexture, textureCoords);
  vec4 finalOverlay = texture2D(overlayTexture, vTextureCoord);

  float frontImageAlpha = (initialBaseTexture.x + initialBaseTexture.y + initialBaseTexture.z) / 3.0;
  
  // the edge is typically to detect the background color 
  float isNotBlack = step(0.95, frontImageAlpha);

  // the value of the page's background color
  vec4 backgroundColor = vec4(vec3(0.961), 1.0);

  //   The code bellow is to keep a `shadowy` overlay between the letters 
  float mouseEffectAlpha = (mouseEffect.x + mouseEffect.y + mouseEffect.z) / 3.0;

  // detect base's letters in order to sample the overlay (only on them)
  float stepCase = (1.0 - isNotBlack) * mouseEffectAlpha;

  // define an area between the mouse displacement effect and the overlay revealation which mixed the two (mostly shows gradient)
  vec4 mixingSpot = smoothstep(finalBase, finalOverlay * (1.0 - isNotBlack) + isNotBlack * backgroundColor, mouseEffect);

  // the width of the mixing [0.0, 0.4) is overlay, [(0.4, 0.6) is the mixing of the two, [0.6, 1.0] is the mouse displacement effect or the background color 
  // adjust as needed
  float clearOverlayUpperBound = 0.4;
  float baseAndOVerlayMixingUpperBound = 0.6;

    // edges used to show some `middle effect` where the overlay becomes one with the distortion
      gl_FragColor = step(clearOverlayUpperBound, stepCase) * finalOverlay 
                    + (1.0 - step(clearOverlayUpperBound, stepCase)) * (step(baseAndOVerlayMixingUpperBound, stepCase)) * mixingSpot
                    + (1.0 - step(baseAndOVerlayMixingUpperBound, stepCase)) * mix(finalBase, backgroundColor, mouseEffect.r);

    // comment the lines 57-59 and uncomment lines 61-63 to remove the `mixingSpace`
    // gl_FragColor = step(baseAndOVerlayMixingUpperBound, stepCase) * finalOverlay 
    //         + (1.0 - step(baseAndOVerlayMixingUpperBound, stepCase)) * mix(finalBase, backgroundColor, mouseEffect.r);


    // Replace lines 46 - 59 to remove in between letters shadows


    //   float isBlack = 1.0 - isNotBlack;

    //   // the width of the mixing [0.0, 0.6) is overlay, [(0.6, 0.8) is the mixing of the two, [0.8, 1.0] is the mouse displacement effect or the background color 
    //   // adjust as needed
    //   float clearDisplayUpperLimit = 0.6;
    //   float mixingDisplayLowerLimit = 0.4;
                
    //                 // circle opacity > 0.8 -> clear path
    //   gl_FragColor = step(clearDisplayUpperLimit, mouseEffectAlpha) * ( isBlack * finalOverlay + isNotBlack * backgroundColor) 
    //                 // less than 0.8, more than 0.6
    //                  + (1.0 - step(clearDisplayUpperLimit, mouseEffectAlpha)) * step(mixingDisplayLowerLimit, mouseEffectAlpha) * (isNotBlack * smoothstep(finalBase, backgroundColor, mouseEffect) + isBlack * mix(finalBase, finalOverlay,  mouseEffect.r))
    //                 // less than 0.6
    //                 + (1.0 - step(mixingDisplayLowerLimit, mouseEffectAlpha)) * finalBase;
    // }
}