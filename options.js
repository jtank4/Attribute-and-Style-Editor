function saveSuccess(e){
	errBox.innerText = "Saved " + String(new Date());
}

function saveFailure(e){
	console.log("Failed to save Attribute and Style editor rules, error below.");
	console.log(e);
	errBox.innerText = String(e);
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
	browser.storage.local.set({"rules":rules}).then(saveSuccess, saveFailure);
}

function setup(){
	browser.storage.local.get({"rules":"[]"}).then(items => document.getElementById("rulesBox").value = items.rules);
	document.getElementById("save").addEventListener("click", saveRules);
}

window.addEventListener("load", setup);