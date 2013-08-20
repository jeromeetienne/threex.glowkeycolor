threex.glowkeycolor
===================

it provides a glow based on key-color.

## Algorithm
* it is starting from a existing scene
  * the non glowing objects are rendered normally
  * the glowing objects are rendered with a key color and THREE.MeshBasicMaterial
  * for example 'hotpink'
* you render this scene in a render target
* the rendertarget is downsampled 
  * + black out all non key color pixel
  * + change keycolor pixel to glow color 
* this render target is then blurred
* the original scene is rendered normally, and then blended with the blur rendertarget
* it is that simple.
