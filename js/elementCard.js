function generateGroupListItem(elements) {
    var listItem = document.createElement("li");
    listItem.className = "group-item";

    listItem.appendChild( generateGroupHeader(elements, listItem ));
    var groupContent = generateGroupContent();
    listItem.appendChild(groupContent);

    var groupSortable = new Sortable(groupContent, {
        group: "elementList",
        dataIdAttr: "ac-i"
    })


    var elementList = document.getElementById("ac-el-list");

    listItem.setAttribute("ac-i", elementList.children.length);
    groupContent.setAttribute("ac-i", elementList.children.length);
    
    elementList.appendChild(listItem);

    autocontrolProces.push(createGroupProcesObj(elements));
}

function generateGroupHeader(elements, listItem) {
    var header = document.createElement("header");
    header.className = "group-header";

    header.appendChild( generateGroupDetails(elements) )

    var baseElement = elements[0];
    header.appendChild( generateSimpleMainContent(baseElement, listItem) );

    return header;
}

function generateGroupDetails(elements) {
    var groupDetails = document.createElement("div");
    groupDetails.className = "group-details";

    groupDetails.innerHTML += `
    <div class="group-type-wrapper">
        <div class="group-type">group [${elements.length}]</div>
    </div>`;

    var tagName = elements[0].tagName.toLowerCase();
    groupDetails.innerHTML += generateActionTypeFromTagName(tagName);

    return groupDetails;
}

function generateGroupContent() {
    var groupContent = document.createElement("ul");
    groupContent.className = "group-content";

    return groupContent;
}

function generateSingleListItem(elements) {
    var element = elements[0];
    
    var listItem = document.createElement("li");
    listItem.className = "element-item";

    var tagName = element.tagName.toLowerCase();

    var actionType = generateActionTypeFromTagName(tagName);
    listItem.innerHTML += actionType;

    var listItemContent;
    if (tagName == "div" || tagName == "button") {
        listItemContent = generateSimpleMainContent(element, listItem);
    }
    else {
        listItemContent = generateContent(element, listItem);
    }
    listItem.appendChild(listItemContent);

    var elementList = document.getElementById("ac-el-list");

    listItem.setAttribute("ac-i", elementList.children.length);
    
    elementList.appendChild(listItem);

    autocontrolProces.push(createProcesObj(element, listItemContent));
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
        handleListItemDeletion(listItem);
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

if (window.location.hostname === "localhost") {
    loadApp();
    var demoButton = document.querySelector(
        "html body:nth-child(2) div#app:nth-child(2) div#card-container:nth-child(10) div.card:nth-child(4) button:nth-child(5)"
    );
    generateSingleListItem([demoButton]);

    var demoCard = document.getElementsByClassName("card")[0]
    generateSingleListItem([demoCard]);

    var demoAnchor = document.getElementById("link-container").getElementsByTagName("a")[0];
    generateSingleListItem([demoAnchor]);

    var buttonGroup = findElementGroup(demoButton, 5);
    generateGroupListItem(buttonGroup);

    var demoInput = document.querySelector("html body:nth-child(2) div#app:nth-child(2) input:nth-child(8)");
    generateSingleListItem([demoInput]);

    // for(var i = 0; i < buttonGroup.length; i++) {
    //     var button = buttonGroup[i];
    //     generateSingleListItem([button]);
    // }

    var mything = new Sortable(document.getElementById("ac-el-list"), {
        group: "elementList",
        dataIdAttr: "data-id",
        onSort: handleElementListSortChange
    });

    console.log(autocontrolProces);
}

function handleListItemDeletion(listItem) {
    var listItemParent = listItem.parentElement;
    
    var chldrenArr = [].slice.call( listItemParent.children );
    var elementIndex = chldrenArr.indexOf(listItem);

    var startIndex = 0;
    if (elementIndex > 0) {
        startIndex = elementIndex - 1;
    }
    listItem.remove();
    updateElementListItemIndexes(listItemParent, startIndex);

    var indexPath = getListIndexPath(listItemParent);
    var proces = getProcesFromIndexPath(indexPath);
    proces.splice(elementIndex, 1);
}

function handleElementListSortChange(event) {
    updateAutoControlProces(event);
    
    var targetList = event.to;
    var originList = event.from;
    var oldIndex = event.oldIndex;
    var newIndex = event.newIndex;
    updateElementListItemIndexes(originList, oldIndex);
    updateElementListItemIndexes(targetList, newIndex);
}

function updateAutoControlProces(event) {
    var originList = event.from;
    var targetList = event.to;
    var originPath = getListIndexPath(originList);
    var targetPath = getListIndexPath(targetList);
    var originProces = getProcesFromIndexPath(originPath);
    var targetProces = getProcesFromIndexPath(targetPath);

    var newIndex = event.newIndex;
    var oldIndex = event.oldIndex;
    var transferElement = originProces[oldIndex];
    insertElementAtIndex(targetProces, newIndex, transferElement);

    originProces.splice(oldIndex, 1);
}

function updateElementListItemIndexes(list, oldIndex, newIndex) {
    var listItems = list.children;
    if (listItems.length == 0) { return; }
    if (newIndex == undefined ) {
        newIndex = listItems.length -1;
    }
    
    var start = Math.min(oldIndex, newIndex);    
    var end = Math.max(oldIndex, newIndex);
    if (end > listItems.length - 1) {
        end = listItems.length - 1;
    }

    for (var i = start; i <= end; i++) {
        if (listItems[i].className == "group-item") {
            listItems[i].children[1].setAttribute("ac-i", i);
        }
        listItems[i].setAttribute("ac-i", i);
    }
}


function insertElementAtIndex(arr, index, element) {
    if (index === 0) {
        arr.unshift(element);
    }
    else if (index === arr.length - 1) {
        arr.push(element);
    }
    else {
        arr.splice(index, 0, element);
    }
}

function getProcesFromIndexPath(indexPath) {
    var proces = autocontrolProces;
    for (var i = 0; i <  indexPath.length; i++) {
        proces = proces[ indexPath[i] ].proces
    }

    return proces;
}

function getListIndexPath(groupParent) {
    var indexes = [];

    var rootList = document.getElementById("ac-el-list");
    while (groupParent != rootList) {
        if (groupParent.parentElement == rootList) { break; }

        indexes.push( parseInt(groupParent.getAttribute("ac-i")) );

        groupParent = groupParent.parentElement.parentElement;
    }

    return indexes.reverse();
}
