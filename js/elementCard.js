function generateElementCard(element) {
    var elementListItem = document.createElement("div");
    elementListItem.className = "autocontrol-element-list-item";

    var listItemHeader = generateCardHeader(element, elementListItem);
    elementListItem.append(listItemHeader);

    var listItemContent = generateCardContent(element);
    elementListItem.appendChild(listItemContent);

    var elementList = document.getElementById("autocontrol-element-list");
    elementList.appendChild(elementListItem);

    return listItemContent;
}

function generateCardHeader(element, listItem) {
    var listItemHeader = document.createElement("header");

    var elementInfo = convertElementToStyledSelectorElement(element);
    listItemHeader.appendChild(elementInfo);

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function () {
        listItem.remove();
    });

    listItemHeader.appendChild(deleteButton);
    return listItemHeader;
}

function convertElementToStyledSelectorElement(element) {
    var elementInfo = document.createElement("span");
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

    return elementInfo;
}

function generateCardContent(element) {
    var contentContainer = document.createElement("div");
    contentContainer.className = "content";

    var actionDescriptor = document.createElement("span");
    actionDescriptor.className = "action-descriptor";

    var generatedElement = null;
    var elementTag = element.tagName.toLowerCase();
    if (elementTag === "a") {
        actionDescriptor.innerHTML += "go to: ";

        generatedElement = generateLinkContent(element);
    } else if (elementTag === "div" || elementTag === "button") {
        actionDescriptor.innerHTML += "action: ";

        generatedElement = generateClickActionContent();
    } else if (elementTag === "input") {
        actionDescriptor.innerHTML += "insert value: ";

        generatedElement = generateInputContent(element);
    }

    contentContainer.appendChild(actionDescriptor);
    contentContainer.appendChild(generatedElement);

    return contentContainer;
}

function generateLinkContent(element) {
    var linkElement = document.createElement("a");

    var url = new URL(element.href, window.location);
    if (url.protocol === "http:" || url.protocol === "https:") {
        linkElement.innerHTML += element.href;
        linkElement.href += element.href;
    } else {
        var root = window.location.origin;
        linkElement.innerHTML += root + element.href;
        linkElement.href += root + element.href;
    }
    linkElement.target = "_blank";

    return linkElement;
}

function generateClickActionContent() {
    var actionElement = document.createElement("span");
    actionElement.innerHTML += "click";

    return actionElement;
}

function generateInputContent(element) {
    var inputContainer = document.createElement("div");
    inputContainer.className = "input-container";

    var inputLabelWrapper = document.createElement("div");
    inputLabelWrapper.className = "label-wrapper";
    var inputLabel = document.createElement("label");
    inputLabel.innerHTML = element.placeholder;
    inputLabelWrapper.appendChild(inputLabel);

    inputContainer.appendChild(inputLabelWrapper);

    var input = document.createElement("input");
    inputContainer.appendChild(input);

    return inputContainer;
}
