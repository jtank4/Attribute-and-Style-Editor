function log(thing){
	console.log(thing);
	return thing;
}

function hasStyles(compdStyles, reqdStyles){ //computed styles, from the element, required styles defined by the user
	return Object.keys(reqdStyles).filter((key, ind) => compdStyles.getPropertyValue(key) == reqdStyles[key]);
}

function matchesStyles(compdStyles, reqdStyles){ //computed styles, from the element, required styles defined by the user
	let filteredStyles = hasStyles(compdStyles, reqdStyles);
	if(filteredStyles.length != Object.keys(reqdStyles).length){
		return false;
	}
	else{
		return true;
	}
}

function notMatchesStyles(compdStyles, reqdStyles){ //computed styles, from the element, required styles defined by the user
	let filteredStyles = hasStyles(compdStyles, reqdStyles);
	if(filteredStyles.length == 0){
		return true;
	}
	else{
		return false;
	}
}

function matchesIdentifiers(el, obj){
	if(obj.hasStyles){
		if(!(matchesStyles(getComputedStyle(el), obj.hasStyles))){
			return false;
		}
	}
	if(obj.notStyles){
		if(!(notMatchesStyles(getComputedStyle(el), obj.notStyles))){
			return false;
		}
	}
	if(obj.hasChildren){
		if(!(obj.hasChildren.length == obj.hasChildren.filter(child => el.querySelector(child) != null).length)){
			return false;
		}
	}
	//add more here later
	return true;
}

function findEls(obj){
	let unfilteredEls = document.querySelectorAll((obj.selector)?obj.selector:"body *");
	return Array.from(unfilteredEls).filter(el => matchesIdentifiers(el, obj));
}

function applyRules(el, obj){
	if(obj.setAttributes){
		Object.keys(obj.setAttributes).map(attr => el.setAttribute(attr, obj.setAttributes[attr]));
	}
	if(obj.removeAttributes){
		obj.removeAttributes.map(attr => el.removeAttribute(attr));
	}
	if(obj.setStyles){
		Object.keys(obj.setStyles).map(key => el.style[key] = obj.setStyles[key]);
	}
}
	
/*
json is how rules will be specified. Each url will have an array of elements, each allowing the user to
specify various filters to make sure the addon only changes the desired element, and allowing the user
to specify various changes to apply to the element.
All identifiers will be checked first before the rules/changes are applied. The special thing here is you can check for
specific computed styles by defining an array of objects called hasStyles. You can also make specify your
element does not have specific properties or that they don't have certain values using notStyles.
You can specify an element has a child by declaring an array of selectors called hasChildren. (you can put
":scope > " before your selector to specify it must be a direct child of the element)
You can check for attributes using default css selector mechanics (see:
https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors).
*/
function main(items, url){
	let rules = JSON.parse(items.rules);
	console.log("Parsed rules successfully");
	let siteRules = rules.filter(site => url.includes(site.url));
	let elRules = siteRules.reduce((acc, el) => acc.concat(el.elements), []);
	let elementArr = elRules.map(el => findEls(el));
	elementArr.map((els, ind) => els.map(el => applyRules(el, elRules[ind])));
}

function loadRules(){
	browser.storage.local.get({"rules":""})
		.then(items => main(items, document.location.href));
}

window.addEventListener("load", loadRules);