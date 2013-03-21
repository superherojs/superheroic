var config = exports.config = {
  assets: {},
  layout: false,
  packed: "packed",
  ignore_processing: ["components"]
};

config.assets.js = {

  vendor: [
    "components/html5shiv/dist/html5shiv.js",
    "components/es5-shim/es5-shim.js",
    "components/json3/lib/json3.js",
    "components/rsvp/rsvp.js",
    "components/underscore/underscore.js",
    "components/underscore.string/lib/underscore.string.js",
    "components/dispatch/dispatch.js"
  ],

  app: [
    "components/main/main.js"
  ]

};

config.assets.css = {

  vendor: [
    "components/normalize-css/normalize.css"
  ],

  app: [
    "components/main/main.css"
  ]

};
