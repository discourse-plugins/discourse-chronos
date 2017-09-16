import { registerOption } from 'pretty-text/pretty-text';

registerOption((siteSettings, opts) => {
  opts.features['d-chronos'] = !!siteSettings.chronos_enabled;
});

function addChronos(buffer, matches, state) {
  let token;

  let config = {
    datetime: null,
    countdown: false,
    format: "YYYY-MM-DD HH:mm"
  };

  const options = matches[1].split(";");
  options.forEach((option) => {
    let o = option.split("=");
    config[o[0]] = o[1];
  });

  token = new state.Token('span_open', 'span', 1);
  token.attrs = [
    ['class', 'd-chronos'],
    ['data-datetime', config.datetime],
    ['data-countdown', config.countdown],
    ['data-format', config.format],
  ];
  buffer.push(token);

  token = new state.Token('text', '', 0);
  token.content = config.time;
  buffer.push(token);

  token = new state.Token('span_close', 'span', -1);
  buffer.push(token);
}

export function setup(helper) {
  helper.whiteList([
    'span.d-chronos',
    'span[data-*]'
  ]);

  helper.registerOptions((opts, siteSettings) => {
    opts.features['d-chronos'] = !!siteSettings.chronos_enabled;
  });

  helper.registerPlugin(md => {
    const rule = {
      matcher: /\[d-chronos (.*?)]/,
      onMatch: addChronos
    };

    md.core.textPostProcess.ruler.push('d-chronos', rule);
  });
}
