var keyjs = {}
keyjs.keysdown = []
keyjs.lastkey = ""
window.addEventListener("keydown", function(e) {
	if ((!e.repeat) && (!keyjs.keysdown.includes(e.key))) {
		keyjs.keysdown.push(e.key)
		keyjs.lastkey = e.key
	}
})
window.addEventListener("keyup", function(e) {
	if (e.key != null){
		if (keyjs.keysdown.includes(e.key)) {
			var keyindex = keyjs.keysdown.indexOf(e.key);
			keyjs.keysdown.splice(keyindex, 1)
		}
	}
});