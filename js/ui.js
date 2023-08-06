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
    if (selectedElement == null) {
        toggleSelector(event);
        return;
    }
    
    var listItemContent = generateElementListItem(selectedElement);

    var elementQuery = elementToQuery(selectedElement);
    var processObject = {
        elementQuery: elementQuery,
        eventType: ""
    };

    var elementTag = selectedElement.tagName.toLowerCase();
    if(elementTag == "input"){
        processObject.eventType = "insert";
        processObject.input = listItemContent.getElementsByTagName("input")[0];
    }
    else if(elementTag == "div" || elementTag == "button"){
        processObject.eventType = "click";
    }
    else if(elementTag == "a"){
        processObject.eventType = "goto";
    }
    
    automationProcess.push(processObject);
}


function elementToQuery(element) {
    let query = "";
    let current = element;
    while (current && current !== document) {
        let id = current.id ? "#" + current.id : "";
        let className = current.className ? "." + current.className.replace(/\s+/g, ".") : "";
        let nthChild = current.parentElement ? ":nth-child(" + (Array.prototype.indexOf.call(current.parentElement.children, current) + 1) + ")" : "";
        query = current.tagName.toLowerCase() + id + className + nthChild + " " + query;
        current = current.parentElement;
    }
    return query.trim();
}

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

function moveOverlayToElement(event) {
    elementSelector.style.display = "none";

    var hoverElement = getHoverElement(event);
    if (
        hoverElement == null ||
        !["a", "div", "button", "input"].includes(
            hoverElement.tagName.toLowerCase()
        )
    ) {
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

function runAutomation(){
    for(var i = 0; i < automationProcess.length; i++){
        var item = automationProcess[i];
        var eventElement = document.querySelector(item.elementQuery);
        if(item.eventType == "click"){
            var event = new Event("click");
            eventElement.dispatchEvent(event);
        }
        else if(item.eventType == "insert"){
            eventElement.value = item.input.value;
        }
        else{
            window.location.assign(eventElement.href); 
        }
    }
}
