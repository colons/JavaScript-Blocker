/***************************************
 * @file js/blocker.js
 * @author Travis Roman (travis@toggleable.com)
 * @package JavaScript Blocker (http://javascript-blocker.toggleable.com)
 * @version 1.2.7-1
 ***************************************/

function pageHost() {
	switch(window.location.protocol) {
		case 'http:':
		case 'https:':
		case 'file:':
			var base = window.location.origin + escape(window.location.pathname) + window.location.search;
			if (window.location.hash.length > 0) return base + window.location.hash;
			else if (window.location.href.substr(-1) === '#') return base + '#';
			else return base;
		break;
		
		default:
			return window.location.href; break;
	}
}

var jsblocker = {
	javascript_blocker_1: 1,
	allowed: {
		count: 0,
		urls: []
	},
	blocked: {
		count: 0,
		urls: []
	},
	unblocked: {
		count: 0,
		urls: []
	},
	href: pageHost()/*,
	frames: {}*/
}, readyTimeout = false, lastAddedFrameData = false, jsonBlocker = false;

function allowedScript(event) {
	if (event.target.nodeName.toUpperCase() === 'SCRIPT' && event.target.src.length > 0) {
		var isAllowed = safari.self.tab.canLoad(event, [jsblocker.href, event.target.src, !(window == window.top)]);

		if (!isAllowed) {
			if (typeof event.target.src === 'string' && event.target.src.length > 0) {
				jsblocker.blocked.count++;
				jsblocker.blocked.urls.push(event.target.src);
	
				event.preventDefault();
			}
		} else {
			jsblocker.allowed.count++;
			jsblocker.allowed.urls.push(event.target.src);
		}
	} else if (event.target.nodeName.toUpperCase() === 'SCRIPT') {
		jsblocker.unblocked.count++;
		jsblocker.unblocked.urls.push(event.target.innerHTML);
	}
	
	if (window !== window.top) {
		clearTimeout(readyTimeout);
		setTimeout(ready, 200);
	}	
}

function ready(event) {
	if (event && event.type === 'DOMContentLoaded') {
		var script_tags = document.getElementsByTagName('script'), i, b;
		for (i = 0, b = script_tags.length; i < b; i++) {
			if (!script_tags[i].src || (script_tags[i].src && script_tags[i].src.length > 0 && /^data/.test(script_tags[i].src))) {
				jsblocker.unblocked.count++;
				jsblocker.unblocked.urls.push(script_tags[i].innerHTML);
			}
		}
	}
	if (window == window.top && event && event.type === 'DOMContentLoaded')
		safari.self.tab.dispatchMessage('setPopoverClass');
	else if (window !== window.top && lastAddedFrameData !== (jsonBlocker = JSON.stringify(jsblocker))) {
		lastAddedFrameData = jsonBlocker;
		safari.self.tab.dispatchMessage('addFrameData', [pageHost(), jsblocker]);
	}
		
	clearTimeout(readyTimeout);
	
	readyTimeout = setTimeout(function () {
		try {
			if (window == window.top) {
		//		for (var i = 0, b = frames.length; i < b; i++)
		//			frames[i].contentWindow.postMessage('add_frame', '*');
				safari.self.tab.dispatchMessage('updatePopover', jsblocker);
			}
		} catch(e) {
			if (!window._jsblocker_user_warned) {
				window._jsblocker_user_warned = true;
				console.error('JavaScript blocker broke! This may be because of an issue with Safari itself. ' +
						'Reloading the page should resolve the issue.')
			}
		}
	}, (event && event.type == 'focus') ? 0 : 300);
}

function messageHandler(event) {
	switch (event.name) {
		case 'reload': window.location.reload(); break;
		case 'updatePopover': ready(event); break;
		case 'unloadPage': unloadHandler(event); break;
	}
}

function unloadHandler(event) {
	try {
		if (window == window.top)
			safari.self.tab.dispatchMessage('unloadPage', pageHost());
	} catch(e) { /* Exception occurs when closing a page sometimes. */ }
}

function hashUpdate(event) {
	var ohref = jsblocker.href.toString();
	
	jsblocker.href = pageHost();
	
	safari.self.tab.dispatchMessage('updateFrameData', [pageHost(), jsblocker, ohref])
	
	ready(event);
}

/*
function frameUpdater(event) {
	if (event.data == 'add_frame') event.source.postMessage(jsblocker, '*');
	else if (typeof event.data == 'object' && event.data.javascript_blocker_1) {
		if (window == window.top) {
			jsblocker.frames[event.data.href] = event.data;
			safari.self.tab.dispatchMessage('updatePopover', jsblocker);
		}
	}
}
*/
safari.self.addEventListener('message', messageHandler, true);
window.addEventListener('hashchange', hashUpdate, true);
window.addEventListener('focus', ready, true);
//window.addEventListener('message', frameUpdater, false);
window.addEventListener('beforeunload', unloadHandler, true);
document.addEventListener('beforeload', allowedScript, true);
document.addEventListener('DOMNodeInserted', allowedScript, true);
document.addEventListener('DOMContentLoaded', ready, true);