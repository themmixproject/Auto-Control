var autocontrolProces = {
    name: "",
    proces: [],
    originUrl: "",

    init: function() {
        autocontrolProces.originUrl = window.location.href;
    },
    createProcesObj: function(element, listItemContent) {
        var procesObj = {};
        procesObj.procesElementType = "single";
        procesObj.element = element;
    
        var actionType = autocontrolProces.generateActionType(element);
        procesObj.actionType = actionType;
    
        var actionElement = autocontrolProces.getActionElement(
            actionType, 
            listItemContent
        );

        if (actionElement != null)
        {
            procesObj.actionElement = actionElement;
        }
    
        autocontrolProces.proces.push(procesObj);
    },    
    createGroupProcesObj: function(elements) {
        var procesObj = {};
        procesObj.procesElementType = "group";
    
        var actionType = autocontrolProces.generateActionType(elements[0]);
        procesObj.actionType = actionType;
        procesObj.proces = [];
    
        procesObj.elements = elements
    
        autocontrolProces.proces.push(procesObj);
    },
    generateActionType: function(element) {
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
    },
    getActionElement: function(actionType, listItemContent) {
        var actionContent = listItemContent.getElementsByClassName("action-content")[0];
    
        var actionElement = null;
        if (actionType == "insert")
        {
            actionElement = actionContent.children[0];
        }
    
        return actionElement;
    }
};
autocontrolProces.init();
