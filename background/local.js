function getIdLocal(data){
    chrome.storage.sync.get(['_id'], function(result) {
        data.id = result._id;
    });
}

function setIdLocal(id){
    chrome.storage.sync.set({_id: id})
}

function setIntroIsShownTrue(){
    chrome.storage.sync.set({introIsShown : true})
}

function setIntroIsShownFalse(){
    chrome.storage.sync.set({introIsShown : false})
}

function chooseForm(callback, data, tabId){
    chrome.storage.sync.get(['introIsShown'], function(result) {
        callback(result.introIsShown, data, tabId);
    })
}