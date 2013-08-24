threex.glowkeycolor
===================

It is a three.js extension which provide a glow based on key-color.
There is a single scene which is rendered only once.
It all happens in screenspace.

## TODO
* rename files
  * glowkeycolorPostProc
  * glowkeycolorRenderer
  * ok for the files...
  * but long for the source.
    * var glowPostProc  = new THREEx.GlowKeyColor.PostProc()
    * var glowRenderer  = new THREEx.GlowKeyColor.Renderer()

Show Don't Tell
===============
* [examples/glowkeycolor.html](http://jeromeetienne.github.io/threex.glowkeycolor/examples/glowkeycolor.html) \[[view source](https://github.com/jeromeetienne/threex.glowkeycolor/blob/master/examples/glowkeycolor.html)\].
It is usage example of threex.glowkeycolor.js
* [examples/glowrenderer.html](http://jeromeetienne.github.io/threex.glowkeycolor/examples/glowrenderer.html) \[[view source](https://github.com/jeromeetienne/threex.glowkeycolor/blob/master/examples/glowrenderer.html)\].
It is usage example of threex.glowkeycolor.js

* Here is an [usage example of threex.glowkeycolor](http://jeromeetienne.github.io/threex.glowkeycolor/examples/glowkeycolor.html) and its [source](https://github.com/jeromeetienne/threex.glowkeycolor/blob/master/examples/glowkeycolor.html).
* Here is an [usage example of threex.glowrenderer](http://jeromeetienne.github.io/threex.glowkeycolor/examples/glowrenderer.html) and its [source](https://github.com/jeromeetienne/threex.glowkeycolor/blob/master/examples/glowrenderer.html).
* Here is an [minecraft tron example](http://jeromeetienne.github.io/threex.glowkeycolor/examples/minecraft_tron.html) and its [source](https://github.com/jeromeetienne/threex.glowkeycolor/blob/master/examples/minecraft_tron.html).
It shows how the key color can be put in a texture.

How To Add a Glowing Object
===========================

One way is to use a ```THREE.MeshBasicMaterial``` with the keycolor, say ```hotpink```.
It would make the whole mesh glow.

```javascript
var geometry	= new THREE.SphereGeometry( 0.5 )
var material	= new THREE.MeshBasicMaterial({
	color	: keyColor
});
var mesh	= new THREE.Mesh( geometry, material )
scene.add( mesh )
```

Maybe you want to put the keyColor in a texture, thus only this part of the texture will 
glow. see [minecraft-tron example](https://github.com/jeromeetienne/threex.glowkeycolor/blob/master/examples/minecraft_tron.html).

threex.glowrenderer.js
======================

```javascript
var glowRenderer	= new THREEx.GlowRenderer(renderer, camera, scene, keyColor, glowColor)
updateFcts.push(function(delta, now){
	// to update at every frame
	glowRenderer.update(delta, now)
})
```

threex.glowkeydatgui.js
=======================

You can add a [dat.gui](https://code.google.com/p/dat-gui/) for fine tuning.

```javascript
THREEx.addGlowKeyColorDatGui(glowRenderer.glow)
```

Algorithm Steps
===============
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


Possible Improvements
=====================
* able to have a texture behind the keycolor
  * change the selection glowing/not-glowing
  * currently this is done with a full vec4() color
  * simply do a if(texel.a == 0.01) then glowing, else notglowing
  * thus the texel can still contains a texture
    * CON: require to accuratly encode the texture
  * now you do the same rendering, but add a edge detection in the glow pass
https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLRenderer.js#L4977  * thus only the borders of the glowing shape will be glowing
  * the inner part of the object will be untouched or close
  * so the texture will still be seeable
* make it possible to have multiple keyColor/glowColor
  * https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLShaders.js#L448
  * https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLShaders.js#L504
  * issue: currently three.js doesnt implement array of color 
    * 
  * fallback on 'fv'
    * it is for "flat array of floats with 3 x N size"
  * new THREE.Color('hotpink').toArray()
  * it makes it all super kludgy...
  * maybe a define would be better
