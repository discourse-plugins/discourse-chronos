# name: discourse-chronos
# about: Display a date in your local timezone
# version: 0.1
# author: Joffrey Jaffeux

register_asset "javascripts/discourse-chronos.js"
register_asset "stylesheets/discourse-chronos.scss"
register_asset "javascripts/vendor/moment.min.js", :vendored_pretty_text
register_asset "javascripts/vendor/moment-timezones.min.js", :vendored_pretty_text

enabled_site_setting :discourse_chronos_enabled

load File.expand_path('../lib/discourse_chronos/engine.rb', __FILE__)
