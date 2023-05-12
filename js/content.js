console.log("hello world!");

var appContainer = null;
var selectedElement = null;
var overlay = null;

appContainer = document.createElement("div");

function generateApp() {
    appContainer.innerHTML +=
        "<div class='autocontrol-overlay'></div>" +
        "<div id='autocontrol-window'>" +
        "<header id='autocontrol-window-header'>" +
        "Auto Control" +
        "<button id='autocontrol-window-close-button'>X</button>" +
        "</header>" +
        "<div id='autocontrol-window-content'>content" +
        "</div>";

    overlay = document.getElementsByClassName("autocontrol-overlay")[0];
    document.addEventListener("mousemove", moveOverlayToElement);

    document
        .getElementById("autocontrol-window-close-button")
        .addEventListener("click", function () {
            document.removeEventListener("click", setSelectedElement);
            document.removeEventListener("mousemove", moveOverlayToElement);
            document.body.removeChild(appContainer);

            selectedElement = null;
            appContainer = null;
            overlay = null;
        });

    document.addEventListener("click", setSelectedElement);
}

function moveOverlayToElement(event) {
    overlay.style.display = "none";

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
        overlay.style.display = "none";
        return;
    }

    overlay.style.display = "";
    selectedElement = hoverElement;

    var boundingClientRect = hoverElement.getBoundingClientRect();

    overlay.style.top = boundingClientRect.top + window.scrollY + "px";
    overlay.style.left = boundingClientRect.left + "px";

    overlay.style.height = boundingClientRect.height + "px";
    overlay.style.width = boundingClientRect.width + "px";
}

function setSelectedElement() {
    console.log(selectedElement);
}

chrome.runtime.onMessage.addListener(function (request, sender) {
    var firstChild = document.body.children[0]
    var lastChildIndex = firstChild.children.length - 1;
    if(firstChild.children[lastChildIndex].id != "autocontrol-window"){
        generateApp();
    }
});
