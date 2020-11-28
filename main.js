window.onload = () => {
	'use strict';

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('./sw.js');
	}
	camStart();
}

var targetCount = 0;
var posX = 5;
var posY = 5;
var height;
var width;
var imageCount = [12, 17, 8, 19, 11, 21, 12, 14, 9, 19, 17, 17, 12, 9, 21, 14];
var bgCount = [7, 3, 6, 5, 10, 7, 8, 6, 4, 5, 6, 3, 8, 4, 7, 6];
var mp3Count = [6, 3, 1, 6, 6, 6, 6, 18, 1, 6, 1, 3, 6, 1, 6, 18];
var setFolders = ["Lines", "Underwater", "Balloons", "Space", "Rectangles", "Patterns", "Robots", "Spooky", "Hotair", "Space", "Butterflys", "Underwater", "Robots", "Hotair", "Patterns", "Spooky"];

function checkImageExists(imageUrl, callBack) { // load svg and if that fails fall back to gif
	var imageData = new Image();
	imageData.onload = function () {
		callBack(true);
	};
	imageData.onerror = function () {
		callBack(false);
	};
	imageData.src = imageUrl;
}

var img;

function loadFile(str) {
	img = new Image();
	img.onload = function () {
		aspectRatio = img.width / (img.height);
		height = img.height;
		width = img.width;
		console.log(aspectRatio);
		try {
			target.remove();
		} catch (e) {}
		target = snap.image(str, 0, 0, 200, 200);
		setSize(); // increase size and set up variables
		target.click(function (evt) {
			targetClicked(); // user clicks target 
		});
		if (setNo == 4)
			flashingOn();
	};
	img.src = str;
}

var svgContainer;

function OpenFile(set, group, item) {
	var f = setFolders[(set - 1) * 4 + group - 1];
	var fname = "resources/" + f + "/" + item.toString();

	// if svg then load it else load gif
	checkImageExists(fname + '.svg', function (existsImage) {
		if (existsImage == true) {
			loadFile(fname + '.svg');
		} else {
			checkImageExists(fname + '.gif', function (existsImage2) {
				if (existsImage2 == true) {
					loadFile(fname + '.gif');
				} else {
					checkImageExists(fname + '.png', function (existsImage3) {
						if (existsImage3 == true) {
							loadFile(fname + '.png');
						} else {
							loadFile(fname + '.jpg')
						}
					});
				}
			});
		}
	});
}

// Override the function with all the posibilities
navigator.getUserMedia ||
	(navigator.getUserMedia = navigator.mozGetUserMedia ||
		navigator.webkitGetUserMedia || navigator.msGetUserMedia);

var canvas;

var Sound1 = 1.0;
var Sound2 = 1.0;
var Sound3 = 1.0;
var Sound4 = 1.0;
var mouseX = 0.5;
var mouseY = 0.5;
var keyState1 = 0;
var keyState2 = 0;
var keyState3 = 0;
var keyState4 = 0;
var keyStatel = 0;
var keyStater = 0;
var firstTime = false;
var fricative = false;
var settings;
var panel;
var panelvisible = false;
var progress;
var vol1;
var vol2;
var inMenu = true;
var menuItem = 0;
var drawContext = null;
var setNo = 1;
var activityNo = 1;
var imgNo = 1;
var backgroundNo = 1;
var ts;

var colorList = [];
var doingRainbow = "1";;

function webGLStart() {
	canvas = document.getElementById("webgl-canvas");
	canvas.width = 1024;
	canvas.height = 1024;

	return;
}


var flashing = true;
var tmr;
var displayed;
var size = 2;

function flashingOn() {
	displayed = true;
	clearTimeout(tmr);
	target.attr({ // show it
		display: ''
	});
	tmr = setInterval(function () { // how to do flashing image
		if (displayed) {
			target.attr({ // hide it
				display: 'none'
			});
		} else {
			target.attr({ // show it
				display: ''
			});
		}
		displayed = !displayed;
	}, 2500);
}

function clearTimers() {
	clearTimeout(tmr);
	clearTimeout(moveTimer);
	target.attr({ // show image
		display: ''
	});
}

function setSize() {
	if (size > 3)
		size = 1;
	if (setNo == 1 && activityNo == 1) { // special case for lines
		if (height > 1000) {
			targetWidth = window.innerWidth * size / 12;
			targetHeight = window.innerHeight * 2;
		} else {
			targetWidth = window.innerWidth * 3;
			targetHeight = window.innerHeight * size / 12;
		}
		target.attr({
			width: targetWidth,
			height: targetHeight
		});
	} else {
		if (aspectRatio > 1) {
			targetWidth = 50 + 100 * size;
			targetHeight = (50 + 100 * size) / aspectRatio;
			target.attr({
				width: targetWidth,
				height: targetHeight
			});
		} else {
			targetWidth = (50 + 150 * size) * aspectRatio;
			targetHeight = 50 + 150 * size;
			target.attr({
				width: targetWidth,
				height: targetHeight
			});
		}
	}
}

function newPosition() {
	var tmpX;
	var tmpY;
	var dist = 0;
	target.attr({ // show it
		display: 'none'
	});
	if (setNo == 1 && activityNo == 1) { // special case for lines
		if (height > 1000) {
			targetTop = 0;
			for (i = 1; i < 100; i++) {
				tmpX = Math.random() * 1000 - targetWidth / 2;
				console.log(tmpX, 0);
				dist = Math.abs(tmpX - targetLeft);
				if (dist > 200) {
					targetLeft = tmpX;
					break;
				}
			}
		} else {
			for (i = 1; i < 100; i++) {
				targetLeft = -700;
				tmpY = Math.random() * 1000 - targetHeight / 2;
				console.log(0, tmpY);
				dist = Math.abs(tmpY - targetTop);
				if (dist > 200) {
					targetTop = tmpY;
					break;
				}
			}
		}
	} else { // not lines
		for (i = 1; i < 100; i++) {
			tmpX = Math.random() * 1000 - targetWidth / 2;
			tmpY = Math.random() * 1000 - targetHeight / 2;
			console.log(tmpX, tmpY);
			dist = Math.abs(tmpX - targetLeft) + Math.abs(tmpY - targetTop);
			if (dist > 400) {
				targetLeft = tmpX;
				targetTop = tmpY;
				break;
			}
		}
	}
	setTimeout(function () {
		target.attr({ // move it
			x: targetLeft,
			y: targetTop,
			display: ''
		});
	}, 200);
}

function nextImage() {
	imgNo = imgNo + 1;
	//target.attr({ // show it
	//	display: 'none'
	//});
	if (imgNo > imageCount[(setNo - 1) * 4 + activityNo - 1])
		imgNo = 1;
	setTimeout(function () {
		OpenFile(setNo, activityNo, imgNo);
	}, 200);
}

function Action(i) {
	switch (i) {
		case 2:
			break;
		case 3: // size (also used to initialise first display of image)
			size++;
			setSize();
			newPosition();
			break;
		case 4: // next background
			backgroundNo = backgroundNo + 1;
			if (backgroundNo > bgCount[(setNo - 1) * 4 + activityNo - 1])
				backgroundNo = 1;
			var f = setFolders[(setNo - 1) * 4 + activityNo - 1];
			canvas.style.backgroundImage = "url(resources/" + f + "/bg" + backgroundNo + ".jpg)";
			break;
		case 5: // previous image
			imgNo = imgNo - 1;
			if (imgNo < 1)
				imgNo = imageCount[(setNo - 1) * 4 + activityNo - 1];
			OpenFile(setNo, activityNo, imgNo);
			break;
		case 6: // next image
			targetCount = 0;
			nextImage();
			newPosition();
			break;
		case 7: // toggle buttons
			toggleButtons();
			break;
	}
}

function toggleButtons() {
	ibuttonl.hidden = !ibuttonl.hidden;
	ibuttonlm.hidden = !ibuttonlm.hidden;
	ibuttonm.hidden = !ibuttonm.hidden;
	ibuttonmr.hidden = !ibuttonmr.hidden;
	ibuttonr.hidden = !ibuttonr.hidden;
}

function MonitorKeyDown(e) { // stop autorepeat of keys with KeyState1-4 flags
	if (!e) e = window.event;
	if (e.keyCode == 32 || e.keyCode == 49) {
		if (keyState1 == 0)
			targetClicked();
		keystate1 = 1;
	} else if (e.keyCode == 50) {
		if (keyState2 == 0)
			Action(3);
		keyState2 = 1;
	} else if (e.keyCode == 51 || e.keyCode == 13) {
		if (keyState3 == 0)
			Action(4);
		keyState3 = 1;
	} else if (e.keyCode == 52) {
		if (keyState4 == 0)
			Action(6);
		keyState4 = 1;
	} else if (e.keyCode == 53) {
		toggleButtons();
	} else if (e.keyCode == 189) { // -
		if (keyStatel == 0)
			Action(5); //buttonl
	} else if (e.keyCode == 187) { // +
		if (keyStater == 0)
			Action(6);

	} else if (e.keycode == 27 || e.keyCode == 54) {
		showMenu();// shows menu on ESC or 6 (like ios app)
	}

	return false;
}

function MonitorKeyUp(e) {
	if (!e) e = window.event;
	if (e.keyCode == 32 || e.keyCode == 49) {
		keyState1 = 0;
	} else if (e.keyCode == 50) {
		keyState2 = 0;
	} else if (e.keyCode == 51 || e.keyCode == 13) {
		keyState3 = 0;
	} else if (e.keyCode == 52) {
		keyState4 = 0;
	} else if (e.keyCode == 189) {
		keyStatel = 0;
	} else if (e.keyCode == 187) {
		keyStater = 0;
	}
	return false;
}

function MonitorMouseDown(e) {
	if (!e) e = window.event;
	if (e.button == 0) {
		mouseX = e.clientX / canvas.scrollWidth;
		mouseY = 1.0 - e.clientY / canvas.scrollHeight;
	}
	//var c = document.getElementById("container");
	//c.style.filter = "sepia(1) hue-rotate(230deg) saturate(2)";
	//toggleButtons();
	return false;
}

function MonitorMouseUp(e) {
	if (!e) e = window.event;
	//var c = document.getElementById("container");
	//c.style.filter = "grayscale(0)";
	return false;
}

var splash;
var button;
var button1;
var button2;
var button3;
var button4;
var button5;
var button6;
var button7;
var ibuttonl;
var ibuttonlm;
var ibuttonm;
var ibuttonmr;
var ibuttonr;

function hideMenu() {
	splash.hidden = true;
	button.hidden = true;
	button1.hidden = true;
	button2.hidden = true;
	button3.hidden = true;
	button4.hidden = true;
	button5.hidden = true;
	button6.hidden = true;
	button6.hidden = true;
	button7.hidden = true;
	ibuttonl.hidden = false;
	ibuttonlm.hidden = false;
	ibuttonm.hidden = false;
	ibuttonmr.hidden = false;
	ibuttonr.hidden = false;
	crosshairs.hidden = true;
	inMenu = false;
}

function showMenu() {
	splash.hidden = false;
	button.hidden = false;
	button1.hidden = false;
	button2.hidden = false;
	button3.hidden = false;
	button4.hidden = false;
	button5.hidden = false;
	button6.hidden = false;
	button6.hidden = false;
	button7.hidden = false;
	//ibutton.hidden = true;
	ibuttonl.hidden = true;
	ibuttonlm.hidden = true;
	ibuttonmr.hidden = true;
	ibuttonr.hidden = true;
	inMenu = true;
	crosshairs.hidden = true;
	clearTimers();
}

function Highlight() {
	button.style.opacity = .7;
	button1.style.opacity = .7;
	button2.style.opacity = .7;
	button3.style.opacity = .7;
	button4.style.opacity = .7;
	button5.style.opacity = .7;
	button6.style.opacity = .7;
	button7.style.opacity = .7;
	switch (menuItem) {
		case 0:
			button.style.opacity = 1.;
			break;
		case 1:
			button1.style.opacity = 1.;
			break;
		case 2:
			button2.style.opacity = 1.;
			break;
		case 3:
			button3.style.opacity = 1.;
			break;
		case 4:
			button4.style.opacity = 1.;
			break;
		case 5:
			button5.style.opacity = 1.;
			break;
		case 6:
			button6.style.opacity = 1.;
			break;
		case 7:
			button7.style.opacity = 1.;
			break;
	}
}

function ChooseSet(i) {
	button4.style.backgroundImage = "url(images/" + i + "1.jpg)";
	button5.style.backgroundImage = "url(images/" + i + "2.jpg)";
	button6.style.backgroundImage = "url(images/" + i + "3.jpg)";
	button7.style.backgroundImage = "url(images/" + i + "4.jpg)";
	setNo = i;
	button.style.border = "none";
	button.style.borderRadius = "0px";
	button1.style.border = "none";
	button1.style.borderRadius = "0px";
	button2.style.border = "none";
	button2.style.borderRadius = "0px";
	button3.style.border = "none";
	button3.style.borderRadius = "0px";
	switch (setNo) {
		case 1:
			button.style.border = "2px solid #FFFFFF";
			button.style.borderRadius = "5vw";
			break;
		case 2:
			button1.style.border = "2px solid #FFFFFF";
			button1.style.borderRadius = "5vw";
			break;
		case 3:
			button2.style.border = "2px solid #FFFFFF";
			button2.style.borderRadius = "5vw";
			break;
		case 4:
			button3.style.border = "2px solid #FFFFFF";
			button3.style.borderRadius = "5vw";
			break;
	}
}

var moveTimer;

function wiggle() {
	target.attr({ // move it
		x: targetLeft + getRndInteger(1, 10),
		y: targetTop + getRndInteger(1, 10)
	});
}

function Go(i) {
	index = i - 1;
	activityNo = i
	if (firstTime) {
		firstTime = false;
		if (document.body.requestFullscreen) {
			document.body.requestFullscreen();
		} else if (document.body.msRequestFullscreen) {
			document.body.msRequestFullscreen();
		} else if (document.body.mozRequestFullScreen) {
			document.body.mozRequestFullScreen();
		} else if (document.body.webkitRequestFullscreen) {
			document.body.webkitRequestFullscreen();
		}
	}

	//   startAudio();
	hideMenu();

	imgNo = 1;
	var f = setFolders[(setNo - 1) * 4 + activityNo - 1];
	canvas.style.backgroundImage = "url(resources/" + f + "/bg1.jpg)";
	backgroundNo = 1;
	OpenFile(setNo, activityNo, imgNo);

	try {
		clearTimeout(moveTimer);
		if (setNo >= 3)
			moveTimer = setInterval(wiggle, 300);
	} catch (e) {
		var i = 3;
	};
}

function slideTo(el, left) {
	var steps = 10;
	var timer = 25;
	var elLeft = parseInt(el.style.left) || 0;
	var diff = left - elLeft;
	var stepSize = diff / steps;
	console.log(stepSize, ", ", steps);

	function step() {
		elLeft += stepSize;
		el.style.left = elLeft + "vw";
		if (--steps) {
			setTimeout(step, timer);
		}
	}
	step();
}

StoreValue = function (key, value) {
	if (window.localStorage) {
		window.localStorage.setItem(key, value);
	}
};

RetrieveValue = function (key, defaultValue) {
	var got;
	try {
		if (window.localStorage) {
			got = window.localStorage.getItem(key);
			if (got == 0) {
				return got;
			}
			if (got == "") {
				return got;
			}
			if (got) {
				return got;
			}
			return defaultValue;
		}
		return defaultValue;
	} catch (e) {
		return defaultValue;
	}
};

var c = document.getElementById("body");

var target;
var snap;
var fname;
var aspectRatio = 1;
var targetWidth;
var targetHeight;
var targetLeft = 500;
var targetTop = 500;


function getRndInteger(min, max) {
	var i = Math.floor(Math.random() * (max - min + 1)) + min;
	if (i > max)
		i = max;
	return i;
}

var audio;

function PlaySound() {
	var s = setFolders[(setNo - 1) * 4 + activityNo - 1];
	s = "resources/" + s + "/" + getRndInteger(1, mp3Count[(setNo - 1) * 4 + activityNo - 1]) + '.mp3';
	if (audio != undefined)
		audio.pause();
	try {
		audio = new Audio(s);
		audio.play();
		console.log('Sound: ' + s);
		/*       var sound = new Howl({
		           src: [s]
		       });
		       sound.play(); */
	} catch (e) {};
}

function PlayApplause() {
	var s = "resources/Applause/" + getRndInteger(1, 8) + '.mp3';
	try {
		audio = new Audio(s);
		audio.play();
		console.log('Sound: ' + s);
		/*       var sound = new Howl({
		           src: [s]
		       });
		       sound.play(); */
	} catch (e) {};
}

function targetClicked() {
	if (++targetCount > 4) {
		PlayApplause();
		nextImage();
		targetCount = 0;
	} else
		PlaySound();
	newPosition();
}

function camStart() {
	contn = document.getElementById("container");
	crosshairs = document.querySelector('crosshairs');
	crosshairs.hidden = true;
	splash = document.querySelector('splash');
	button = document.querySelector('button');
	button1 = document.querySelector('button1');
	button2 = document.querySelector('button2');
	button3 = document.querySelector('button3');
	button4 = document.querySelector('button4');
	button5 = document.querySelector('button5');
	button6 = document.querySelector('button6');
	button7 = document.querySelector('button7');
	ibuttonl = document.querySelector('ibuttonl');
	ibuttonlm = document.querySelector('ibuttonlm');
	ibuttonm = document.querySelector('ibuttonm');
	ibuttonmr = document.querySelector('ibuttonmr');
	ibuttonr = document.querySelector('ibuttonr');
	webcam = document.createElement('canvas');
	svgContainer = document.querySelector('svg');
	//getElementById('webcam');
	keyState1 = 0;
	keyState2 = 0;
	keyState3 = 0;
	keyState4 = 0;

	webGLStart();

	snap = Snap("#svg").attr({
		viewBox: "0 0 1000 1000"
	});

	document.onkeydown = MonitorKeyDown;
	document.onkeyup = MonitorKeyUp;

	canvas.onmousedown = MonitorMouseDown;
	canvas.onmouseup = MonitorMouseUp;

	ibuttonl.onclick = function (e) {
		showMenu(); // home
	}
	//	ibuttonlm.onclick = function (e) {
	//		Action(2);
	//	}
	ibuttonm.onclick = function (e) {
		Action(3); // size
	}
	ibuttonmr.onclick = function (e) {
		Action(4); // background
	}
	ibuttonr.onclick = function (e) {
		Action(6); // foreground
	}

	button.onmousedown = function (e) {
		ChooseSet(1);
	}
	button1.onmousedown = function (e) {
		ChooseSet(2);
	}
	button2.onmousedown = function (e) {
		ChooseSet(3);
	}
	button3.onmousedown = function (e) {
		ChooseSet(4);
	}
	button4.onmousedown = function (e) {
		Go(1);
	}
	button5.onmousedown = function (e) {
		Go(2);
	}
	button6.onmousedown = function (e) {
		Go(3);
	}
	button7.onmousedown = function (e) {
		Go(4);
	}

	var point = {
		x: -10,
		y: 0
	};

	function MouseClick() {
		if (!inMenu) {
			var s;
			var elements = document.elementFromPoint(crosshairs.offsetLeft + (crosshairs.offsetWidth) / 2, crosshairs.offsetTop + (crosshairs.offsetHeight) / 2);
			try {
				if (elements.nodeName == 'image')
					targetClicked();
				else if (elements.nodeName == 'svg')
				;
				else
					elements.click();
			} catch (e) {
				console.log(e);
			}
		}
	}

	function MoveMouse(xm, ym) {
		crosshairs.hidden = false;
		try {
			mouseX = crosshairs.offsetLeft + (crosshairs.offsetWidth) / 2;
			mouseY = crosshairs.offsetTop + (crosshairs.offsetHeight) / 2;
			mouseX += xm;
			mouseY += ym;
			if (mouseX < 10)
				mouseX = 10;
			if (mouseY < 10)
				mouseY = 10;
			if (mouseX >= window.innerWidth - 10)
				mouseX = window.innerWidth - 10;
			if (mouseY >= window.innerHeight - 10)
				mouseY = window.innerHeight - 10;
			console.log('MoveTo: ', mouseX, mouseY);
			crosshairs.style.left = mouseX - crosshairs.offsetWidth / 2 + "px";
			crosshairs.style.top = mouseY - crosshairs.offsetHeight / 2 + "px";
			mouseX /= canvas.width;
			mouseY /= canvas.height;
		} catch (e) {}
	}

	function JoystickMoveTo(jy, jx) {
		if (Math.abs(jx) < .1 && Math.abs(jy) < .1) {
			try {
				if (gpad.getButton(14).value > 0) // dpad left
					MoveMouse(-10, 0);
				if (gpad.getButton(12).value > 0) // dup
					MoveMouse(0, -7);
				if (gpad.getButton(13).value > 0) // ddown
					MoveMouse(0, 7);
				if (gpad.getButton(15).value > 0) // dright
					MoveMouse(10, 0);
			} catch (e) {}
			return;
		}
		MoveMouse(jx * 10, jy * 7);

	}

	function showPressedButton(index) {
		console.log("Press: ", index);
		if (inMenu) {
			switch (index) {
				case 0: // A

				case 1: // B
				case 2: // X
				case 3: // Y
					if (menuItem < 4)
						ChooseSet(menuItem + 1)
					else
						Go(menuItem - 3);
					break;
				case 12: // dup
					if (menuItem > 3)
						menuItem -= 4;
					Highlight();
					break;
				case 13: // ddown
					if (menuItem < 4)
						menuItem += 4;
					Highlight();
					break;
				case 14: // dleft
					if (menuItem > 0)
						menuItem--;
					Highlight();
					break;
				case 15: // dright
					if (menuItem < 7)
						menuItem++;
					Highlight();
					break;
			}
			console.log("Menu: ", menuItem);
		} else switch (index) {
			case 0: // A
				MouseClick();
				break;
			case 6://L Trig
			case 11:// RThumb press
            case 9:// List Button
				Action(3);
				break;
            case 7://R Trig
            case 3: // Y
				Action(4);
				break;
			case 2: // X
            case 4: // LB
				Action(6);
				break;
			case 1: // B
			case 5: // RB
				targetClicked();
				break;
            case 8: // View Button new 20/6/20
            toggleButtons(); // new 20/6/20
            break; // new 20/6/20
			case 10: // LThumbPress
            case 16: // XBox
            
				showMenu();
				break;
			default:
		}
	}

	function removePressedButton(index) {
		console.log("Releasd: ", index);
	}

	function moveJoystick(values, isLeft) {
		if (!inMenu)
			JoystickMoveTo(values[1], values[0]);
	}

	var gpad;

	function getAxes() {
		//       console.log('Axis', gpad.getAxis(0), gpad.getAxis(1), gpad.getButton(14).value);

		if (!inMenu)
			JoystickMoveTo(gpad.getAxis(1), gpad.getAxis(0));
		setTimeout(function () {
			getAxes();
		}, 50);
	}

	gamepads.addEventListener('connect', e => {
		console.log('Gamepad connected:');
		console.log(e.gamepad);
		ChooseSet(1)
		Highlight()
		gpad = e.gamepad;
		e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
		e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
		//       e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, true),
		//            StandardMapping.Axis.JOYSTICK_LEFT);
		//        e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, false),
		//            StandardMapping.Axis.JOYSTICK_RIGHT);
		setTimeout(function () {
			getAxes();
		}, 50);
	});

	gamepads.addEventListener('disconnect', e => {
		console.log('Gamepad disconnected:');
		console.log(e.gamepad);
	});

	gamepads.start();

	ChooseSet(1);

}
/*block B button on XBox Controller closing app via back command on XBox*/
var systemNavigationManager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
var systemNavigation = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
systemNavigationManager.addEventListener("backrequested", handleSystemNavigationEvent.bind(this));
function handleSystemNavigationEvent(args) { args.handled = true;
history.back()
}
//© 2020 Sensory App House Ltd www.sensoryapphouse.com