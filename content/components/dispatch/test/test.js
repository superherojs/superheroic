/*global dispatch, window, $ */

var add = function(num, name) {
    $("body").append($("<div/>")
        .html(num + " &mdash; " + name)
        .addClass("test-" + num));
};

var pass = function(num) {
    $(".test-" + num).first()
        .removeClass("fail")
        .addClass("pass");
};

var fail = function(num) {
    $(".test-" + num).first()
        .removeClass("pass")
        .addClass("fail");
};

var then = function(fn, num) {
    return function() { fn(num); };
};

/* ------------------------------------ */

$(function() {

window.location = "#/1";

/* ------------------------------------ */

add(1, "should fire initial hash value");
add(2, "should handle hash change");
add(3, "should run second hash change");
add(4, "should run complex hashes");
add(5, "should ignore query strings");

add(6, "should turn off routes by pattern");
add(7, "should turn off routes by handler");
add(8, "should turn off routes by name");

add(9, "should get previous hash");
add(10, "should accept ints as paths");
add(11, "should match ints in hash");
add(12, "should run routes manually");

add(20, "should parse first parameter");
add(21, "should parse second parameter");
add(22, "should parse third parameter");
add(23, "should parse adjecent parameters");
add(24, "should parse central parameters");

add(30, "should run routes once");
add(31, "should force route reload");
add(32, "should run before");
add(33, "should run after");
add(34, "should run multiple before");
add(35, "should run multiple after");
add(36, "should run fallback");

add(51, "should handle complex query strings");

/* ------------------------------------ */

dispatch.run();

dispatch.on("/1", then(pass, 1));
dispatch.on("/2", then(pass, 2));
dispatch.on("/3", then(pass, 3));
dispatch.on("4a+sdf/&$§!/:a sdf/_4", then(pass, 4));
dispatch.on("/5", then(pass, 5));

window.location = "#/2";
window.location = "#/3";
window.location = "#4a+sdf/&$§!/:a sdf/_4";
window.location = "#/5?a=1";

/* ------------------------------------ */

pass(6);
dispatch.on("6", then(fail, 6));
dispatch.off("6");
window.location = "#6";

pass(7);
dispatch.on("7", then(fail, 7));
dispatch.off(then(fail, 7));
window.location = "#7";

pass(8);
dispatch.on("route8", "8", then(fail, 8));
dispatch.off("route8");
window.location = "#8";

/* ------------------------------------ */

dispatch.on("9", function(params) {
    params.prev === "8" ? pass("9") : fail("9");
});
window.location = "#9";

dispatch.on(10, then(pass, 10));
dispatch.on("11", then(pass, 11));
dispatch.on(12, then(pass, 12));
window.location = "#10";
window.location.hash = 11;
dispatch.run("12");

/* ------------------------------------ */

dispatch.on("0/:foo", function(p) {
    p.foo === "a" ? pass(20) : fail(20);
});
dispatch.on("1/foo/:foo", function(p) {
    p.foo === "b" ? pass(21) : fail(21);
});
dispatch.on("2/foo/foo/:foo", function(p) {
    p.foo === "c" ? pass(22) : fail(22);
});
dispatch.on("3/:foo/:bar/:baz", function(p) {
    p.foo === "a" && p.bar === "b" && p.baz === "c" ? pass(23) : fail(23);
});
dispatch.on("4/lal/:lol/lil", function(p) {
    p.lol === "l" ? pass(24) : fail(24);
});

window.location = "#0/a";
window.location = "#1/foo/b";
window.location = "#2/foo/foo/c";
window.location = "#3/a/b/c";
window.location = "#4/lal/l/lil";

var i = 0;
dispatch.on("/num/1", function() { i++; });
dispatch.on("/num/2", function() {});
dispatch.on("/num/3", function() {
    i === 2  ? pass(30) : fail(30);
});

window.location = "#/num/1";
window.location = "#/num/1";
window.location = "#/num/2";
window.location = "#/num/1";
window.location = "#/num/1";
window.location = "#/num/3";
window.location = "#/num/1";

var x = 0;
dispatch.on("/reloaded", function() { if(++x === 3) pass(31); });
window.location = "#/reloaded";
dispatch.run();
dispatch.run();

dispatch.before.push(function(fn) { pass(32); fn(); });
dispatch.after.push(function(fn) { pass(33); fn(); });

dispatch.before.push(function(fn) { fn(); });
dispatch.before.push(function(fn) { pass(34); fn(); });
dispatch.after.push(function(fn) { fn(); });
dispatch.after.push(function(fn) { pass(35); fn(); });

dispatch.fallback = function() { pass(36); };
window.location = "#/lol/no/way";

dispatch.on("/qs/foo/bar", function() { pass(51); });
window.location = "#/qs/foo/bar?asdf=1234/123/$312/qasd/reloaded&foobar=42";

window.location = "#/done";

});
