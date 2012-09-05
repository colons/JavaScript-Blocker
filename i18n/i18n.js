/***************************************
 * @file i18n/i18n.js
 * @author Travis Roman (travis@toggleable.com)
 * @package JavaScript Blocker (http://javascript-blocker.toggleable.com)
 ***************************************/

var Strings = {},
		_ = function (string, args) {
	var s, load_language = Strings.getLanguage();
		
	s = Strings[load_language] && (string in Strings[load_language]) ? Strings[load_language][string] : Strings['en-us'][string] || string + ':NOT_LOCALIZED';
	
	if (args) {
		for(var i = 1; i <= args.length; i++) {
			var new_string = (args[i - 1] !== undefined) ? ((args[i - 1] === false) ? 'false' : args[i - 1]) : 'undefined';

			if(new_string instanceof Array) new_string = '[' + new_string.join(', ') + ']';
			else if(typeof new_string == 'number') new_string = new_string.toString();

			s = s.replace(new RegExp('\\{' + i + '\\}', 'g'), new_string);
		}
	}
	
	return s;
};

Strings.getLanguage = function () {
	var lang = Settings.current_value ? Settings.current_value('language') : Settings.getItem('language');
	return (lang !== 'Automatic') ? lang : window.navigator.language.toLowerCase();
};
