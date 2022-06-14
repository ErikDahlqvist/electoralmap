var selectedColor = "white"

function selectColor(color) {
	selectedColor = color;
}

function initStats(states) {
	console.log(states);
	Object.keys(states).forEach(state => {

		document.getElementById("stateMap").contentDocument.getElementById(state).addEventListener(
			"click",
			function() {
				console.log(`Clicked on ${state}`)
				this.style.fill = selectedColor;
		});
	});
	
}

function fetchData() {
	fetch('/electoralmap/states.json')
		.then(data => data.json())
		.then(success => initStats(success))
		.catch(error => console.error('There has been a problem with your fetch operation:', error));
}

document.documentElement.style.setProperty("--window-height", `${window.innerHeight}px`);
document.documentElement.style.setProperty("--window-width", `${window.innerWidth}px`);

window.addEventListener("resize", () => {
	document.documentElement.style.setProperty("--window-height", `${window.innerHeight}px`);
	document.documentElement.style.setProperty("--window-width", `${window.innerWidth}px`);
});