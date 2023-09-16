var autocontrolProces = [];

function createProcesObj(element, listItemContent) {
    var procesObj = {};
    procesObj.procesElementType = "single";
    procesObj.element = element;

    var actionType = generateActionType(element);
    procesObj.actionType = actionType;

    var actionElement = getActionElement(actionType, listItemContent);
    if (actionElement != null)
    {
        procesObj.actionElement = actionElement;
    }

    return procesObj;
}

function createGroupProcesObj(elements) {
    var procesObj = {};
    procesObj.procesElementType = "group";

    var actionType = generateActionType(elements[0]);
    procesObj.actionType = actionType;
    procesObj.proces = [];

    procesObj.elements = elements

    return procesObj;
}

function generateActionType(element) {
    var tagName = element.tagName.toLowerCase();

    var actionString = "";
    if (tagName == "div" || tagName == "button")
    {
        actionString = "click";
    }
    else if (tagName == "a")
    {
        actionString = "goto";
    }
    else if (tagName == "input")
    {
        actionString = "insert";
    }

    return actionString;
}

function getActionElement(actionType, listItemContent) {
    var actionContent = listItemContent.getElementsByClassName("action-content")[0];

    var actionElement = null;
    if (actionType == "insert")
    {
        actionElement = actionContent.children[0];
    }

    return actionElement;
}

