if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/sw.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err));
    });
  }
  if (window.location.protocol === 'http:') {
    const requireHTTPS = document.getElementById('requireHTTPS');
    const link = requireHTTPS.querySelector('a');
    link.href = window.location.href.replace('http://', 'https://');
    requireHTTPS.classList.remove('hidden');
  }
  
 
  /*
  function showAddToHomeScreen() {
       console.log('ready to download');
   var a2hsBtn = document.querySelector(".ad2hs-prompt");
   // Get the modal
  var modal = document.getElementById("myModalInstall");
  modal.style.display = "block ";    
   a2hsBtn.style.display = "flex";
   a2hsBtn.addEventListener("click", addToHomeScreen);
   // When the user clicks on <span> (x), close the modal
   var span = document.getElementsByClassName("closeInstall")[0];
  span.onclick = function() {
    modal.style.display = "none";
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  }
   var a2hsBtn = document.querySelector(".ad2hs-prompt");
    a2hsBtn.addEventListener("click", addToHomeScreen);
   function addToHomeScreen() {
  
   if (deferredPrompt) {
   // Show the prompt
   deferredPrompt.prompt();
   // Wait for the user to respond to the prompt
   deferredPrompt.userChoice
   .then(function (choiceResult) {
   if (choiceResult.outcome === 'accepted') {
   console.log('User accepted the A2HS prompt');
   } else {
   console.log('User dismissed the A2HS prompt');
   }
   deferredPrompt = null;
   });
   }
   }*/
  