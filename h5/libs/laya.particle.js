
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var BlendMode=laya.webgl.canvas.BlendMode,Buffer=laya.webgl.utils.Buffer,Context=laya.resource.Context;
	var DrawParticleCmd=laya.display.cmd.DrawParticleCmd,Handler=laya.utils.Handler,Loader=laya.net.Loader,MathUtil=laya.maths.MathUtil;
	var MeshParticle2D=laya.webgl.utils.MeshParticle2D,Render=laya.renders.Render,RenderState2D=laya.webgl.utils.RenderState2D;
	var Shader=laya.webgl.shader.Shader,ShaderValue=laya.webgl.shader.ShaderValue,Sprite=laya.display.Sprite;
	var Stat=laya.utils.Stat,Texture=laya.resource.Texture,Value2D=laya.webgl.shader.d2.value.Value2D,VertexBuffer2D=laya.webgl.utils.VertexBuffer2D;
	var WebGL=laya.webgl.WebGL,WebGLContext=laya.webgl.WebGLContext;
/**
*
*<code>ParticleTemplateBase</code> 类是粒子模板基类
*
*/
//class laya.particle.ParticleTemplateBase
var ParticleTemplateBase=(function(){
	function ParticleTemplateBase(){
		/**
		*粒子配置数据
		*/
		this.settings=null;
		/**
		*粒子贴图
		*/
		this.texture=null;
	}

	__class(ParticleTemplateBase,'laya.particle.ParticleTemplateBase');
	var __proto=ParticleTemplateBase.prototype;
	/**
	*添加一个粒子
	*@param position 粒子位置
	*@param velocity 粒子速度
	*
	*/
	__proto.addParticleArray=function(position,velocity){}
	return ParticleTemplateBase;
})()


/**
*<code>EmitterBase</code> 类是粒子发射器类
*/
//class laya.particle.emitter.EmitterBase
var EmitterBase=(function(){
	function EmitterBase(){
		/**
		*积累的帧时间
		*/
		this._frameTime=0;
		/**
		*粒子发射速率
		*/
		this._emissionRate=60;
		/**
		*当前剩余发射时间
		*/
		this._emissionTime=0;
		/**
		*发射粒子最小时间间隔
		*/
		this.minEmissionTime=1 / 60;
		/**@private */
		this._particleTemplate=null;
	}

	__class(EmitterBase,'laya.particle.emitter.EmitterBase');
	var __proto=EmitterBase.prototype;
	/**
	*开始发射粒子
	*@param duration 发射持续的时间(秒)
	*/
	__proto.start=function(duration){
		(duration===void 0)&& (duration=Number.MAX_VALUE);
		if (this._emissionRate !=0)
			this._emissionTime=duration;
	}

	/**
	*停止发射粒子
	*@param clearParticles 是否清理当前的粒子
	*/
	__proto.stop=function(){
		this._emissionTime=0;
	}

	/**
	*清理当前的活跃粒子
	*@param clearTexture 是否清理贴图数据,若清除贴图数据将无法再播放
	*/
	__proto.clear=function(){
		this._emissionTime=0;
	}

	/**
	*发射一个粒子
	*
	*/
	__proto.emit=function(){}
	/**
	*时钟前进
	*@param passedTime 前进时间
	*
	*/
	__proto.advanceTime=function(passedTime){
		(passedTime===void 0)&& (passedTime=1);
		this._emissionTime-=passedTime;
		if (this._emissionTime < 0)return;
		this._frameTime+=passedTime;
		if (this._frameTime < this.minEmissionTime)return;
		while (this._frameTime > this.minEmissionTime){
			this._frameTime-=this.minEmissionTime;
			this.emit();
		}
	}

	/**
	*设置粒子粒子模板
	*@param particleTemplate 粒子模板
	*
	*/
	__getset(0,__proto,'particleTemplate',null,function(particleTemplate){
		this._particleTemplate=particleTemplate;
	});

	/**
	*设置粒子发射速率
	*@param emissionRate 粒子发射速率 (个/秒)
	*/
	/**
	*获取粒子发射速率
	*@return 发射速率 粒子发射速率 (个/秒)
	*/
	__getset(0,__proto,'emissionRate',function(){
		return this._emissionRate;
		},function(_emissionRate){
		if (_emissionRate <=0)return;
		this._emissionRate=_emissionRate;
		(_emissionRate > 0)&& (this.minEmissionTime=1 / _emissionRate);
	});

	return EmitterBase;
})()


/**
*@private
*/
//class laya.particle.ParticleEmitter
var ParticleEmitter=(function(){
	function ParticleEmitter(templet,particlesPerSecond,initialPosition){
		this._templet=null;
		this._timeBetweenParticles=NaN;
		this._previousPosition=null;
		this._timeLeftOver=0;
		this._tempVelocity=new Float32Array([0,0,0]);
		this._tempPosition=new Float32Array([0,0,0]);
		this._templet=templet;
		this._timeBetweenParticles=1.0 / particlesPerSecond;
		this._previousPosition=initialPosition;
	}

	__class(ParticleEmitter,'laya.particle.ParticleEmitter');
	var __proto=ParticleEmitter.prototype;
	__proto.update=function(elapsedTime,newPosition){
		elapsedTime=elapsedTime / 1000;
		if (elapsedTime > 0){
			MathUtil.subtractVector3(newPosition,this._previousPosition,this._tempVelocity);
			MathUtil.scaleVector3(this._tempVelocity,1 / elapsedTime,this._tempVelocity);
			var timeToSpend=this._timeLeftOver+elapsedTime;
			var currentTime=-this._timeLeftOver;
			while (timeToSpend > this._timeBetweenParticles){
				currentTime+=this._timeBetweenParticles;
				timeToSpend-=this._timeBetweenParticles;
				MathUtil.lerpVector3(this._previousPosition,newPosition,currentTime / elapsedTime,this._tempPosition);
				this._templet.addParticleArray(this._tempPosition,this._tempVelocity);
			}
			this._timeLeftOver=timeToSpend;
		}
		this._previousPosition[0]=newPosition[0];
		this._previousPosition[1]=newPosition[1];
		this._previousPosition[2]=newPosition[2];
	}

	return ParticleEmitter;
})()


/**
*<code>ParticleSettings</code> 类是粒子配置数据类
*/
//class laya.particle.ParticleSetting
var ParticleSetting=(function(){
	function ParticleSetting(){
		/**贴图*/
		this.textureName=null;
		/**贴图个数,默认为1可不设置*/
		this.textureCount=1;
		/**由于循环队列判断算法，最大饱和粒子数为maxPartices-1*/
		this.maxPartices=100;
		/**粒子持续时间(单位:秒）*/
		this.duration=1;
		/**如果大于0，某些粒子的持续时间会小于其他粒子,并具有随机性(单位:无）*/
		this.ageAddScale=0;
		/**粒子受发射器速度的敏感度（需在自定义发射器中编码设置）*/
		this.emitterVelocitySensitivity=1;
		/**最小开始尺寸（单位：2D像素、3D坐标）*/
		this.minStartSize=100;
		/**最大开始尺寸（单位：2D像素、3D坐标）*/
		this.maxStartSize=100;
		/**最小结束尺寸（单位：2D像素、3D坐标）*/
		this.minEndSize=100;
		/**最大结束尺寸（单位：2D像素、3D坐标）*/
		this.maxEndSize=100;
		/**最小水平速度（单位：2D像素、3D坐标）*/
		this.minHorizontalVelocity=0;
		/**最大水平速度（单位：2D像素、3D坐标）*/
		this.maxHorizontalVelocity=0;
		/**最小垂直速度（单位：2D像素、3D坐标）*/
		this.minVerticalVelocity=0;
		/**最大垂直速度（单位：2D像素、3D坐标）*/
		this.maxVerticalVelocity=0;
		/**等于1时粒子从出生到消亡保持一致的速度，等于0时粒子消亡时速度为0，大于1时粒子会保持加速（单位：无）*/
		this.endVelocity=1;
		/**最小旋转速度（单位：2D弧度/秒、3D弧度/秒）*/
		this.minRotateSpeed=0;
		/**最大旋转速度（单位：2D弧度/秒、3D弧度/秒）*/
		this.maxRotateSpeed=0;
		/**最小开始半径（单位：2D像素、3D坐标）*/
		this.minStartRadius=0;
		/**最大开始半径（单位：2D像素、3D坐标）*/
		this.maxStartRadius=0;
		/**最小结束半径（单位：2D像素、3D坐标）*/
		this.minEndRadius=0;
		/**最大结束半径（单位：2D像素、3D坐标）*/
		this.maxEndRadius=0;
		/**最小水平开始弧度（单位：2D弧度、3D弧度）*/
		this.minHorizontalStartRadian=0;
		/**最大水平开始弧度（单位：2D弧度、3D弧度）*/
		this.maxHorizontalStartRadian=0;
		/**最小垂直开始弧度（单位：2D弧度、3D弧度）*/
		this.minVerticalStartRadian=0;
		/**最大垂直开始弧度（单位：2D弧度、3D弧度）*/
		this.maxVerticalStartRadian=0;
		/**是否使用结束弧度,false为结束时与起始弧度保持一致,true为根据minHorizontalEndRadian、maxHorizontalEndRadian、minVerticalEndRadian、maxVerticalEndRadian计算结束弧度。*/
		this.useEndRadian=true;
		/**最小水平结束弧度（单位：2D弧度、3D弧度）*/
		this.minHorizontalEndRadian=0;
		/**最大水平结束弧度（单位：2D弧度、3D弧度）*/
		this.maxHorizontalEndRadian=0;
		/**最小垂直结束弧度（单位：2D弧度、3D弧度）*/
		this.minVerticalEndRadian=0;
		/**最大垂直结束弧度（单位：2D弧度、3D弧度）*/
		this.maxVerticalEndRadian=0;
		/**false代表RGBA整体插值，true代表RGBA逐分量插值*/
		this.colorComponentInter=false;
		/**false代表使用参数颜色数据，true代表使用原图颜色数据*/
		this.disableColor=false;
		/**混合模式，待调整，引擎中暂无BlendState抽象*/
		this.blendState=0;
		/**发射器类型,"point","box","sphere","ring"*/
		this.emitterType="null";
		/**发射器发射速率*/
		this.emissionRate=0;
		/**球发射器半径*/
		this.sphereEmitterRadius=1;
		/**球发射器速度*/
		this.sphereEmitterVelocity=0;
		/**球发射器速度随机值*/
		this.sphereEmitterVelocityAddVariance=0;
		/**环发射器半径*/
		this.ringEmitterRadius=30;
		/**环发射器速度*/
		this.ringEmitterVelocity=0;
		/**环发射器速度随机值*/
		this.ringEmitterVelocityAddVariance=0;
		/**环发射器up向量，0代表X轴,1代表Y轴,2代表Z轴*/
		this.ringEmitterUp=2;
		this.gravity=new Float32Array([0,0,0]);
		this.minStartColor=new Float32Array([1,1,1,1]);
		this.maxStartColor=new Float32Array([1,1,1,1]);
		this.minEndColor=new Float32Array([1,1,1,1]);
		this.maxEndColor=new Float32Array([1,1,1,1]);
		this.pointEmitterPosition=new Float32Array([0,0,0]);
		this.pointEmitterPositionVariance=new Float32Array([0,0,0]);
		this.pointEmitterVelocity=new Float32Array([0,0,0]);
		this.pointEmitterVelocityAddVariance=new Float32Array([0,0,0]);
		this.boxEmitterCenterPosition=new Float32Array([0,0,0]);
		this.boxEmitterSize=new Float32Array([0,0,0]);
		this.boxEmitterVelocity=new Float32Array([0,0,0]);
		this.boxEmitterVelocityAddVariance=new Float32Array([0,0,0]);
		this.sphereEmitterCenterPosition=new Float32Array([0,0,0]);
		this.ringEmitterCenterPosition=new Float32Array([0,0,0]);
		this.positionVariance=new Float32Array([0,0,0]);
	}

	__class(ParticleSetting,'laya.particle.ParticleSetting');
	ParticleSetting.checkSetting=function(setting){
		var key;
		for (key in ParticleSetting._defaultSetting){
			if (!setting.hasOwnProperty(key)){
				setting[key]=ParticleSetting._defaultSetting[key];
			}
		}
		setting.endVelocity=+setting.endVelocity;
		setting.gravity[0]=+setting.gravity[0];
		setting.gravity[1]=+setting.gravity[1];
		setting.gravity[2]=+setting.gravity[2];
	}

	__static(ParticleSetting,
	['_defaultSetting',function(){return this._defaultSetting=new ParticleSetting();}
	]);
	return ParticleSetting;
})()


/**
*@private
*/
//class laya.particle.ParticleData
var ParticleData=(function(){
	function ParticleData(){
		this.position=null;
		this.velocity=null;
		this.startColor=null;
		this.endColor=null;
		this.sizeRotation=null;
		this.radius=null;
		this.radian=null;
		this.durationAddScale=NaN;
		this.time=NaN;
	}

	__class(ParticleData,'laya.particle.ParticleData');
	ParticleData.Create=function(settings,position,velocity,time){
		var particleData=new ParticleData();
		particleData.position=position;
		MathUtil.scaleVector3(velocity,settings.emitterVelocitySensitivity,ParticleData._tempVelocity);
		var horizontalVelocity=MathUtil.lerp(settings.minHorizontalVelocity,settings.maxHorizontalVelocity,Math.random());
		var horizontalAngle=Math.random()*Math.PI *2;
		ParticleData._tempVelocity[0]+=horizontalVelocity *Math.cos(horizontalAngle);
		ParticleData._tempVelocity[2]+=horizontalVelocity *Math.sin(horizontalAngle);
		ParticleData._tempVelocity[1]+=MathUtil.lerp(settings.minVerticalVelocity,settings.maxVerticalVelocity,Math.random());
		particleData.velocity=ParticleData._tempVelocity;
		particleData.startColor=ParticleData._tempStartColor;
		particleData.endColor=ParticleData._tempEndColor;
		var i=0;
		if (settings.disableColor){
			for (i=0;i < 3;i++){
				particleData.startColor[i]=1;
				particleData.endColor[i]=1;
			}
			particleData.startColor[i]=MathUtil.lerp(settings.minStartColor[i],settings.maxStartColor[i],Math.random());
			particleData.endColor[i]=MathUtil.lerp(settings.minEndColor[i],settings.maxEndColor[i],Math.random());
		}
		else{
			if (settings.colorComponentInter){
				for (i=0;i < 4;i++){
					particleData.startColor[i]=MathUtil.lerp(settings.minStartColor[i],settings.maxStartColor[i],Math.random());
					particleData.endColor[i]=MathUtil.lerp(settings.minEndColor[i],settings.maxEndColor[i],Math.random());
				}
				}else {
				MathUtil.lerpVector4(settings.minStartColor,settings.maxStartColor,Math.random(),particleData.startColor);
				MathUtil.lerpVector4(settings.minEndColor,settings.maxEndColor,Math.random(),particleData.endColor);
			}
		}
		particleData.sizeRotation=ParticleData._tempSizeRotation;
		var sizeRandom=Math.random();
		particleData.sizeRotation[0]=MathUtil.lerp(settings.minStartSize,settings.maxStartSize,sizeRandom);
		particleData.sizeRotation[1]=MathUtil.lerp(settings.minEndSize,settings.maxEndSize,sizeRandom);
		particleData.sizeRotation[2]=MathUtil.lerp(settings.minRotateSpeed,settings.maxRotateSpeed,Math.random());
		particleData.radius=ParticleData._tempRadius;
		var radiusRandom=Math.random();
		particleData.radius[0]=MathUtil.lerp(settings.minStartRadius,settings.maxStartRadius,radiusRandom);
		particleData.radius[1]=MathUtil.lerp(settings.minEndRadius,settings.maxEndRadius,radiusRandom);
		particleData.radian=ParticleData._tempRadian;
		particleData.radian[0]=MathUtil.lerp(settings.minHorizontalStartRadian,settings.maxHorizontalStartRadian,Math.random());
		particleData.radian[1]=MathUtil.lerp(settings.minVerticalStartRadian,settings.maxVerticalStartRadian,Math.random());
		var useEndRadian=settings.useEndRadian;
		particleData.radian[2]=useEndRadian?MathUtil.lerp(settings.minHorizontalEndRadian,settings.maxHorizontalEndRadian,Math.random()):particleData.radian[0];
		particleData.radian[3]=useEndRadian?MathUtil.lerp(settings.minVerticalEndRadian,settings.maxVerticalEndRadian,Math.random()):particleData.radian[1];
		particleData.durationAddScale=settings.ageAddScale *Math.random();
		particleData.time=time;
		return particleData;
	}

	__static(ParticleData,
	['_tempVelocity',function(){return this._tempVelocity=new Float32Array(3);},'_tempStartColor',function(){return this._tempStartColor=new Float32Array(4);},'_tempEndColor',function(){return this._tempEndColor=new Float32Array(4);},'_tempSizeRotation',function(){return this._tempSizeRotation=new Float32Array(3);},'_tempRadius',function(){return this._tempRadius=new Float32Array(2);},'_tempRadian',function(){return this._tempRadian=new Float32Array(4);}
	]);
	return ParticleData;
})()


/**
*@private
*/
//class laya.particle.shader.value.ParticleShaderValue extends laya.webgl.shader.d2.value.Value2D
var ParticleShaderValue=(function(_super){
	function ParticleShaderValue(){
		/*
		public var a_CornerTextureCoordinate:Array=[4,WebGLContext.FLOAT,false,116,0];
		public var a_Position:Array=[3,WebGLContext.FLOAT,false,116,16];
		public var a_Velocity:Array=[3,WebGLContext.FLOAT,false,116,28];
		public var a_StartColor:Array=[4,WebGLContext.FLOAT,false,116,40];
		public var a_EndColor:Array=[4,WebGLContext.FLOAT,false,116,56];
		public var a_SizeRotation:Array=[3,WebGLContext.FLOAT,false,116,72];
		public var a_Radius:Array=[2,WebGLContext.FLOAT,false,116,84];
		public var a_Radian:Array=[4,WebGLContext.FLOAT,false,116,92];
		public var a_AgeAddScale:Array=[1,WebGLContext.FLOAT,false,116,108];
		public var a_Time:Array=[1,WebGLContext.FLOAT,false,116,112];
		*/
		this.u_CurrentTime=NaN;
		this.u_Duration=NaN;
		this.u_Gravity=null;
		//v3
		this.u_EndVelocity=NaN;
		this.u_texture=null;
		ParticleShaderValue.__super.call(this,0,0);
	}

	__class(ParticleShaderValue,'laya.particle.shader.value.ParticleShaderValue',_super);
	var __proto=ParticleShaderValue.prototype;
	/*�ŵ� ParticleShader ����
	this._attribLocation=['a_CornerTextureCoordinate',0,'a_Position',1,'a_Velocity',2,'a_StartColor',3,
	'a_EndColor',4,'a_SizeRotation',5,'a_Radius',6,'a_Radian',7,'a_AgeAddScale',8,'a_Time',9];
	*/
	__proto.upload=function(){
		var size=this.size;
		size[0]=RenderState2D.width;
		size[1]=RenderState2D.height;
		this.alpha=this.ALPHA *RenderState2D.worldAlpha;
		ParticleShaderValue.pShader.upload(this);
	}

	__static(ParticleShaderValue,
	['pShader',function(){return this.pShader=new ParticleShader();}
	]);
	return ParticleShaderValue;
})(Value2D)


/**
*@private
*/
//class laya.particle.ParticleTemplateWebGL extends laya.particle.ParticleTemplateBase
var ParticleTemplateWebGL=(function(_super){
	function ParticleTemplateWebGL(parSetting){
		this._vertices=null;
		//protected var _indexBuffer:Buffer;
		this._mesh=null;
		this._conchMesh=null;
		this._floatCountPerVertex=29;
		//0~3为CornerTextureCoordinate,4~6为Position,7~9Velocity,10到13为StartColor,14到17为EndColor,18到20位SizeRotation，21到22位Radius,23到26位Radian，27为DurationAddScaleShaderValue,28为Time
		this._firstActiveElement=0;
		this._firstNewElement=0;
		this._firstFreeElement=0;
		this._firstRetiredElement=0;
		this._currentTime=0;
		this._drawCounter=0;
		ParticleTemplateWebGL.__super.call(this);
		this.settings=parSetting;
	}

	__class(ParticleTemplateWebGL,'laya.particle.ParticleTemplateWebGL',_super);
	var __proto=ParticleTemplateWebGL.prototype;
	__proto.reUse=function(context,pos){
		return 0;
	}

	__proto.initialize=function(){
		var floatStride=0;
		this._vertices=this._mesh._vb.getFloat32Array();
		floatStride=this._mesh._stride / 4;
		var bufi=0;
		var bufStart=0;
		for (var i=0;i < this.settings.maxPartices;i++){
			var random=Math.random();
			var cornerYSegement=this.settings.textureCount ? 1.0 / this.settings.textureCount :1.0;
			var cornerY=NaN;
			for (cornerY=0;cornerY < this.settings.textureCount;cornerY+=cornerYSegement){
				if (random < cornerY+cornerYSegement)
					break ;
			}
			this._vertices[bufi++]=-1;
			this._vertices[bufi++]=-1;
			this._vertices[bufi++]=0;
			this._vertices[bufi++]=cornerY;
			bufi=(bufStart+=floatStride);
			this._vertices[bufi++]=1;
			this._vertices[bufi++]=-1;
			this._vertices[bufi++]=1;
			this._vertices[bufi++]=cornerY;
			bufi=bufStart+=floatStride;
			this._vertices[bufi++]=1;
			this._vertices[bufi++]=1;
			this._vertices[bufi++]=1;
			this._vertices[bufi++]=cornerY+cornerYSegement;
			bufi=bufStart+=floatStride;
			this._vertices[bufi++]=-1;
			this._vertices[bufi++]=1;
			this._vertices[bufi++]=0;
			this._vertices[bufi++]=cornerY+cornerYSegement;
			bufi=bufStart+=floatStride;
		}
	}

	__proto.update=function(elapsedTime){
		this._currentTime+=elapsedTime / 1000;
		this.retireActiveParticles();
		this.freeRetiredParticles();
		if (this._firstActiveElement==this._firstFreeElement)
			this._currentTime=0;
		if (this._firstRetiredElement==this._firstActiveElement)
			this._drawCounter=0;
	}

	__proto.retireActiveParticles=function(){
		var epsilon=0.0001;
		var particleDuration=this.settings.duration;
		while (this._firstActiveElement !=this._firstNewElement){
			var offset=this._firstActiveElement *this._floatCountPerVertex *4;
			var index=offset+28;
			var particleAge=this._currentTime-this._vertices[index];
			particleAge *=(1.0+this._vertices[offset+27]);
			if (particleAge+epsilon < particleDuration)
				break ;
			this._vertices[index]=this._drawCounter;
			this._firstActiveElement++;
			if (this._firstActiveElement >=this.settings.maxPartices)
				this._firstActiveElement=0;
		}
	}

	__proto.freeRetiredParticles=function(){
		while (this._firstRetiredElement !=this._firstActiveElement){
			var age=this._drawCounter-this._vertices[this._firstRetiredElement *this._floatCountPerVertex *4+28];
			if (age < 3)
				break ;
			this._firstRetiredElement++;
			if (this._firstRetiredElement >=this.settings.maxPartices)
				this._firstRetiredElement=0;
		}
	}

	__proto.addNewParticlesToVertexBuffer=function(){}
	//由于循环队列判断算法，当下一个freeParticle等于retiredParticle时不添加例子，意味循环队列中永远有一个空位。（由于此判断算法快速、简单，所以放弃了使循环队列饱和的复杂算法（需判断freeParticle在retiredParticle前、后两种情况并不同处理））
	__proto.addParticleArray=function(position,velocity){
		var nextFreeParticle=this._firstFreeElement+1;
		if (nextFreeParticle >=this.settings.maxPartices)
			nextFreeParticle=0;
		if (nextFreeParticle===this._firstRetiredElement)
			return;
		var particleData=ParticleData.Create(this.settings,position,velocity,this._currentTime);
		var startIndex=this._firstFreeElement *this._floatCountPerVertex *4;
		for (var i=0;i < 4;i++){
			var j=0,offset=0;
			for (j=0,offset=4;j < 3;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.position[j];
			for (j=0,offset=7;j < 3;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.velocity[j];
			for (j=0,offset=10;j < 4;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.startColor[j];
			for (j=0,offset=14;j < 4;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.endColor[j];
			for (j=0,offset=18;j < 3;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.sizeRotation[j];
			for (j=0,offset=21;j < 2;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.radius[j];
			for (j=0,offset=23;j < 4;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.radian[j];
			this._vertices[startIndex+i *this._floatCountPerVertex+27]=particleData.durationAddScale;
			this._vertices[startIndex+i *this._floatCountPerVertex+28]=particleData.time;
		}
		this._firstFreeElement=nextFreeParticle;
	}

	return ParticleTemplateWebGL;
})(ParticleTemplateBase)


/**
*
*@private
*/
//class laya.particle.emitter.Emitter2D extends laya.particle.emitter.EmitterBase
var Emitter2D=(function(_super){
	function Emitter2D(_template){
		this.setting=null;
		this._posRange=null;
		this._canvasTemplate=null;
		this._emitFun=null;
		Emitter2D.__super.call(this);
		this.template=_template;
	}

	__class(Emitter2D,'laya.particle.emitter.Emitter2D',_super);
	var __proto=Emitter2D.prototype;
	__proto.emit=function(){
		_super.prototype.emit.call(this);
		if(this._emitFun!=null)
			this._emitFun();
	}

	__proto.getRandom=function(value){
		return (Math.random()*2-1)*value;
	}

	__proto.webGLEmit=function(){
		var pos=new Float32Array(3);
		pos[0]=this.getRandom(this._posRange[0]);
		pos[1]=this.getRandom(this._posRange[1]);
		pos[2]=this.getRandom(this._posRange[2]);
		var v=new Float32Array(3);
		v[0]=0;
		v[1]=0;
		v[2]=0;
		this._particleTemplate.addParticleArray(pos,v);
	}

	__proto.canvasEmit=function(){
		var pos=new Float32Array(3);
		pos[0]=this.getRandom(this._posRange[0]);
		pos[1]=this.getRandom(this._posRange[1]);
		pos[2]=this.getRandom(this._posRange[2]);
		var v=new Float32Array(3);
		v[0]=0;
		v[1]=0;
		v[2]=0;
		this._particleTemplate.addParticleArray(pos,v);
	}

	__getset(0,__proto,'template',function(){
		return this._particleTemplate;
		},function(template){
		this._particleTemplate=template;
		if (!template){
			this._emitFun=null;
			this.setting=null;
			this._posRange=null;
		};
		this.setting=template.settings;
		this._posRange=this.setting.positionVariance;
		if((this._particleTemplate instanceof laya.particle.ParticleTemplate2D )){
			this._emitFun=this.webGLEmit;
		}
	});

	return Emitter2D;
})(EmitterBase)


/**
*@private
*/
//class laya.particle.ParticleTemplate2D extends laya.particle.ParticleTemplateWebGL
var ParticleTemplate2D=(function(_super){
	function ParticleTemplate2D(parSetting){
		this.x=0;
		this.y=0;
		this._blendFn=null;
		this._startTime=0;
		this._key={};
		this.sv=new ParticleShaderValue();
		ParticleTemplate2D.__super.call(this,parSetting);
		var _this=this;
		Laya.loader.load(this.settings.textureName,Handler.create(null,function(texture){
			_this.texture=texture;
		}));
		this.sv.u_Duration=this.settings.duration;
		this.sv.u_Gravity=this.settings.gravity;
		this.sv.u_EndVelocity=this.settings.endVelocity;
		this._blendFn=BlendMode.fns[parSetting.blendState];
		this._mesh=MeshParticle2D.getAMesh(this.settings.maxPartices);
		this.initialize();
	}

	__class(ParticleTemplate2D,'laya.particle.ParticleTemplate2D',_super);
	var __proto=ParticleTemplate2D.prototype;
	Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
	//loadContent();
	__proto.getRenderType=function(){return-111}
	__proto.releaseRender=function(){}
	__proto.addParticleArray=function(position,velocity){
		position[0]+=this.x;
		position[1]+=this.y;
		_super.prototype.addParticleArray.call(this,position,velocity);
	}

	/*
	override protected function loadContent():void{
		var indexes:Uint16Array=new Uint16Array(settings.maxPartices *6);
		for (var i:int=0;i < settings.maxPartices;i++){
			indexes[i *6+0]=(i *4+0);
			indexes[i *6+1]=(i *4+1);
			indexes[i *6+2]=(i *4+2);
			indexes[i *6+3]=(i *4+0);
			indexes[i *6+4]=(i *4+2);
			indexes[i *6+5]=(i *4+3);
		}
		_indexBuffer2D.clear();
		_indexBuffer2D.append(indexes);
		_indexBuffer2D.upload();
	}

	*/
	__proto.addNewParticlesToVertexBuffer=function(){
		var _vertexBuffer2D=this._mesh._vb;
		_vertexBuffer2D.clear();
		_vertexBuffer2D.append(this._vertices);
		var start=0;
		if (this._firstNewElement < this._firstFreeElement){
			start=this._firstNewElement *4 *this._floatCountPerVertex *4;
			_vertexBuffer2D.subUpload(start,start,start+(this._firstFreeElement-this._firstNewElement)*4 *this._floatCountPerVertex *4);
			}else {
			start=this._firstNewElement *4 *this._floatCountPerVertex *4;
			_vertexBuffer2D.subUpload(start,start,start+(this.settings.maxPartices-this._firstNewElement)*4 *this._floatCountPerVertex *4);
			if (this._firstFreeElement > 0){
				_vertexBuffer2D.setNeedUpload();
				_vertexBuffer2D.subUpload(0,0,this._firstFreeElement *4 *this._floatCountPerVertex *4);
			}
		}
		this._firstNewElement=this._firstFreeElement;
	}

	__proto.renderSubmit=function(){
		if (this.texture&&this.texture.getIsReady()){
			this.update(Laya.timer._delta);
			this.sv.u_CurrentTime=this._currentTime;
			if (this._firstNewElement !=this._firstFreeElement){
				this.addNewParticlesToVertexBuffer();
			}
			this.blend();
			if (this._firstActiveElement !=this._firstFreeElement){
				var gl=WebGL.mainContext;
				this._mesh.useMesh(gl);
				this.sv.u_texture=this.texture._getSource();
				this.sv.upload();
				if (this._firstActiveElement < this._firstFreeElement){
					WebGL.mainContext.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,(this._firstFreeElement-this._firstActiveElement)*6,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._firstActiveElement *6 *2);
				}
				else{
					WebGL.mainContext.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,(this.settings.maxPartices-this._firstActiveElement)*6,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._firstActiveElement *6 *2);
					if (this._firstFreeElement > 0)
						WebGL.mainContext.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,this._firstFreeElement *6,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,0);
				}
				Stat.renderBatches++;
			}
			this._drawCounter++;
		}
		return 1;
	}

	__proto.updateParticleForNative=function(){
		if (this.texture&&this.texture.getIsReady()){
			this.update(Laya.timer._delta);
			this.sv.u_CurrentTime=this._currentTime;
			if (this._firstNewElement !=this._firstFreeElement){
				this._firstNewElement=this._firstFreeElement;
			}
		}
	}

	__proto.getMesh=function(){
		return this._mesh;
	}

	__proto.getConchMesh=function(){
		return this._conchMesh;
	}

	__proto.getFirstNewElement=function(){
		return this._firstNewElement;
	}

	__proto.getFirstFreeElement=function(){
		return this._firstFreeElement;
	}

	__proto.getFirstActiveElement=function(){
		return this._firstActiveElement;
	}

	__proto.getFirstRetiredElement=function(){
		return this._firstRetiredElement;
	}

	__proto.setFirstFreeElement=function(_value){
		this._firstFreeElement=_value;
	}

	__proto.setFirstNewElement=function(_value){
		this._firstNewElement=_value;
	}

	__proto.addDrawCounter=function(){
		this._drawCounter++;
	}

	__proto.blend=function(){
		if (BlendMode.activeBlendFunction!==this._blendFn){
			var gl=WebGL.mainContext;
			gl.enable(/*laya.webgl.WebGLContext.BLEND*/0x0BE2);
			this._blendFn(gl);
			BlendMode.activeBlendFunction=this._blendFn;
		}
	}

	__proto.dispose=function(){
		this._mesh.releaseMesh();
	}

	ParticleTemplate2D.activeBlendType=-1;
	return ParticleTemplate2D;
})(ParticleTemplateWebGL)


/**
*<code>Particle2D</code> 类是2D粒子播放类
*
*/
//class laya.particle.Particle2D extends laya.display.Sprite
var Particle2D=(function(_super){
	function Particle2D(setting){
		/**@private */
		this._particleTemplate=null;
		/**@private */
		this._emitter=null;
		/**是否自动播放*/
		this.autoPlay=true;
		this.tempCmd=null;
		Particle2D.__super.call(this);
		this._matrix4=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
		this.customRenderEnable=true;
		if (setting)this.setParticleSetting(setting);
	}

	__class(Particle2D,'laya.particle.Particle2D',_super);
	var __proto=Particle2D.prototype;
	/**
	*加载粒子文件
	*@param url 粒子文件地址
	*/
	__proto.load=function(url){
		Laya.loader.load(url,Handler.create(this,this.setParticleSetting),null,/*laya.net.Loader.JSON*/"json");
	}

	/**
	*设置粒子配置数据
	*@param settings 粒子配置数据
	*/
	__proto.setParticleSetting=function(setting){
		if (!setting)return this.stop();
		ParticleSetting.checkSetting(setting);
		this.customRenderEnable=true;
		this._particleTemplate=new ParticleTemplate2D(setting);
		this.graphics._saveToCmd(null,DrawParticleCmd.create(this._particleTemplate));
		if (!this._emitter){
			this._emitter=new Emitter2D(this._particleTemplate);
			}else {
			(this._emitter).template=this._particleTemplate;
		}
		if (this.autoPlay){
			this.emitter.start();
			this.play();
		}
	}

	/**
	*播放
	*/
	__proto.play=function(){
		Laya.timer.frameLoop(1,this,this._loop);
	}

	/**
	*停止
	*/
	__proto.stop=function(){
		Laya.timer.clear(this,this._loop);
	}

	/**@private */
	__proto._loop=function(){
		this.advanceTime(1 / 60);
	}

	/**
	*时钟前进
	*@param passedTime 时钟前进时间
	*/
	__proto.advanceTime=function(passedTime){
		(passedTime===void 0)&& (passedTime=1);
		if (this._emitter){
			this._emitter.advanceTime(passedTime);
		}
	}

	__proto.customRender=function(context,x,y){
		this._matrix4[0]=context._curMat.a;
		this._matrix4[1]=context._curMat.b;
		this._matrix4[4]=context._curMat.c;
		this._matrix4[5]=context._curMat.d;
		this._matrix4[12]=context._curMat.tx;
		this._matrix4[13]=context._curMat.ty;
		var sv=(this._particleTemplate).sv;
		sv.u_mmat=this._matrix4;
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		if ((this._particleTemplate instanceof laya.particle.ParticleTemplate2D ))
			(this._particleTemplate).dispose();
		_super.prototype.destroy.call(this,destroyChild);
	}

	/**
	*设置 粒子文件地址
	*@param path 粒子文件地址
	*/
	__getset(0,__proto,'url',null,function(url){
		this.load(url);
	});

	/**
	*获取粒子发射器
	*/
	__getset(0,__proto,'emitter',function(){
		return this._emitter;
	});

	return Particle2D;
})(Sprite)


/**
*@private
*/
//class laya.particle.shader.ParticleShader extends laya.webgl.shader.Shader
var ParticleShader=(function(_super){
	//TODO:coverage
	function ParticleShader(){
		ParticleShader.__super.call(this,ParticleShader.vs,ParticleShader.ps,"ParticleShader",null,['a_CornerTextureCoordinate',0,'a_Position',1,'a_Velocity',2,'a_StartColor',3,
		'a_EndColor',4,'a_SizeRotation',5,'a_Radius',6,'a_Radian',7,'a_AgeAddScale',8,'a_Time',9]);
	}

	__class(ParticleShader,'laya.particle.shader.ParticleShader',_super);
	__static(ParticleShader,
	['vs',function(){return this.vs="attribute vec4 a_CornerTextureCoordinate;\nattribute vec3 a_Position;\nattribute vec3 a_Velocity;\nattribute vec4 a_StartColor;\nattribute vec4 a_EndColor;\nattribute vec3 a_SizeRotation;\nattribute vec2 a_Radius;\nattribute vec4 a_Radian;\nattribute float a_AgeAddScale;\nattribute float a_Time;\n\nvarying vec4 v_Color;\nvarying vec2 v_TextureCoordinate;\n\nuniform float u_CurrentTime;\nuniform float u_Duration;\nuniform float u_EndVelocity;\nuniform vec3 u_Gravity;\n\nuniform vec2 size;\nuniform mat4 u_mmat;\n\nvec4 ComputeParticlePosition(in vec3 position, in vec3 velocity,in float age,in float normalizedAge)\n{\n\n   float startVelocity = length(velocity);//起始标量速度\n   float endVelocity = startVelocity * u_EndVelocity;//结束标量速度\n\n   float velocityIntegral = startVelocity * normalizedAge +(endVelocity - startVelocity) * normalizedAge *normalizedAge/2.0;//计算当前速度的标量（单位空间），vt=v0*t+(1/2)*a*(t^2)\n   \n   vec3 addPosition = normalize(velocity) * velocityIntegral * u_Duration;//计算受自身速度影响的位置，转换标量到矢量    \n   addPosition += u_Gravity * age * normalizedAge;//计算受重力影响的位置\n   \n   float radius=mix(a_Radius.x, a_Radius.y, normalizedAge); //计算粒子受半径和角度影响（无需计算角度和半径时，可用宏定义优化屏蔽此计算）\n   float radianHorizontal =mix(a_Radian.x,a_Radian.z,normalizedAge);\n   float radianVertical =mix(a_Radian.y,a_Radian.w,normalizedAge);\n   \n   float r =cos(radianVertical)* radius;\n   addPosition.y += sin(radianVertical) * radius;\n	\n   addPosition.x += cos(radianHorizontal) *r;\n   addPosition.z += sin(radianHorizontal) *r;\n  \n   addPosition.y=-addPosition.y;//2D粒子位置更新需要取负，2D粒子坐标系Y轴正向朝上\n   position+=addPosition;\n   return  vec4(position,1.0);\n}\n\nfloat ComputeParticleSize(in float startSize,in float endSize, in float normalizedAge)\n{    \n    float size = mix(startSize, endSize, normalizedAge);\n    return size;\n}\n\nmat2 ComputeParticleRotation(in float rot,in float age)\n{    \n    float rotation =rot * age;\n    //计算2x2旋转矩阵.\n    float c = cos(rotation);\n    float s = sin(rotation);\n    return mat2(c, -s, s, c);\n}\n\nvec4 ComputeParticleColor(in vec4 startColor,in vec4 endColor,in float normalizedAge)\n{\n	vec4 color=mix(startColor,endColor,normalizedAge);\n    //硬编码设置，使粒子淡入很快，淡出很慢,6.7的缩放因子把置归一在0到1之间，可以谷歌x*(1-x)*(1-x)*6.7的制图表\n    color.a *= normalizedAge * (1.0-normalizedAge) * (1.0-normalizedAge) * 6.7;\n   \n    return color;\n}\n\nvoid main()\n{\n   float age = u_CurrentTime - a_Time;\n   age *= 1.0 + a_AgeAddScale;\n   float normalizedAge = clamp(age / u_Duration,0.0,1.0);\n   gl_Position = ComputeParticlePosition(a_Position, a_Velocity, age, normalizedAge);//计算粒子位置\n   float pSize = ComputeParticleSize(a_SizeRotation.x,a_SizeRotation.y, normalizedAge);\n   mat2 rotation = ComputeParticleRotation(a_SizeRotation.z, age);\n	\n    mat4 mat=u_mmat;\n    gl_Position=vec4((mat*gl_Position).xy,0.0,1.0);\n    gl_Position.xy += (rotation*a_CornerTextureCoordinate.xy) * pSize*vec2(mat[0][0],mat[1][1]);\n    gl_Position=vec4((gl_Position.x/size.x-0.5)*2.0,(0.5-gl_Position.y/size.y)*2.0,0.0,1.0);\n   \n   v_Color = ComputeParticleColor(a_StartColor,a_EndColor, normalizedAge);\n   v_TextureCoordinate =a_CornerTextureCoordinate.zw;\n}\n\n";},'ps',function(){return this.ps="#ifdef FSHIGHPRECISION\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\nvarying vec4 v_Color;\nvarying vec2 v_TextureCoordinate;\nuniform sampler2D u_texture;\n\nvoid main()\n{	\n	gl_FragColor=texture2D(u_texture,v_TextureCoordinate)*v_Color;\n	gl_FragColor.xyz *= v_Color.w;\n}";}
	]);
	return ParticleShader;
})(Shader)



})(window,document,Laya);
