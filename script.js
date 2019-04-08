/*global fetch DOMParser goodReadsApiKey*/

function search(e) {
	e.preventDefault();
	const keyword = document.getElementById("keyword").value;
	console.log(keyword);
	const endpoint = "https://www.goodreads.com/search/index.xml";
	const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
	const url = corsAnywhere + endpoint + "?key=" + goodReadsApiKey + "&q=" + keyword;
	fetch(url)
	.then(function(response) {
		return response.text();
		}).then(function(response){
			const parser = new DOMParser();
			const parsedRes = parser.parseFromString(response, "text/xml");
			const parsedJsonResponse = xmlToJson(parsedRes);
			console.log(parsedJsonResponse);
			displayResults(parsedJsonResponse);
	});	
}		

function displayResults(parsedObj){
	const works = parsedObj.GoodreadsResponse.search.results.work;
	var liGroup = "";
	works.forEach(function(work){
		const author = work.best_book.author.name['#text'];
		const title = work.best_book.title['#text'];
		const imgUrl = work.best_book.image_url['#text'];
		const li = "<li>" + title + "by" + author + "</li>";
		const img = "<img src=" + imgUrl + " />";
		liGroup += (li + img);


	});
	document.getElementById('list').innerHTML = liGroup;
}


//	Changes XML to JSON
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}

