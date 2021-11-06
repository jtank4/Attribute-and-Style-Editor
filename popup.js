function setup(){
	document.getElementById("apply").addEventListener("click", applyRules);
	document.getElementById("options").addEventListener("click", () => chrome.runtime.openOptionsPage());
}

function onError(err){
	console.error(err);
}

function sendApplyRules(tabs){
	for (let tab of tabs) {
		chrome.tabs.sendMessage(
			tab.id,
			"applyRules"
		).catch(onError);
	}
}

function applyRules(){
	chrome.tabs.query({
		currentWindow: true,
		active: true
	}).then(sendApplyRules).catch(onError);
}

window.addEventListener("load", setup);