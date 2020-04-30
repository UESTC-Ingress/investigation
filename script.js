//---------------------------------------
//     APP         ----------------------
//---------------------------------------

// INIT SCENE
// CREATE LETTERS
// POSITION LETTERS
// CREATE INPUTS
// INIT INPUTS
// INPUT VALIDATION
// ENTRY SEQUENCE
// SETUP ANIMATION
// UI BEHAVIOR
// ANIMATE LETTER

var numLetters = 12;
var letterPadding = 111;
var letterY = 600;
var inputGroupWidth = window.innerWidth > 600 ? 500 : 400;
var inputWidth = window.innerWidth > 600 ? 30 : 20;
var inputHeight = inputWidth;
var numLinks = 75;
var linkLength = 7;
var strokeWidth = linkLength;
var viewBox = "0 0 1300 975";
var SVGWidth = "400";
var SVGHeight = "300";
var svgns = "http://www.w3.org/2000/svg";
var xlink = "http://www.w3.org/1999/xlink";
var main = document.getElementById("main");
var inputDiv = document.getElementById("userInput");

var dur; // Animation speed

var l; // dynamic reference to link
var lg; // dynamic reference to link groups
var letg; // dynamic reference to letter group
var validInputs = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  ".",
  " ",
  "-",
  "_",
  "",
];
var validKeys = [190, 189, 32];
for (var i = 65; i <= 90; i++) {
  validKeys.push(i);
}

// Convenience: Set multiple attributes at once
function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

// Convenience: Return array of links/linkGroups to animated
function linkArr(first, last, type) {
  var arr = [];
  if (type == undefined) {
    type = lg;
  }
  for (var i = first; i <= last; i++) {
    arr.push(type + i);
  }
  return arr;
}

//-----------------------
//-----------------------	INIT SCENE
//-----------------------

$(initScene(createLetters, positionLetters, createInputs));

function initScene(x, y, z) {
  // Create SVG
  var newSVG = document.createElementNS(svgns, "svg");

  // Set SVG attributes
  setAttributes(newSVG, {
    id: "kineticType",
    xmlns: svgns,
    viewBox: viewBox,
    width: SVGWidth,
    height: SVGHeight,
  });

  // Create Defs tag
  var newDefs = document.createElementNS(svgns, "defs");

  // Create path template
  var newPathTemplate = document.createElementNS(svgns, "path");

  // Set path attributes
  setAttributes(newPathTemplate, {
    id: "link",
    d: "M0 0h" + linkLength,
    "stroke-linecap": "round",
    "stroke-width": strokeWidth,
  });

  // Create the mainGroup
  var mainGroup = document.createElementNS(svgns, "g");

  // Set mainGroup attributes
  setAttributes(mainGroup, {
    id: "mainGroup",
  });

  // Append SVG to main div
  main.appendChild(newSVG);

  // Append Defs to SVG
  newSVG.appendChild(newDefs);

  // Append path to Defs
  newDefs.appendChild(newPathTemplate);

  // Append mainGroup to SVG
  newSVG.appendChild(mainGroup);

  x();
  y();
  z();
}

//-----------------------
//-----------------------	CREATE LETTERS
//-----------------------

function createLetters() {
  // Create letterGroups and put them in mainGroup
  for (var i = 0; i < numLetters; i++) {
    // Create a letterGroup
    var newLetterGroup = document.createElementNS(svgns, "g");

    // Set letterGroup attributes
    setAttributes(newLetterGroup, {
      id: "letterGroup" + i,
      class: "letterGroup",
      stroke: "hsla(330, 40%, " + random(40, 60) + "%, 1)",
      opacity: "0",
    });

    // Store previously created link group
    var prevLinkGroup;

    // Create Links and nest them in LinkGroups
    for (var j = 0; j < numLinks; j++) {
      // Create a linkGroup
      var newLinkGroup = document.createElementNS(svgns, "g");

      // Set linkGroup attributes
      setAttributes(newLinkGroup, {
        id: "linkGroup" + i + "-" + j,
        class: "linkGroup",
      });

      // Create Link
      var newLink = document.createElementNS(svgns, "use");

      // Set Link attributes
      newLink.setAttributeNS(xlink, "xlink:href", "#link");
      setAttributes(newLink, {
        class: "link",
        id: "link" + i + "-" + j,
        x: j * linkLength,
      });

      // Put the link in the linkGroup
      newLinkGroup.appendChild(newLink);

      // Nest linkGroups
      if (j == 0) {
        newLetterGroup.appendChild(newLinkGroup);
      } else {
        prevLinkGroup.appendChild(newLinkGroup);
      }

      // Set previous linkGroup for next iteration
      prevLinkGroup = newLinkGroup;
    }

    // Put the letterGroup in the mainGroup
    mainGroup.appendChild(newLetterGroup);
  }
}

//-----------------------
//-----------------------	POSITION LETTERS
//-----------------------

function positionLetters() {
  for (var i = 0; i < numLetters; i++) {
    TweenMax.set(".letterGroup", {
      rotation: -90,
      transformOrigin: "left center",
    });
    TweenMax.set("#letterGroup" + i, { x: i * letterPadding, y: letterY });
  }
}

//-----------------------
//-----------------------	CREATE INPUTS
//-----------------------

function createInputs() {
  var inputGroup = document.getElementById("userInput");
  setAttributes(inputGroup, {
    style: "width: " + inputGroupWidth + "px;",
  });
  for (var i = 0; i < numLetters; i++) {
    //var inputGroupWidth = document.getElementById("userInput").clientWidth;
    // Create an input
    var newInput = document.createElement("input");

    var margin = (inputGroupWidth - numLetters * inputWidth) / (numLetters * 2);

    // Set attributes
    setAttributes(newInput, {
      id: "index" + i,
      class: "input",
      "data-index": i,
      maxlength: "1",
      style:
        "margin: 0 " +
        margin +
        "px; width: " +
        inputWidth +
        "px; height: " +
        inputHeight +
        "px; font-size: " +
        (inputWidth - 2) +
        "px;",
    });

    // Put input in inputDiv
    inputDiv.appendChild(newInput);
  }

  // Connect listeners to inputs
  initInputs();
}

//-----------------------
//-----------------------	INIT INPUTS
//-----------------------

// Initiate inputs after they are created
function initInputs() {
  // ADD EVENT LISTENERS TO INPUTS
  // Highlight text of focused inputs
  $(".input").on("focus", function () {
    if (getInput() == "") animateWord("", 1);
    highlightText(this);
  });
  // Check valid inputs and initiate animation
  $(".input").keyup(function (e) {
    if (e.which == 13) submitRequest(this);
    else checkInput(this, e);
  });

  // SET FIRST STATE OF UI
  // Focus and highlight the first input
  //$(".input").first().focus().select();

  // START EXPERIENCE
  entrySequence();
}

//-----------------------
//-----------------------	INPUT VALIDATION
//-----------------------

function checkInput(elem, event) {
  // CHECK IF KEYSTROKE IS VALID
  // Get pressed key
  var key = event.which;
  // Check if valid
  if ($.inArray(key, validKeys) != -1) {
    // If valid
    animationSetup(elem);
    moveToNext(elem);
  } else {
    // If not
    highlightText(elem);
  }

  // If user hit backspace, move back and erase
  if (key == 8) {
    moveToPrev(elem);
    animationSetup(elem);
  }

  // INFORM THE USER
  // Check if
  if ($.inArray(elem.value.toLowerCase(), validInputs) == -1) {
    // Show error message if invalid
    $(elem).addClass("error");
  } else {
    // Remove error message
    $(elem).removeClass("error");
  }
}

//-----------------------
//-----------------------	ENTRY SEQUENCE
//-----------------------

function entrySequence() {
  animateWord("NIA SEC ZONE", 0);

  revealScene();
}

function revealScene() {
  TweenMax.to("body", 0.5, { backgroundColor: "hsla(200, 50%, 10%, 1)" });
  TweenMax.from("#userInput", 0.7, {
    y: "+=60",
    ease: Back.easeOut,
    delay: 0.5,
  });
  TweenMax.to("#userInput", 0.5, { autoAlpha: 1, delay: 0.5 });
  TweenMax.staggerTo(".letterGroup", 0.5, { autoAlpha: 1, delay: 1 }, 0.05);
}

//-----------------------
//-----------------------	SETUP ANIMATION
//-----------------------

function animationSetup(elem) {
  // Get which input box
  var i = elem.dataset.index;

  // Get which input value
  var input = elem.value;

  // Animate to correlating input value
  switch (input) {
    case "":
      animate(i, "space");
      break;
    case ".":
      animate(i, "dot");
      break;
    case " ":
      animate(i, "space");
      break;
    case "-":
      animate(i, "dash");
      break;
    case "_":
      animate(i, "score");
      break;
    default:
      animate(i, input);
  }
}

//-----------------------
//-----------------------	UI BEHAVIOR
//-----------------------

function highlightText(elem) {
  $(elem).select();
}

function moveToNext(elem) {
  // Focus on the next input box
  var $next = $(elem).next(".input");

  if ($next.length) {
    $(elem).next(".input").focus();
  } else {
    //$(".input").first().focus();
  }
}

function moveToPrev(elem) {
  // Focus on the next input box
  var $prev = $(elem).prev(".input");

  if ($prev.length) {
    $(elem).prev(".input").focus();
    elem.value = "";
  } else {
    $(".input").last().focus();
    elem.value = "";
  }
}

//-----------------------
//-----------------------	ANIMATE LETTER
//-----------------------

// Initiate animation with correleting input box and character
function animate(index, letter, seconds) {
  // Normalise input
  var letter = letter.toUpperCase();

  // Set dynamic references
  letg = "#letterGroup" + index;
  lg = "#linkGroup" + index + "-";
  l = "#link" + index + "-";
  dur = seconds == undefined ? 1 : seconds;

  // Reset and start animation
  reset(window[letter]);
}

// Resets properties of links and linkgroups before animating the letter
function reset(letterFunc) {
  var allLinkGroups = linkArr(0, numLinks - 1);
  var allLinks = linkArr(0, numLinks - 1, l);
  TweenMax.to(letg, 0.2, {
    attr: {
      stroke: "hsla(330, " + random(60, 65) + "%, " + random(37, 50) + ", 1)",
    },
  });
  TweenMax.to(allLinkGroups, dur * 2, { rotation: 0, autoAlpha: 1 });
  TweenMax.to(allLinks, dur, { autoAlpha: 1 });
  letterFunc();
}

// Tweening the properties of links and linkgroups to form given letter
function A() {
  var first = -1;
  var last = 64;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(16, 30);

  TweenMax.to(c1, dur, { rotation: 180 / c1.length });
  TweenMax.to(lg + 36, dur, { rotation: 90 });
  TweenMax.to(lg + 45, dur, { rotation: 180 });
  TweenMax.to(lg + 54, dur, { rotation: 90 });
}

function B() {
  var first = -1;
  var last = 70;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(25, 38);
  var c2 = linkArr(48, 65);

  TweenMax.to(lg + 20, dur, { rotation: 90 });
  TweenMax.to(c1, dur, { rotation: 180 / c1.length });
  TweenMax.to(lg + 43, dur, { rotation: -180 });
  TweenMax.to(c2, dur, { rotation: 180 / c2.length });
}

function C() {
  var first = 4;
  var last = 56;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(5, 12);
  var c2 = linkArr(14, 29);
  var c3 = linkArr(40, 55);

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(c1, dur, { rotation: -90 / c1.length });
  TweenMax.to(lg + 13, dur, { rotation: -180 });
  TweenMax.to(c2, dur, { rotation: 180 / c2.length });
  TweenMax.to(c3, dur, { rotation: 180 / c3.length });
}

function D() {
  var first = -1;
  var last = 54;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(24, 32);
  var c2 = linkArr(42, 50);

  TweenMax.to(lg + "20", dur, { rotation: 90 });
  TweenMax.to(c1, dur, { rotation: 90 / c1.length });
  TweenMax.to(c2, dur, { rotation: 90 / c2.length });
}
function E() {
  var first = -1;
  var last = 61;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + "0", dur, { rotation: 90 });
  TweenMax.to(lg + "9", dur, { rotation: -180 });
  TweenMax.to(lg + "18", dur, { rotation: 90 });
  TweenMax.to(lg + "28", dur, { rotation: 90 });
  TweenMax.to(lg + "35", dur, { rotation: 180 });
  TweenMax.to(lg + "42", dur, { rotation: 90 });
  TweenMax.to(lg + "52", dur, { rotation: 90 });
}
function F() {
  var first = -1;
  var last = 43;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + "10", dur, { rotation: 90 });
  TweenMax.to(lg + "17", dur, { rotation: 180 });
  TweenMax.to(lg + "24", dur, { rotation: 90 });
  TweenMax.to(lg + "34", dur, { rotation: 90 });
}
function G() {
  var first = 4;
  var last = 72;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(5, 12);
  var c2 = linkArr(30, 45);
  var c3 = linkArr(56, 71);

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(c1, dur, { rotation: -90 / c1.length });
  TweenMax.to(lg + 17, dur, { rotation: -90 });
  TweenMax.to(lg + 21, dur, { rotation: 180 });
  TweenMax.to(lg + 25, dur, { rotation: 90 });
  TweenMax.to(c2, dur, { rotation: 180 / c2.length });
  TweenMax.to(c3, dur, { rotation: 180 / c3.length });
}

function H() {
  var first = -1;
  var last = 70;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + "20", dur, { rotation: 180 });
  TweenMax.to(lg + "30", dur, { rotation: -90 });
  TweenMax.to(lg + "40", dur, { rotation: 90 });
  TweenMax.to(lg + "50", dur, { rotation: 180 });
}
function I() {
  var first = 1;
  var last = 40;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(lg + 8, dur, { rotation: -180 });
  TweenMax.to(lg + 11, dur, { rotation: 90 });
  TweenMax.to(lg + 31, dur, { rotation: 90 });
  TweenMax.to(lg + 34, dur, { rotation: 180 });
}
function J() {
  var first = 4;
  var last = 48;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(5, 12);
  var c2 = linkArr(18, 33);

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(lg + 4, dur, { rotation: -180 });
  TweenMax.to(c1, dur, { rotation: 90 / c1.length });
  TweenMax.to(lg + 15, dur, { rotation: 180 });
  TweenMax.to(c2, dur, { rotation: -180 / c2.length });
}
function K() {
  var first = -1;
  var last = 68;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + "20", dur, { rotation: 180 });
  TweenMax.to(lg + "30", dur, { rotation: -140 });
  TweenMax.to(lg + "43", dur, { rotation: 180 });
  TweenMax.to(lg + "54", dur, { rotation: -75 });
}
function L() {
  var first = -1;
  var last = 38;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + "0", dur, { rotation: 90 });
  TweenMax.to(lg + "9", dur, { rotation: -180 });
  TweenMax.to(lg + "18", dur, { rotation: 90 });
}
function M() {
  var first = -1;
  var last = 60;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + "20", dur, { rotation: 150 });
  TweenMax.to(lg + "30", dur, { rotation: -120 });
  TweenMax.to(lg + "40", dur, { rotation: 150 });
}
function N() {
  var first = -1;
  var last = 62;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + "20", dur, { rotation: 155 });
  TweenMax.to(lg + "42", dur, { rotation: -155 });
}
function O() {
  var first = 4;
  var last = 57;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(5, 12);
  var c2 = linkArr(23, 38);
  var c3 = linkArr(49, 56);

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(lg + 4, dur, { rotation: -180 });
  TweenMax.to(c1, dur, { rotation: 90 / c1.length });
  TweenMax.to(c2, dur, { rotation: 180 / c2.length });
  TweenMax.to(c3, dur, { rotation: 90 / c3.length });
}
function P() {
  var first = -1;
  var last = 45;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(25, 40);

  TweenMax.to(lg + 20, dur, { rotation: 90 });
  TweenMax.to(c1, dur, { rotation: 180 / c1.length });
}
function Q() {
  var first = 4;
  var last = 68;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(5, 12);
  var c2 = linkArr(23, 38);
  var c3 = linkArr(49, 59);

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(c1, dur, { rotation: -90 / c1.length });
  TweenMax.to(c2, dur, { rotation: -180 / c2.length });
  TweenMax.to(c3, dur, { rotation: -90 / c1.length });
  TweenMax.to(lg + 60, dur, { rotation: -105 });
  TweenMax.to(lg + 63, dur, { rotation: 180 });
}
function R() {
  var first = -1;
  var last = 61;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(25, 40);

  TweenMax.to(lg + 20, dur, { rotation: 90 });
  TweenMax.to(c1, dur, { rotation: 180 / c1.length });
  TweenMax.to(lg + 45, dur, { rotation: 180 });
  TweenMax.to(lg + 50, dur, { rotation: 66 });
}

function S() {
  var first = 4;
  var last = 67;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(5, 12);
  var c2 = linkArr(18, 40);
  var c3 = linkArr(43, 65);

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(lg + 4, dur, { rotation: -180 });
  TweenMax.to(c1, dur, { rotation: 90 / c1.length });
  TweenMax.to(lg + 15, dur, { rotation: 180 });
  TweenMax.to(c2, dur, { rotation: -259.25 / c2.length });
  TweenMax.to(c3, dur, { rotation: 259.25 / c3.length });
}
function T() {
  var first = 3;
  var last = 42;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(lg + 4, dur, { rotation: -90 });
  TweenMax.to(lg + 24, dur, { rotation: -90 });
  TweenMax.to(lg + 30, dur, { rotation: 180 });
}

function U() {
  var first = 4;
  var last = 73;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(6, 13);
  var c2 = linkArr(43, 58);

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(lg + 5, dur, { rotation: -180 });
  TweenMax.to(c1, dur, { rotation: 90 / c1.length });
  TweenMax.to(lg + 28, dur, { rotation: 180 });
  TweenMax.to(c2, dur, { rotation: -180 / c2.length });
}

function V() {
  var first = 3;
  var last = 67;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(lg + 4, dur, { rotation: -105 });
  TweenMax.to(lg + 25, dur, { rotation: 180 });
  TweenMax.to(lg + 46, dur, { rotation: -150 });
}
function W() {
  var first = 2;
  var last = 72;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(lg + 2, dur, { rotation: -100 });
  TweenMax.to(lg + 22, dur, { rotation: 180 });
  TweenMax.to(lg + 42, dur, { rotation: -140 });
  TweenMax.to(lg + 47, dur, { rotation: 120 });
  TweenMax.to(lg + 52, dur, { rotation: -140 });
}
function X() {
  var first = -1;
  var last = 64;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + 0, dur, { rotation: 25 });
  TweenMax.to(lg + 22, dur, { rotation: 180 });
  TweenMax.to(lg + 32, dur, { rotation: 130 });
  TweenMax.to(lg + 42, dur, { rotation: -180 });
}
function Y() {
  var first = 3;
  var last = 52;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(15, 22);
  var c2 = linkArr(32, 47);

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(lg + 4, dur, { rotation: -90 });
  TweenMax.to(lg + 14, dur, { rotation: -90 });
  TweenMax.to(c1, dur, { rotation: 90 / c1.length });
  TweenMax.to(lg + 27, dur, { rotation: 180 });
  TweenMax.to(c2, dur, { rotation: -180 / c2.length });
}
function Z() {
  var first = -1;
  var last = 51;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(lg + 10, dur, { rotation: -180 });
  TweenMax.to(lg + 20, dur, { rotation: 115 });
  TweenMax.to(lg + 42, dur, { rotation: -115 });
}

function DOT() {
  var first = 5;
  var last = 15;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  var c1 = linkArr(6, 15);

  TweenMax.to(lg + 0, dur, { rotation: 90 });
  TweenMax.to(lg + 5, dur, { rotation: -90 });
  TweenMax.to(c1, dur, { rotation: 1000 / c1.length });
}

function SPACE() {
  var first = -1;
  var last = 0;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + 0, dur, { rotation: 90 });
}

function DASH() {
  var first = 10;
  var last = 20;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + 10, dur, { rotation: 90 });
}

function SCORE() {
  var first = -1;
  var last = 11;
  var startArr = linkArr(0, first, l);
  TweenMax.to(startArr, dur, { autoAlpha: 0 });
  TweenMax.to(lg + last, dur, { autoAlpha: 0 });

  TweenMax.to(lg + 0, dur, { rotation: 90 });
}

function animateWord(word, delay) {
  var now_delay = 0;
  for (let index = 0; index < Math.min(word.length, numLetters); index++) {
    setTimeout(function () {
      if (word[index] == " ") animate(index, "space", delay);
      else animate(index, word[index], delay);
    }, now_delay * 1000);
    now_delay += delay / numLetters;
  }
  if (word.length < numLetters)
    for (let index = word.length; index < numLetters; index++) {
      setTimeout(function () {
        animate(index, "space", delay);
      }, now_delay * 1000);
      now_delay += delay / numLetters;
    }
}

function clearInput() {
  $("[id^=index]").val("");
  $("#index0").focus();
}

function getInput() {
  var inputText = "";
  for (let index = 0; index < numLetters; index++) {
    if ($("#index" + index).val() === "") inputText += " ";
    else inputText += $("#index" + index).val();
  }
  return inputText.trim();
}

function submitRequest() {
  $("#userInput").hide();
  clearInput();
  animateWord("loading data", 1);
  setTimeout(function () {
    $.ajax({
      url: "https://api.nia.ac.cn/investigation/code?s=" + getInput(),
      error: function () {
        animateWord("serv error", 1);
        setTimeout(function () {
          $("#userInput").show();
        }, 2000);
      },
      success: function (data) {
        if (data.error) {
          animateWord("input error", 1);
          setTimeout(function () {
            $("#userInput").show();
          }, 2000);
        } else {
          animateWord(data.data.code, 1);
          setTimeout(function () {
            $("#userInput").show();
          }, 2000);
        }
      },
    });
  }, 4000);
}
