var config = exports.config = {
  assets: {},
  layout: false,
  packed: "packed",
  ignore_processing: ["components"]
};

config.assets.js = {
  vendor: ["components/rsvp/rsvp.js", "components/underscore/underscore.js"],
  app: ["js/main.js"]
};

config.assets.css = {
  vendor: ["components/normalize-css/normalize.css"],
  app: ["css/main.css"]
};
