var canvas
var voxels = []
var oldvoxels = voxels
var mesh = []
var ctx
var mousex = 0
var mousey = 0
const mapsize = 100
const pixelsize = 10
const colorlist = ["red", "green", "blue", "white", "cyan", "purple", "orange", "gray", "yellow"]
var colorindex = 0
var floodfilllist = []
const renderoptions = {
	"wireframe": true,
	"solid": false
}
function draw() {
	ctx.beginPath()
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	if (renderoptions.solid) {
		for (let x in voxels) {
			for (let y in voxels[x]) {
				if (voxels[x][y][1] != "none") {
					ctx.fillStyle = voxels[x][y][1]
				} else {
					ctx.fillStyle = "#000000"
				}
				ctx.fillRect(x * pixelsize, y * pixelsize, pixelsize, pixelsize)
			}
		}
	}
	ctx.stroke()
	ctx.lineWidth = 2
	if (renderoptions.wireframe) {
		for (let i in mesh) {
			if (mesh[i][2] != "none") {
				ctx.strokeStyle = mesh[i][2]
			} else {
				ctx.strokeStyle = "#000000"
			}
			drawLine(mesh[i][0][0] * pixelsize, mesh[i][0][1] * pixelsize, mesh[i][1][0] * pixelsize, mesh[i][1][1] * pixelsize) 
		}
	}
}
function drawLine(a, b, c, d) {
	ctx.beginPath();
	ctx.moveTo(a, b);
	ctx.lineTo(c, d)
	ctx.stroke();
}
function getatcord(x, y) {
	if (voxels[x] != null) {
		if (voxels[x][y] != null) {
			return voxels[x][y]
		} else {
			return ["air", "none"]
		}
	} else {
		return ["air", "none"]
	}
}
function voxeltomesh() {
	mesh = []
	for (let x in voxels) {
		for (let y in voxels[x]) {
			if (getatcord(x, y)[0] == "block") {
				if (getatcord(parseFloat(x) - 1, parseFloat(y))[0] != "block") {
					mesh.push([[parseFloat(x), parseFloat(y)], [parseFloat(x), parseFloat(y) + 1], getatcord(x, y)[1]])
				}
				if (getatcord(parseFloat(x) + 1, parseFloat(y))[0] != "block") {
					mesh.push([[parseFloat(x) + 1, parseFloat(y)], [parseFloat(x) + 1, parseFloat(y) + 1], getatcord(x, y)[1]])
				}
				if (getatcord(parseFloat(x), parseFloat(y) - 1)[0] != "block") {
					mesh.push([[parseFloat(x), parseFloat(y)], [parseFloat(x) + 1, parseFloat(y)], getatcord(x, y)[1]])
				}
				if (getatcord(parseFloat(x), parseFloat(y) + 1)[0] != "block") {
					mesh.push([[parseFloat(x), parseFloat(y) + 1], [parseFloat(x) + 1, parseFloat(y) + 1], getatcord(x, y)[1]])
				}
			}
		}
	}
	draw()
}
function ismapempty() {
	let isempty = true
	for (let x in voxels) {
		for (let y in voxels[x]) {
			if (getatcord(x, y)[0] == "block") {
				isempty = false
			}
		}
	}
	return isempty
}
function floodfillvoxels(x, y, c) {
	if (voxels[x] != null) {
		if (voxels[x][y] != null) {
			if (voxels[x][y][0] != "air") {
				if (voxels[x][y][1] == "none") {
					voxels[x][y][1] = c
					floodfilllist.push([parseInt(x) - 1, y, c])
					floodfilllist.push([parseInt(x) + 1, y, c])
					floodfilllist.push([parseInt(x), parseInt(y) - 1, c])
					floodfilllist.push([parseInt(x), parseInt(y) + 1, c])
				}
			}
		}
	}
}
function floodfillhandler(x, y, c) {
	floodfillvoxels(x, y, c)
	do {
		floodfillvoxels(floodfilllist[0][0], floodfilllist[0][1], floodfilllist[0][2])
		floodfilllist.shift()
	} while (floodfilllist.length > 0)
}
function trytofill(x, y) {
	if (voxels[x][y][1] == "none") {
		if (voxels[x][y][0] != "air") {
			floodfillhandler(x, y, colorlist[colorindex])
			colorindex++
			if (colorindex > 8) {
				colorindex = 0
			}
		}
	}
}
function update() {
	colorindex = 0
	for (let x in voxels) {
		for (let y in voxels[x]) {
			voxels[x][y][1] = "none"
		}
	}
	for (let x in voxels) {
		for (let y in voxels) {
			
			trytofill(x, y)
		}
	}
	
	voxeltomesh()
}
function tick() {
	if (keyjs.keysdown.length > 0) {
		voxels[Math.floor(Math.min(Math.max(0, mousex), (mapsize - 1) * pixelsize) / pixelsize)][Math.floor(Math.min(Math.max(0, mousey), (mapsize - 1) * pixelsize) / pixelsize)][0] = "air"
		update()
	}
	window.requestAnimationFrame(tick)
}
function makevoxels() {
	for (let x = 0; x < mapsize; x++) {
		let newarray = []
		for (let y = 0; y < mapsize; y++) {
			newarray.push(["block", "none"])
		}
		voxels.push(newarray)
	}
}
function updateoptions() {
	renderoptions.solid = document.getElementById("checkbox-solid").checked
	renderoptions.wireframe = document.getElementById("checkbox-wireframe").checked
	console.log(renderoptions)
	draw()
}
function start() {
	canvas = document.getElementById("canvas")
	ctx = canvas.getContext("2d")
	canvas.width = window.innerWidth,
	canvas.height = window.innerHeight
	makevoxels()
	voxeltomesh()
	console.log(mesh)
	tick()
	update()
}
window.addEventListener("mousemove", function (e) {
	mousex = e.clientX
	mousey = e.clientY
})