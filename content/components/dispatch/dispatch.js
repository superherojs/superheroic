/*global window, setInterval */

;(function(window, undefined) {
  "use strict";

  var dispatch = window.dispatch = {}, internal = {},
      id, routes, names, paths, handlers;

  var escapeString = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
      queryMatch   = /\?([^#]*)?$/,
      prefixMatch  = /^[^#]*#/,
      fragMatch    = /:([^:\\$]+)/g,
      fragReplace  = "([^\/]+)";

  /*
   * Add a new route.
   *
   * @name: An optional name for the route.
   * @path: The path the route should answer to, with optional parameters.
   * @handler: The handler function to call when this route is run.
   */
  dispatch.on = function(name, path, handler) {
    if(arguments.length === 2) { handler = path; path = name; }
    if(names[name]) { return; }
    var str = "" + (path || "");
    var escaped = str
      .replace(escapeString, "\\$&")
      .replace(fragMatch, fragReplace);
    var pathMatcher = new RegExp("^" + escaped + "$");
    names[name] = paths[path] = handlers[handler] = ++id;
    routes[id] = {
      name: name,
      path: str,
      matcher: pathMatcher,
      handler: handler,
      id: id
    };
  };

  /*
   * Remove existing route(s).
   * Omit the argument to remove all routes.
   *
   * @x The name, path or handler of the route to remove.
   */
  dispatch.off = function(x) {
    if(!x) dispatch.reset();
    return !!(delete routes[names[x] || paths[x] || handlers[x] || x]);
  };

  /*
   * Go to a route by changing the current hash,
   * ensuring that if that route is the current route,
   * the callback is still run.
   *
   * @path The route to run.
   */
  dispatch.go = function(path) {
    var current = internal.parse(window.location.hash, {}).path;
    var target  = internal.parse(path, {}).path;
    if(current === target) dispatch.run(target);
    else window.location.hash = target;
  };

  /*
   * Startup, run after each route has been added.
   *
   * @origin Where to start, omit for beginning at "/".
   */
  dispatch.start = function(origin) {
    origin = origin || "/";
    if(!window.location.hash) window.location.hash = origin;
    else dispatch.run(window.location.hash);
  };

  /*
   * Run a route manually, without changing the location.
   * You should not have to use this method, try using
   * dispatch.go or dispatch.start instead.
   *
   * @path The path which should trigger a route.
   * @params Optional parameters to pass to the handler.
   */
  dispatch.run = function(path, params) {
    if(!path) path = window.location.hash;
    if(!params) params = {};

    var prev  = internal.parse(params.prev, {}).path;
    var next  = internal.parse(path, { prev: prev });
    var route = dispatch.route(next.path);
    if(!route) return dispatch.fallback();

    var next_parts  = next.path.split("/");
    var route_parts = route.path.split("/");
    for(var i = 0; i < route_parts.length; i++)
      if(route_parts[i].charAt(0) === ":")
        next[route_parts[i].substring(1)] = next_parts[i];

    internal.callbacks(dispatch.before, function() {
      route.handler(next);
      internal.callbacks(dispatch.after);
    });
  };

  /*
   * Reset all routes and callbacks.
   */
  dispatch.reset = function() {
    dispatch.fallback = function() {};
    dispatch.before = [];
    dispatch.after = [];
    routes = {};
    handlers = {};
    names = {};
    paths = {};
    id = 0;
  };

  /*
   * Find a route by its name, path, matcher or handler.
   */
  dispatch.route = function(x) {
    var route = routes[names[x] || paths[x] || handlers[x] || x];
    if(route) return route;
    var parsed = internal.parse(x, {}).path;
    for (var p in routes)
      if (routes.hasOwnProperty(p) && routes[p] && routes[p].matcher.test(parsed))
        return routes[p];
  };

  /*
   * @internal Parse an input path.
   */
  internal.parse = function(input, params) {
    params.path = (input || "")
      .replace(queryMatch, "")
      .replace(prefixMatch, "");
    params.path = decodeURIComponent(params.path);
    return params;
  };

  /*
   * @internal Run an array of methods with a final callback.
   */
  internal.callbacks = function(callbacks, after) {
    after = after || function() {};
    if(callbacks.length === 0) after(function() {});
    else callbacks[0](function() {
        internal.callbacks(Array.prototype.slice.call(callbacks, 1), after);
    });
  };

  /*
   * Listen on the hash change event to trigger routes.
   */
  var prev, next, change = function(event) {
    dispatch.run(event.newURL, { prev: event.oldURL });
  };
  if(!('onhashchange' in window)) {
    prev = window.location.href;
    setInterval(function() {
      next = window.location.href;
      if(prev === next) return;
      prev = next;
      change.call(window, {
        type: 'hashchange',
        newURL: next,
        oldURL: prev
      });
    }, 100);
  } else if (window.addEventListener) {
    window.addEventListener("hashchange", change, false);
  } else if (window.attachEvent) {
    window.attachEvent("onhashchange", change);
  }

  dispatch.reset();

}(window));
