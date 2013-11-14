/***************************************
 * @file js/blocker.js
 * @author Travis Roman (travis@toggleable.com)
 * @package JavaScript Blocker (http://javascript-blocker.toggleable.com)
 ***************************************/

"use strict";

var blank = window.location.href === 'about:blank',
		Token = {
			_tokens: {},
			generate: function () {
				return Math.random().toString(36).substr(2);
			},
			create: function (value, keep) {
				var t = this.generate();

				this._tokens[t] = {
					value: value || undefined,
					keep: !!keep
				};

				if (!keep)
					setTimeout(function (self, to) {
						delete self._tokens[to];
					}, 120000, this, t);

				return t;
			},
			valid: function (token, value) {
				return (token && this._tokens[token] && this._tokens[token].value === value);
			},
			expire: function (token, not_kept) {
				if (this._tokens[token] && (!not_kept || !this._tokens[token].keep))
					delete this._tokens[token];
			}
		},
		beforeLoad = {'url':'','returnValue':true,'timeStamp':1334608269228,'eventPhase':0,'target':null,'defaultPrevented':false,'srcElement':null,'type':'beforeload','cancelable':false,'currentTarget':null,'bubbles':false,'cancelBubble':false},
		accessToken = Token.generate(),
		bv = window.navigator.appVersion.split('Safari/')[1].split('.'),
		parentURL = (window !== window.top && blank) ? (ResourceCanLoad(beforeLoad, 'parentURL') + '-' + Token.generate()) : false,
		alert_history = {},
		disabled = ResourceCanLoad(beforeLoad, ['disabled', pageHost()]);

if (!window.CustomEvent)
	(function () {
		function CustomEvent (event, params) {
			params = params || { bubbles: false, cancelable: false, detail: undefined };
			var evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			return evt;
		};

		window.CustomEvent = CustomEvent;
	})();

function pageHost(not_real) {
	if (parentURL) return parentURL;

	switch(window.location.protocol) {
		case 'http:':
		case 'https:':
		case 'file:':
			var base = window.location.origin + (bv[0] >= 535 ?
					window.location.pathname : encodeURI(window.location.pathname)) + window.location.search;
			if (window.location.hash.length > 0) return base + window.location.hash;
			else if (window.location.href.substr(-1) === '#') return base + '#';
			else if (/\?$/.test(window.location.href)) return base + '?';
			else return base;
		break;
		
		default:
			return window.location.href;
		break;
	}
}

function setCSS(st, pr, pl) {
	for (var i = 0; i < pr.length; i++)
		pl.style.setProperty(pr[i], st.getPropertyValue(pr[i]), 'important');
}

function setCSSs(e, p, not_important) {
	for (var prop in p)
		e.style.setProperty(prop, p[prop], not_important ? '' : 'important');
}

function fitFont(e, f) {
	var fs = 22, maxH = e.offsetHeight, maxW = e.offsetWidth - 10, text = e.querySelector('.jsblocker-node'),
			wr = e.querySelector('.jsblocker-node-wrap'), tH, tW;
	
	text.style.setProperty('opacity', '0.5', 'important')
	
	do {
		text.style.setProperty('font-size', fs + 'pt', 'important');
		wr.style.setProperty('margin-top', '-' + ((text.offsetHeight / 2) - 3) + 'px', 'important');
		tH = text.offsetHeight;
		tW = text.offsetWidth;
		fs -= 1;
	} while ((tH + 3 > maxH || tW + 3 > maxW) && fs > 4);

	setCSSs(text, {
		position: 'absolute',
		top: 'auto',
		left: '50%',
		'margin-left': '-' + Math.round(tW / 2) + 'px'
	});
}

function createPlaceholder(e, url) {
	if (!e.parentNode || !url) return false;
		
	var pl, st, pl, i, p, w, pw, pB, p2, t, o, parsed = parseURL(url), proto = activeProtocol(url), host = parsed.host,
			types = { 'application/x-shockwave-flash': 'flash', 'application/pdf': 'PDF document' }, type = e.getAttribute('type'),
			pr = ['top', 'right', 'bottom', 'left', 'z-index', 'clear', 'float', 'vertical-align', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', '-webkit-margin-before-collapse', '-webkit-margin-after-collapse'],
			pa = parsed.pathname.replace(/</g, '&lt;').replace(/\//g, '/<wbr />').replace(/\?/g, '?<wbr />').replace(/&(?!lt;)/g, '&<wbr />').replace(/=/g, '=<wbr />'),
			se = parsed.search.replace(/</g, '&lt;').replace(/\//g, '/<wbr />').replace(/\?/g, '?<wbr />').replace(/&(?!lt;)/g, '&<wbr />').replace(/=/g, '=<wbr />'),
			place =  [
				'<div class="jsblocker-node-wrap">',
					'<p class="jsblocker-node">', e.nodeName.toLowerCase(), type ? '<br/>' + (types[type] || type) : '', '</p>',
				'</div>',
				'<p class="jsblocker-url">',
					'<span class="jsblocker-protocol">', proto, ~['about', 'javascript', 'data'].indexOf(proto) ? ':' : '://', '</span>',
					'<span class="jsblocker-host">', ~['about', 'javascript', 'data'].indexOf(proto) ? '' : host.replace(/\./g, '.<wbr />'), '<wbr /></span>',
					'<span class="jsblocker-path">', pa, se, '</span>',
				'</p>'].join(''),
			pl = document.createElement('div');	

	pl.innerHTML = place;

	var pw = pl.querySelector('.jsblocker-node-wrap'),
			p = pl.querySelector('.jsblocker-node'),
			p2 = pl.querySelector('.jsblocker-url');
	
	p2.title = e.nodeName.toLowerCase() + ' - ' + url;
	p.title = p2.title;

	var	w = e.offsetWidth <= 12 ? e.offsetWidth : e.offsetWidth - 12,
			h = e.offsetHeight <= 12 ? e.offsetHeight : e.offsetHeight - 12;
	
	pl.className = 'jsblocker-placeholder';
	pl.id = 'placeholder-' + Token.generate();

	setCSSs(pl, {
		display: 'inline-block',
		width: w + 'px',
		height: h + 'px',
		padding: '6px'
	});
	
	if ((e.offsetWidth - 12) <= 0)
		setCSSs(pl, { 'padding-left': '0px', 'padding-right': '0px' });
	
	if ((e.offsetHeight - 12) <= 0)
		setCSSs(pl, { 'padding-top': '0px', 'padding-bottom': '0px' });
	
	st = window.getComputedStyle(e, null);
		
	if(st.getPropertyValue('position') === 'static')
		pl.style.setProperty('position', 'relative', 'important');
	else
		pr.push('position');
	
	setCSS(st, pr, pl);
	
	e.parentNode.replaceChild(pl, e);
	
	fitFont(pl);

	pl.addEventListener('click', function (ev) {
		if (!ev.isTrigger) {
			ev.preventDefault();
			ev.stopImmediatePropagation();
			e.setAttribute('data-jsb_auto_allow', Token.create('auto_allow'));
			pl.parentNode.replaceChild(e, pl);
		}
	});
}

var alwaysDo = {},
		jsblocker = {
			allowed: {},
			blocked: {},
			unblocked: {},
			href: pageHost(),
			host: blank ? 'blank' : window.location.host || 'blank'
		}, readyTimeout = {}, zero = [], settings = {},
		ph = function (kind, allowed, host, url) {
			if (!allowed)
				if_setting('showPlaceholder' + kind, true, function (t) {
					createPlaceholder(t, url);
				}, function (t) {
					if (t.parentNode) t.parentNode.removeChild(t);
				}, [this]);
		},
		kinds = {
			SCRIPT: ['script', ph],
			FRAME: ['frame', ph],
			IFRAME: ['frame', ph],
			EMBED: ['embed', ph],
			OBJECT: ['embed', ph],
			VIDEO: ['video', ph],
			IMG: ['image', ph],
			AJAX_POST: ['ajax_post'],
			AJAX_PUT: ['ajax_put'],
			AJAX_GET: ['ajax_get'],
			INJECTED: ['injected'],
			special: ['special'],
			disable: ['disable']
		};

for (var kind in kinds) {
	jsblocker.allowed[kinds[kind][0]] = { all: [], hosts: [] }
	jsblocker.blocked[kinds[kind][0]] = { all: [], hosts: [] }
	jsblocker.unblocked[kinds[kind][0]] = { all: [], hosts: [] }
}

function zero_timeout(fn, args) {
	zero.push([fn, args]);
	window.postMessage('zero-timeout', '*');
}
	
function if_setting(setting, value, cb, cb2, args) {
	var s = setting.split('|');
		
	for (var i = 0; i < s.length; i++) {
		if (!(s[i] in settings))
			settings[s[i]] = ResourceCanLoad(beforeLoad, ['setting', s[i]]);
	
		if (settings[s[i]] === value) {
			if (typeof cb === 'function') cb.apply(window, args);
			break;
		} else if (i === (s.length -1) && typeof cb2 === 'function')
			cb2.apply(window, args);
	}
	
	return settings[s[--i]];
}

function activeHost(url, real) {
	var r = /^(https?|file|safari\-extension):\/\/([^\/]+)\//;

	if (url === 'about:blank') return '';
	if (/^javascript:/.test(url)) return real ? 'javascript': '';
	if (/^data:/.test(url)) return real ? 'data' : '';
	if (url.match(r) && url.match(r).length > 2) return url.match(r)[2];
	return 'ERROR';
}

function parseURL(url) {
	var a = document.createElement('a');
	a.href = url;
	return a;
}

function activeProtocol(url) {
	var p = parseURL(url).protocol;
	return p.substr(0, p.length - 1);
}

function getAbsoluteURL(url) {
	if (!url) return '';

	return parseURL(url).href;
}

function canLoad(event, exclude, meta) {
	var el = event.target ? event.target : event,
			node = el.nodeName.toUpperCase();

	if (!(node in kinds)) return 1;

	var source = getAbsoluteURL(event.url), pathname, host, at, arr, use_source, did_something = 0, kind = kinds[node][0];

	if (!Token.valid(el.getAttribute('data-jsb_auto_allow'), 'auto_allow')) {
		if (kind in alwaysDo) {
			if (!alwaysDo[kind] && event.preventDefault) event.preventDefault();
			return alwaysDo[kind];
		} else if (event.target) {		
			if (source && source.length)
				use_source = source, host = activeHost(source, 1);
			else if (node !== 'OBJECT')
				use_source = 'about:blank', host = 'blank';
			else
				return 1;

			if (Token.valid(el.getAttribute('data-jsb_ignore'), 'jsb_ignore')) {
				Token.expire(el.getAttribute('data-jsb_ignore'));

				el.setAttribute('data-jsb_added', Token.create(el.outerHTML, true));

				if_setting('hideJSBInjected', false, function (kind, el) {
					jsblocker.unblocked[kind].all.push('JSB Injected Script (' + el.getAttribute('data-jsb_special') + '): ' + el.src);
				}, null, [kind, el]);

				el.removeAttribute('data-jsb_ignore');
				return 1;
			}

			if (node === 'IFRAME' || node === 'FRAME') el.setAttribute('data-jsb_url', use_source);

			var allo = ResourceCanLoad(event, [kind, jsblocker.href, use_source, !(window == window.top)]),
					isAllowed = allo[0],
					mo = isAllowed || !event.preventDefault ? 'allowed' : 'blocked';


			if (allo[1] === -84) {
				alwaysDo[kind] = isAllowed;
				return allo;
			}

			did_something = 1;

			if (!meta) {
				switch (node) {
					case 'EMBED':
					case 'OBJECT':
					case 'FRAME':
						meta = el.getAttribute('type');
					break;
				}
			}

			if (!isAllowed && event.preventDefault)	event.preventDefault();
			
			if (exclude !== true || allo[1] >= 0) jsblocker[mo][kind].all.push([use_source, allo[1], event.unblockable || false, meta]);
		
			if (!~jsblocker[mo][kind].hosts.indexOf(host)) jsblocker[mo][kind].hosts.push(host);

			if (kinds[node][1] && event.preventDefault) kinds[node][1].call(event.target, kind, isAllowed, host, use_source);
		} else if ((!source || source.length === 0) && !event.target) {
			if (el.innerHTML.length && (!el.getAttribute('data-jsb_added') || !Token.valid(el.getAttribute('data-jsb_added'), el.outerHTML.length))) {
				did_something = 1;

				el.setAttribute('data-jsb_added', Token.create(el.outerHTML.length, true));

				jsblocker.unblocked[kind].all.push(el.innerHTML);
			
				if (kinds[node][1]) kinds[node][1].call(el, kind, 1);
			}
		}
	} else
		Token.expire(el.getAttribute('data-jsb_auto_allow'));

	if (did_something)
		ready(event);

	return allo;
}

function ready(event) {
	if (disabled) return false;

	var l = event.type === 'DOMContentLoaded';
			
	clearTimeout(readyTimeout[l]);
		
	readyTimeout[l] = setTimeout(function (event) {
		if (event.type === 'DOMContentLoaded') {
			var script_tags = document.getElementsByTagName('script'), i, b = script_tags.length;
			for (i = 0; i < b; i++) {
				if (!Token.valid(script_tags[i].getAttribute('data-jsb_added'), script_tags[i].outerHTML.length)) {
					if (!script_tags[i].getAttribute('src') || (script_tags[i].src && script_tags[i].src.length > 0 && /^data/.test(script_tags[i].src))) {
						script_tags[i].setAttribute('data-jsb_added', Token.create(script_tags[i].outerHTML.length, true));

						jsblocker.unblocked.script.all.push(script_tags[i].innerHTML);

						kinds.SCRIPT[1].call(script_tags[i], 'script', 1);
					}
				}
			}
		}
			
		try {
			if (window === window.top)
				GlobalPage.message(event.name && ~event.name.indexOf('updatePopover') ? event.name : 'updatePopover', jsblocker);
		} catch(e) {
			if (!window._jsblocker_user_warned) {
				window._jsblocker_user_warned = true;
				console.error('JavaScript blocker broke! This is an issue with Safari itself. ' +
						'Reloading the page should fix things.')
			}
		}
	}, 250, event);
}

function messageHandler(event) {
	if (event.message)
		try {
			event.message = JSON.parse(event.message);
		} catch (e) {}

	switch (event.name) {
		case 'reload':
			if (window === window.top) window.location.reload();
		break;

		case 'updatePopover':
			if (window === window.top) {
				hashUpdate();
				
				GlobalPage.message('updateReady');
				GlobalPage.message(event.name, jsblocker);
			}
		break;

		case 'setting':
			settings[event.message[0]] = event.message[1];
		break;

		case 'openSettings':
			if (document.getElementById('jsblocker-settings') || window !== window.top) break;

			var fr = document.createElement('iframe');
			fr.id = 'jsblocker-settings';
			fr.src = event.message;

			setCSSs(fr, {
				visibility: 'hidden',
				width: '100%',
				height: '100%',
				position: 'fixed',
				top: '0px',
				'z-index': +new Date(),
				border: 'none'
			});

			document.documentElement.appendChild(fr);

			fr.onload = function () {
				fr.style.setProperty('visibility', 'visible', 'important');
			};
		break;

		case 'closeSettings':
			var fr = document.getElementById('jsblocker-settings');

			if (fr) fr.parentNode.removeChild(fr);
		break;

		case 'notification':
			if (window === window.top) {
				if (event.message[1] === 'JavaScript Blocker Update') {
					if (window.showedUpdateNotification) break;
					else window.showedUpdateNotification = 1;
				}

				special_actions.alert_dialogs(1, [1])(event.message[0], event.message[1], 1);
			}
		break;

		case 'loadElementsOnce':
			var pls = document.querySelectorAll('.jsblocker-placeholder');
	
			for (var i = 0; pls[i]; i++) {
				var ev = document.createEvent('MouseEvents');
				
				ev.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

				pls[i].dispatchEvent(ev);
			}
		break;

		case 'getFrameData':
			if (window !== window.top)
				GlobalPage.message('addFrameData', [jsblocker.href, jsblocker]);
		break;
	}
}

function hashUpdate(event) {
	var ohref = jsblocker.href.toString();
	
	jsblocker.href = pageHost();

	GlobalPage.message('updateFrameData', [jsblocker.href, jsblocker, ohref]);
	
	if (event) ready(event);
}

function prepareAnchors(event, anchors, forms) {
	var a = anchors || document.getElementsByTagName('a'),
			f = forms || document.getElementsByTagName('form');

	for (var x = 0; x < a.length; x++)
		if (a[x].getAttribute('href'))
			prepareAnchor(a[x], x);

	if_setting('blockReferrer', true, function (f) {
		for (var y = 0; y < f.length; y++)
			if (f[y].getAttribute('method') && f[y].getAttribute('method').toLowerCase() === 'post')
				GlobalPage.message('cannotAnonymize', getAbsoluteURL(f[y].getAttribute('action')));
	}, null, [f]);
}

function prepareAnchor(anchor, i) {
	var type = !anchor.target;
	anchor = !type ? anchor.target : anchor;
	
	if (!type && anchor.nodeName && anchor.nodeName.toUpperCase() !== 'A') {
		if (anchor.querySelectorAll)
			prepareAnchors(null, anchor.querySelectorAll('a', anchor), []);
		
		return false;
	}

	if (anchor.nodeName && anchor.nodeName.toUpperCase() === 'A') {
		if (Token.valid(anchor.getAttribute('data-jsb_prepared'), 'anchor')) return;

		anchor.setAttribute('data-jsb_prepared', Token.create('anchor', 1));
		
		if (!(enabled_specials.simple_referrer.allowed % 2)) {
			if (anchor.getAttribute('href') && anchor.getAttribute('href').length && anchor.getAttribute('href').charAt(0) !== '#')
				if ((!anchor.getAttribute('rel') || !anchor.getAttribute('rel').length))
					anchor.setAttribute('rel', 'noreferrer');
		}

		if (window !== window.top)
			if_setting('confirmShortURL', true, function (anchor) {
				anchor.addEventListener('click', function (ev) {
					var target = this.getAttribute('target');

					if (target !== '_blank' && target !== '_top')
						if (!ResourceCanLoad(beforeLoad, ['confirmShortURL', this.href, jsblocker.href])) {
							ev.preventDefault();
							ev.stopPropagation();
						}
				});
			}, null, [anchor]);
		
		if_setting('blockReferrer', true, function (anchor) {
			if (anchor.getAttribute('href') && anchor.getAttribute('href').charAt(0) === '#')
				GlobalPage.message('cannotAnonymize', getAbsoluteURL(anchor.getAttribute('href')));
			else	
				anchor.addEventListener('mousedown', function (e) {
					var k = (window.navigator.platform.match(/Win/)) ? e.ctrlKey : e.metaKey;
				
					GlobalPage.message('anonymousNewTab', k || e.which === 2 ? 1 : 0);
				
					setTimeout(function () {
						GlobalPage.message('anonymousNewTab', 0);
					}, 1000);
				}, true);
		}, null, [anchor]);
	}
}

function prepareFrames() {
	var iframes = document.getElementsByTagName('iframe'),
			frames = document.getElementsByTagName('frame');

	for (var i = 0; iframes[i]; i++)
		prepareFrame(iframes[i]);
	for (var i = 0; frames[i]; i++)
		prepareFrame(frames[i]);
}

function prepareFrame(frame) {
	var fr = frame.target ? frame.target : frame, id;

	if (!~['FRAME', 'IFRAME'].indexOf(fr.nodeName.toUpperCase())) return false;

	id = fr.getAttribute('id');

	if (!id || !id.length) fr.setAttribute('id', 'frame-' + Token.generate());

	fr.addEventListener('load', function () {
		this.contentWindow.postMessage('mayIPleaseKnowYourURL:' + this.id, '*');
	}, false);
}

function windowMessenger(event) {
	var mayI = 'mayIPleaseKnowYourURL:', sure = 'theURLFor:';

	if (typeof event.data === 'string') {
		if (event.data === 'history-state-change')
			jsblocker.href = pageHost();
		else if (event.data === 'zero-timeout') {
			event.stopPropagation();
			if (zero.length) {
				var o = zero.shift();
				if (typeof o[0] === 'function')
					o[0].apply(window, o[1]);
			}
		} else if (event.data.indexOf(mayI) === 0) {
			var id = event.data.substr(mayI.length);
			window.top.postMessage(sure + id + '#' + encodeURI(jsblocker.href), '*');
		} else if (event.data.indexOf(sure) === 0) {
			var off = event.data.substr(sure.length),
					id = off.substr(0, off.indexOf('#')),
					url = decodeURI(off.substr(id.length + 1)),
					fr = document.getElementById(id);

			if (!fr) return;

			var old = fr.getAttribute('data-jsb_url');

			Token.expire(fr.getAttribute('data-jsb_auto_allow'));

			if (old !== url) {
				var t = JSON.parse(JSON.stringify(beforeLoad));
				t.target = fr;
				t.url = url;
				t.unblockable = old;
				canLoad(t);
				fr.setAttribute('data-jsb_url', url);
			} else
				fr.setAttribute('data-jsb_url', url);
		}
	}
}

function commandHandler(event) {
	if (event.detail.command && Token.valid(event.detail.token, event.detail.command) && (event.detail.key === window.accessToken || Token.valid(event.detail.key, 'custom'))) {
		Token.expire(event.detail.token, true);

		switch (event.detail.command) {
			case 'ajaxIntercept':
				var b = JSON.parse(JSON.stringify(beforeLoad));

				b.url = event.detail.source;
				b.preventDefault = function () {};
				b.target = {
					nodeName: event.detail.kind,
					getAttribute: function () { return null; },
					setAttribute: function () {}
				};

				var e = new CustomEvent('jsb_ajax_handler', {
					detail: {
						id: event.detail.id,
						token: Token.create('inlineAlert'),
						str: event.detail.str,
						kind: event.detail.kind,
						source: event.detail.source,
						meta: event.detail.meta,
						accessKey: ResourceCanLoad(beforeLoad, ['generateRuleAccessKey']),
						rule: ResourceCanLoad(beforeLoad, ['arbitrary', 'utils.escape_regexp', event.detail.source]),
						allowed: canLoad(b, event.detail.exclude, event.detail.meta),
						domain_parts: ResourceCanLoad(beforeLoad, ['arbitrary', 'domain_parts', parseURL(pageHost()).host])
					}
				});

				document.dispatchEvent(e);
			break;

			case 'pushItem':
				jsblocker[event.detail.action][event.detail.kind].all.push([event.detail.data, event.detail.how[1], false, event.detail.meta]);

				if (event.detail.which === 'hosts' && !~jsblocker[event.detail.action][event.detail.kind].hosts.indexOf(event.detail.data))
					jsblocker[event.detail.action][event.detail.kind].hosts.push(event.detail.data);

				GlobalPage.message('updatePopover', jsblocker);
			break;

			case 'inlineAlert':
				special_actions.alert_dialogs(1, [window.accessToken])(event.detail.body, event.detail.title, event.detail.key, event.detail.hkey, event.detail.id);

				var e = new CustomEvent('jsb_alert_ready', {
					detail: {
						id: event.detail.id,
						meta: event.detail.meta,
						addRuleToken: Token.create('addRule'),
						pushItemToken: Token.create('pushItem')
					}
				});

				document.dispatchEvent(e);
			break;

			case 'addRule':
				GlobalPage.message('addRule', event.detail);
			break;
		}
	}
}

function contextmenu(event) {
	Events.setContextMenuEventUserInfo(event, event.userInfo || document.querySelectorAll('.jsblocker-placeholder').length);
}

Events.addTabListener('message', messageHandler, true);

if (!disabled) {
	window.addEventListener('hashchange', hashUpdate, true);
	window.addEventListener('message', windowMessenger, true);
	document.addEventListener('keyup', function (event) {
		if (event.ctrlKey && event.altKey && event.which === 74) GlobalPage.message('openPopover');
	}, true);

	if (parseInt(bv[0], 10) >= 536) {
		var observer = new WebKitMutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
					var node, i;

					for (i = 0; i < mutation.addedNodes.length; i++) {
						node = mutation.addedNodes[i];

						if (node.nodeName === 'A')
							prepareAnchor(node);
						else if (node.nodeName in kinds) {
							if (node.nodeName === 'IFRAME' || node.nodeName === 'FRAME')
								prepareFrame(node);

							canLoad(node);
						}
					}
				}
			});
		});

		observer.observe(document, { childList: true, subtree: true });
	} else {
		document.addEventListener('DOMNodeInserted', canLoad, true);
		document.addEventListener('DOMNodeInserted', prepareFrame, true);
		document.addEventListener('DOMNodeInserted', prepareAnchor, true);
	}

	document.addEventListener('contextmenu', contextmenu, false);
	document.addEventListener('DOMContentLoaded', ready, true);
	document.addEventListener('DOMContentLoaded', prepareAnchors, true);
	document.addEventListener('DOMContentLoaded', prepareFrames, true);
	document.addEventListener('beforeload', canLoad, true);
	document.addEventListener('JSBCommander', commandHandler, true);

	window.onerror = function (d, p, l, c) {
		if (~p.indexOf('JavaScriptBlocker'))
			GlobalPage.message('errorOccurred', d + ', ' + p + ', ' + l);
	};
}