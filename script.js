var alignmentList = [
	"rgb(0, 0, 0)",			// Swing state
	"rgb(0, 0, 255)",		// Solid dem
	"rgb(85, 85, 255)",		// Likely dem
	"rgb(144, 144, 255)",	// Lean dem
	"rgb(200, 200, 255)",	// Tilt dem
	"rgb(255, 0, 0)",		// Solid rep
	"rgb(255, 85, 85)",		// Likely rep
	"rgb(255, 144, 144)",	// Lean rep
	"rgb(255, 200, 200)"	// Tilt rep
];

function changeAlignment(state) {
	for(let i = 0; i < alignmentList.length; i++) {
		if (alignmentList[i] !== state.style.fill) {
			console.log(alignmentList[i]);
			continue;
		}
		else if (alignmentList[i] === state.style.fill) {
			console.log(`Last: ${alignmentList[i]}`);
			state.style.fill = alignmentList[nextAlignment(i)];
			console.log(nextAlignment(i));
			break;
		}
	}
}

function nextAlignment(currentAlignment) {
	if ((currentAlignment + 1) < alignmentList.length) { return currentAlignment + 1 }
	if ((currentAlignment + 1) >= alignmentList.length) { return 0 }
}

function initStats(states) {
	console.log(states);
	Object.keys(states).forEach(state => {
		document.getElementById("stateMap").contentDocument.getElementById(state).style.fill = alignmentList[0];
		document.getElementById("stateMap").contentDocument.getElementById(state).addEventListener(
			"click",
			function() {
				console.log(`Clicked on ${state}`)
				changeAlignment(this);
		});
	});
}

function fetchData() {
	fetch('/electoralmap/states.json')
		.then(data => data.json())
		.then(success => initStats(success))
		.catch(error => console.error('There has been a problem with your fetch operation:', error));
}

setHeightWidth();

function setHeightWidth() {
	document.documentElement.style.setProperty("--window-width", `${window.innerWidth}px`);
	document.documentElement.style.setProperty("--window-height", `${window.innerHeight}px`);
}

window.addEventListener("resize", () => { setHeightWidth() });