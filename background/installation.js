chrome.runtime.onInstalled.addListener(async function setId(details) {

    if(details.reason == "install"){ 

        try{
            const id = await getId();
            setIdLocal(id);
            setIntroIsShownFalse();
        } catch(error){
            console.log(error);
        }

    }
    chrome.runtime.onInstalled.removeListener(setId)
});