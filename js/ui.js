var selectedElements = [];

function enableSelectors(procesMethod, moveOverlayMethod) {
    document.addEventListener("click", procesMethod);
    document.addEventListener("mousemove", moveOverlayMethod);

    var panelOverlay = document.getElementById("ac-panel-overlay");
    panelOverlay.addEventListener("click", function () { 
        disableSelectors(procesMethod, moveOverlayMethod)
    });
    panelOverlay.style.display = "block";
}

function disableSelectors(procesMethod, moveOverlayMethod) {
    selectorsContainer.innerHTML = "";

    document.removeEventListener("click", procesMethod);
    document.removeEventListener("mousemove", moveOverlayMethod);

    var panelOverlay = document.getElementById("ac-panel-overlay");
    panelOverlay.removeEventListener("click", disableSelectors);
    panelOverlay.removeAttribute("style");
}

function moveGroupOverlayToElement(event) {
    selectorsContainer.innerHTML = "";
    var hoverElement = getHoverElement(event);
    if (hoverElement == null) {
        selectedElements = null;
        return;
    }
    
    selectedElements = findElementGroup(hoverElement, 5);

    if (selectedElements != null) {
        renderSelectors(selectedElements, hoverElement);
    }
}

function renderSelectors(elements, hoverElement) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var elementBoundingClient = element.getBoundingClientRect;
        var selector = generateSelector( elementBoundingClient );
        
        if (element == hoverElement) {
            var label = renderLabel(selector, hoverElement);
            handleLabelOverflow(selector, label, elementBoundingClient);
        }
    }
}

function renderLabel(selector, hoverElement) {
    var label = document.createElement("div");
    label.className = "ac-selector-label";
    label.innerHTML = getCssSelector(hoverElement);

    selector.appendChild(label);
    selector.className += " has-label";

    return label;
}

function handleLabelOverflow(selector, label, elementBoundingClient) {
    var selectorBoundingClient = selector.getBoundingClientRect();
    if (selectorBoundingClient.width > elementBoundingClient.width) {
        label.style.width = elementBoundingClient.width + "px";
        selector.className += " label-overflow";
    }
}

function generateLabel(hoverElement) {


    return label;
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

function generateSelector(elementBoundingClient) {
    var selector = document.createElement("div");
    selector.className = "ac-selector";

    selector.style.top = elementBoundingClient.top + window.scrollY + "px";
    selector.style.left = elementBoundingClient.left + window.scrollX + "px";
    selector.style.height = elementBoundingClient.height + "px";
    selector.style.width = elementBoundingClient.width + "px";

    return selector;
}


function findElementGroup(originElement, maxDepth) {
    var depth = 0;
    var compareChild = originElement;
    var parent = originElement.parentElement;
    var children = parent.children;

    while (parent && parent != document.body && depth < maxDepth) {
        var matchingChildren = getMatchingChildren(children, compareChild);

        var elementGroup = getElementGroup(
          matchingChildren,
          compareChild, 
          originElement
        );
        if (elementGroup.length > 1) {
          return elementGroup;
        }

        compareChild = parent;
        parent = parent.parentElement;
        children = parent.children;
        depth++;
    }

    return null;
}

function getMatchingChildren(children, compareChild) {
    var matchingChildren = [];
    for (var i = 0; i < children.length; i++) {
        var child = children[i];

        if (isSameElement(compareChild, child)) {
            matchingChildren.push(child);
        }
    }

    return matchingChildren;
}

function isSameElement(element1, element2) {
    return (
        element1.className == element2.className &&
        element1.tagName.toLowerCase() == element2.tagName.toLowerCase() &&
        element1.getAttribute("style") == element2.getAttribute("style")
    );
}

function getElementGroup(matchingChildren, compareChild, originElement) {
    if (isSameElement(compareChild, originElement)) {
        return matchingChildren;
    }

    var elementGroup = [];
    var childQuery = getChildQuery(compareChild, originElement);
    for (var i = 0; i < matchingChildren.length; i++) {
        var originParent = matchingChildren[i];
        var matchingChild = originParent.querySelector(childQuery);
        
        if (matchingChild != null) {
            elementGroup.push(matchingChild);
        }
    }

    return elementGroup;
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
    if (selectedElements == null) { return; }

    disableSelectors(processGroupSelectedElements, moveGroupOverlayToElement);
    generateGroupListItem(selectedElements);
}

function processSingleSelectedElement() {
    if (selectedElements == null) { return; }
    
    disableSelectors(processSingleSelectedElement, moveSingleOverlayToElement);
    generateSingleListItem(selectedElements)
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
    selectorsContainer.innerHTML = "";
    var hoverElement = getHoverElement(event);

    if (
        hoverElement == null ||
        !["a", "div", "button", "input"].includes(
            hoverElement.tagName.toLowerCase()
        )
    ) {
        selectedElements = null;
        return;
    }

    selectedElements = [hoverElement];
    renderSelectors(selectedElements, hoverElement);
}

function getHoverElement(event) {
    var hoverElement = document.elementFromPoint(
        event.pageX - window.scrollX,
        event.pageY - window.scrollY
    );

    var autoControlWindow = document.getElementById("ac-panel");
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
