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

function dataGathering(data, url, error){ 
  getIdLocal(data);
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
    warning_url : details.url,
    user_agent : "",
    bh : false
  }

  const error_codes_causing_browser_warnings = ['net::ERR_CERT_DATE_INVALID','net::ERR_CERT_AUTHORITY_INVALID',
  'net::ERR_CERT_COMMON_NAME_INVALID','net::ERR_CERT_WEAK_SIGNATURE_ALGORITHM',
  'net::ERR_CERTIFICATE_TRANSPARENCY_REQUIRED', 'net::ERR_CERT_SYMANTEC_LEGACY','net::ERR_BLOCKED_BY_CLIENT'];

  if((details.error === error_codes_causing_browser_warnings.includes(details.error)) && (details.frameId === 0)){
      dataGathering(data, details.url, details.error)
      detectAnswer(details.url, details.tabId, data)
  }

}

function showForm(isShown, data, tabId){
  if(isShown){
    chrome.tabs.executeScript(tabId, {file: "content/injectForm.js"}, function() {
      chrome.tabs.sendMessage(tabId, {msg: 'show_form', data} , setIntroIsShownTrue);
    })
  }else{
    chrome.tabs.executeScript(tabId, {file: "content/injectForm.js"}, function() {
      chrome.tabs.sendMessage(tabId, {msg: 'show_intro_form', data} , setIntroIsShownTrue);
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