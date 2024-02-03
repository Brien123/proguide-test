function getForm(formID,hiddenID){

    const names={};
     var y = document.getElementById(formID);
     var i;
       for (i = 0; i < y.length-1;i++) {
          names[ y.elements[i].name ] = y.elements[i].value;
            
}

myJSON=JSON.stringify(names);
//alert(myJSON);
document.getElementById(hiddenID).value = myJSON ;







}