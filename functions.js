export function siteEnabled(rules, url){
	//this function determines whether the site is enabled or not based on the rules having the enabled:false property
	if('enabled' in rules){
		return rules.enabled;
	}else{
		return true;
	}
}

function getSiteRules(items, url){
	let rules = JSON.parse(items.rules);
	console.log("Parsed rules successfully");
	return rules.filter(site => url.includes(site.url));
}

function testImport(){
	console.log("Import worked");
}