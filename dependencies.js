function loadApp(){
    adaptSiteContent();
    closeApp();
    toggleSelector();
    resizePanel();
    setNavWidth();
};

function resizePanel(){
    adaptBodyStyle();
    setNavWidth();
};

function adaptSiteContent(){
    adaptElementStyle();
    adaptChildrenStyle();
    adaptAllDivs();
    adaptBodyStyle();
};

function adaptAllDivs(){
    adaptElementStyle();
};

function adaptBodyStyle(){}

function adaptChildrenStyle(){
    adaptElementStyle();
}

function toggleSelector(){}

function selectElement(){
    generateElementListItem();
    toggleSelector();
};

function generateElementListItem(){};

function moveOverlayToElement(){};

function getHoverElement(){};

function closeApp(){
    resetElementsToOriginalStyle();
};

function resetElementsToOriginalStyle(){};

chrome.runtime.onMessage.addListener(function(){
    getFirstElement();
    loadApp();
});

function getFirstElement(){};

