/***************************************
 * @file js/blocker.js
 * @author Travis Roman (travis@toggleable.com)
 * @package JavaScript Blocker (http://javascript-blocker.toggleable.com)
 ***************************************/

function pageHost(not_real) {
	switch(window.location.protocol) {
		case 'http:':
		case 'https:':
		case 'file:':
			var base = window.location.origin + (bv[0] >= 535 ?
					window.location.pathname : escape(window.location.pathname)) + window.location.search;
			if (window.location.hash.length > 0) return base + window.location.hash;
			else if (window.location.href.substr(-1) === '#') return base + '#';
			else return base;
		break;
		
		default:
			return window.location.href;
		break;
	}
}

var bv = window.navigator.appVersion.split('Safari/')[1].split('.'),
		jsblocker = {
			allowed: {
				hosts: [],
				count: 0,
				urls: []
			},
			blocked: {
				hosts: [],
				count: 0,
				urls: []
			},
			unblocked: {
				hosts: [],
				count: 0,
				urls: []
			},
			href: null
		}, readyTimeout = false, lastAddedFrameData = false, jsonBlocker = false, settings = {}
		
function if_setting(setting, value, cb, args) {
	if (!(setting in settings)) {
		safari.self.tab.dispatchMessage('setting', setting);
		
		return setTimeout(function (setting, value, cb, args) {
			if_setting(setting, value, cb, args);
		}, 6, setting, value, cb, args);
	}
	
	if (settings[setting] === value)
		cb.apply(window, args);
}

function activeHost(url) {
	var r = /^(https?|file|safari\-extension):\/\/([^\/]+)\//;
	if (url) {
		if (/^data/.test(url)) return 'Data URI';
		else if (url.match(r) && url.match(r).length > 2) return url.match(r)[2];
		else return 'ERROR';
	}
}
function allowedScript(event) {
	if (event.target.nodeName.toUpperCase() === 'SCRIPT' && event.target.src.length > 0 && event.type !== 'DOMNodeInserted') {
		var isAllowed = safari.self.tab.canLoad(event, [jsblocker.href, event.target.src, !(window == window.top)]),
				host = activeHost(event.target.src);

		if (!isAllowed) {
			if (typeof event.target.src === 'string' && event.target.src.length > 0) {
				jsblocker.blocked.count++;
				jsblocker.blocked.urls.push(event.target.src);
						
				if (jsblocker.blocked.hosts.indexOf(host) === -1) jsblocker.blocked.hosts.push(host);

				event.preventDefault();
			}
		} else {
			jsblocker.allowed.count++;
			jsblocker.allowed.urls.push(event.target.src);
		
			if (jsblocker.allowed.hosts.indexOf(host) === -1) jsblocker.allowed.hosts.push(host);
		}
	} else if (event.target.nodeName.toUpperCase() === 'SCRIPT' && event.target.src.length === 0 && event.type === 'DOMNodeInserted') {
		jsblocker.unblocked.count++;
		jsblocker.unblocked.urls.push(event.target.innerHTML);
	} else if (event.target.nodeName.toUpperCase() === 'A' && event.target.href.length) {

	}

	if (window !== window.top || event.type === 'DOMNodeInserted') {
		clearTimeout(readyTimeout);
		readyTimeout = setTimeout(ready, 200, event);
	}
}

function ready(event) {
	safari.self.tab.dispatchMessage('updateReady');
	
	if (event.type === 'DOMContentLoaded') {
		var script_tags = document.getElementsByTagName('script'), i, b;
		for (i = 0, b = script_tags.length; i < b; i++) {
			if (!script_tags[i].src || (script_tags[i].src && script_tags[i].src.length > 0 && /^data/.test(script_tags[i].src))) {
				jsblocker.unblocked.count++;
				jsblocker.unblocked.urls.push(script_tags[i].innerHTML);
			}
		}
	}
	if (window == window.top && event.type === 'DOMContentLoaded')
		safari.self.tab.dispatchMessage('setPopoverClass');
	else if (window !== window.top && lastAddedFrameData !== (jsonBlocker = JSON.stringify(jsblocker))) {
		lastAddedFrameData = jsonBlocker;
		safari.self.tab.dispatchMessage('addFrameData', [pageHost(), jsblocker]);
	}
		
	clearTimeout(readyTimeout);
		
	readyTimeout = setTimeout(function () {
		try {
			if (window === window.top)
				safari.self.tab.dispatchMessage('updatePopover', jsblocker);
		} catch(e) {
			if (!window._jsblocker_user_warned) {
				window._jsblocker_user_warned = true;
				console.error('JavaScript blocker broke! This is an issue with Safari itself. ' +
						'Reloading the page should fix things.')
			}
		}
	}, (event.type === 'focus') ? 100 : 300);
}

function messageHandler(event) {
	switch (event.name) {
		case 'reload': window.location.reload(); break;
		case 'updatePopover': ready(event); break;
		case 'validateFrame':
			var f = document.getElementsByTagName('iframe'), a = [pageHost(), jsblocker];
			
			for (var y = 0; y < f.length; y++) {
				if (!('src' in f[y]) || f[y].src.length < 1) continue;
				else if (f[y].src === event.message) {
					a.push(f[y].src);
					break;
				}
			}
			
			if (a.length < 3) a.push(-1);
									
			safari.self.tab.dispatchMessage('addFrameData', a);
		break;
		case 'setting':
			settings[event.message[0]] = event.message[1];
		break;
	}
}

function hashUpdate(event) {
	var ohref = jsblocker.href.toString();
	
	jsblocker.href = pageHost();
	
	safari.self.tab.dispatchMessage('updateFrameData', [pageHost(), jsblocker, ohref])
	
	ready(event);
}

function prepareAnchors(event) {
	var a = document.getElementsByTagName('a'),
			f = document.getElementsByTagName('form');
	
	for (var x = 0; x < a.length; x++)
		setTimeout(function (an) {
			prepareAnchor(an);
		}, 1 * x, a[x]);
	for (var y = 0; y < f.length; y++)
		if (f[y].method && f[y].method.toLowerCase() === 'post')
			safari.self.tab.dispatchMessage('cannotAnonymize', f[y].getAttribute('action'));
}

function prepareAnchor(anchor) {
	if (anchor.nodeName && anchor.nodeName.toUpperCase() === 'A') {
		if_setting('simpleReferrer', true, function (anchor) {
			if ((!anchor.getAttribute('rel') || !anchor.getAttribute('rel').length)) anchor.setAttribute('rel', 'noreferrer');
		}, [anchor]);
		
		anchor.addEventListener('mousedown', function (e) {
			var k = (window.navigator.platform.match(/Win/)) ? e.ctrlKey : e.metaKey;
			
			safari.self.tab.dispatchMessage('anonymousNewTab', k ? 1 : 0);
			
			setTimeout(function () {
				safari.self.tab.dispatchMessage('anonymousNewTab', 0);
			}, 1000);
		}, true);
	}
}

safari.self.addEventListener('message', messageHandler, true);
window.addEventListener('hashchange', hashUpdate, true);

if (window === window.top)
	window.addEventListener('focus', ready, true);

document.addEventListener('DOMContentLoaded', function () {
	jsblocker.href = pageHost();
}, false);
	
document.addEventListener('DOMContentLoaded', ready, false);
document.addEventListener('DOMContentLoaded', prepareAnchors, false);
document.addEventListener('beforeload', allowedScript, true);
document.addEventListener('DOMNodeInserted', allowedScript, true);
document.addEventListener('DOMNodeInserted', prepareAnchor, true);