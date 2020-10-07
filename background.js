function getHostname(url) {
  const a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

function isInBrowserHistory(data, url){
  const hostname = getHostname(url)
  chrome.history.search({text: hostname, maxResults: 1}, function(historyItems){
    if(historyItems.length === 1){
      data.bh = true
    }
  })
}

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

function sendData(data){
  fetch("https://browserwarning.herokuapp.com/postData", {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: 'follow'
  })
  .catch(error => console.log('error', error));
};

function getId(data){
  chrome.storage.sync.get(['_id'], function(result) {
    data.id = result._id;
  });
}

function dataGathering(data, url, error){ 
  getId(data);
  data.user_agent = navigator.userAgent;
  isInBrowserHistory(data, url);
  data.error_code = error;
}

function detectWarning(details) {
  
  const data = {
    id : 0,
    choice : false,
    time : details.timeStamp,
    error_code : "",
    error_type : details.url,
    user_agent : "",
    bh : false
  }

  const error_codes_causing_browser_warnings = ['net::ERR_CERT_DATE_INVALID','net::ERR_CERT_AUTHORITY_INVALID',
  'net::ERR_CERT_COMMON_NAME_INVALID','net::ERR_CERT_WEAK_SIGNATURE_ALGORITHM',
  'net::ERR_CERTIFICATE_TRANSPARENCY_REQUIRED', 'net::ERR_CERT_SYMANTEC_LEGACY'];

  if((details.error === 'net::ERR_BLOCKED_BY_CLIENT') && (details.frameId === 0)){

      dataGathering(data, details.url, details.error)

      detectAnswer(details.url, details.tabId, data)

  }else if(error_codes_causing_browser_warnings.includes(details.error) && (details.frameId === 0)){

    //TODO:solve captive portal false positives
    //solution for firefox: captivePortal API

    dataGathering(data, details.url, details.error)

    detectAnswer(details.url, details.tabId, data)

  }

}

function setIntroIsShownTrue(){
  chrome.storage.sync.set({introIsShown : true})
}

function setIntroIsShownFalse(){
  chrome.storage.sync.set({introIsShown : false}, function(arg){
    console.log("setIntroIsShownFalse")
  })
}

function chooseForm(callback, data, tabId){
  chrome.storage.sync.get(['introIsShown'], function(result) {
    callback(result.introIsShown, data, tabId);
  })
}

function showForm(isShown, data, tabId){
  if(isShown){
    chrome.tabs.executeScript(tabId, {file: "content.js"}, function() {
      chrome.tabs.sendMessage(tabId, {msg: 'show_form', id : data.id, error_code: data.error_code, error_type: data.error_type, choice : data.choice} , setIntroIsShownTrue);
    })
  }else{
    chrome.tabs.executeScript(tabId, {file: "content.js"}, function() {
      chrome.tabs.sendMessage(tabId, {msg: 'show_intro_form', id : data.id, error_code: data.error_code, error_type: data.error_type, choice : data.choice} , setIntroIsShownTrue);
    })
  }
}

function detectAnswer(url, tabId, data){
  chrome.webNavigation.onErrorOccurred.removeListener(detectWarning)

  chrome.webNavigation.onCompleted.addListener(function whenCompleted(details){
    
    if(tabId === details.tabId){

      data.time = (details.timeStamp - data.time)/1000; //time to respond to warning in seconds

      if(url === details.url){
        data.choice = true;
        
        chooseForm(showForm, data, tabId)

      }else{

        chooseForm(showForm, data, tabId)
      }
      sendData(data);
      chrome.webNavigation.onCompleted.removeListener(whenCompleted)
      chrome.webNavigation.onErrorOccurred.addListener(detectWarning)
    }
  });
}

chrome.webNavigation.onErrorOccurred.addListener(detectWarning);