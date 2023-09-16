var runningProcesIndexPath = [];
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
    },

    /**
     * how to save proces progress: create an array, every time it goes another layer "deeper" push a new integer into it
     * then increment the integer the further you get into that layer of the process, this should work
     */
    runAutomation: function() {
        var proces = autocontrolProces.proces;
        autocontrolProces.executeProces(proces)
    },
    executeProces: function(proces) {
        runningProcesIndexPath.push(0);
        var currentProcesDepth = runningProcesIndexPath.length;

        for (var i = 0; i < proces.length; i++) {
            var procesElement = proces[i];

            if (procesElement.procesElementType == "group") {
                autocontrolProces.runGroupProces(procesElement);
            }
            else {
                autocontrolProces.executeAction(procesElement);
            }

            // runningProcesIndexPath[currentProcesDepth] = i;
            // console.log(runningProcesIndexPath);
        }

        console.log("finished running proces");

        runningProcesIndexPath.splice(currentProcesDepth, 1);
        console.log(runningProcesIndexPath.length);
    },

    executeAction: function(procesElement) {
        // console.log(procesElement);
    },
    runGroupProces: function(groupProces) {
        for (var i = 0; i < groupProces.elements.length; i++) {
            var procesElement = autocontrolProces
                .convertToProcesElement(
                    groupProces,
                    i
                );
            autocontrolProces.executeAction(procesElement);

            if (groupProces.proces.length > 0) {
                autocontrolProces.executeProces(groupProces.proces);
            }
        }
    },
    convertToProcesElement(groupProces, index) {
        return {
            element: groupProces.elements[index],
            actionType: groupProces.actionType
        };
    },
    
};
autocontrolProces.init();
