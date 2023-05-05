console.log("hello world!");

var overlay = document.createElement("div");
overlay.className = "autocontrol-overlay";
document.body.appendChild(overlay);
overlay.style.display = "none";


var selectedElement = null;

document.addEventListener("mousemove", function (event) {
    overlay.style.display = "none";

    var hoverElement = document.elementFromPoint(
        event.pageX - window.scrollX,
        event.pageY - window.scrollY
    );
    if(hoverElement == document.body || hoverElement == document.documentElement){
        console.log("stop run")
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
