var resultDictionary = {};
function doSpellcheck() {
	let editor = document.querySelector('.sp-editor');
	prepare(editor);
	process();

}

function prepare(editor) {
	editor.innerHTML = editor.innerText.replace(/(^|<\/?[^>]+>|\s+)([^\s<]+)/g, '$1<span class="word">$2</span>');
}

function checkWord(word) {
	if (resultDictionary[word] && resultDictionary[word].result) {
		return new Promise((resolve, reject) => { resolve("Value already checked"); });
	}
	return $.getJSON('/api/spellcheck', { word }, (data) => {
		resultDictionary[word].result = data;
	});
}

function addMenuItem(label, word) {
	var menuitem = document.createElement("menuitem");
	menuitem.label = label;
	menuitem.for = word;
	document.querySelector("#suggestions").appendChild(menuitem);
	menuitem.addEventListener("click", (event) => {
		let word = event.target.for;
		resultDictionary[word].node.innerText = event.target.label;
		resultDictionary[word].node.classList.remove("error");
		resultDictionary[word].node.result.suggestions=[];
	});
}

function process() {
	let words = document.querySelectorAll(".word");
	let i = words.length;
	while (i--) {
		let word = words[i].innerText;
		if (!resultDictionary[word]) {
			resultDictionary[word] = {};
		}
		resultDictionary[word].node = words[i];
		resultDictionary[word].node.classList.remove("error");
		checkWord(word).then(() => onResult(word));
	}
}

function onResult(word) {
	if (!resultDictionary[word].result.correct) {
		resultDictionary[word].node.classList.add("error");
	}
	resultDictionary[word].node.addEventListener(
		"contextmenu",
		onContextClick,
		false
	);
}
function onContextClick() {
	let word = this.innerText;
	if (!word || !resultDictionary[word]) {
		return;
	}
	let suggestionsNode = document.getElementById("suggestions")
	if (suggestionsNode) {
		document.getElementById("suggestionsmenu").removeChild(suggestionsNode);
	}
	let suggestions = resultDictionary[word].result.suggestions;
	if (!suggestions || !suggestions.length) {
		return;
	}
	menu = document.createElement("menu");
	menu.label = "Suggestions";
	menu.id = "suggestions"
	document.getElementById("suggestionsmenu").appendChild(menu);
	for (let i = 0; i < suggestions.length; i++) {
		addMenuItem(suggestions[i], word);
	}
}
