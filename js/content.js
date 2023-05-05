console.log("hello world!");

document.addEventListener("click", function(event){
    var x = event.pageX;
    var y = event.pageY;
    var myElement = document.elementFromPoint(x - window.scrollX, y - window.scrollY);

    console.log(myElement);
});
