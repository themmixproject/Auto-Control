function generateCard(elements) {
    // console.log("elements: ", elements);

    var elementCard = document.createElement("div");
    elementCard.className = "autocontrol-element-list-item item-group";

    var header = generateCardHeader(elements, elementCard);
    elementCard.append(header);

    var content = generateCardContent(elements);
    elementCard.appendChild(content);

    var elementList = document.getElementById("autocontrol-element-list");
    elementList.appendChild(elementCard);

    return content;
}

function generateCardHeader(elements, elementCard) {
    var header = document.createElement("header");
    var baseElement = elements[0];

    console.log("baseElement: ", baseElement);

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

    var content = document.createElement("div");
    content.className = "content";
    
    var tag = baseElement.tagName.toLowerCase();
    
    content.innerHTML += generateActionDescription(tag);
    
    var conditionalContent = generateConditionalContent(tag);
    if (conditionalContent != null) {
        content.appendChild(conditionalContent);
    }

    return content;
}

function generateActionDescription (tag) {
    var actionDescriber = document.createElement("span");
    actionDescriber.className = "action-descriptor";

    if (tag == "a") {
        actionDescriber.innerHTML += "got to: ";
    }
    else if (tag == "div" || tag == "button") {
        actionDescriber.innerHTML += "action: ";
        return actionDescriber.outerHTML + "click";
    }
    else if (tag == "input") {
        actionDescriber.innerHTML += "insert value";
    }

    return actionDescriber.outerHTML;
}

function generateConditionalContent (tag) {
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

// function generateGroupCardHeader(elements, listItem) {
//     var listItemHeader = document.createElement("header");
//     var baseElement = elements[0];

//     var infoContainer = document.createElement("span");
//     infoContainer.style.fontFamily = "monospace";
//     infoContainer.style.overflow = "hidden";
//     infoContainer.style.textOverflow = "ellipsis";
//     infoContainer.style.whiteSpace = "nowrap";

//     infoContainer.innerHTML =
//     "<span style='color: blue'>" +
//     baseElement.tagName.toLowerCase() +
//     "</span>";
//     if (baseElement.id) {
//         infoContainer.innerHTML +=
//         "<span style='color: green;'>#" + baseElement.id + "</span>";
//     }
//     if (baseElement.className) {
//         infoContainer.innerHTML +=
//         "<span style='color: red'>." + baseElement.className + "</span>";
//     }
//     infoContainer.innerHTML += " [<span style='color: orange'>" + elements.length +"</span>]";
//     listItemHeader.appendChild(infoContainer);

//     var deleteButton = document.createElement("button");
//     deleteButton.textContent = "Delete";
//     deleteButton.className = "delete-button";
//     deleteButton.addEventListener("click", function () {
//         listItem.remove();
//     });
//     listItemHeader.appendChild(deleteButton);

//     return listItemHeader;

// }

// function generateElementCard(element) {
//     var elementListItem = document.createElement("div");
//     elementListItem.className = "autocontrol-element-list-item";

//     var listItemHeader = generateCardHeader(element, elementListItem);
//     elementListItem.append(listItemHeader);

//     var listItemContent = generateCardContent(element);
//     elementListItem.appendChild(listItemContent);

//     var elementList = document.getElementById("autocontrol-element-list");
//     elementList.appendChild(elementListItem);

//     return listItemContent;
// }

// function generateCardHeader(element, listItem) {
//     var listItemHeader = document.createElement("header");

//     var elementInfo = convertElementToStyledSelectorElement(element);
//     listItemHeader.appendChild(elementInfo);

//     var deleteButton = document.createElement("button");
//     deleteButton.textContent = "Delete";
//     deleteButton.className = "delete-button";
//     deleteButton.addEventListener("click", function () {
//         listItem.remove();
//     });

//     listItemHeader.appendChild(deleteButton);
//     return listItemHeader;
// }

// function convertElementToStyledSelectorElement(element) {
//     var elementInfo = document.createElement("span");
//     elementInfo.style.fontFamily = "monospace";
//     elementInfo.style.overflow = "hidden";
//     elementInfo.style.textOverflow = "ellipsis";
//     elementInfo.style.whiteSpace = "nowrap";

//     elementInfo.innerHTML =
//         "<span style='color: blue'>" +
//         element.tagName.toLowerCase() +
//         "</span>";]
//     if (element.id) {
//         elementInfo.innerHTML +=
//             "<span style='color: green;'>#" + element.id + "</span>";
//     }
//     if (element.className) {
//         elementInfo.innerHTML +=
//             "<span style='color: red'>." + element.className + "</span>";
//     }

//     return elementInfo;
// }

// function generateCardContent(element) {
//     var contentContainer = document.createElement("div");
//     contentContainer.className = "content";

//     var actionDescriptor = document.createElement("span");
//     actionDescriptor.className = "action-descriptor";

//     var generatedElement = null;
//     var elementTag = element.tagName.toLowerCase();
//     if (elementTag === "a") {
//         actionDescriptor.innerHTML += "go to: ";

//         generatedElement = generateLinkContent(element);
//     } else if (elementTag === "div" || elementTag === "button") {
//         actionDescriptor.innerHTML += "action: ";

//         generatedElement = generateClickActionContent();
//     } else if (elementTag === "input") {
//         actionDescriptor.innerHTML += "insert value: ";

//         generatedElement = generateInputContent(element);
//     }

//     contentContainer.appendChild(actionDescriptor);
//     contentContainer.appendChild(generatedElement);

//     return contentContainer;
// }

// function generateLinkContent(element) {
//     var linkElement = document.createElement("a");

//     var url = new URL(element.href, window.location);
//     if (url.protocol === "http:" || url.protocol === "https:") {
//         linkElement.innerHTML += element.href;
//         linkElement.href += element.href;
//     } else {
//         var root = window.location.origin;
//         linkElement.innerHTML += root + element.href;
//         linkElement.href += root + element.href;
//     }
//     linkElement.target = "_blank";

//     return linkElement;
// }

// function generateClickActionContent() {
//     var actionElement = document.createElement("span");
//     actionElement.innerHTML += "click";

//     return actionElement;
// }

// function generateInputContent(element) {
//     var inputContainer = document.createElement("div");
//     inputContainer.className = "input-container";

//     var inputLabelWrapper = document.createElement("div");
//     inputLabelWrapper.className = "label-wrapper";
//     var inputLabel = document.createElement("label");
//     inputLabel.innerHTML = element.placeholder;
//     inputLabelWrapper.appendChild(inputLabel);

//     inputContainer.appendChild(inputLabelWrapper);

//     var input = document.createElement("input");
//     inputContainer.appendChild(input);

//     return inputContainer;
// }

if (window.location.hostname === 'localhost') {
    loadApp();

    var demoButton = document.querySelector(
        "html body:nth-child(2) div#app:nth-child(2) div#card-container:nth-child(9) div.card:nth-child(3) button:nth-child(5)"
    );
    console.log(findElementGroup(demoButton, 5));
    
    var buttonGroup = findElementGroup(demoButton, 5);
    generateCard(buttonGroup);

}
