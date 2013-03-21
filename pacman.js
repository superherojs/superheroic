exports.config = {

  layout: false,
  packed: "packed",
  ignore_processing: ["components"],

  assets: {

    js: {
      vendor: ["components/rsvp/rsvp.js", "components/underscore/underscore.js" ],
      app: ["js/main.js"]
    },

    css: {
      vendor: [],
      app: ["css/main.css"]
    }

  }

};
