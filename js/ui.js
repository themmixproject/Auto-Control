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
    console.log("generate");

    var elementListItem = document.createElement("div");
    elementListItem.className = "autocontrol-element-list-item";
    
    var listItemHeader = document.createElement("header");
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


    listItemHeader.appendChild(elementInfo);
    elementListItem.appendChild(listItemHeader);
    
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function () {
        elementListItem.remove();
    });
    listItemHeader.appendChild(deleteButton);

    elementListItem.append(listItemHeader);

    var elementList = document.getElementById("autocontrol-element-list");
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
