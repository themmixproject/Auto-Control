function generateCard(elements) {
    var elementCard = document.createElement("div");
    elementCard.className = "ac-element-list-item item-group";

    var header = generateCardHeader(elements, elementCard);
    elementCard.append(header);

    var content = generateCardContent(elements);
    elementCard.appendChild(content);

    var elementList = document.getElementById("ac-element-list");
    elementList.appendChild(elementCard);

    return content;
}

function generateCardHeader(elements, elementCard) {
    var header = document.createElement("header");
    var baseElement = elements[0];

    var infoContainer = document.createElement("span");
    infoContainer.style.fontFamily = "monospace";
    infoContainer.style.overflow = "hidden";
    infoContainer.style.textOverflow = "ellipsis";
    infoContainer.style.whiteSpace = "nowrap";

    infoContainer.innerHTML =
        "<span style='color: blue'>" +
        baseElement.tagName.toLowerCase() +
        "</span>";
    if (baseElement.id) {
        infoContainer.innerHTML +=
            "<span style='color: green;'>#" + baseElement.id + "</span>";
    }
    if (baseElement.className) {
        infoContainer.innerHTML +=
            "<span style='color: red'>." + baseElement.className + "</span>";
    }
    if (elements.length > 1) {
        infoContainer.innerHTML += " [<span style='color: orange'>" + elements.length +"</span>]";
    }
    header.appendChild(infoContainer);

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function () {
        elementCard.remove();
    });
    
    header.appendChild(deleteButton);

    return header;
}

function generateCardContent(elements) {
    var baseElement = elements[0];
    var tag = baseElement.tagName.toLowerCase();
    
    var content = document.createElement("div");
    content.className = "content";
    content.innerHTML += generateActionDescription(tag);
    
    var conditionalContent = generateConditionalContent(tag, baseElement);
    if (conditionalContent != null) {
        content.appendChild(conditionalContent);
    }

    return content;
}

function generateActionDescription (tag) {
    var actionDescriber = "<span class='action-descriptor'>"

    if (tag == "a") {
        actionDescriber += "got to: ";
    }
    else if (tag == "div" || tag == "button") {
        actionDescriber += "action: </span>";
        return actionDescriber + "click";
    }
    else if (tag == "input") {
        actionDescriber += "insert value:";
    }

    return actionDescriber + "</span>";
}

function generateConditionalContent (tag, baseElement) {
    var content = null;
    if (tag == "a") {
        content = generateLinkContent(baseElement)
    }
    else if(tag == "input") {
        content = generateInputContent(baseElement);
    }

    return content;
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


if (window.location.hostname === "localhost") {
    loadApp();
    // var demoButton = document.querySelector(
    //     "html body:nth-child(2) div#app:nth-child(2) div#card-container:nth-child(9) div.card:nth-child(3) button:nth-child(5)"
    // );
        
    // var buttonGroup = findElementGroup(demoButton, 5);
    // generateCard(buttonGroup);
}
