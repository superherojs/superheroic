dispatch.on("/", function() {
    document.getElementsByTagName("body")[0].textContent = "Hello World!";
});

document.addEventListener("DOMContentLoaded", function() {
    dispatch.start("/");
}, false);
