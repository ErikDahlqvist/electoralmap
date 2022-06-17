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

function initMap(states) {

	const stateMap = document.getElementById("stateMap");
	const mapContainer = document.querySelector(".mapContainer");

	let currentZoom = 1;
	let touchZoom = false;
	let pinchLocation, pinchOrigin;

	["touchstart", "touchend"].forEach(touchEvent => {
		stateMap.contentDocument.addEventListener(touchEvent, event => {
			if (event.touches.length === 2 && touchZoom === false) {
				pinchOrigin = Math.hypot(event.touches[0].clientX - event.touches[1].clientX , event.touches[0].clientY - event.touches[1].clientY);
				touchZoom = true;
			}
			if (event.touches.length !== 2 && touchZoom === true) {
				pinchOrigin = undefined;
				touchZoom = false;
			}
		});
	});

	stateMap.contentDocument.addEventListener("touchmove", event => {
		if (touchZoom === true) {
			pinchLocation = Math.hypot(event.touches[0].clientX - event.touches[1].clientX , event.touches[0].clientY - event.touches[1].clientY);
			currentZoom = (pinchLocation / (pinchOrigin / currentZoom)).toFixed(4);
			if (currentZoom < 1) { currentZoom = 1 }
			if (currentZoom > 4) { currentZoom = 4 }
			stateMap.style.transform = `scale(${currentZoom})`;
		}
	});

	stateMap.contentDocument.addEventListener("wheel", event => event.preventDefault(), { passive: false });

	stateMap.contentDocument.addEventListener("wheel", event => {
		let currentY = event.clientY;
		let currentX = event.clientX;
		
		if (event.deltaY < 0 && currentZoom < 4) { stateMap.style.transform = `scale(${currentZoom += 0.5})` }
		if (event.deltaY > 0 && currentZoom > 1) { stateMap.style.transform = `scale(${currentZoom -= 0.5})` }

		mapContainer.scroll(
			currentZoom * currentX - event.clientX,
			currentZoom * currentY - event.clientY
		);
	});

	let mousedown, currentY, currentX;

	stateMap.contentDocument.addEventListener("mousedown", event => {
		mousedown = true;
		currentY = event.clientY;
		currentX = event.clientX;
	});

	stateMap.contentDocument.addEventListener("mouseup", () => mousedown = false);

	stateMap.contentDocument.addEventListener("mousemove", event => {
		if (mousedown === true) {
			mapContainer.scroll(
				mapContainer.scrollLeft + currentZoom * (currentX - event.clientX),
				mapContainer.scrollTop + currentZoom * (currentY - event.clientY)
			);
		}
	});

	Object.keys(states).forEach(state => {
		let selectedState = stateMap.contentDocument.getElementById(state);
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