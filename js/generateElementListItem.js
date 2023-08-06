function generateElementListItem(element) {
    var elementListItem = document.createElement("div");
    elementListItem.className = "autocontrol-element-list-item";

    var listItemHeader = generateListItemHeader(element, elementListItem);
    elementListItem.append(listItemHeader);

    var listItemContent = generateListItemContent(element);
    elementListItem.appendChild(listItemContent);

    var elementList = document.getElementById("autocontrol-element-list");
    elementList.appendChild(elementListItem);

    return listItemContent;
}

function generateListItemHeader(element, listItem){
    var listItemHeader = document.createElement("header");
    
    var elementInfo = generateElementInfo(element);
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

function generateElementInfo(element){
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

    return elementInfo;
}


function generateListItemContent(element){
    var listItemContent = document.createElement("div");
    listItemContent.className = "content";

    var actionDescriptor = document.createElement("span");
    actionDescriptor.className = "action-descriptor";

    var elementTag = element.tagName.toLowerCase();
    if(elementTag === "a"){
        actionDescriptor.innerHTML += "go to: ";
        listItemContent.appendChild(actionDescriptor);

        var linkElement = document.createElement("a");

        var url = new URL(element.href, window.location);
        if(url.protocol === "http:" || url.protocol === "https:"){ // check if the protocol is http or https
            linkElement.innerHTML += element.href;
            linkElement.href += element.href;
        }
        else {
            var root = window.location.origin;
            linkElement.innerHTML += root + element.href;
            linkElement.href += root + element.href;
        }
        linkElement.target = "_blank";
        
        listItemContent.appendChild(linkElement);
    }
    else if(elementTag === "div" || elementTag === "button"){
        actionDescriptor.innerHTML += "action: ";
        listItemContent.appendChild(actionDescriptor);

        listItemContent.innerHTML += "click";
    }
    else if(elementTag === "input"){
        actionDescriptor.innerHTML += "insert value: ";
        listItemContent.appendChild(actionDescriptor);

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

        listItemContent.appendChild(inputContainer);
    }

    return listItemContent;
}
