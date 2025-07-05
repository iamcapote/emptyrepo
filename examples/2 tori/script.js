console.clear();

// Config
// ------------------------

// Affects perspective
const cameraDistance = 12;
// Does not affect perspective
const sceneScale = 0.75;

//   World Orientation
// ---------------------
//          -y  -z
//           | /
//     ______|/_____
//     -x   /|    +x
//         / |
//       +z  +y

// Lightweight canvas adapter. All drawing code is still native 2D canvas commands.
const stage = new SimpleStage({ container: document.body });

// Constants
const TAU = Math.PI * 2;

// State
// ----------------------

// Animate rotation along 2 axes, Y and Z.
let rotationAutoY = 0;
let rotationAutoZ = 0;
// The rendered rotation (note: interactive rotation is tracked further down).
let rotationFinalY = 0;
let rotationFinalZ = 0;



// Helpers
// ----------------------

// Clone array and all vertices.
function cloneVertices(vertices) {
	return vertices.map(vertex => ({ ...vertex }));
}

// Compute triangle midpoint.
// Mutates `middle` property of given `poly`.
function computeTriMiddle(poly) {
	const v = poly.vertices;
	poly.middle.x = (v[0].x + v[1].x + v[2].x) / 3;
	poly.middle.y = (v[0].y + v[1].y + v[2].y) / 3;
	poly.middle.z = (v[0].z + v[1].z + v[2].z) / 3;
}

// Compute quad midpoint.
// Mutates `middle` property of given `poly`.
function computeQuadMiddle(poly) {
	const v = poly.vertices;
	poly.middle.x = (v[0].x + v[1].x + v[2].x + v[3].x) / 4;
	poly.middle.y = (v[0].y + v[1].y + v[2].y + v[3].y) / 4;
	poly.middle.z = (v[0].z + v[1].z + v[2].z + v[3].z) / 4;
}

function computePolyMiddle(poly) {
	if (poly.vertices.length === 3) {
		computeTriMiddle(poly);
	} else {
		computeQuadMiddle(poly);
	}
}

// Compute distance from any polygon (tri or quad) midpoint to camera.
// Sets `depth` property of given `poly`.
// Also triggers midpoint calculation, which mutates `middle` property of `poly`.
function computePolyDepth(poly) {
	computePolyMiddle(poly);
	const dX = poly.middle.x;
	const dY = poly.middle.y;
	const dZ = poly.middle.z - cameraDistance;
	poly.depth = Math.sqrt(dX*dX + dY*dY + dZ*dZ);
}

// Compute normal of any polygon. Uses normalized vector cross product.
// Mutates `normalName` property of given `poly`.
function computePolyNormal(poly, normalName) {
	// Store quick refs to vertices
	const v1 = poly.vertices[0];
	const v2 = poly.vertices[1];
	const v3 = poly.vertices[2];
	// Calculate difference of vertices, following winding order.
	const ax = v1.x - v2.x;
	const ay = v1.y - v2.y;
	const az = v1.z - v2.z;
	const bx = v1.x - v3.x;
	const by = v1.y - v3.y;
	const bz = v1.z - v3.z;
	// Cross product
	const nx = ay*bz - az*by;
	const ny = az*bx - ax*bz;
	const nz = ax*by - ay*bx;
	// Compute magnitude of normal and normalize
	const mag = Math.sqrt(nx*nx + ny*ny + nz*nz);
	const polyNormal = poly[normalName];
	polyNormal.x = nx / mag;
	polyNormal.y = ny / mag;
	polyNormal.z = nz / mag;
}


// Define models once. The origin is the center of the model.

// A simple cube, 8 vertices, 6 quads.
const cubeModel = {
	vertices: [
		// top
		{ x: -1, y: -1, z: 1 },
		{ x:  1, y: -1, z: 1 },
		{ x:  1, y:  1, z: 1 },
		{ x: -1, y:  1, z: 1 },
		// bottom
		{ x: -1, y: -1, z: -1 },
		{ x:  1, y: -1, z: -1 },
		{ x:  1, y:  1, z: -1 },
		{ x: -1, y:  1, z: -1 }
	],
	polys: [
		// z = 1
		{
			vIndexes: [0, 1, 2, 3],
			color: { h: 0, s: 80, l: 50 }
		},
		// z = -1
		{
			vIndexes: [7, 6, 5, 4],
			color: { h: 60, s: 80, l: 50 }
		},
		// y = 1
		{
			vIndexes: [3, 2, 6, 7],
			color: { h: 120, s: 80, l: 50 }
		},
		// y = -1
		{
			vIndexes: [4, 5, 1, 0],
			color: { h: 180, s: 80, l: 50 }
		},
		// x = 1
		{
			vIndexes: [5, 6, 2, 1],
			color: { h: 240, s: 80, l: 50 }
		},
		// x = -1
		{
			vIndexes: [0, 3, 7, 4],
			color: { h: 300, s: 80, l: 50 }
		}
	]
};

const pyramidModel = {
	vertices: [
		{ x: 0, y: 0, z: 1 },
		{ x: -1, y: -1, z: -1 },
		{ x:  1, y: -1, z: -1 },
		{ x:  1, y:  1, z: -1 },
		{ x: -1, y:  1, z: -1 }
	],
	polys: [
		{
			vIndexes: [0, 1, 2],
			color: { h: 0, s: 80, l: 50 }
		},
		{
			vIndexes: [0, 2, 3],
			color: { h: 60, s: 80, l: 50 }
		},
		{
			vIndexes: [0, 3, 4],
			color: { h: 120, s: 80, l: 50 }
		},
		{
			vIndexes: [0, 4, 1],
			color: { h: 180, s: 80, l: 50 }
		},
		{
			vIndexes: [4, 3, 2, 1],
			color: { h: 240, s: 80, l: 50 }
		}
	]
};

const makeTorusModel = (props) => {
	const {
		// "Lat" = small rings
		// "Long" = longitudal lines
		latCount = 40,
		longCount = 20,
		innerRadius = .6,
		outerRadius = 1,
		color = { h: 192, s: 0, l: 50 }
	} = props;
	
	const vertices = [];
	
	const latArc = TAU / latCount;
	const longArc = TAU / longCount;
	for (let x=0; x<latCount; x++) {
		const latAngle = latArc * x;
		const sinY = Math.sin(latAngle);
		const cosY = Math.cos(latAngle);
		for (let y=0; y<longCount; y++) {
			const longAngle = longArc * y;
			const vx = Math.sin(longAngle) * innerRadius + outerRadius;
			const vy = Math.cos(longAngle) * innerRadius;
			const vz = 0;
			vertices.push({
				x: vx*cosY - vz*sinY,
				y: vy,
				z: vx*sinY + vz*cosY
			});
		}
	}
	
	const polys = vertices.map((v, i) => {
		const latIndex = Math.floor(i / longCount);
		const latStartIndex = latIndex * longCount;
		const longIndex = i % longCount;
		const latNeighbor = (longIndex + 1) % longCount + latStartIndex;
		const wrapTorus = i => i % vertices.length;
		return {
			vIndexes: [
				wrapTorus(i + longCount),
				wrapTorus(latNeighbor + longCount),
				wrapTorus(latNeighbor),
				i
			],
			color: color
		};
	});
	
	return { vertices, polys };
};


class Entity {
	constructor({ model, x=0, y=0, z=0, rotateX=0, rotateY=0, rotateZ=0, scaleX=1, scaleY=1, scaleZ=1 }) {
		const vertices = cloneVertices(model.vertices);
		
		const polys = model.polys.map(p => ({
			vertices: p.vIndexes.map(vIndex => vertices[vIndex]),
			color: p.color,
			depth: 0,
			middle: { x: 0, y: 0, z: 0 },
			normalWorld: { x: 0, y: 0, z: 0 },
			normalCamera: { x: 0, y: 0, z: 0 }
		}));
		
		this.model = model;
		this.x = x;
		this.y = y;
		this.z = z;
		this.rotateX = rotateX;
		this.rotateY = rotateY;
		this.rotateZ = rotateZ;
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.scaleZ = scaleZ;
		this.vertices = vertices;
		this.polys = polys;
	}
	
	transform() {
		transformVertices(
			this.model.vertices,
			this.vertices,
			this.x,
			this.y,
			this.z,
			this.rotateX,
			this.rotateY,
			this.rotateZ,
			this.scaleX,
			this.scaleY,
			this.scaleZ
		);
	}
}


const entities = [
	// new Entity({ model: cubeModel, x: 4 }),
	// new Entity({ model: pyramidModel, x: 0 })
	new Entity({
		model: makeTorusModel({
			latCount: 36,
			longCount: 20,
			innerRadius: 0.6,
			outerRadius: 1,
			color: { h: 192, s: 80, l: 50 }
		})
	}),
	new Entity({
		model: makeTorusModel({
			latCount: 36,
			longCount: 7,
			innerRadius: 0.1,
			outerRadius: 2,
			color: { h: 36, s: 80, l: 50 }
		})
	}),
	new Entity({
		model: makeTorusModel({
			latCount: 36,
			longCount: 3,
			innerRadius: 0.04,
			outerRadius: 2.4,
			color: { h: 12, s: 80, l: 50 }
		})
	})
];
const allVertices = entities.reduce((acc, entity) => {
	acc.push(...entity.vertices);
	return acc;
}, []);
const allPolys = entities.reduce((acc, entity) => {
	acc.push(...entity.polys);
	return acc;
}, []);


// Apply translation/rotation to all vertices in scene.
function transformVertices(vertices, target, tX, tY, tZ, rX, rY, rZ, sX, sY, sZ) {
	// Matrix multiplcation constants only need calculated once for all vertices.
	const sinX = Math.sin(rX);
	const cosX = Math.cos(rX);
	const sinY = Math.sin(rY);
	const cosY = Math.cos(rY);
	const sinZ = Math.sin(rZ);
	const cosZ = Math.cos(rZ);
	
	// Using forEach() like map(), but with a (recycled) target array.
	vertices.forEach((v, i) => {
		const targetVertex = target[i];
		// X axis rotation
		const x1 = v.x;
		const y1 = v.z*sinX + v.y*cosX;
		const z1 = v.z*cosX - v.y*sinX;
		// Y axis rotation
		const x2 = x1*cosY - z1*sinY;
		const y2 = y1;
		const z2 = x1*sinY + z1*cosY;
		// Z axis rotation
		const x3 = x2*cosZ - y2*sinZ;
		const y3 = x2*sinZ + y2*cosZ;
		const z3 = z2;
		
		// Scale, Translate, and set the transform.
		 targetVertex.x = x3 * sX + tX;
		 targetVertex.y = y3 * sY + tY;
		 targetVertex.z = z3 * sZ + tZ;
	});
}

// Apply perspective projection to all vertices in scene.
function projectScene() {
	const focalLength = cameraDistance * sceneScale;
	allVertices.forEach((v, i) => {
		const depth = focalLength / (cameraDistance - v.z);
		v.x = v.x * depth;
		v.y = v.y * depth;
	});
}


// Main loop (rAF)
stage.onTick = function tick({ simTime, simSpeed, width, height }) {
	const tickStartTime = performance.now();
	// Only auto-rotate if user is not interacting.
	if (!pointerIsDown) {
		rotationAutoY += 0.005 * simSpeed;
		rotationAutoZ += 0.005 * simSpeed;
	}
	
	rotationFinalY = rotationAutoY + pointerDelta.x;
	rotationFinalZ = rotationAutoZ + pointerDelta.y;
	
	const torus1 = entities[0];
	const torus2 = entities[1];
	const torus3 = entities[2];
	
	torus1.rotateX = rotationFinalZ;
	torus1.rotateY = -rotationFinalY;
	torus2.rotateX = rotationFinalZ;
	torus2.rotateZ = -rotationFinalZ;
	torus2.rotateY = rotationFinalY;
	torus3.rotateZ = rotationFinalZ;
	torus3.rotateY = rotationFinalY;
	
	entities.forEach(e => {
		e.transform();
	});
	allPolys.forEach(p => computePolyNormal(p, 'normalWorld'));
	transformVertices(allVertices, allVertices, 0, 0, 0, 0.75, 0, 0, 1, 1, 1);
	allPolys.forEach(computePolyDepth);
	allPolys.sort((a, b) => b.depth - a.depth);
	projectScene();
	allPolys.forEach(p => computePolyNormal(p, 'normalCamera'));
	
	updateTickTime(performance.now() - tickStartTime);
};

// Draw loop
let renderedPolyCount = 0;
stage.onDraw = function draw({ ctx, width, height }) {
	const renderStartTime = performance.now();
	
	const scale = Math.min(width, height) / 4;
	const centerX = width / 2;
	const centerY = height / 2;
	
	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, width, height);
	
	// Center coordinate system
	ctx.save();
	ctx.translate(centerX, centerY);
	ctx.scale(scale, scale);

	// ctx.strokeStyle = '#09f';
	// ctx.lineJoin = 'round';
	// ctx.lineWidth = 1 / scale;
	
	renderedPolyCount = 0;
	allPolys.forEach(p => {
		if (p.normalCamera.z < 0) return;
		
		const { vertices } = p;
		const lastV = vertices[vertices.length - 1];
		renderedPolyCount++;
		
		const normalLight = p.normalWorld.y;
		const lightness = normalLight > 0
			? 10
			: ((normalLight ** 32 - normalLight) / 2) * 90 + 10;

		ctx.fillStyle = `hsl(${p.color.h},${p.color.s}%,${lightness}%)`;
		ctx.beginPath();
		ctx.moveTo(lastV.x, lastV.y);
		for (let v of vertices) {
			ctx.lineTo(v.x, v.y);
		}
		ctx.fill();
		// ctx.stroke();
	});
	
	ctx.restore();
	
	updateRenderTime(performance.now() - renderStartTime);
}	

// Simple render time display with a moving average.
const renderTimeNode = document.createElement('div');
renderTimeNode.classList.add('render-time');
document.body.appendChild(renderTimeNode);
const tickTimeLog = [];
const renderTimeLog = [];
function updateTickTime(timeMs) {
	tickTimeLog.push(timeMs);
}
function updateRenderTime(timeMs) {
	renderTimeLog.push(timeMs);
	if (renderTimeLog.length > 30) {
		const tickTime = tickTimeLog.reduce((a, b) => a + b) / tickTimeLog.length;
		const renderTime = renderTimeLog.reduce((a, b) => a + b) / renderTimeLog.length;
		renderTimeNode.innerHTML = `Polys: ${allPolys.length} (${renderedPolyCount})<br>Tick:  ${tickTime.toFixed(2)}ms<br>Draw:  ${renderTime.toFixed(2)}ms<br>Total: ${(tickTime + renderTime).toFixed(2)}ms`;
		tickTimeLog.length = 0;
		renderTimeLog.length = 0;
	}
}


// Interaction
// -----------------------------

// Interaction state
let pointerIsDown = false;
let pointerStart = { x: 0, y: 0 };
let pointerDelta = { x: 0, y: 0 };

function handlePointerDown(x, y) {
	if (!pointerIsDown) {
		pointerIsDown = true;
		pointerStart.x = x;
		pointerStart.y = y;
	}
}

function handlePointerUp() {
	pointerIsDown = false;
	// Apply rotation
	rotationAutoY += pointerDelta.x;
	rotationAutoZ += pointerDelta.y;
	// Reset delta
	pointerDelta.x = 0;
	pointerDelta.y = 0;
}

function handlePointerMove(x, y) {
	if (pointerIsDown) {
		const maxRotationX = Math.PI * 1.2;
		const maxRotationY = Math.PI * 1.2;
		pointerDelta.x = (x - pointerStart.x) / stage.width * maxRotationX;
		pointerDelta.y = (y - pointerStart.y) / stage.height * maxRotationY;
	}
}


// Use pointer events if available, otherwise fallback to touch events (for iOS).
if ('PointerEvent' in window) {
	stage.canvas.addEventListener('pointerdown', event => {
		event.isPrimary && handlePointerDown(event.clientX, event.clientY);
	});

	stage.canvas.addEventListener('pointerup', event => {
		event.isPrimary && handlePointerUp();
	});

	stage.canvas.addEventListener('pointermove', event => {
		event.isPrimary && handlePointerMove(event.clientX, event.clientY);
	});
} else {
	let activeTouchId = null;
	stage.canvas.addEventListener('touchstart', event => {
		if (!pointerIsDown) {
			const touch = event.changedTouches[0];
			activeTouchId = touch.identifier;
			handlePointerDown(touch.clientX, touch.clientY);
		}
	});
	stage.canvas.addEventListener('touchend', event => {
		for (let touch of event.changedTouches) {
			if (touch.identifier === activeTouchId) {
				handlePointerUp();
				break;
			}
		}
	});
	stage.canvas.addEventListener('touchmove', event => {
		for (let touch of event.changedTouches) {
			if (touch.identifier === activeTouchId) {
				handlePointerMove(touch.clientX, touch.clientY);
				event.preventDefault();
				break;
			}
		}
	}, { passive: false });
}
