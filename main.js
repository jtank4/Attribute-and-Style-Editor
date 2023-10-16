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
	//once that bug is fixed use this function def instead: function main(items, funs, url){
	console.log(items);
	let rules;
	try{
		rules = JSON.parse(items.rules);
		console.log("Parsed rules successfully");
	}catch(e){
		rules = [];
		console.log(e);
	}
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
	//https://bugzilla.mozilla.org/show_bug.cgi?id=1803950
	//I'll be able to use the dynamic import below once the above bug is fixed. As as recap:
	//I want to avoid duplication of code by using a functions file
	//I could include the functions file in the context script section and use the functions fine here no problem,
	//but only if they don't have the export statements in the functions file, because those are not allowed in a
	//non module context. So then I can't do the normal import in the popup.js
	//So the right way to do it, it seems, is to do the export and use a dynamic import() which works in a non
	//module context. However because of the above bug, the dynamic import tries to import it from whatever site
	//you're on instead of from the addon's files.
	/*
	Promise.all([browser.storage.local.get({"rules":""}), import("./functions.js")]).then( 
		values => main(values[0], values[1], document.location.href)
	);
	You also need to put this in the manifest below icons
	"web_accessible_resources": [
    {
      "resources": ["./functions.js"],
	  "matches": ["<all_urls>"]
    }
  ],
  
	
	*/
	console.log("Loaded, ASE is now loading rules");
	browser.storage.local.get({"rules":""}).then( 
		items => main(items, document.location.href)
	);
}

console.log("Attribute and Style Editor main.js is working");
window.addEventListener("load", loadRules);
if(document.readyState == "complete"){
	console.log("Document was already loaded ASE is removing onload event listener");
	window.removeEventListener("load", loadRules);
	loadRules();
}
else{
	console.log("Document was not yet loaded, onload event will trigger ASE");
}
browser.runtime.onMessage.addListener(request => {if(request == "applyRules"){loadRules()}});