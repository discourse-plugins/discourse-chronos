import { withPluginApi } from "discourse/lib/plugin-api";
import loadScript from "discourse/lib/load-script";
import showModal from "discourse/lib/show-modal";

function initializeDiscourseChronos(api) {
  api.decorateCooked($elem => {
    const cdn = "https://momentjs.com/downloads/moment-timezone-with-data-2012-2022.js";

    // this will be needed for tests later
    // currently I didn’t write tests as the current Ember version used in Discourse
    // has an issue with freezing dates
    if (Ember.testing) {
      const script = document.createElement("script");
      script.src = cdn;
      script.type = "text/javascript";
      document.getElementsByTagName("head")[0].appendChild(script);
    }

    loadScript(cdn, { scriptTag: !Ember.testing }).then(() => {
      $(".discourse-chronos", $elem).chronos();
    });
  });

  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
      action: "insertDiscourseChronos",
      icon: "globe",
      label: "discourse_chronos.title"
    };
  });

  api.modifyClass('controller:composer', {
    actions: {
      insertDiscourseChronos() {
        showModal("discourse-chronos-create-modal").setProperties({
          toolbarEvent: this.get("toolbarEvent")
        });
      }
    }
  });
}

export default {
  name: "discourse-chronos",

  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");
    if (siteSettings.discourse_chronos_enabled) {
      withPluginApi("0.8.8", initializeDiscourseChronos);
    }
  }
};
