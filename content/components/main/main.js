dispatch.on("/", function() {
    document.getElementById("app").textContent = "Hello World!";
});

document.addEventListener("DOMContentLoaded", function() {
    dispatch.start("/");
}, false);
