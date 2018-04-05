import computed from "ember-addons/ember-computed-decorators";

export default Ember.Component.extend({
  timeFormat: "HH:mm",
  dateFormat: "YYYY-MM-DD",
  dateTimeFormat: "YYYY-MM-DD HH:mm",
  config: null,
  date: null,
  time: null,
  format: null,
  formats: null,
  recurring: null,

  init() {
    this._super();

    this.set("date", moment().format(this.dateFormat));
    this.set("time", moment().format(this.timeFormat));
    this.set("format", `LL HH:mm (\\T\\Z)`);
    this.set("timezones", (this.siteSettings.discourse_chronos_default_timezones || "").split("|").filter(f => f));
    this.set("formats", (this.siteSettings.discourse_chronos_default_formats || "").split("|"));
  },

  currentUserTimezone() {
    return moment.tz.guess();
  },

  @computed
  recurringOptions() {
    return [
      { name: "Every day", id: "1.days" },
      { name: "Every week", id: "1.weeks" },
      { name: "Every two weeks", id: "2.weeks" },
      { name: "Every month", id: "1.months" },
      { name: "Every two months", id: "2.months" },
      { name: "Every three months", id: "3.months" },
      { name: "Every six months", id: "6.months" },
      { name: "Every year", id: "1.years" },
    ];
  },

  @computed()
  allTimezones() {
    return _.map(moment.tz.names(), (z) => z);
  },

  getConfig() {
    const date = this.get("date");
    const time = this.get("time");
    const dateTime = moment(`${date} ${time}`, this.dateTimeFormat).utc();

    return {
      date: dateTime.format(this.dateFormat),
      time: dateTime.format(this.timeFormat),
      recurring: this.get("recurring"),
      format: this.get("format"),
      timezones: this.get("timezones"),
    };
  },

  getTextConfig(config) {
    let text = "[discourse-chronos ";
    if (config.recurring) text += `recurring=${config.recurring};`;
    text += `time=${config.time};`;
    text += `date=${config.date};`;
    text += `format=${config.format};`;
    text += `timezones=${config.timezones.join("|")};`;
    text += `]`;
    return text;
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

    cancel() {
      this._closeModal();
    }
  },

  _closeModal() {
    const composer = Discourse.__container__.lookup("controller:composer");
    composer.send("closeModal");
  }
});
