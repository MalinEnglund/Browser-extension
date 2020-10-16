chrome.runtime.onMessage.addListener(function (text, sender, sendResponse) {
    if (text.msg === 'show_form') {
      showForm(false, text.data);
      sendResponse();
    }else if(text.msg === 'show_intro_form'){
      showForm(true, text.data);
      sendResponse();
    }
});

function getUrl(showIntroForm){
  if(showIntroForm){
    return "http://localhost:3000/introForm?id="
  } else {
    return "http://localhost:3000/form?id="
  }
}

function getHeight(showIntroForm){
  if(showIntroForm){
    return '400px'
  } else {
    return '300px'
  }
}

function showForm(showIntroForm, data){

  window.scrollTo(0, 0);

  const iframe = document.createElement("iframe")

  const src = document.createAttribute("src");
  
  src.value = getUrl(showIntroForm) + data.id + "&error_code=" + data.error_code + "&warning_url=" + data.warning_url + "&choice=" + data.choice;
  iframe.setAttributeNode(src);

  const height = document.createAttribute("height")
  height.value = getHeight(showIntroForm);
  iframe.setAttributeNode(height)

  const width = document.createAttribute("width")
  width.value = '100%';
  iframe.setAttributeNode(width)

  document.body.insertBefore(iframe, document.body.firstChild);
}