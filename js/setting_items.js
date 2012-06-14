"use strict";

var Settings = Settings || {};

Settings._alwaysBlockHelp = _('alwaysBlock help');
Settings._alwaysBlock = [['domain', 'Different hostnames'], ['topLevel', 'Different hosts &amp; subdomains'], ['nowhere', 'Nowhere'], ['everywhere', 'Anywhere']];
Settings.settings = {
	misc: {
		donationVerified: {
			default: false
		},
		enablespecial: {
			default: true
		},
		installID: {
			default: false
		},
		installedBundle: {
			default: 0
		},
		trialStart: {
			default: 0
		}
	},
	ui: {
		animations: {
			label: 'Use animations',
			setting: true,
			default: true
		},
		floaters: {
			label: 'Use floating headers',
			setting: true,
			default: true
		},
		largeFont: {
			label: 'Use a large font',
			setting: false,
			default: false
		},
		showPerHost: {
			label: 'Show the number of items blocked or allowed for each host',
			setting: false,
			if_setting: ['simpleMode', true],
			help: _('showPerHost help'),
			default: false
		},
		showUnblocked: {
			label: 'Show scripts that can\'t be blocked',
			setting: false,
			divider: 1,
			help: _('showUnblocked help'),
			default: false
		},
		language: {
			label: 'Language:',
			setting: [['Automatic', 'Automatic'], ['en-us', 'US English'], ['de-de', 'Deutsch']],
			default: 'Automatic'
		},
		sourceCount: {
			label: 'Sources displayed by default:',
			setting: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [99999999, 'All of them']],
			default: '3'
		},
		toolbarDisplay: {
			label: 'Toolbar badge shows number of:',
			setting: [['blocked', 'Blocked items'], ['allowed', 'Allowed items'], ['neither', 'Neither']],
			divider: 1,
			default: 'blocked'
		},
		theme: {
			label: 'Theme:',
			setting: [['default', 'Default'], ['metal', 'Textured Metal'], ['lion', 'OS X Lion'], ['linen', 'Blue Linen']],
			donator: 1,
			divider: 1,
			default: 'default'
		},
		simpleMode: {
			label: 'Enable expert features to block individual items instead of full hosts',
			setting: false,
			opposite: 1,
			default: true
		}
	},
	predefined: {
		ignoreWhitelist: {
			label: 'Ignore whitelist rules',
			setting: false,
			default: false
		},
		ignoreBlacklist: {
			label: 'Ignore blacklist rules',
			setting: false,
			default: false
		},
		saveAutomatic: {
			label: 'Create temporary rules for automatic actions',
			setting: false,
			if_setting: ['simpleMode', false],
			default: true
		},
		secureOnly: {
			label: 'Resources on secure sites must also be secure',
			setting: false,
			default: false
		},
		allowExtensions: {
			label: 'Automatically allow resources from other extensions',
			setting: true,
			default: true
		},
		simpleReferrer: {
			label: 'Prevent links on webpages from sending referrer information',
			setting: false,
			divider: 1,
			help: _('simpleReferrer help'),
			default: false
		},
		enablescript: {
			label: 'Enable script blocker',
			setting: true,
			default: true
		},
		alwaysBlock: {
			label: 'Automatically block scripts from:',
			setting: Settings._alwaysBlock,
			divider: 1,
			if_setting: ['enablescript', true],
			help: Settings._alwaysBlockHelp,
			default: 'domain'
		},
		enableframe: {
			label: 'Enable frame blocker',
			setting: false,
			donator: 1,
			default: true
		},
		showPlaceholderframe: {
			label: 'Show a placeholder for blocked frames',
			setting: true,
			if_setting: ['enableframe', true],
			default: true
		},
		alwaysBlockframe: {
			label: 'Automatically block frames from:',
			setting: Settings._alwaysBlock,
			divider: 1,
			if_setting: ['enableframe', true],
			help: Settings._alwaysBlockHelp,
			default: 'domain'
		},
		enableembed: {
			label: 'Enable embed and object blocker',
			setting: false,
			default: false
		},
		showPlaceholderembed: {
			label: 'Show a placeholder for blocked embeds and objects',
			setting: true,
			if_setting: ['enableembed', true],
			default: true
		},
		alwaysBlockembed: {
			label: 'Automatically block embeds and objects from:',
			setting: Settings._alwaysBlock,
			divider: 1,
			if_setting: ['enableembed', true],
			help: Settings._alwaysBlockHelp,
			default: 'everywhere'
		},
		enablevideo: {
			label: 'Enable video blocker',
			setting: false,
			default: false
		},
		showPlaceholdervideo: {
			label: 'Show a placeholder for blocked videos',
			setting: true,
			if_setting: ['enablevideo', true],
			default: true
		},
		alwaysBlockvideo: {
			label: 'Automatically block videos from:',
			setting: Settings._alwaysBlock,
			divider: 1,
			if_setting: ['enablevideo', true],
			help: Settings._alwaysBlockHelp,
			default: 'everywhere'
		},
		enableimage: {
			label: 'Enable DOM image blocker',
			setting: false,
			help: _('enableimage help'),
			default: false
		},
		showPlaceholderimage: {
			label: 'Show a placeholder for blocked images',
			setting: true,
			if_setting: ['enableimage', true],
			default: true
		},
		alwaysBlockimage: {
			label: 'Automatically block images from:',
			setting: Settings._alwaysBlock,
			if_setting: ['enableimage', true],
			help: Settings._alwaysBlockHelp,
			default: 'nowhere'
		}
	},
	other: {
		blockReferrer: {
			label: 'EXPERIMENTAL: Enable full referrer blocking',
			setting: false,
			donator: 1,
			divider: 1,
			default: false
		},
		enable_special_alert_dialogs: {
			label: 'Display alert() messages within the webpage instead of a popup dialog',
			setting: false,
			description: _('Once any of these features are active, they can be disabled on a per-domain basis. They will appear in the main window under <b>OTHER</b> and will not count towards the amount of blocked/allowed resources.'),
			default: false
		},
		enable_special_confirm_dialogs: {
			label: 'Disable confirm() popup dialogs and confirm actions automatically',
			setting: false,
			default: false
		},
		enable_special_contextmenu_overrides: {
			label: 'Prevent webpages from disabling or using a custom context menu and prevent other extensions from creating menu items',
			setting: false,
			help: _('contextmenu_overrides help'),
			default: false
		},
		enable_special_window_resize: {
			label: 'Prevent webpages from resizing the window and creating new windows with a custom size',
			setting: false,
			default: false
		},
		enable_special_autocomplete_disabler: {
			label: 'Prevent webpages from disabling autocomplete',
			setting: false,
			default: false
		},
		enable_special_font: {
			label: 'Custom font for webpages:',
			prompt: 'Enter a custom font name to use.',
			setting: [[0, 'Webpage default'], ['Helvetica', 'Helvetica'], ['Arial', 'Arial'], ['Times', 'Times'], ['Comic Sans MS', 'Comic Sans MS'], ['other', 'Other…']],
			default: '0'
		},
		enable_special_zoom: {
			label: 'Custom zoom level for webpages:',
			prompt: 'Enter a custom zoom level to use.',
			setting: [[0, 'Webpage default'], [60, '60%'], [80, '80%'], [100, '100%'], [120, '120%'], [140, '140%'], [160, '160%'], [180, '180%'], [200, '200%'], ['other', 'Other…']],
			default: '0'
		},
	},
	about: {
		header: {
			label: false,
			description: [
				'<a href="http://javascript-blocker.toggleable.com/">',
					'<img src="images/toggleable.png" alt="Toggleable" style="margin-left:-8px;" />',
					'<img src="Icon-32.png" alt="JavaScript Blocker" style="margin-bottom:5px;margin-left:5px;" />',
				'</a>',
				'<h4>JavaScript Blocker <span id="js-displayv"></span> (<span id="js-bundleid"></span>)</h4>'].join('')
		},
		trial: {
			id: 'trial-remaining',
			label: '',
			classes: 'description',
			divider: 1
		},
		resetSettings: {
			label: 'Reset all settings to their default values:',
			setting: 'Reset Settings',
			description: _('These actions are permanent and cannot be undone. If you have a verified donation, backup your rules before proceeding.')
		},
		removeRules: {
			label: 'Remove all rules:',
			setting: 'Remove Rules'
		}
	},
	search: {
		headerSearch: {
			classes: 'donator',
			label: 'Search Results',
			setting: null
		}
	}
};

Settings.items = {};

for (var section in Settings.settings) {
	if (section === 'about') continue;

	for (var setting in Settings.settings[section])
		Settings.items[setting] = {
			default: Settings.settings[section][setting].default,
			editable: section !== 'misc'
		}
}

Settings.getItem = function (setting) {
	var tes = safari.extension.settings ? safari.extension.settings.getItem(setting) : Settings.current_value(setting);
	return tes === null ? (Settings.items[setting] ? Settings.items[setting].default : false) : tes;
};

Settings.setItem = function (setting, v) {
	if (!safari.extension.settings) return null;
	safari.extension.settings.setItem(setting, v);
}
