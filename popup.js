function setup(){
	document.getElementById("apply").addEventListener("click", applyRules);
	document.getElementById("options").addEventListener("click", () => browser.runtime.openOptionsPage());
}

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

window.addEventListener("load", setup);