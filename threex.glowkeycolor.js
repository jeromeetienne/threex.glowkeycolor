var THREEx	= THREEx || {};

THREEx.GlowKeyColor	= function(renderer, camera, srcRenderTarget, dstRenderTarget){
	// setup the dstRenderTarget
	if( dstRenderTarget === undefined ){
		var textureW	= Math.floor(renderer.domElement.offsetWidth /2)
		var textureH	= Math.floor(renderer.domElement.offsetHeight/2)
		dstRenderTarget	= new THREE.WebGLRenderTarget(textureW, textureH, {
			minFilter	: THREE.LinearFilter,
			magFilter	: THREE.LinearFilter,
			format		: THREE.RGBFormat
		})		
	}
	this.dstRenderTarget = dstRenderTarget
	
	//////////////////////////////////////////////////////////////////////////////////
	//		update loop							//
	//////////////////////////////////////////////////////////////////////////////////
	
	var updateFcts	= []
	this.update	= function(delta, now){
		updateFcts.forEach(function(updateFct){
			updateFct(delta, now)
		})
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////

	// create the composer
	var composer	= new THREE.EffectComposer( renderer, dstRenderTarget )
	this.composer	= composer
	
	updateFcts.push(function(delta, now){
		composer.render(delta);		
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	// copy color + downsample
	var effect	= new THREE.TexturePass(srcRenderTarget)
	composer.addPass( effect )

	var effect	= new THREE.ShaderPass( THREEx.GlowKeyColor.ColorPassBandShader )
	this.filterEffect	= effect
	composer.addPass( effect )

	// configuration 
	var blurHLevel	= 0.006
	var blurVLevel	= 0.012


	console.assert( THREE.HorizontalBlurShader )
	console.assert( THREE.VerticalBlurShader )

	var nBlurPass	= 1
	this.nBlurPass	= nBlurPass
	for(var i = 0; i < nBlurPass; i++){
		// add HorizontalBlur Pass
		var effect	= new THREE.ShaderPass( THREE.HorizontalBlurShader )
		effect.uniforms[ 'h' ].value	= blurHLevel 
		composer.addPass( effect )
		// add Vertical Pass
		var effect	= new THREE.ShaderPass( THREE.VerticalBlurShader )
		effect.uniforms[ 'v' ].value	= blurVLevel
		composer.addPass( effect )		
	}

	// getter/setter for blurHLevel/blurVLevel	
	Object.defineProperty(this, 'blurHLevel', {
		get	: function(){ return blurHLevel; },
		set	: function(value){
			blurHLevel	= value
			for(var i = 0; i < nBlurPass; i++){
				var pass	= composer.passes[i*2 + 2]
				pass.uniforms[ 'h' ].value	= blurHLevel 
			}
		}
	})
	Object.defineProperty(this, 'blurVLevel', {
		get	: function(){ return blurVLevel; },
		set	: function(value){
			blurVLevel	= value
			for(var i = 0; i < nBlurPass; i++){
				var pass	= composer.passes[i*2 + 3]
				pass.uniforms[ 'v' ].value	= blurVLevel 
			}
		}
	})
}


/**
 * ColorPassBandShader - it is to keep only the keyColor - and maybe downsampling too 
 */
THREEx.GlowKeyColor.ColorPassBandShader	= {
	uniforms: {
		tDiffuse	: {
			type	: 't',
			value	: null
		},
		keyColor	: {
			type	: 'c',
			value	: new THREE.Color().set('hotpink')
		},
		glowColor	: {
			type	: 'c',
			value	: new THREE.Color().set('blue')
		},
	},

	vertexShader: [
		'varying vec2 vUv;',

		'void main() {',

			'vUv = uv;',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'
	].join('\n'),

	fragmentShader: [
		'uniform sampler2D tDiffuse;',

		'varying vec2 vUv;',
		'uniform vec3 keyColor;',
		'uniform vec3 glowColor;',

		'void main() {',
			'vec4 texel = texture2D( tDiffuse, vUv );',
			'if( equal(texel.xyz, keyColor) == bvec3(true) ){',
				'gl_FragColor = vec4(glowColor, 0);',
			'}else{',
				'gl_FragColor = vec4(0,0,0,0);',
			'}',
		'}',
	].join('\n')
};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Blend two textures
 */
THREEx.GlowKeyColor.BlendShader = {
	uniforms: {
		'tDiffuse1'	: { type: 't', value: null },
		'tDiffuse2'	: { type: 't', value: null },
		glowFactor	: { type: 'f', value: 4.0 },
		keyColor	: {
			type	: 'c',
			value	: new THREE.Color().set('red')
		},
		glowColor	: {
			type	: 'c',
			value	: new THREE.Color().set('red')
		},
	},

	vertexShader: [
		'varying vec2 vUv;',

		'void main() {',

			'vUv = uv;',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'
	].join('\n'),

	fragmentShader: [
		'uniform sampler2D tDiffuse1;',
		'uniform sampler2D tDiffuse2;',

		'varying vec2	vUv;',
		'uniform vec3	keyColor;',
		'uniform vec3	glowColor;',
		'uniform float	glowFactor;',

		'void main() {',

			'vec4 texel1 = texture2D( tDiffuse1, vUv );',
			'vec4 texel2 = texture2D( tDiffuse2, vUv );',
			
			// if original rendering keyColor then keep change it to glowColor
			'if( equal(texel1.xyz, keyColor) == bvec3(true) ){',
				'texel1	= vec4(glowColor, 1);',
			'}',
			
			// if texel2 is glowing, then increase it
			'if( equal(texel2.xyz, vec3(0.0,0.0,0.0)) != bvec3(true) ){',
				'texel2 *= vec4(vec3(glowFactor), 1.0);',
			'}',
			'gl_FragColor	= texel1 + texel2;',

		'}'
	].join('\n')

};


