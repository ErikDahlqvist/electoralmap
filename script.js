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
		if (alignmentList[i] !== state.style.fill) { continue; }
		if (alignmentList[i] === state.style.fill) {
			state.style.fill = alignmentList[nextAlignment(i)];
			break;
		}
	}
}

const nextAlignment = currentAlignment => ((currentAlignment + 1) < alignmentList.length) ? currentAlignment + 1 : 0;


let currentZoom = 1;
let mousedown = false;
let currentY = 0;
let currentX = 0;

function initMap(states) {

	const stateMap = document.getElementById("stateMap").contentDocument;

	stateMap.addEventListener("wheel", e => e.preventDefault(), { passive: false });

	stateMap.addEventListener("wheel", function(event) {
		if (event.deltaY < 0 && currentZoom < 4) {
			document.getElementById("stateMap").style.transform = `scale(${currentZoom += 0.5})`;
		}
		if (event.deltaY > 0 && currentZoom > 1) {
			document.getElementById("stateMap").style.transform = `scale(${currentZoom -= 0.5})`;
		}
	});

	stateMap.addEventListener("mousedown", function(event) {
		mousedown = true
		currentY = event.clientY;
		currentX = event.clientX;
	});
	
	stateMap.addEventListener("mouseup", () => mousedown = false);

	stateMap.addEventListener("mousemove", function(event) {
		if (mousedown == true) {
			document.querySelector(".mapContainer").scroll({
				top: document.querySelector(".mapContainer").scrollTop + currentZoom * (currentY - event.clientY),
				left: document.querySelector(".mapContainer").scrollLeft + currentZoom * (currentX - event.clientX)
			});
			currentY = event.clientY;
			currentX = event.clientX;
		}
	});

	Object.keys(states).forEach(state => {
		let selectedState = document.getElementById("stateMap").contentDocument.getElementById(state);
		selectedState.style.fill = alignmentList[0];
		selectedState.addEventListener("click", () => { changeAlignment(selectedState) });
	});
}

function fetchData() {
	fetch('/electoralmap/states.json')
		.then(data => data.json())
		.then(success => initMap(success))
		.catch(error => console.error('There has been a problem with your fetch operation:', error));
}

setHeightWidth();

function setHeightWidth() {
	document.documentElement.style.setProperty("--window-width", `${window.innerWidth}px`);
	document.documentElement.style.setProperty("--window-height", `${window.innerHeight}px`);
}

window.addEventListener("resize", () => { setHeightWidth() });