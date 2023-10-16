//refer to comments in main.js loadrules() as to when I can use the below import statement
//import * as funs from "./functions.js"

function onError(err){
	console.error(err);
}

function sendApplyRules(tabs){
	for (let tab of tabs) {
		browser.tabs.sendMessage(
			tab.id,
			"applyRules"
		).catch(onError);
	}
}

function applyRules(){
	browser.tabs.query({
		currentWindow: true,
		active: true
	}).then(sendApplyRules).catch(onError);
}

function setupWithRules(items, url){
	let rules;
	try{
		rules = JSON.parse(items.rules);
	}catch(e){
		rules = [];
		console.log(e);
	}
	let siteRules = rules.filter(site => url.includes(site.url));
	//we will determine if a site is disabled based off the first rule that applies to the site, but if the user
	//chooses to enable or disable them we will change the property on all rules that apply to the site
	let siteEnabled;
	if(siteRules[0] instanceof Object && 'enabled' in siteRules[0]){
		siteEnabled = siteRules[0].enabled;
	}else{
		siteEnabled = true; //If we don't have the enabled property at all, default to enabled
	}
	console.log(siteEnabled);
	document.getElementById("apply").addEventListener("click", applyRules);
	document.getElementById("options").addEventListener("click", () => browser.runtime.openOptionsPage());
	let enableDisable = document.getElementById("enableDisable");
	enableDisable.value = (siteEnabled)?"Disable":"Enable";
}

function setup(url){
	document.getElementById("apply").addEventListener("click", applyRules);
	document.getElementById("options").addEventListener("click", () => browser.runtime.openOptionsPage());
}

function loadRules(){
	browser.storage.local.get({"rules":""})
		.then(items => setupWithRules(items, document.location.href));
}

console.log("Attribute and Style Editor popup.js is working");
setup(document.location.href)
//I was planning on adding a way to temporarily disable rules on a page so I added the line below that can load the
//rules so we can determine if there's a temp disable property. If I ever end up needing the rules in here,
//uncomment the following line.
//window.addEventListener("load", loadRules);
