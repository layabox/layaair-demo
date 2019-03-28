class PhysicsWorldRayShapeCast{
    constructor(){
        //初始化变量
        this.castType = 0;
        this.castAll = false;
        this.ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
        this.hitResult = new Laya.HitResult();
        this.hitResults = new Array();
        this.debugSprites = new Array();

        this.tmpVector = new Laya.Vector3(0,0,0);
        this.tmpVector2 = new Laya.Vector3(0,0,0);
        this.albedoColor =new Laya.Vector4(1.0, 0.0, 0.0, 1.0);
        this.from = new Laya.Vector3(0, 1, 10);
        this.to = new Laya.Vector3(0, 1, -5);
        //初始化引擎
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        var camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        camera.transform.translate(new Laya.Vector3(0, 8, 20));
        camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        var mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
        directionLight.transform.worldMatrix = mat;
        var plane = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createPlane(20, 20, 10, 10)));
        var planeMat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
            planeMat.albedoTexture = tex;
        }));
        plane.meshRenderer.material = planeMat;
        var rigidBody = plane.addComponent(Laya.PhysicsCollider);
        var boxCollider = new Laya.BoxColliderShape(20, 0, 20);
        rigidBody.colliderShape = boxCollider;
        for (var i = 0; i < 60; i++) {
            this.addBox();
            this.addCapsule();
        }

        this.addButton(200, 200, 160, 40, "射线模式", this.rayPattern);
        this.addButton(200, 300, 160, 40, "不穿透", this.penetratePattern);
        this.addButton(200, 400, 160, 40, "检测", this.detection);

    }

    addButton(x, y, width, height, text, clikFun) {
        Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
            var changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", text));
            changeActionButton.size(width, height);
            changeActionButton.labelBold = true;
            changeActionButton.labelSize = 30;
            changeActionButton.sizeGrid = "4,4,4,4";
            changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            changeActionButton.pos(x, y);
            changeActionButton.on(Laya.Event.CLICK, this, clikFun);
        }));
    }

    addBox() {
        var mat1 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(null, function (tex) {
            mat1.albedoTexture = tex;
        }));
        var sX = Math.random() * 0.75 + 0.25;
        var sY = Math.random() * 0.75 + 0.25;
        var sZ = Math.random() * 0.75 + 0.25;
        var box = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
        box.meshRenderer.material = mat1;
        var transform = box.transform;
        var pos = transform.position;
        pos.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        transform.position = pos;
        var rotationEuler = transform.rotationEuler;
        rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        box.transform.rotationEuler = rotationEuler;

        var rigidBody = box.addComponent(Laya.Rigidbody3D);
        var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
    }

    addCapsule() {
        var mat3 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
            mat3.albedoTexture = tex;
        }));
        var raidius = Math.random() * 0.2 + 0.2;
        var height = Math.random() * 0.5 + 0.8;
        var capsule = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createCapsule(raidius, height)));
        capsule.meshRenderer.material = mat3;

        var transform = capsule.transform;
        var pos = transform.position;
        pos.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        transform.position = pos;
        var rotationEuler = transform.rotationEuler;
        rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        box.transform.rotationEuler = rotationEuler;


        var rigidBody = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }
    //射线模式
    rayPattern(e){
        this.castType++;
        this.castType %= 4;
        switch (this.castType) {
            case 0:
                e.target.label = "射线模式";
                break;
            case 1:
                e.target.label = "盒子模式";
                break;
            case 2:
                e.target.label = "球模式";
                break;
            case 3:
                e.target.label = "胶囊模式";
                break;
        }
    }
    //穿透模式
    penetratePattern(e){
        if (this.castAll) {
            e.target.label = "不穿透";
            this.castAll = false;
        }else {
            e.target.label = "穿透";
            this.castAll = true;
        }
    }
    //检测
    detection(e){ 
            if (this.hitResult.succeeded)
                this.hitResult.collider.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
            if (this.hitResults.length > 0) {
                for (var i = 0, n = this.hitResults.length; i < n; i++)
                    this.hitResults[i].collider.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
                this.hitResults.length = 0;
            }
            if (this.debugSprites.length > 0) {
                for (i = 0, n = this.debugSprites.length; i < n; i++)
                    this.debugSprites[i].destroy();
                this.debugSprites.length = 0;
            }
            switch (this.castType) {
                case 0:
                    var lineSprite = this.scene.addChild(new Laya.PixelLineSprite3D(1));
					lineSprite.addLine(this.from, this.to, Laya.Color.RED, Laya.Color.RED);
                    this.debugSprites.push(lineSprite);
                    if (this.castAll) {
                        //射线发射方法
                        this.scene.physicsSimulation.raycastAllFromTo(this.from, this.to, this.hitResults);
                        for (i = 0, n = this.hitResults.length; i < n; i++)
                            this.hitResults[i].collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor;
                    }
                    else {
                        //射线发射方法
                        this.scene.physicsSimulation.raycastFromTo(this.from, this.to, this.hitResult);
                        this.hitResult.collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor;
                    }
                    break;
                case 1:
                    var boxCollider = new Laya.BoxColliderShape(1.0, 1.0, 1.0);
                    for (i = 0; i < 21; i++) {
                        var boxSprite = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createBox(1.0, 1.0, 1.0)));
                        var mat = new Laya.BlinnPhongMaterial();
                        mat.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 0.5);
                        mat.renderMode = Laya.BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
                        //mat.renderMode = 2;
                        boxSprite.meshRenderer.material = mat;
                        Laya.Vector3.lerp(this.from, this.to, i / 20, this.tmpVector2);
                        boxSprite.transform.localPosition = this.tmpVector2;
                        this.debugSprites.push(boxSprite);
                    }
                    if (this.castAll) {
                        this.scene.physicsSimulation.shapeCastAll(boxCollider, this.from, this.to, this.hitResults);
                        for (i = 0, n = this.hitResults.length; i < n; i++)
                            this.hitResults[i].collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor;
                    }
                    else {
                        if (this.scene.physicsSimulation.shapeCast(boxCollider, from, to, this.hitResult))
                            this.hitResult.collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor;
                    }
                    break;
                case 2:
                    var sphereCollider = new Laya.SphereColliderShape(0.5);
                    for (i = 0; i < 41; i++) {
                        var sphereSprite = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createSphere(0.5)));
                        var mat = new Laya.BlinnPhongMaterial();
                        mat.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 0.5);
                        mat.renderMode = 2;
                        sphereSprite.meshRenderer.material = mat;
                        Laya.Vector3.lerp(this.from, this.to, i / 40, this.tmpVector2);
                        sphereSprite.transform.localPosition = this.tmpVector2;
                        this.debugSprites.push(sphereSprite);
                    }
                    if (this.castAll) {
                        this.scene.physicsSimulation.shapeCastAll(sphereCollider, this.from, this.to, this.hitResults);
                        for (i = 0, n = this.hitResults.length; i < n; i++)
                            this.hitResults[i].collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor;
                    }
                    else {
                        if (this.scene.physicsSimulation.shapeCast(sphereCollider, this.from, this.to, this.hitResult))
                            this.hitResult.collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor;
                    }
                    break;
                case 3:
                    var capsuleCollider = new Laya.CapsuleColliderShape(0.25, 1.0);
                    for (i = 0; i < 41; i++) {
                        var capsuleSprite = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createCapsule(0.25, 1.0)));
                        var mat = new Laya.BlinnPhongMaterial();
                        mat.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 0.5);
                        mat.renderMode = 2;
                        capsuleSprite.meshRenderer.material = mat;
                        Laya.Vector3.lerp(this.from, this.to, i / 40, this.tmpVector2);
                        capsuleSprite.transform.localPosition = this.tmpVector2;
                        this.debugSprites.push(capsuleSprite);
                    }
                    if (this.castAll) {
                        this.scene.physicsSimulation.shapeCastAll(capsuleCollider, this.from, this.to, this.hitResults);
                        for (i = 0, n = this.hitResults.length; i < n; i++)
                            this.hitResults[i].collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor;
                    }
                    else {
                        if (this.scene.physicsSimulation.shapeCast(capsuleCollider, this.from, this.to, this.hitResult))
                            this.hitResult.collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor;
                    }
                    break;
            }
    }
}


//激活启动类
new PhysicsWorldRayShapeCast();
