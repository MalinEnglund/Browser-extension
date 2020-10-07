chrome.runtime.onMessage.addListener(function (text, sender, sendResponse) {
    if (text.msg === 'show_form') {
      showForm(false, text.id, text.error_code, text.error_type, text.choice);
      sendResponse();
    }else if(text.msg === 'show_intro_form'){
      showForm(true, text.id, text.error_code, text.error_type, text.choice);
      sendResponse();
    }
});

function getUrl(showIntroForm){
  if(showIntroForm){
    return "https://browserwarning.herokuapp.com/introform.html?id="
  } else {
    return "https://browserwarning.herokuapp.com/form.html?id="
  }
}

function getHeight(showIntroForm){
  if(showIntroForm){
    return '400px'
  } else {
    return '300px'
  }
}

function showForm(showIntroForm, id, error_code, error_type, choice){

  window.scrollTo(0, 0);

  const iframe = document.createElement("iframe")

  const src = document.createAttribute("src");
  
  src.value = getUrl(showIntroForm) + id + "&error_code=" + error_code + "&error_type=" + error_type + "&choice=" + choice;
  iframe.setAttributeNode(src);

  const height = document.createAttribute("height")
  height.value = getHeight(showIntroForm);
  iframe.setAttributeNode(height)

  const width = document.createAttribute("width")
  width.value = '100%';
  iframe.setAttributeNode(width)

  document.body.insertBefore(iframe, document.body.firstChild);
}