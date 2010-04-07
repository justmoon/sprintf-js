/**
 * JavaScript sprintf implementation.
 *
 * This implementation imitates PHP's sprintf() function. For syntax information
 * refer to: http://php.net/manual/en/function.sprintf.php
 *
 * Differences to PHP version:
 * 
 *  - Floating point trailing zeros are cut off
 *  - No support for %e
 *
 * Licensed under the MIT license. Copyright 2010 by Stefan Thomas. See LICENSE
 * file for more information. Based on gettext parser by Maxime Haineault, also
 * licensed under the MIT license.
 */

window["sprintf"] = (function ()
{
	var tokenRegexp = /%(?:(\d+)$)?(\+?)('.|0|\x20)?(-)?(\d+)?(\.\d+)?([%bcdufosxX])/g;
	
	var currentArguments;
	var currentRemainingArguments;
	function replaceToken()
	{
		var pSwap = arguments[1], pSign = arguments[2], pPad = arguments[3],
		    pJustify = arguments[4], pMinLength = arguments[5],
		    pPrecision = arguments[6], pType = arguments[7];
		
		if (pType == '%') return '%';
		else {
			var param;
			if (pSwap) {
				param = currentArguments[pSwap];
			} else if (currentRemainingArguments.length < 1) {
				// Next argument requested, but none remain
				console.error('sprintf Error: Arguments count ('+ arguments.length +') does not match replacement token count ('+ str.match('%','g').length +').');
				return str;
			} else {
				param = currentRemainingArguments.shift();
			}
			
			var subst = param;
			
			// Convert parameter
			if (pType == 'b')      subst = parseInt(param).toString(2);
			else if (pType == 'c') subst = String.fromCharCode(parseInt(param));
			else if (pType == 'd') subst = parseInt(param) ? parseInt(param) : 0;
			else if (pType == 'u') subst = Math.abs(param);
			else if (pType == 'o') subst = parseInt(param).toString(8);
			else if (pType == 's') subst = param;
			else if (pType == 'x') subst = ('' + parseInt(param).toString(16)).toLowerCase();
			else if (pType == 'X') subst = ('' + parseInt(param).toString(16)).toUpperCase();
			else if (pType == 'f') {
				if (pPrecision) pPrecision = parseInt(pPrecision.substring(1));
				else pPrecision = 6;
				
				subst = Math.round(parseFloat(param) * Math.pow(10, pPrecision)) / Math.pow(10, pPrecision);
				
			}
			
			// Apply padding/alignment
			if (pMinLength) {
				if (pPad && pPad.substr(0,1) == "'") pPad = pPad.substr(1,1);
				else if (pPad.length == 0) pPad = ' ';
				
				var padding = Array(parseInt(pMinLength) + 1 - subst.length).join(pPad);
				
				var justifyRight = pJustify !== "-";
				
				if (justifyRight) subst = padding + subst;
				else subst = subst + padding;
			}
		}
		
		return subst;
	};
	
	return function sprintf(format)
	{
		try {
			// Convert "arguments" to true Array
			var args = Array.prototype.slice.call(arguments);
			
			// Get format string
			var str = args.shift();

			// Other arguments may be given as an arry.
			if (args.length == 1 && "object" == typeof args[0]) args = args[0];
			
			// Parse format string and return result
			currentArguments = currentRemainingArguments = args;
			return str.replace(tokenRegexp, replaceToken);
		} catch (e) {
			// If something goes very wrong, at least output the format string back
			return format;
		}
	};
})();
	
