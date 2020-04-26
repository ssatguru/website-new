/*global THREE */
/*global Leap */
/*jslint browser: true, devel: true */

var action = "move";
var mode = "object";

var DrawnPart = {
    mesh: null,
    frameId: ""
};

function setItems(scene) {
    //-------------------------- items 

    //materials
    var material = new THREE.MeshLambertMaterial({
        color: 0xEE0000,
        wireframe: false
    });

    material.opacity = 0.9;
    material.transparent = true;

    //item
    var item = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), material);
    scene.add(item);

    //room
    var roomMaterial = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        wireframe: true
    });

    var wall = new THREE.Mesh(new THREE.PlaneGeometry(600, 300, 10, 10), roomMaterial);
    wall.position = new THREE.Vector3(0, 150, -300);
    scene.add(wall);
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(600, 600, 10, 10), roomMaterial);
    floor.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    scene.add(floor);

    return item;
}

function setLight(scene) {
    //-------------------------- light

    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.x = 0;
    pointLight.position.y = 500;
    pointLight.position.z = 500;
    scene.add(pointLight);
}

function addText(camera) {

    var string = "Mode ( o / f ) [ " + mode + " ] - Action ( m / r / z ) [ " + action + " ]";

    if (camera.txt) {
        camera.remove(camera.txt);
    }
    
    var text3d = new THREE.TextGeometry(string, {
        size: 12,
        height: 1,
        curveSegments: 4,
        font: "helvetiker",
        bevelThickness: 1,
        bevelSize: 0.1,
        bevelSegments: 1,
        bevelEnabled: true
    });


    var textMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        overdraw: true
    });
    textMaterial.opacity = 0.5;
    textMaterial.transparent = true;
    var text = new THREE.Mesh(text3d, textMaterial);

    text3d.computeBoundingBox();
    var centerOffset = -0.5 * (text3d.boundingBox.max.x - text3d.boundingBox.min.x);
    text.position.x = centerOffset;
    text.position.y = 150;
    text.position.z = -500;
    text.rotateOnAxis(new THREE.Vector3(1, 0, 0),Math.atan(150 / 500));
    camera.add(text);
    camera.txt = text;
}

function setCamera(scene, WIDTH, HEIGHT) {
    //-------------------------- camera
    var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

    var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.z = 1000;
    camera.position.y = 300;
    camera.position.x = 0;
    //camera.lookAt(new THREE.Vector3(0, 0, 0));

    addText(camera, "Hello Leapers");
    scene.add(camera);
    return camera;
}



function render(scene, camera, WIDTH, HEIGHT) {

    //-------------------------- action
    //create renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);

    //insert renderer into the browser
    var container = window.document.getElementById('LeapContainer');
    var rendererElement = renderer.domElement;
    container.appendChild(rendererElement);

    //render
    renderer.render(scene, camera);
    return renderer;
}


//--------------------------- event handlers
function onWindowResize(e, camera, renderer) {
   //camera.aspect = window.innerWidth / window.innerHeight;
    //camera.updateProjectionMatrix();
    //renderer.setSize(window.innerWidth, window.innerHeight);
}

function handleKeyPress(e, camera) {
    switch (e.keyCode) {
        case 70:
        case 102:
            //f key - frame
            mode = "frame";
            addText(camera);
            break;
        case 79:
        case 111:
            //o key - object
            mode = "object";
            addText(camera);
            break;
        case 77:
        case 109:
            //m key - move
            action = "move";
            addText(camera);
            break;
        case 90:
        case 122:
            //z key
            if (action === "zoomIn") {
                action = "zoomOut";
            } else {
                action = "zoomIn";
            }
            addText(camera);
            break;
        case 82:
        case 114:
            //r key
            action = "rotate";
            addText(camera);
            break;
        default:
            action = "?";
            addText(camera);

    }
}

function setEventHandlers(camera, renderer) {
    window.document.addEventListener("keypress", function(e) {
        handleKeyPress(e, camera);
    }, false);

    window.addEventListener('resize', function(e) {
        onWindowResize(e, camera, renderer);
    }, false);
}


function drawParts(scene, frame, partName, handMaterial, drawnParts) {
    var drawnPart;
    var frameItems;

    if (partName === "palm") {
        frameItems = frame.hands;
    } else {
        frameItems = frame.fingers;
    }


    for (var index = 0; index < frameItems.length; index++) {

        var part = frameItems[index];
        drawnPart = drawnParts[part.id];

        //draw part if not already drawn
        if (!drawnPart) {
            var partGeometry, partMesh, childAxis;
            if (partName === "palm") {
                // cube for hand (palm along z-axis)
                partGeometry = new THREE.CubeGeometry(35, 20, 35);
                //move median point to the face  
                partGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -10, 0));
                partMesh = new THREE.Mesh(partGeometry, handMaterial);
                //axis for debugging
                childAxis = new THREE.AxisHelper(50);
            } else {
                //long cube for finger (long along z-axis)
                partGeometry = new THREE.CubeGeometry(10, 10, 50);
                //move median point to the front - finger tip
                partGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -25));
                partMesh = new THREE.Mesh(partGeometry, handMaterial);
                //axis for debugging
                childAxis = new THREE.AxisHelper(10);
            }

            partMesh.add(childAxis);
            scene.add(partMesh);

            drawnPart = Object.create(DrawnPart);
            drawnPart.mesh = partMesh;
            drawnPart.frameId = frame.id;
            drawnParts[part.id] = drawnPart;
        }

        drawnPart.frameId = frame.id;

        var v1, v2, v3;
        if (partName === "palm") {
            v1 = part.palmPosition;
            v2 = part.direction;
            v3 = part.palmNormal;
            var up = new THREE.Vector3(v3[0], v3[1], v3[2]);
            drawnPart.mesh.up = up;
        } else {
            v1 = part.tipPosition;
            v2 = part.direction;
        }

        var origin = new THREE.Vector3(v1[0], v1[1], v1[2]);
        drawnPart.mesh.position = origin;

        var direction = new THREE.Vector3(v2[0], v2[1], v2[2]);
        var lookAtPoint = direction.add(origin);
        drawnPart.mesh.lookAt(lookAtPoint);
    }

}

function getHandMaterial() {
    var handMaterial = new THREE.MeshLambertMaterial({
        color: 0xa96836,
        wireframe: false
    });

    handMaterial.opacity = 0.5;
    handMaterial.transparent = true;
    return handMaterial;
}

function leapIt(scene, camera, renderer, item) {

    //list of hand parts drawn in scene
    var drawnParts = {};

    var s = 0;
    var prevRad = 0,
        fprevRad = 0;


    var previousFrame;

    var handMaterial = getHandMaterial();

    Leap.loop(function(frame) {

        if (!previousFrame) {
            previousFrame = frame;
        }

        //get palm curve and scale item accordingly
        if (frame.hands.length > 0) {
            var hand, trans;

            if (mode === "object") {
                if ((action === "zoomIn" || action === "zoomOut") && frame.fingers.length > 3) {
                    hand = frame.hands[0];
                    var radius = hand.sphereRadius.toFixed(1);
                    if (prevRad === 0) {
                        prevRad = radius;
                    }
                    s = item.scale.x;
                    if (action === "zoomIn") {
                        if ((radius - prevRad) > 0.5) {
                            s = s + 0.01;
                        }

                    } else if (action === "zoomOut") {
                        if ((prevRad - radius) > 0.5) {
                            s = s - 0.01;
                            if (s < 0.01) s = 0.01;
                        }
                    }
                    prevRad = radius;

                    item.scale.x = s;
                    item.scale.y = s;
                    item.scale.z = s;

                }

                if (action === "rotate" && frame.fingers.length < 2) {
                    hand = frame.hands[0];
                    var trans = frame.translation(previousFrame);
                    var pp = hand.palmPosition;
                    var rot = -Math.atan(trans[0] / pp[1]);
                    item.rotateOnAxis(new THREE.Vector3(0, 0, 1), rot);
                }
                if (action === "move" && frame.fingers.length < 2) {
                    hand = frame.hands[0];
                    var trans = frame.translation(previousFrame);
                    var mat = new THREE.Matrix4(1, 0, 0, trans[0], 0, 1, 0, trans[1], 0, 0, 1, trans[2], 0, 0, 0, 1);
                    item.applyMatrix(mat);
                }
            }

            if (mode === "frame") {
                if (action === "move" && frame.fingers.length < 2) {
                    hand = frame.hands[0];
                    trans = frame.translation(previousFrame);
                    camera.position.z = camera.position.z - trans[2];
                    camera.position.y = camera.position.y - trans[1];
                    camera.position.x = camera.position.x - trans[0];
                }
                if (action === "rotate" && frame.fingers.length < 2) {
                    hand = frame.hands[0];
                    var trans = frame.translation(previousFrame);
                    var pp = hand.palmPosition;
                    var rot = -Math.atan(trans[0] / pp[1]);
                    camera.rotateOnAxis(new THREE.Vector3(0, 0, 1), -rot);
                }
                if ((action === "zoomIn" || action === "zoomOut") && frame.fingers.length > 3) {
                    hand = frame.hands[0];
                    var radius = hand.sphereRadius.toFixed(1);
                    if (fprevRad === 0) {
                        fprevRad = radius;
                    }
                    s = 0;
                    if (action === "zoomIn") {
                        if ((radius - fprevRad) > 0.5) {
                            s = -2;
                        }

                    } else if (action === "zoomOut") {
                        if ((fprevRad - radius) > 0.5) {
                            s = 2;
                        }
                    }
                    fprevRad = radius;

                    camera.position.z = camera.position.z + s;
                    camera.position.y = camera.position.y + s;
                    //camera.position.x = camera.position.x + s;

                }
            }

        }

        //draw fingers
        drawParts(scene, frame, "finger", handMaterial, drawnParts);

        //draw palm
        drawParts(scene, frame, "palm", handMaterial, drawnParts);

        //remove any part from scene which weren't sensed in this frame
        for (var id in drawnParts) {
            var drawnPart = drawnParts[id];
            if (drawnPart.frameId !== frame.id) {
                scene.remove(drawnPart.mesh);
                delete drawnParts[id];
            }
        }

        renderer.render(scene, camera);
        previousFrame = frame;
    });
}

function main() {
	/*
		var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
	*/
	  
	  var parent = window.document.getElementById('LeapContainer');
	  var WIDTH = parent.clientWidth;
	  var HEIGHT = WIDTH*0.75;

	  /*
    var WIDTH = 800,
        HEIGHT = 600;
		*/

    var scene = new THREE.Scene();

    var item = setItems(scene);

    setLight(scene);

    var camera = setCamera(scene, WIDTH, HEIGHT);

    var renderer = render(scene, camera, WIDTH, HEIGHT);

    setEventHandlers(camera, renderer);

    leapIt(scene, camera, renderer, item);
}


main();