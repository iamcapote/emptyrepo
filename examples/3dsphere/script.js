var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xdddddd );

var c = document.getElementById('c');
var renderer = new THREE.WebGLRenderer({canvas : c, alpha: false, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 100);

camera.position.z = 0;
camera.position.x = 0;
camera.position.y = 2;
camera.rotation.set(0,0,0);
scene.add(camera);

var gl = c.getContext("webgl");

function Shape(gen, x, y, z, r, dir) {
  this.gen = parseInt(gen);
  this.mesh;
  this.x = x;
  this.y = y;
  this.z = z;
  this.r = r;
  this.vertices = 30/this.gen;
  
  switch(dir){
    case "y0": 
      this.not = "y180";
      break;
    case "y90":
      this.not = "y270";
      break;
    case "y180":
      this.not = "y0";
      break;
    case "y270":
      this.not = "y90";
      break;
    case "z90":
      this.not = "z270";
      break;
    case "z270":
      this.not = "z90";
      break;
    default:
      this.not = 0;
  }
  
  this.geometry = new THREE.SphereGeometry(this.r, this.vertices, this.vertices, 0, Math.PI * 2, 0, Math.PI * 2);
  this.material = new THREE.MeshBasicMaterial({color: "#333333", transparent: false, opacity: .75, wireframe: true});

  if (this.gen <= 4) {

    this.childr = this.r/2.5;
    var x, y, z, d;

    var y_angles = [0, 90, 180, 270];
    this.children = [];
    for (var a in y_angles) {
      d = (y_angles[a]) * Math.PI / 180;
      x = Math.cos(d)*(this.r+this.childr);
      y = Math.sin(d)*(this.r+this.childr);
      if (this.not != "y"+y_angles[a]) {
        this.children[this.children.length] = new Shape(this.gen+1, this.x + x, this.y + y, this.z, this.childr, "y"+y_angles[a]);
      }
    }

    var z_angles = [90, 270];
    for (var a in z_angles) {
      d = (z_angles[a]) * Math.PI / 180;
      x = Math.cos(d)*(this.r+this.childr);
      z = Math.sin(d)*(this.r+this.childr);
      if (this.not != "z"+z_angles[a]) {
        this.children[this.children.length] = new Shape(this.gen+1, this.x + x, this.y, this.z + z, this.childr, "z"+z_angles[a]);
      }
    }

  }  

  this.draw();
}

Shape.prototype.draw = function() {
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    scene.add(this.mesh);
    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;
    this.mesh.position.z = this.z;
  }

var shape = new Shape(1,0,0,0,1,0);

camera.lookAt( scene.position );
renderer.render(scene, camera);

controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

animate();

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', function(ev) {
  var w, h;
  if (ev != undefined) {
    w = ev.target.innerWidth;
    h = ev.target.innerHeight;
  } else {
    w = window.innerWidth;
    h = window.innerHeight;
  }
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});