const requestOptions = {
    method: 'GET'
};

async function get(){
    const response = await fetch("https://browserwarning.herokuapp.com/idXCjklpoiklhhh", requestOptions)

    if (!response.ok) {
        throw await response.json();
    }

    return response.json();
}

chrome.runtime.onInstalled.addListener(async function setId(details) {

    console.log(details.reason) 
    if(details.reason == "install"){ 

        try{
            const id = await get();
            chrome.storage.sync.set({_id: id}, function() {
                console.log('ID is set to ' + id);
            })
            setIntroIsShownFalse();
        } catch(error){
            console.log(error);
        }

    }
    chrome.runtime.onInstalled.removeListener(setId)
});