/***************************************
 * @file js/poppies.js
 * @author Travis Roman (travis@toggleable.com)
 * @package JavaScript Blocker (http://javascript-blocker.toggleable.com)
 ***************************************/

JavaScriptBlocker.poppies = {
	add_rule: function (main) {
		var zoo = {
			me: this,
			main: main,
			content: [
				'<div>',
					'<p class="misc-info">', this.header, '</p>',
					'<p>',
						_('Enter the pattern for the URL(s) you want to affect.'),
					'</p>',
					'<p id="rules-radios">',
						'<input id="select-type-normal" checked="checked" type="radio" name="select-type" value="0" /> ',
						'<label for="select-type-normal">', _('Normal Block'), ' &nbsp;</label>',
						'<input id="select-type-high" type="radio" name="select-type" value="6" />  ',
						'<label for="select-type-high">', _('High-priority Block'),' &nbsp;</label>',
						'<input id="select-type-high-opposite" type="radio" name="select-type" value="7" />  ',
						'<label for="select-type-high-opposite">', _('High-priority Allow'), '</label>',
					'</p>',
					'<div class="inputs">',
						'<textarea id="rule-input" wrap="off"></textarea> ',
						'<input type="button" value="', _('Save'), '" id="rule-save" />',
					'</div>',
				'</div>'].join(''),
			save: function (no_refresh) {
				main.rules.add($('#domain-picker', main.popover).val(), this.val(), this.parent().prev().find('input:checked').val());

				if (!no_refresh) {
					safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('reload');
					new Poppy();
				}
				
				return this.parent().prev().find('input:checked').val();
			},
			callback: function () {
				var i = $('#poppy #rule-input', main.popover).val(zoo.me.url).focus();
		
				i.keypress(function (e) {
					if (e.keyCode == 13 || e.keyCode == 3) {
						zoo.save.call(i);
						e.preventDefault();
					}
				}).siblings('#rule-save').click(function () {
					zoo.save.call(i);
				});
			}
		};
		
		return zoo;
	}
};