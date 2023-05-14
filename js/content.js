console.log("hello world!");

var appContainer = null;
var selectedElement = null;
var overlay = null;
var selectorsContainer = null;
var selectorIsDisplayed = false;

function generateApp() {
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
        "<button id='autocontrol-add-element-button'>Add Element</button>" +
        "</div>";

    elementSelector = document.getElementsByClassName(
        "autocontrol-selector"
    )[0];


    document
        .getElementById("autocontrol-window-close-button")
        .addEventListener("click", closeApp);

    var addElementButton = document.getElementById(
        "autocontrol-add-element-button"
    );
    addElementButton.addEventListener("click", function () {
        if (selectorIsDisplayed) {
            document.removeEventListener("mousemove", moveOverlayToElement)
            document.removeEventListener("click", selectElement);

            addElementButton.innerHTML = "Add Element";
        } else {
            document.addEventListener("click", selectElement);
            document.addEventListener("mousemove", moveOverlayToElement)

            addElementButton.innerHTML = "Cancel";
        }

        selectorIsDisplayed = !selectorIsDisplayed;
    });
}

function selectElement() {
    if (selectedElement != null) {
        console.log(selectedElement);
    }
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
    elementSelector.style.left = boundingClientRect.left + "px";
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

    selectedElement = null;
    appContainer = null;
    overlay = null;
}

chrome.runtime.onMessage.addListener(function (request, sender) {
    var firstChild = document.body.children[0];
    var lastChildIndex = firstChild.children.length - 1;
    if (firstChild.children[lastChildIndex].id != "autocontrol-window") {
        generateApp();
    }
});
