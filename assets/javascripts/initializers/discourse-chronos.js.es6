import { withPluginApi } from "discourse/lib/plugin-api";
import ComposerController from "discourse/controllers/composer";
import loadScript from "discourse/lib/load-script";
import showModal from "discourse/lib/show-modal";

function initializeDiscourseChronos(api) {
  api.decorateCooked($elem => {
    const cdn = "https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data.min.js";
    loadScript(cdn, { scriptTag: true }).then(function () {
      $(".d-chronos", $elem).chronos();
    });
  });

  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
      action: "insertDiscourseChronos",
      icon: "globe",
      label: "d-chronos.title"
    };
  });

  ComposerController.reopen({
    actions: {
      insertDiscourseChronos() {
        const discourseChronosConfig = Ember.Object.extend({
          format: "YY-MM-DD HH:mm",
          time: "09:00",
          countdown: false,
          date: moment().format("YYYY-MM-DD")
        }).create();

        showModal("d-chronos-create-modal").setProperties({
          toolbarEvent: this.get("toolbarEvent"),
          config: discourseChronosConfig
        });
      }
    }
  });
}

export default {
  name: "discourse-chronos",

  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");
    if (siteSettings.d_chronos_enabled) {
      withPluginApi("0.8.8", initializeDiscourseChronos);
    }
  }
};
