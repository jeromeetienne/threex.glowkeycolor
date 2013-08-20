threex.glowkeycolor
===================

it provides a glow based on key-color.

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