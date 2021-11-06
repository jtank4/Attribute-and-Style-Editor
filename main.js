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

function applyChanges(el, obj){
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

function findElsAndApplyChanges(siteRules){
	console.log("Finding elements and applying changes.");
	let elRules = siteRules.reduce((acc, el) => acc.concat(el.elements), []);
	let elementArr = elRules.map(el => findEls(el));
	elementArr.map((els, ind) => els.map(el => applyChanges(el, elRules[ind])));
}

function main(items, url){
	let rules = JSON.parse(items.rules);
	console.log("Parsed rules successfully");
	let siteRules = rules.filter(site => url.includes(site.url));
	let refreshedSites = siteRules.filter(site => !isNaN(site.refresh));
	if(refreshedSites.length > 0){
		let lowestRefreshTime = refreshedSites.reduce((acc, site) => Math.min(acc, parseInt(site.refresh)), parseInt(refreshedSites[0].refresh));
		setInterval(findElsAndApplyChanges, Math.max(lowestRefreshTime, 1000), siteRules);
	}
	siteRules.map(site => {if(!(isNaN(site.tryAgain))){setTimeout(findElsAndApplyChanges, parseInt(site.tryAgain), siteRules)}});
	findElsAndApplyChanges(siteRules);
}

function loadRules(){
	chrome.storage.local.get({"rules":""}, (items) => main(items, document.location.href));
}

window.addEventListener("load", loadRules);
chrome.runtime.onMessage.addListener(request => {if(request == "applyRules"){loadRules()}});