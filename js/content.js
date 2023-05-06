console.log("hello world!");

var appContainer = document.createElement("div");
document.body.prepend(appContainer);
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

    var selectedElement = null;

    var overlay = document.getElementsByClassName("autocontrol-overlay")[0];
    document.addEventListener("mousemove", function (event) {
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
    });

    document
        .getElementById("autocontrol-window-close-button")
        .addEventListener("click", function () {
            console.log("close Auto Control window");
        });

    document.addEventListener("click", function (event) {
        console.log(selectedElement);
    });
}

generateApp();
