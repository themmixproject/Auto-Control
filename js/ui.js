var selectedElements = [];

function toggleGroupSelector(event) {
    event.stopPropagation();

    var addGroupButton = document.getElementById(
        "autocontrol-add-element-group-button"
    );

    var selectorIsDisplayed = selectorsContainer.children.length > 0;
    if (selectorIsDisplayed) {
        selectorsContainer.innerHTML = "";

        addGroupButton.innerHTML = "Add Element";

        document.removeEventListener("click", processSingleSelectedElement);
        document.removeEventListener("mousemove", moveGroupOverlayToElement);
    } else {
        var elementSelector = document.createElement("div");
        // elementSelector.className = "autocontrol-selector";

        // var selectorLabel = document.createElement("div");
        // selectorLabel.className = "autocontrol-selector-label";
        // elementSelector.appendChild(selectorLabel);

        selectorsContainer.appendChild(elementSelector);

        addGroupButton.innerHTML = "Cancel";

        document.addEventListener("click", processGroupSelectedElements);
        document.addEventListener("mousemove", moveGroupOverlayToElement);
    }
}

function moveGroupOverlayToElement(event) {
    selectorsContainer.innerHTML = "";
    var hoverElement = getHoverElement(event);

    if (hoverElement == null) {
        return;
    }

    selectedElements = findElementGroup(hoverElement, 5);

    selectorsContainer.innerHTML = "";
    if (selectedElements != null) {
        renderSelectors(selectedElements, hoverElement);
    }
}

function renderSelectors(elements, hoverElement) {
    for (var i = 0; i < elements.length; i++) {
        var newSelector = document.createElement("div");
        newSelector.className = "autocontrol-selector";
        selectorsContainer.appendChild(newSelector);

        var overlayElement = elements[i];
        var boundingClientRect = overlayElement.getBoundingClientRect();
        newSelector.style.top = boundingClientRect.top + window.scrollY + "px";
        newSelector.style.left =
            boundingClientRect.left + window.scrollX + "px";
        newSelector.style.height = boundingClientRect.height + "px";
        newSelector.style.width = boundingClientRect.width + "px";

        if (overlayElement == hoverElement) {
            var selectorLabel = document.createElement("div");
            selectorLabel.className = "autocontrol-selector-label";
            selectorLabel.innerHTML = getCssSelector(hoverElement);

            newSelector.appendChild(selectorLabel);
        }
    }
}

function findElementGroup(originElement, maxDepth) {
    var depth = 0;
    var compareChild = originElement;
    var parent = originElement.parentElement;
    var children = parent.children;

    while (parent && parent != document.body && depth < maxDepth) {
        var matchingChildren = [];
        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if (isSameElement(compareChild, child)) {
                matchingChildren.push(child);
            }
        }

        if (matchingChildren.length > 1) {
            if (isSameElement(compareChild, originElement)) {
                return matchingChildren;
            }

            var elementGroup = [];
            var childQuery = getChildQuery(compareChild, originElement);

            for (var i = 0; i < matchingChildren.length; i++) {
                var originParent = matchingChildren[i];
                var matchingChild = originParent.querySelector(childQuery);

                elementGroup.push(matchingChild);
            }

            if (elementGroup.length > 1) {
                return elementGroup;
            }
        }

        compareChild = parent;
        parent = parent.parentElement;
        children = parent.children;
        depth++;
    }

    return null;
}

function isSameElement(element1, element2) {
    return (
        element1.className == element2.className &&
        element1.tagName.toLowerCase() == element2.tagName.toLowerCase() &&
        element1.getAttribute("style") == element2.getAttribute("style")
    );
}

function getChildQuery(parent, child) {
    let query = "";
    let currentElement = child;
    while (currentElement !== parent) {
        let tagName = currentElement.tagName.toLowerCase();
        let id = currentElement.id ? "#" + currentElement.id : "";
        let className = currentElement.className
            ? "." + currentElement.className.split(" ").join(".")
            : "";
        if (id || className) {
            query = " > " + tagName + id + className + query;
        } else {
            let index = Array.prototype.indexOf.call(
                currentElement.parentElement.children,
                currentElement
            );
            query = " > " + tagName + ":nth-child(" + (index + 1) + ")" + query;
        }
        currentElement = currentElement.parentElement;
    }
    return query.slice(3);
}

function processGroupSelectedElements() {
    generateCard(selectedElements);
}

function toggleSingleSelector(event) {
    event.stopPropagation();

    var addElementButton = document.getElementById(
        "autocontrol-add-element-button"
    );

    var selectorIsDisplayed = selectorsContainer.children.length > 0;
    if (selectorIsDisplayed) {
        selectorsContainer.innerHTML = "";

        addElementButton.innerHTML = "Add Element";

        document.removeEventListener("click", processSingleSelectedElement);
        document.removeEventListener("mousemove", moveSingleOverlayToElement);
    } else {
        var elementSelector = document.createElement("div");
        elementSelector.className = "autocontrol-selector";

        var selectorLabel = document.createElement("div");
        selectorLabel.className = "autocontrol-selector-label";
        elementSelector.appendChild(selectorLabel);

        selectorsContainer.appendChild(elementSelector);

        addElementButton.innerHTML = "Cancel";

        document.addEventListener("click", processSingleSelectedElement);
        document.addEventListener("mousemove", moveSingleOverlayToElement);
    }
}

function processSingleSelectedElement(event) {
    toggleSingleSelector(event);

    generateCard([selectedElement])

    // var listItemContent = generateElementCard(selectedElement);
    // var processObject = createProcessObject(listItemContent);
    // automationProcess.push(processObject);
}

function createProcessObject(listItemContent) {
    var elementQuery = elementToQuery(selectedElement);
    var processObject = {
        elementQuery: elementQuery,
        eventType: "",
    };

    var elementTag = selectedElement.tagName.toLowerCase();
    if (elementTag == "input") {
        processObject.eventType = "insert";
        processObject.input = listItemContent.getElementsByTagName("input")[0];
    } else if (elementTag == "div" || elementTag == "button") {
        processObject.eventType = "click";
    } else if (elementTag == "a") {
        processObject.eventType = "goto";
    }

    return processObject;
}

function elementToQuery(element) {
    let query = "";
    let current = element;
    while (current && current !== document) {
        let id = current.id ? "#" + current.id : "";
        let className = current.className
            ? "." + current.className.replace(/\s+/g, ".")
            : "";
        let nthChild = current.parentElement
            ? ":nth-child(" +
              (Array.prototype.indexOf.call(
                  current.parentElement.children,
                  current
              ) +
                  1) +
              ")"
            : "";
        query =
            current.tagName.toLowerCase() +
            id +
            className +
            nthChild +
            " " +
            query;
        current = current.parentElement;
    }
    return query.trim();
}

function moveSingleOverlayToElement(event) {
    var elementSelector = selectorsContainer.children[0];
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

    var elementSelectorLabel = elementSelector.children[0];
    elementSelectorLabel.innerHTML = getCssSelector(hoverElement);

    var selectorWidth = elementSelector.style.width.split("px")[0];
    var labelWidth = elementSelectorLabel.getBoundingClientRect().width;

    elementSelector.className = "autocontrol-selector";

    var hasLabelOverflow = labelWidth >= selectorWidth;
    if (hasLabelOverflow) {
        elementSelector.className += " labelOverflow";
    }
    elementSelectorLabel.style.maxWidth = selectorWidth + "px";
}

function getCssSelector(element) {
    var selector = element.nodeName.toLowerCase();
    if (element.id) {
        selector += "#" + element.id;
    }
    if (element.className) {
        selector += "." + element.className.trim().replace(/\s+/g, ".");
    }
    return selector;
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

function runAutomation() {
    for (var i = 0; i < automationProcess.length; i++) {
        var item = automationProcess[i];
        var eventElement = document.querySelector(item.elementQuery);
        if (item.eventType == "click") {
            var event = new Event("click");
            eventElement.dispatchEvent(event);
        } else if (item.eventType == "insert") {
            eventElement.value = item.input.value;
        } else {
            window.location.assign(eventElement.href);
        }
    }
}
