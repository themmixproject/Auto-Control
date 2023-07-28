//TODO: ADD EXCEPTIONS WITHIN ADAPTING ELEMENTS TO ADAPT THE BODY

console.log("hello world!");

let appContainer = null;
var selectedElement = null;
var overlay = null;
var selectorsContainer = null;
var selectorIsDisplayed = false;
var globalOffset = 200;
var adaptedElementsAreLoaded = false;
var isResizing = false;
var resizeStart = 0;

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

    appContainer.innerHTML +=
        "<div id='autocontrol-selectors-container'>" +
        "<div class='autocontrol-selector'></div>" +
        "</div>" +
        "<div id='autocontrol-panel' style='width: " +
        globalOffset +
        "px;'>" +
        "<div id='autocontrol-panel-resizer' style='position: fixed; left:" +
        globalOffset +
        "px;'></div>" +
        "<header id='autocontrol-panel-header' style='width: " +
        globalOffset +
        "px;'>" +
        "<div id='app-title-wrapper'>" +
        "<h1 id='app-title'>Auto Control</h1>" +
        "</div>" +
        "<div id='close-button-wrapper'>" +
        "<button id='close-button'>" +
        "<div id='close-button-icon' style='background-image: url(\"chrome-extension://" +
        extensionId +
        "/assets/cross.svg\")'></div>" +
        "</button>" +
        "</div>" +
        "</header>" +
        "<div id='autocontrol-panel-content'>" +
        "<div id='autocontrol-element-list'>" +
        "<div class='autocontrol-element-list-item-placeholder'></div>" +
        "</div>" +
        "</div>" +
        "<div id='autocontrol-bottom-nav' style='width: " +
        globalOffset +
        "'>" +
        "<h1>bottom nav</h1>" +
        "</div>" +
        "</div>";

    elementSelector = document.getElementsByClassName(
        "autocontrol-selector"
    )[0];

    document.getElementById("close-button").addEventListener("click", closeApp);

    // document
    //     .getElementById("autocontrol-add-element-button")
    //     .addEventListener("click", toggleSelector);

    document
        .getElementById("autocontrol-panel-resizer")
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

    setNavWidth();
}

function setNavWidth() {
    var panel = document.getElementById("autocontrol-panel");
    var header = document.getElementById("autocontrol-panel-header");
    var bottomNav = document.getElementById("autocontrol-bottom-nav");
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
    console.log(globalOffset);
    adaptBodyStyle();
    var autocontrolPanel = document.getElementById("autocontrol-panel");
    autocontrolPanel.style.width = globalOffset + "px";
    autocontrolPanel.style.marginLeft = -globalOffset + "px";

    var resizer = document.getElementById("autocontrol-panel-resizer");
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

function toggleSelector(event) {
    event.stopPropagation();

    var addElementButton = document.getElementById(
        "autocontrol-add-element-button"
    );

    if (selectorIsDisplayed) {
        addElementButton.innerHTML = "Add Element";

        elementSelector.style.display = "none";
        document.removeEventListener("click", selectElement);
        document.removeEventListener("mousemove", moveOverlayToElement);
    } else {
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

    var elementInfo = document.createElement("div");
    elementInfo.style.fontFamily = "monospace";
    elementInfo.style.overflow = "hidden";
    elementInfo.style.textOverflow = "ellipsis";
    elementInfo.style.whiteSpace = "nowrap";

    elementInfo.innerHTML =
        "<span style='color: blue'>" +
        element.tagName.toLowerCase() +
        "</span>";
    if (element.id) {
        elementInfo.innerHTML +=
            "<span style='color: green;'>#" + element.id + "</span>";
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

    var autoControlWindow = document.getElementById("autocontrol-panel");
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
    var firstChild = getFirstElement();
    extensionId = sender.id;

    if (firstChild == null) {
        alert("This document does not contain any elements");
        return;
    } else if (firstChild.children.length > 0) {
        var lastChildIndex = firstChild.children.length - 1;
        if (firstChild.children[lastChildIndex].id == "autocontrol-window") {
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
