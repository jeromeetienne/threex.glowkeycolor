/**
 * vendor.js framework definition
 * @type {Object}
 */
var THREEx	= THREEx || {};

THREEx.GlowKeyColor	= THREEx.GlowKeyColor	|| {}

THREEx.GlowKeyColor.addPostProcDatGui	= function(glowPostProc, datGui){
	datGui		= datGui || new dat.GUI()
	var filterEffect= glowPostProc.filterEffect
	var passes	= glowPostProc.composer.passes
	// options
	var options  = {
		blurHLevel	: passes[2].uniforms['h'].value,
		blurVLevel	: passes[3].uniforms['v'].value,
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
		for(var i = 0; i < glowPostProc.nBlurPass; i++){
			passes[2+i*2].uniforms['h'].value	= options.blurHLevel
			passes[3+i*2].uniforms['v'].value	= options.blurVLevel	
		}
		filterEffect.uniforms.keyColor.value.set( options.keyColor ); 
		filterEffect.uniforms.glowColor.value.set( options.glowColor ); 
	}
	onChange()
	
	// config datGui
	datGui.add( options, 'blurHLevel', 0.0 , 0.1)	.listen().onChange( onChange )
	datGui.add( options, 'blurVLevel', 0.0 , 0.1)	.listen().onChange( onChange )
	datGui.addColor( options, 'keyColor' )		.listen().onChange( onChange )
	datGui.addColor( options, 'glowColor' )		.listen().onChange( onChange )
	datGui.add( options, 'presetLow' )
	datGui.add( options, 'presetHigh' )
}