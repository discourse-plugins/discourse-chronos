import computed from "ember-addons/ember-computed-decorators";

export default Ember.Component.extend({
  previewValue: null,
  timeFormat: "HH:mm",
  dateFormat: "YYYY-MM-DD",
  dateTimeFormat: "YYYY-MM-DD HH:mm",
  config: null,
  fallbackTimezones: null,
  previewTimezones: null,
  date: null,
  time: null,
  format: null,
  formats: null,
  fallbackFormat: null,
  previewFormat: null,

  init() {
    this._super();

    this.set("date", moment().format(this.dateFormat));
    this.set("time", moment().format(this.timeFormat));
    this.set("format", `${this.dateTimeFormat} \\T\\Z`);

    this.set("fallbackTimezones", (this.siteSettings.discourse_chronos_fallback_timezones || "").split("|").filter(f => f));
    this.set("fallbackFormat", this.siteSettings.discourse_chronos_fallback_format || this.dateTimeFormat);

    this.set("previewTimezones", (this.siteSettings.discourse_chronos_preview_timezones || "").split("|").filter(f => f));
    this.set("previewFormat", this.siteSettings.discourse_chronos_preview_format || this.dateTimeFormat);

    this.set("formats", (this.siteSettings.discourse_chronos_default_formats || "").split("|"));
  },

  currentUserTimezone() {
    return moment.tz.guess();
  },

  @computed()
  timezones() {
    return _.map(moment.tz.names(), (z) => z);
  },

  getConfig() {
    const date = this.get("date");
    const time = this.get("time");
    const dateTime = moment(`${date} ${time}`, this.dateTimeFormat).utc();

    return {
      date: dateTime.format(this.dateFormat),
      time: dateTime.format(this.timeFormat),
      format: this.get("format"),
      previewTimezones: this.get("previewTimezones"),
      fallbackTimezones: this.get("fallbackTimezones"),
      fallbackFormat: this.get("fallbackFormat"),
      previewFormat: this.get("previewFormat"),
    };
  },

  getTextConfig(config) {
    const fallbacks = config.fallbackTimezones.map(t => {
      const dateTime = moment
                        .utc(`${config.date} ${config.time}`, this.dateTimeFormat)
                        .tz(t)
                        .format(config.fallbackFormat);

      return `${dateTime} (${t})`;
    });

    const previews = config.previewTimezones.map(t => {
      const dateTime = moment
                        .utc(`${config.date} ${config.time}`, this.dateTimeFormat)
                        .tz(t)
                        .format(config.previewFormat);

      return `${t} ${dateTime}`;
    });

    return `[discourse-chronos time=${config.time};date=${config.date};format=${config.format};fallbackTimezones=${config.fallbackTimezones.join("|")};fallbackFormat=${config.fallbackFormat};previewTimezones=${config.previewTimezones.join("|")};previewFormat=${config.previewFormat};previews=${previews.join("|")}]${fallbacks.join(", ")}[/discourse-chronos]`;
  },

  actions: {
    save() {
      this._closeModal();

      const config = this.getConfig();
      const textConfig = this.getTextConfig(config);
      this.get("toolbarEvent").addText(textConfig);
    },

    fillFormat(format) {
      this.set("format", format);
    },
  },

  _closeModal() {
    const composer = Discourse.__container__.lookup("controller:composer");
    composer.send("closeModal");
  }
});
