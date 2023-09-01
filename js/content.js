let appContainer = null;
var selectedElement = null;
var elementSelector = null;
var elementSelectorLabel = null;
var selectorsContainer = null;
var globalOffset = 200;
var adaptedElementsAreLoaded = false;
var isResizing = false;
var resizeStart = 0;

var automationProcess = [];

var adaptedElements = [];

var extensionId = "";

function loadApp() {
    adaptSiteContent();

    appContainer = document.createElement("div");
    if (document.body.children.length > 0) {
        var firstChild = document.body.children[0];
        document.body.insertBefore(appContainer, firstChild);
    } else {
        document.body.appendChild(appContainer);
    }
    appContainer.style.display = "block";

    appendAppHTML();
    addInitialEventListeners();
    setNavWidth();

    selectorsContainer = document.getElementById("ac-selectors-container");
}

function appendAppHTML() {
    appContainer.innerHTML += `
    <div id="ac-selectors-container"></div>
    <div id="ac-panel" style="width: ${globalOffset}px;">
        <div id="ac-panel-resizer" style="position: fixed; left: ${globalOffset}px;"></div>
        <header id="ac-panel-header" style="width: ${globalOffset}px;">
            <div id="title-wrapper">
                <h1>Auto Control</h1>
            </div>
            <div id="close-button-wrapper">
                <button id="close-button">
                    <div id="close-button-icon" style="background-image: url('chrome-extension://${extensionId}/assets/cross.svg')"></div>
                </button>
            </div>
        </header>
        <ul id="ac-el-list"></ul>
        <div id="ac-bottom-nav" style="width: ${globalOffset}px;">
            <button id="ac-add-element-group-button">Add Group</button>
            <button id="ac-add-element-button">Add Element</button>
            <button id="ac-run-button">Run</button>
        </div>
    </div>`;
}

function addInitialEventListeners() {
    document.getElementById("close-button").addEventListener("click", closeApp);

    document
        .getElementById("ac-add-element-group-button")
        .addEventListener("click", toggleGroupSelector);

    document
        .getElementById("ac-add-element-button")
        .addEventListener("click", toggleSingleSelector);

    document
        .getElementById("ac-run-button")
        .addEventListener("click", runAutomation);

    document
        .getElementById("ac-panel-resizer")
        .addEventListener("mousedown", function (event) {
            isResizing = true;
            resizeStart = event.clientX;
        });

    document.addEventListener("mouseup", function (event) {
        if (isResizing) {
            event.preventDefault();
            isResizing = false;
            document.body.style.cursor = null;
        }
    });

    document.addEventListener("mousemove", function (event) {
        if (isResizing) {
            event.preventDefault();
            resizePanel(event.clientX);
        }
    });
}

function setNavWidth() {
    var panel = document.getElementById("ac-panel");
    var header = document.getElementById("ac-panel-header");
    var bottomNav = document.getElementById("ac-bottom-nav");
    var hasScrollbar = panel.scrollHeight > panel.clientHeight;
    header.style.width =
        (hasScrollbar ? globalOffset - 17 : globalOffset) + "px";
    bottomNav.style.width =
        (hasScrollbar ? globalOffset - 17 : globalOffset) + "px";
}

function resizePanel(clientX) {
    var newGlobalOffset = globalOffset + clientX - globalOffset;
    if (newGlobalOffset > 200) {
        globalOffset = newGlobalOffset;
    }

    adaptBodyStyle();

    var autocontrolPanel = document.getElementById("ac-panel");
    autocontrolPanel.style.width = globalOffset + "px";
    autocontrolPanel.style.marginLeft = -globalOffset + "px";

    var resizer = document.getElementById("ac-panel-resizer");
    resizer.style.cursor = "w-resize";
    resizer.style.left = globalOffset + "px";

    setNavWidth();

    document.body.style.cursor = "w-resize";
}

function adaptSiteContent() {
    if (adaptedElements.length > 0) {
        adaptedElements.forEach(function (adaptedElement) {
            adaptElementStyle(adaptedElement.element);
        });
    } else {
        let allDivs = document.getElementsByTagName("div");
        if (allDivs.length > 200) {
            adaptChildrenStyle(document.body, 5);
        } else {
            adaptAllDivs(allDivs);
        }

        var currentBodyStyle = document.body.getAttribute("style");
        adaptedElements.push({
            element: document.body,
            originalStyle: currentBodyStyle,
        });
    }

    adaptBodyStyle();
}

function adaptAllDivs(divs) {
    for (var i = 0; i < divs.length; i++) {
        var element = divs[i];
        if (!["BR", "SCRIPT", "STYLE", "NOSCRIPT"].includes(element.tagName)) {
            adaptElementStyle(element);
        }
    }
}

function adaptBodyStyle() {
    document.body.style.marginLeft = null;
    var currentBodyStyle = document.body.getAttribute("style");
    document.body.setAttribute(
        "style",
        (currentBodyStyle ? currentBodyStyle + " " : "") +
            "margin-left:" +
            globalOffset +
            "px !important;"
    );
}

function adaptChildrenStyle(node, level) {
    if (level == 0) {
        return;
    }
    for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        if (!["BR", "SCRIPT", "STYLE", "NOSCRIPT"].includes(child.tagName)) {
            var originalStyle = child.getAttribute("style");
            adaptedElements.push({
                element: child,
                originalStyle: originalStyle,
            });

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

function closeApp() {
    document.removeEventListener("click", selectElement);
    document.removeEventListener("mousemove", moveOverlayToElement);
    document.body.removeChild(appContainer);

    appContainer = null;
    selectedElement = null;

    resetElementsToOriginalStyle();
}

function resetElementsToOriginalStyle() {
    for (var i = 0; i < adaptedElements.length; i++) {
        var adaptedElement = adaptedElements[i];
        if (adaptedElement.originalStyle) {
            adaptedElement.element.setAttribute(
                "style",
                adaptedElement.originalStyle
            );
        } else {
            adaptedElement.element.removeAttribute("style");
        }
    }
}

chrome.runtime.onMessage.addListener(function (request, sender) {
    extensionId = sender.id;
    var firstChild = getFirstElement();

    if (firstChild == null) {
        alert("This document does not contain any elements");
        return;
    } else if (firstChild.children.length > 0) {
        var lastChildIndex = firstChild.children.length - 1;
        if (firstChild.children[lastChildIndex].id == "ac-window") {
            return;
        }
    }

    loadApp();
});

function getFirstElement() {
    var firstElement = document.body.firstElementChild;
    while (
        firstElement &&
        ["BR", "SCRIPT", "STYLE", "NOSCRIPT"].includes(firstElement.tagName)
    ) {
        firstElement = firstElement.nextElementSibling;
    }
    if (!firstElement) {
        return null;
    }
    return firstElement;
}

