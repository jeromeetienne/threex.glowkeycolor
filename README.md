threex.glowkeycolor
===================

It is a three.js extension which provide a glow based on key-color.
There is a single scene which is rendered only once.
It all happens in screenspace.

## TODO
* rename files
* find a nice example
  * minecraft with star war sword
  * or just a tron
* make it possible to have multiple keyColor/glowColor
  * https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLShaders.js#L448
  * https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLShaders.js#L504

## Algorithm
* it is starting from a existing scene
  * the non glowing objects are rendered normally
  * the glowing objects are rendered with a key color and THREE.MeshBasicMaterial
  * for example 'hotpink'
* you render this scene in a render target
* the rendertarget is downsampled (PRO as it consume less gpu to process)
  * + black out all non key color pixel
  * + change keycolor pixel to glow color 
* this render target is then blurred
  * in horizontal, then vertical. 
  * it may be repeated several time to provide better looking glow, but slower
* then the original render is blended with the blur rendertarget
* it is that simple.

## How To Add a Glowing Object

just use a ```THREE.MeshBasicMaterial``` with the keycolor, say ```hotpink```

```javascript
var geometry	= new THREE.SphereGeometry( 0.5 )
var material	= new THREE.MeshBasicMaterial({
	color	: keyColor
});
var mesh	= new THREE.Mesh( geometry, material )
scene.add( mesh )
```

## threex.glowrenderer.js

```javascript
var glowRenderer	= new THREEx.GlowRenderer(renderer, camera, scene, keyColor, glowColor)
updateFcts.push(function(delta, now){
	// to update at every frame
	glowRenderer.update(delta, now)
})
```

## threex.glowkeydatgui..js

You can add a [dat.gui](https://code.google.com/p/dat-gui/) for fine tuning.

```javascript
THREEx.addGlowKeyColorDatGui(glowRenderer.glow)
```

# Possible Improvements
* able to have a texture behind the keycolor
  * change the selection glowing/not-glowing
  * currently this is done with a full vec4() color
  * simply do a if(texel.a == 0.01) then glowing, else notglowing
  * thus the texel can still contains a texture
    * CON: require to accuratly encode the texture
  * now you do the same rendering, but add a edge detection in the glow pass
  * thus only the borders of the glowing shape will be glowing
  * the inner part of the object will be untouched or close
  * so the texture will still be seeable