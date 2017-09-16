# name: discourse-chronos
# about: Display a date in your local timezone
# version: 0.1
# author: Joffrey Jaffeux

register_asset "javascripts/discourse-chronos.js"
register_asset "stylesheets/discourse-chronos.scss"

enabled_site_setting :d_chronos_enabled

load File.expand_path('../lib/discourse_chronos/engine.rb', __FILE__)
