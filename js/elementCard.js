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

function generateSingleListItem(elements) {
    var element = elements[0];

    var listItem = document.createElement("li");
    var itemContainer = document.createElement("div");
    itemContainer.className = "element-item";
    listItem.appendChild(itemContainer);

    var tagName = element.tagName.toLowerCase();
    
    var actionType = generateActionType(tagName);
    itemContainer.innerHTML += actionType;

    var listItemContent;
    if (tagName == "div" || tagName == "button") {
        listItemContent = generateSimpleContent(element, listItem);
    }
    else {
        listItemContent = generateContent(element, listItem);
    }
    itemContainer.appendChild(listItemContent);

    document.getElementById("ac-el-list").appendChild(listItem);
}

function generateActionType(tagName) {
    var actionString = "";

    if (tagName == "div" || tagName == "button") {
        actionString = "click";
    }
    else if (tagName == "a") {
        actionString = "goto";
    }
    else if (tagName == "input") {
        actionString = "insert";
    }

    return "<div class='action-type'>" + actionString + "</div>";
}

function generateSimpleContent (element, listItem) {
    var mainContent = document.createElement("div");
    mainContent.className = "main-content";

    mainContent.appendChild( generateElementDetails(element) )
    mainContent.appendChild( generateDeleteButton(listItem) );

    return mainContent;
}

function generateContent (element, listItem) {
    var contentContainer = document.createElement("div");
    contentContainer.className = "list-item-content";
    
    var mainContent = document.createElement("header");
    mainContent.className = "main-content";

    var elementDetails = generateElementDetails(element)
    mainContent.innerHTML += elementDetails.innerHTML;

    mainContent.appendChild( generateDeleteButton(listItem) );

    contentContainer.appendChild(mainContent);

    var actionContent = generateActionContent(element);
    contentContainer.appendChild(actionContent);

    return contentContainer;
}

function generateActionContent (element) {
    var actionContent = document.createElement("div");
    actionContent.className = "action-content";
    
    var tagName = element.tagName.toLowerCase();
    if (tagName == "input") {
        actionContent.appendChild( generateInputContent(element) );
    }
    else if (tagName == "a") {
        actionContent.innerHTML += generateAnchorContent(element);
    }

    return actionContent
}

function generateInputContent (element) {
    var input = document.createElement("input");
    input.type = "text";

    if (element.placeholder) {
        input.placeholder = element.placeholder;
    }

    return input;
}

function generateAnchorContent (element) {
        var anchorContent = "href: ";

        var anchor = document.createElement("a");
    
        var url = new URL(element.href, window.location);
        if (url.protocol === "http:" || url.protocol === "https:") {
            anchor.innerHTML += element.href;
            anchor.href += element.href;
        } else {
            var root = window.location.origin;
            anchor.innerHTML += root + element.href;
            anchor.href += root + element.href;
        }
        anchor.target = "_blank";

        anchorContent += anchor.outerHTML;
    
        return anchorContent;
}

function generateDeleteButton (listItem) {
    var deleteButton = document.createElement("button");
    deleteButton.className = "ac-delete-btn";
    deleteButton.innerHTML = "Delete";

    deleteButton.addEventListener("click", function(){
        listItem.remove();
    });

    return deleteButton;
}

function generateElementDetails (element) {
    var elementDetails = document.createElement("div");
    elementDetails.className = "element-details";
    
    elementDetails.class = "element-details";
    elementDetails.style.fontFamily = "monospace";
    elementDetails.style.overflow = "hidden";
    elementDetails.style.textOverflow = "ellipsis";
    elementDetails.style.whiteSpace = "nowrap";

    elementDetails.innerHTML =
        "<span style='color: blue'>" +
        element.tagName.toLowerCase() +
        "</span>";
    if (element.id) {
        elementDetails.innerHTML +=
            "<span style='color: green;'>#" + element.id + "</span>";
    }
    if (element.className) {
        elementDetails.innerHTML +=
            "<span style='color: red'>." + element.className + "</span>";
    }

    return elementDetails;
}