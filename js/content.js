console.log("hello world!");

var appContainer = null;
var selectedElement = null;
var overlay = null;
var selectorsContainer = null;
var selectorIsDisplayed = false;
var globalOffset = 100;

function generateApp() {
    adaptSiteContent();
    
    var currentSyle = document.body.getAttribute("style");
    document.body.setAttribute(
        "style",
        currentSyle + " margin-left: " + globalOffset + " !important"
    );

    appContainer = document.createElement("div");
    appContainer.style.display = "block";

    if (document.body.children.length > 0) {
        var firstChild = document.body.children[0];
        document.body.insertBefore(appContainer, firstChild);
    } else {
        document.body.appendChild(appContainer);
    }

    appContainer.innerHTML +=
        "<div id='autocontrol-selectors-container'>" +
        "<div class='autocontrol-selector'></div>" +
        "</div>" +
        "<div id='autocontrol-window'>" +
        "<header id='autocontrol-window-header'>" +
        "Auto Control" +
        "<button id='autocontrol-window-close-button'>X</button>" +
        "</header>" +
        "<div id='autocontrol-window-content'>" +
        "<div id='autocontrol-element-list'></div>" +
        "<button id='autocontrol-add-element-button'>Add Element</button>" +
        "</div>";

    elementSelector = document.getElementsByClassName(
        "autocontrol-selector"
    )[0];

    document
        .getElementById("autocontrol-window-close-button")
        .addEventListener("click", closeApp);

    document
        .getElementById("autocontrol-add-element-button")
        .addEventListener("click", toggleSelector);
}

function adaptSiteContent() {
    var allDivs  = document.getElementsByTagName("div");
    if (allDivs.length > 200) {
        adaptChildrenStyle(document.body, 5);
    } else {
        for (var i = 0; i < allDivs.length; i++) {
            var element = allDivs[i];
            if (
                element.tagName != "BR" &&
                element.tagName != "SCRIPT" &&
                element.tagName != "STYLE" &&
                element.tagName != "NOSCRIPT"
            ) {
                adaptElementStyle(element);
            }
            console.log()
        }
    }
}

var counter = 0;
function adaptChildrenStyle(node, level) {
    if (level == 0) {
        return;
    }
    for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        if (
            child.tagName != "BR" &&
            child.tagName != "SCRIPT" &&
            child.tagName != "STYLE" &&
            child.tagName != "NOSCRIPT"
        ) {
            adaptElementStyle(child);
            if (child.children.length > 0) {
                adaptChildrenStyle(child, level - 1);
            }
        }
    }
}

function adaptElementStyle(element) {
    var elementStyle = window.getComputedStyle(element);
    var zIndex = elementStyle.getPropertyValue("z-index");
    zIndex = parseInt(zIndex);
    if (zIndex > 1000000) {
        element.style.zIndex = 100000;
    }
    var left = elementStyle.getPropertyValue("left");
    var right = elementStyle.getPropertyValue("right");
    var position = elementStyle.getPropertyValue("position");

    if (position == "absoluste" || position == "fixed") {
        if (left === "0px" && !right) {
            element.style.right = "0px";
            element.style.left = globalOffset + "px";
        } else if (left) {
            element.style.left = parseInt(left) + globalOffset + "px";
        }
    }
}

function toggleSelector(event) {
    event.stopPropagation();

    var addElementButton = document.getElementById(
        "autocontrol-add-element-button"
    );

    console.log(selectorIsDisplayed);

    if (selectorIsDisplayed) {
        addElementButton.innerHTML = "Add Element";

        elementSelector.style.display = "none";
        document.removeEventListener("click", selectElement);
        document.removeEventListener("mousemove", moveOverlayToElement);
    } else {
        console.log("add");

        addElementButton.innerHTML = "Cancel";

        document.addEventListener("click", selectElement);
        document.addEventListener("mousemove", moveOverlayToElement);
    }

    selectorIsDisplayed = !selectorIsDisplayed;
}

function selectElement(event) {
    if (selectedElement != null) {
        generateElementListItem(selectedElement);
    }
    toggleSelector(event);
}

function generateElementListItem(element) {
    var elementList = document.getElementById("autocontrol-element-list");

    var elementListItem = document.createElement("div");
    elementListItem.className = "autocontrol-element-list-item";

    var elementInfo = document.createElement("span");
    elementInfo.style.fontFamily = "monospace";
    elementInfo.style.fontSize = "16px";

    elementInfo.innerHTML =
        "<span style='color: blue'>" +
        element.tagName.toLowerCase() +
        "</span>";
    if (element.id) {
        elementInfo.innerHTML +=
            "<span style='color: green'>#" + element.id + "</span>";
    }
    if (element.className) {
        elementInfo.innerHTML +=
            "<span style='color: red'>." + element.className + "</span>";
    }
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
        elementListItem.remove();
    });

    elementListItem.appendChild(elementInfo);
    elementListItem.appendChild(deleteButton);
    elementList.appendChild(elementListItem);
}

function moveOverlayToElement(event) {
    elementSelector.style.display = "none";

    var hoverElement = getHoverElement(event);
    if (hoverElement == null) {
        selectedElement = null;
        return;
    }

    selectedElement = hoverElement;
    elementSelector.style.display = "";

    var boundingClientRect = hoverElement.getBoundingClientRect();
    elementSelector.style.top = boundingClientRect.top + window.scrollY + "px";
    elementSelector.style.left =
        boundingClientRect.left + window.scrollX + "px";
    elementSelector.style.height = boundingClientRect.height + "px";
    elementSelector.style.width = boundingClientRect.width + "px";
}

function getHoverElement(event) {
    var hoverElement = document.elementFromPoint(
        event.pageX - window.scrollX,
        event.pageY - window.scrollY
    );

    var autoControlWindow = document.getElementById("autocontrol-window");
    var isWindow =
        autoControlWindow.contains(hoverElement) ||
        hoverElement == autoControlWindow;

    if (
        hoverElement == null ||
        hoverElement == document.body ||
        hoverElement == document.documentElement ||
        isWindow
    ) {
        return null;
    } else {
        return hoverElement;
    }
}

function closeApp() {
    document.removeEventListener("click", selectElement);
    document.removeEventListener("mousemove", moveOverlayToElement);
    document.body.removeChild(appContainer);

    overlay = null;
    appContainer = null;
    selectedElement = null;
    selectorIsDisplayed = false;
}

chrome.runtime.onMessage.addListener(function (request, sender) {
    var firstChild = getFirstElement();

    if (firstChild == null) {
        alert("This document does not contain any elements");
        return;
    } else if (firstChild.children.length > 0) {
        var lastChildIndex = firstChild.children.length - 1;
        if (firstChild.children[lastChildIndex].id == "autocontrol-window") {
            return;
        }
    }

    generateApp();
});

function getFirstElement() {
    var firstElement = document.body.firstElementChild;
    while (
        firstElement &&
        (firstElement.tagName === "SCRIPT" ||
            firstElement.tagName === "STYLE" ||
            firstElement.tagName === "NOSCRIPT")
    ) {
        firstElement = firstElement.nextElementSibling;
    }
    if (!firstElement) {
        return null;
    }
    return firstElement;
}
