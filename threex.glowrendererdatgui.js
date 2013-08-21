/**
 * vendor.js framework definition
 * @type {Object}
 */
var THREEx	= THREEx || {};

THREEx.addGlowRendererDatGui	= function(glowRenderer, datGui){
	datGui		= datGui || new dat.GUI()
	var filterEffect= glowRenderer.glow.filterEffect
	var glowPasses	= glowRenderer.glow.composer.passes
	var blendEffect	= glowRenderer.blendEffect
	// options
	var options  = {
		glowFactor	: blendEffect.uniforms['glowFactor'].value,
		blurHLevel	: glowPasses[2].uniforms['h'].value,
		blurVLevel	: glowPasses[3].uniforms['v'].value,
		keyColor	: '#'+filterEffect.uniforms['keyColor'].value.getHexString(),
		glowColor	: '#'+filterEffect.uniforms['glowColor'].value.getHexString(),
		presetLow	: function(){
			options.blurHLevel	= 0.003
			options.blurVLevel	= 0.006
			onChange()
		},
		presetHigh	: function(){
			options.blurHLevel	= 0.006
			options.blurVLevel	= 0.012
			onChange()
		},
	}
	var onChange = function(){
		blendEffect.uniforms['glowFactor'].value	= options.glowFactor
		for(var i = 0; i < glowRenderer.glow.nBlurPass; i++){
			glowPasses[2+i*2].uniforms['h'].value	= options.blurHLevel
			glowPasses[3+i*2].uniforms['v'].value	= options.blurVLevel	
		}
		filterEffect.uniforms.keyColor.value.set( options.keyColor ); 
		filterEffect.uniforms.glowColor.value.set( options.glowColor ); 
	}
	onChange()
	
	// config datGui
	datGui.add( options, 'glowFactor', 0.0 , 15)	.listen().onChange( onChange )
	datGui.add( options, 'blurHLevel', 0.0 , 0.03)	.listen().onChange( onChange )
	datGui.add( options, 'blurVLevel', 0.0 , 0.03)	.listen().onChange( onChange )
	datGui.addColor( options, 'keyColor' )		.listen().onChange( onChange )
	datGui.addColor( options, 'glowColor' )		.listen().onChange( onChange )
	datGui.add( options, 'presetLow' )
	datGui.add( options, 'presetHigh' )
}