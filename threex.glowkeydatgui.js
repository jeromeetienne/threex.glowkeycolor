/**
 * vendor.js framework definition
 * @type {Object}
 */
var THREEx	= THREEx || {};

THREEx.addGlowKeyColorDatGui	= function(glow, datGui){
	datGui		= datGui || new dat.GUI()
	var passes	= glow.composer.passes
	// options
	var options  = {
		blurHLevel	: passes[2].uniforms['h'].value,
		blurVLevel	: passes[3].uniforms['v'].value,
		presetLow	: function(){
			options.blurHLevel	= 0.003
			options.blurVLevel	= 0.006
			onChange()
		},
		presetHigh	: function(){
			options.blurHLevel	= 0.009
			options.blurVLevel	= 0.018
			onChange()
		},
	}
	var onChange = function(){
		for(var i = 0; i < glow.nBlurPass; i++){
			passes[2+i*2].uniforms['h'].value	= options.blurHLevel
			passes[3+i*2].uniforms['v'].value	= options.blurVLevel	
		}
	}
	onChange()
	
	// config datGui
	datGui.add( options, 'blurHLevel'	, 0.0 , 0.1)
		.listen().onChange( onChange )
	datGui.add( options, 'blurVLevel'	, 0.0 , 0.1)
		.listen().onChange( onChange )
	datGui.add( options, 'presetLow' )
	datGui.add( options, 'presetHigh' )
}