pref("toolkit.defaultChromeURI", "chrome://allectus/content/main/main.xul");

/* Don't inherit OS locale */
pref("intl.locale.matchOS", "false");

/* Choose own fallback locale; later it can be overridden by the user */
pref("general.useragent.locale", "da-DK");

/* debugging prefs */
pref("browser.dom.window.dump.enabled", true);
pref("javascript.options.showInConsole", true);
pref("javascript.options.strict", true);
pref("nglayout.debug.disable_xul_cache", true);
pref("nglayout.debug.disable_xul_fastload", true);
