function setup(){
	chrome.storage.local.get({"rules":"[]"}, (items) => document.getElementById("rulesBox").value = items.rules);
	document.getElementById("save").addEventListener("click", saveRules);
}

function saveRules(){
	let errBox = document.getElementById("errBox");
	errBox.innerText = "";
	let rules = document.getElementById("rulesBox").value;
	try{
		JSON.parse(rules);
	}
	catch(err){
		errBox.innerText = String(err);
	}
	chrome.storage.local.set({"rules":rules});
}

window.addEventListener("load", setup);