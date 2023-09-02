if (window.location.hostname === "localhost") {
    loadApp();
    // var demoButton = document.querySelector(
    //     "html body:nth-child(2) div#app:nth-child(2) div#card-container:nth-child(9) div.card:nth-child(3) button:nth-child(5)"
    // );

    // var buttonGroup = findElementGroup(demoButton, 5);
    // generateCard(buttonGroup);
}

function generateGroupListItem(elements) {
    var listItem = document.createElement("li");
    var groupItem = document.createElement("div");
    groupItem.className = "group-item";
    listItem.appendChild(groupItem);

    groupItem.appendChild( generateGroupHeader(elements, groupItem ));
    groupItem.innerHTML += "<div class='group-content'>placeholder content</div>";

    document.getElementById("ac-el-list").appendChild(listItem);
}

function generateGroupHeader(elements, groupItem) {
    var header = document.createElement("header");
    header.className = "group-header";

    header.appendChild( generateGroupDetails(elements) )

    var baseElement = elements[0];
    header.appendChild( generateSimpleMainContent(baseElement, groupItem) );

    return header;
}

function generateGroupDetails(elements) {
    var groupDetails = document.createElement("dev");
    groupDetails.className = "group-details";

    groupDetails.innerHTML += `
    <div class="group-type-wrapper">
        <div class="group-type">group [${elements.length}]</div>
    </div>`;

    var tagName = elements[0].tagName.toLowerCase();
    groupDetails.innerHTML += generateActionTypeFromTagName(tagName);


    return groupDetails;
}

function generateSingleListItem(elements) {
    var element = elements[0];

    var listItem = document.createElement("li");
    var itemContainer = document.createElement("div");
    itemContainer.className = "element-item";
    listItem.appendChild(itemContainer);

    var tagName = element.tagName.toLowerCase();

    var actionType = generateActionTypeFromTagName(tagName);
    itemContainer.innerHTML += actionType;

    var listItemContent;
    if (tagName == "div" || tagName == "button") {
        listItemContent = generateSimpleMainContent(element, listItem);
    }
    else {
        listItemContent = generateContent(element, listItem);
    }
    itemContainer.appendChild(listItemContent);

    document.getElementById("ac-el-list").appendChild(listItem);
}

function generateActionTypeFromTagName(tagName) {
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

function generateSimpleMainContent (element, listItem) {
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

function generateActionContent(element) {
    var actionContent = document.createElement("div");
    actionContent.className = "action-content";

    var tagName = element.tagName.toLowerCase();
    if (tagName == "input") {
        actionContent.appendChild(generateInputContent(element));
    }
    else if (tagName == "a") {
        actionContent.innerHTML += generateAnchorContent(element);
    }

    return actionContent;
}

function generateInputContent(element) {
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
    }
    else {
        var root = window.location.origin;
        anchor.innerHTML += root + element.href;
        anchor.href += root + element.href;
    }
    anchor.target = "_blank";

    anchorContent += anchor.outerHTML;

    return anchorContent;
}

function generateDeleteButton(listItem) {
    var deleteButton = document.createElement("button");
    deleteButton.className = "ac-delete-btn";
    deleteButton.innerHTML = "Delete";

    deleteButton.addEventListener("click", function () {
        listItem.remove();
    });

    return deleteButton;
}

function generateElementDetails(element) {
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
