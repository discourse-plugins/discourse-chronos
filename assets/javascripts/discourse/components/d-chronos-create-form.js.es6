import { on, observes } from "ember-addons/ember-computed-decorators";
import computed from "ember-addons/ember-computed-decorators";

export default Ember.Component.extend({
  @on("didInsertElement")
  @observes("datetime", "config.format", "config.countdown", "config.timezone")
  _processPreview() {
    $(".d-chronos", this.$(".preview"))
      .data("datetime", this.get("datetime"))
      .data("timezone", this.get("timezone"))
      .data("format", this.get("config.format"))
      .data("countdown", this.get("config.countdown"))
      .chronos();
  },

  @computed("config.date", "config.time", "config.timezone")
  datetime(date, time, timezone) {
    return moment.tz(
      `${date} ${time}`,
      "YYYY-MM-DD HH:mm",
      timezone
    ).format();
  },

  currentUserTimezone: function() {
    return moment.tz.guess();
  }.property(),

  actions: {
    save() {
      this._closeModal();

      this.get("toolbarEvent").addText(
        `[d-chronos timezone=${this.get("config.timezone")};datetime=${this.get("datetime")};format=${this.get("config.format")};countdown=${this.get("config.countdown")}]`
      );
    },

    cancel() {
      this._closeModal();
    },

    fillFormat(format) {
      this.set("config.format", format);
    }
  },

  _closeModal() {
    const composer = Discourse.__container__.lookup("controller:composer");
    composer.send("closeModal");
  },
});
