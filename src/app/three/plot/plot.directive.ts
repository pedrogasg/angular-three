import { Directive } from '@angular/core';
import * as THREE from 'three';
@Directive({
  selector: 'neo-plot'
})
export class PlotDirective {
  test(){
    ////////////////////////////////////////////////////////////////////////////////
// Robot hand exercise: add a second grabber and have it respond
////////////////////////////////////////////////////////////////////////////////
    /*global THREE, Coordinates, $, document, window, dat*/

    var camera, scene, renderer;
    var cameraControls, effectController;
    var clock = new THREE.Clock();
    var gridX = true;
    var gridY = false;
    var gridZ = false;
    var axes = true;
    var ground = true;
    var arm, forearm, body, handLeft, handRight;

    function fillScene() {
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

      // LIGHTS
      var ambientLight = new THREE.AmbientLight( 0x222222 );
      var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
      light.position.set( 200, 400, 500 );
      var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
      light2.position.set( -500, 250, -200 );
      scene.add(ambientLight);
      scene.add(light);
      scene.add(light2);

      // Robot definitions
      var robotHandLeftMaterial = new THREE.MeshPhongMaterial( { color: 0xCC3399, specular: 0xCC3399, shininess: 20 } );
      var robotHandRightMaterial = new THREE.MeshPhongMaterial( { color: 0xDD3388, specular: 0xDD3388, shininess: 20 } );
      var robotBaseMaterial = new THREE.MeshPhongMaterial( { color: 0x6E23BB, specular: 0x6E23BB, shininess: 20 } );
      var robotForearmMaterial = new THREE.MeshPhongMaterial( { color: 0xF4C154, specular: 0xF4C154, shininess: 100 } );
      var robotUpperArmMaterial = new THREE.MeshPhongMaterial( { color: 0x95E4FB, specular: 0x95E4FB, shininess: 100 } );

      var torus = new THREE.Mesh(
        new THREE.TorusGeometry( 22, 15, 32, 32 ), robotBaseMaterial );
      torus.rotation.x = 90 * Math.PI/180;
      scene.add( torus );

      forearm = new THREE.Object3D();
      var faLength = 80;

      createRobotExtender( forearm, faLength, robotForearmMaterial );

      arm = new THREE.Object3D();
      var uaLength = 120;

      createRobotCrane( arm, uaLength, robotUpperArmMaterial );

      // Move the forearm itself to the end of the upper arm.
      forearm.position.y = uaLength;
      arm.add( forearm );

      scene.add( arm );

      var handLength = 38;

      handLeft = new THREE.Object3D();
      createRobotGrabber( handLeft, handLength, robotHandLeftMaterial );
      // Move the hand part to the end of the forearm.
      handLeft.position.y = faLength;
      forearm.add( handLeft );
      handRight = new THREE.Object3D();
      createRobotGrabber( handRight, handLength, robotHandRightMaterial );
      // Move the hand part to the end of the forearm.
      handRight.position.y = faLength;
      forearm.add( handRight );
      // YOUR CODE HERE
      // Add the second grabber handRight. Note that it uses a different color, defined above
      // ALSO EDIT render() TO ENABLE CONTROLS FOR GRABBER
    }

    function createRobotGrabber( part, length, material )
    {
      var box = new THREE.Mesh(
        new THREE.CubeGeometry( 30, length, 4 ), material );
      box.position.y = length/2;
      part.add( box );
    }

    function createRobotExtender( part, length, material )
    {
      var cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry( 22, 22, 6, 32 ), material );
      part.add( cylinder );

      var i;
      for ( i = 0; i < 4; i++ )
      {
        var box = new THREE.Mesh(
          new THREE.CubeGeometry( 4, length, 4 ), material );
        box.position.x = (i < 2) ? -8 : 8;
        box.position.y = length/2;
        box.position.z = (i%2) ? -8 : 8;
        part.add( box );
      }

      cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry( 15, 15, 40, 32 ), material );
      cylinder.rotation.x = 90 * Math.PI/180;
      cylinder.position.y = length;
      part.add( cylinder );
    }

    function createRobotCrane( part, length, material )
    {
      var box = new THREE.Mesh(
        new THREE.CubeGeometry( 18, length, 18 ), material );
      box.position.y = length/2;
      part.add( box );

      var sphere = new THREE.Mesh(
        new THREE.SphereGeometry( 20, 32, 16 ), material );
      // place sphere at end of arm
      sphere.position.y = length;
      part.add( sphere );
    }

    function init() {
      var canvasWidth = 846;
      var canvasHeight = 494;
      // For grading the window is fixed in size; here's general code:
      //var canvasWidth = window.innerWidth;
      //var canvasHeight = window.innerHeight;
      var canvasRatio = canvasWidth / canvasHeight;

      // RENDERER
      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.gammaInput = true;
      renderer.gammaOutput = true;
      renderer.setSize(canvasWidth, canvasHeight);
      renderer.setClearColorHex( 0xAAAAAA, 1.0 );

      // CAMERA
      camera = new THREE.PerspectiveCamera( 38, canvasRatio, 1, 10000 );
      // CONTROLS
      cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
      camera.position.set(-49, 242,54);
      cameraControls.target.set(54, 106, 33);
      fillScene();

    }

    function addToDOM() {
      var container = document.getElementById('container');
      var canvas = container.getElementsByTagName('canvas');
      if (canvas.length>0) {
        container.removeChild(canvas[0]);
      }
      container.appendChild( renderer.domElement );
    }

    function drawHelpers() {
      if (ground) {
        Coordinates.drawGround({size:10000});
      }
      if (gridX) {
        Coordinates.drawGrid({size:10000,scale:0.01});
      }
      if (gridY) {
        Coordinates.drawGrid({size:10000,scale:0.01, orientation:"y"});
      }
      if (gridZ) {
        Coordinates.drawGrid({size:10000,scale:0.01, orientation:"z"});
      }
      if (axes) {
        Coordinates.drawAllAxes({axisLength:200,axisRadius:1,axisTess:50});
      }
    }

    function animate() {
      window.requestAnimationFrame(animate);
      render();
    }

    function render() {
      var delta = clock.getDelta();
      cameraControls.update(delta);

      if ( effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes)
      {
        gridX = effectController.newGridX;
        gridY = effectController.newGridY;
        gridZ = effectController.newGridZ;
        ground = effectController.newGround;
        axes = effectController.newAxes;

        fillScene();
        drawHelpers();
      }

      arm.rotation.y = effectController.uy * Math.PI/180;	// yaw
      arm.rotation.z = effectController.uz * Math.PI/180;	// roll

      forearm.rotation.y = effectController.fy * Math.PI/180;	// yaw
      forearm.rotation.z = effectController.fz * Math.PI/180;	// roll

      // ADD handRight yaw AND translate HERE
      handLeft.rotation.z = effectController.hz * Math.PI/180;	// yaw
      handLeft.position.z = effectController.htz;	// translate

      // solution
      handRight.rotation.z = effectController.hz * Math.PI/180;    // yaw
      // negate to go the other direction
      handRight.position.z = -effectController.htz;    // translate

      renderer.render(scene, camera);
    }

    function setupGui() {

      effectController = {

        newGridX: gridX,
        newGridY: gridY,
        newGridZ: gridZ,
        newGround: ground,
        newAxes: axes,

        uy: 70.0,
        uz: -15.0,

        fy: 10.0,
        fz: 60.0,

        hz: 30.0,
        htz: 12.0
      };

      var gui = new dat.GUI();
      var h = gui.addFolder("Grid display");
      h.add( effectController, "newGridX").name("Show XZ grid");
      h.add( effectController, "newGridY" ).name("Show YZ grid");
      h.add( effectController, "newGridZ" ).name("Show XY grid");
      h.add( effectController, "newGround" ).name("Show ground");
      h.add( effectController, "newAxes" ).name("Show axes");
      h = gui.addFolder("Arm angles");
      h.add(effectController, "uy", -180.0, 180.0, 0.025).name("Upper arm y");
      h.add(effectController, "uz", -45.0, 45.0, 0.025).name("Upper arm z");
      h.add(effectController, "fy", -180.0, 180.0, 0.025).name("Forearm y");
      h.add(effectController, "fz", -120.0, 120.0, 0.025).name("Forearm z");
      h.add(effectController, "hz", -45.0, 45.0, 0.025).name("Hand z");
      h.add(effectController, "htz", 2.0, 17.0, 0.025).name("Hand spread");
    }

    try {
      init();
      fillScene();
      drawHelpers();
      addToDOM();
      setupGui();
      animate();
    } catch(e) {

    }

  }
  constructor() {
    var scene = new THREE.Scene();
    var Coordinates = {
      drawGrid:function(params) {
        params = params || {};
        var size = params.size !== undefined ? params.size:100;
        var scale = params.scale !== undefined ? params.scale:0.1;
        var orientation = params.orientation !== undefined ? params.orientation:"x";
        var grid = new THREE.Mesh(
          new THREE.PlaneGeometry(size, size, size * scale, size * scale),
          new THREE.MeshBasicMaterial({ color: 0x555555, wireframe: true })
        );
        // Yes, these are poorly labeled! It would be a mess to fix.
        // What's really going on here:
        // "x" means "rotate 90 degrees around x", etc.
        // So "x" really means "show a grid with a normal of Y"
        //    "y" means "show a grid with a normal of X"
        //    "z" means (logically enough) "show a grid with a normal of Z"
        if (orientation === "x") {
          grid.rotation.x = - Math.PI / 2;
        } else if (orientation === "y") {
          grid.rotation.y = - Math.PI / 2;
        } else if (orientation === "z") {
          grid.rotation.z = - Math.PI / 2;
        }

        scene.add(grid);
      },
      drawGround:function(params) {
        params = params || {};
        var size = params.size !== undefined ? params.size:100;
        var color = params.color !== undefined ? params.color:0xFFFFFF;
        var ground = new THREE.Mesh(
          new THREE.PlaneGeometry(size, size),
          // When we use a ground plane we use directional lights, so illuminating
          // just the corners is sufficient.
          // Use MeshPhongMaterial if you want to capture per-pixel lighting:
          // new THREE.MeshPhongMaterial({ color: color, specular: 0x000000,
          new THREE.MeshLambertMaterial({ color: color,
            // polygonOffset moves the plane back from the eye a bit, so that the lines on top of
            // the grid do not have z-fighting with the grid:
            // Factor == 1 moves it back relative to the slope (more on-edge means move back farther)
            // Units == 4 is a fixed amount to move back, and 4 is usually a good value
            polygonOffset: true, polygonOffsetFactor: 1.0, polygonOffsetUnits: 4.0
          }));
        ground.rotation.x = - Math.PI / 2;
        scene.add(ground);
      },
      drawAxes:function(params) {
        // x = red, y = green, z = blue  (RGB = xyz)
        params = params || {};
        var axisRadius = params.axisRadius !== undefined ? params.axisRadius:0.04;
        var axisLength = params.axisLength !== undefined ? params.axisLength:11;
        var axisTess = params.axisTess !== undefined ? params.axisTess:48;
        var axisOrientation = params.axisOrientation !== undefined ? params.axisOrientation:"x";

        var axisMaterial = new THREE.MeshLambertMaterial({ color: 0x000000, side: THREE.DoubleSide });
        var axis = new THREE.Mesh(
          new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
          axisMaterial
        );
        if (axisOrientation === "x") {
          axis.rotation.z = - Math.PI / 2;
          axis.position.x = axisLength/2-1;
        } else if (axisOrientation === "y") {
          axis.position.y = axisLength/2-1;
        }

        scene.add( axis );

        var arrow = new THREE.Mesh(
          new THREE.CylinderGeometry(0, 4*axisRadius, 8*axisRadius, axisTess, 1, true),
          axisMaterial
        );
        if (axisOrientation === "x") {
          arrow.rotation.z = - Math.PI / 2;
          arrow.position.x = axisLength - 1 + axisRadius*4/2;
        } else if (axisOrientation === "y") {
          arrow.position.y = axisLength - 1 + axisRadius*4/2;
        }

        scene.add( arrow );

      },
      drawAllAxes:function(params) {
        params = params || {};
        var axisRadius = params.axisRadius !== undefined ? params.axisRadius:0.04;
        var axisLength = params.axisLength !== undefined ? params.axisLength:11;
        var axisTess = params.axisTess !== undefined ? params.axisTess:48;

        var axisXMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
        var axisYMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
        var axisZMaterial = new THREE.MeshLambertMaterial({ color: 0x0000FF });
        axisXMaterial.side = THREE.DoubleSide;
        axisYMaterial.side = THREE.DoubleSide;
        axisZMaterial.side = THREE.DoubleSide;
        var axisX = new THREE.Mesh(
          new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
          axisXMaterial
        );
        var axisY = new THREE.Mesh(
          new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
          axisYMaterial
        );
        var axisZ = new THREE.Mesh(
          new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
          axisZMaterial
        );
        axisX.rotation.z = - Math.PI / 2;
        axisX.position.x = axisLength/2-1;

        axisY.position.y = axisLength/2-1;

        axisZ.rotation.y = - Math.PI / 2;
        axisZ.rotation.z = - Math.PI / 2;
        axisZ.position.z = axisLength/2-1;

        scene.add( axisX );
        scene.add( axisY );
        scene.add( axisZ );

        var arrowX = new THREE.Mesh(
          new THREE.CylinderGeometry(0, 4*axisRadius, 4*axisRadius, axisTess, 1, true),
          axisXMaterial
        );
        var arrowY = new THREE.Mesh(
          new THREE.CylinderGeometry(0, 4*axisRadius, 4*axisRadius, axisTess, 1, true),
          axisYMaterial
        );
        var arrowZ = new THREE.Mesh(
          new THREE.CylinderGeometry(0, 4*axisRadius, 4*axisRadius, axisTess, 1, true),
          axisZMaterial
        );
        arrowX.rotation.z = - Math.PI / 2;
        arrowX.position.x = axisLength - 1 + axisRadius*4/2;

        arrowY.position.y = axisLength - 1 + axisRadius*4/2;

        arrowZ.rotation.z = - Math.PI / 2;
        arrowZ.rotation.y = - Math.PI / 2;
        arrowZ.position.z = axisLength - 1 + axisRadius*4/2;

        scene.add( arrowX );
        scene.add( arrowY );
        scene.add( arrowZ );

      }

    };


  }


}
