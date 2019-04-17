function drawSortingScreen(newCards){
	if (document.getElementsByClassName("bucket").length === 0){
		// If we haven't drawn the sorting screen once, do that
		while (document.body.firstChild && document.body.firstChild.id != "file") {
        document.body.removeChild(document.body.firstChild);
    	}
	}
	// If we have previously sorted all the cards, add them back 
	if (!document.getElementById("bucket0")){
		drawBucket(0);
	}

    if (document.getElementsByClassName("bucket").length < 1){
        alert("Something went wrong during upload."); 
        return; 
	} 
	
    for (var i = 0; i < newCards.length; i++){
        drawCard(newCards[i]); 
	}
	document.getElementById("add-more").style.visibility = "visible"; 
}

function drawBucket(bucketNumber) {
	var bucket = document.createElement("div");
	bucket.className = "bucket";
    bucket.id = "bucket" + String(bucketNumber);
    if (document.getElementById(bucket.id)){
        return; 
    }
	bucket.ondrop = function(event) {
		drop(event);
	};
	bucket.ondragover = function(event) {
		allowDrop(event);
	};
	bucket.ondragleave = function(event) {
		dragleave(event);
    };
    
	var bucketActions = document.createElement("div");
	var shortcut = document.createElement("div");
	var cardCount = document.createElement("div"); 

    shortcut.className = "shortcut";
    shortcut.id = "shortcut"+ String(bucketNumber);
	shortcut.innerHTML = String(bucketNumber);
	
	cardCount.className = "cardCount"; 
	cardCount.id = "cardCount" + String(bucketNumber);
	
	bucketActions.className = "bucketActions";
	bucketActions.id = "bucketActions" + String(bucketNumber);
	bucketActions.append(shortcut);  
	bucketActions.append(cardCount);
    bucket.append(bucketActions);  
	document.body.append(bucket);
}


function Card(message, date, source, url, tags, id) {
	this.message = message;
	this.id = "card" + id;
	this.date = date;
	this.source = source;
    this.url = url;
    this.tags = tags;
}

function drawCard(card) {
    if (!card){
        console.log("The card does not appear to exist.");
        return -1; 
    }
	// this will make the card a little more "real"
	var physicalCard = document.createElement("div");
	var tagsContainer = document.createElement("div");
	physicalCard.draggable = "true";
	physicalCard.id = card.id;
	physicalCard.className = "card";
	physicalCard.innerHTML = card.message;
	physicalCard.onclick = function(event) {
		drawLargeCard(card);
	};
	physicalCard.ondragstart = function(event) {
		drag(event);
	};
	physicalCard.ondragend = function(event) {
		dragend(event);
	};
	tagsContainer.className = "tags";
    var str = String(card.tags + card.date + card.url + card.source + "ID: " + card.id); 
    tagsContainer.innerHTML = str;
	physicalCard.append(tagsContainer);
	document.getElementById("bucket0").append(physicalCard);
	redraw(); 
}

function drawLargeCard(card) {
	var bg = document.createElement("div");
	var modalCard = document.createElement("div");
	var modalCardX = document.createElement("div");
	var modalCardMessage = document.createElement("div");
	var modalCardTags = document.createElement("div");
	var modalCardActions = document.createElement("div");
	var modalCardDelete = document.createElement("div");
	var modalCardPromote = document.createElement("div");
	modalCard.id = "modalCard";
	modalCardX.id = "x";
	modalCardMessage.id = "modalCardMessage";
	modalCardTags.id = "modalCardTags";
	modalCardActions.className = "modalCardActions";
	modalCardDelete.id = "modalCardDelete";
	modalCardPromote.id = "modalCardPromote";
	modalCardDelete.className = "modalCardAction";
	modalCardPromote.className = "modalCardAction";
	bg.id = "backgroundCover";

	modalCardX.innerHTML = "x";
	modalCardDelete.innerHTML = "Delete";
	if (document.getElementById(card.id).classList.contains( "blueCard")){
		modalCardPromote.innerHTML = "Demote to normal card"; 
	} else {
		modalCardPromote.innerHTML = "Promote to blue card"; 
	}

	modalCardDelete.onclick = function() {
		closeLargeCard(card);
		deleteCard(card); 
	};
	modalCardPromote.onclick = function() {
		console.log("Trying to  convert this card to a blue card."); 
		// Should also make this the first card on the list.
		console.log(card); 
		document.getElementById(card.id).classList.toggle("blueCard");
		if (document.getElementById(card.id).classList.contains( "blueCard")){
			modalCardPromote.innerHTML = "Demote to normal card"; 
		} else {
			modalCardPromote.innerHTML = "Promote to blue card"; 
		}
	};
	modalCardX.onclick = function() {
		closeLargeCard(card);
	};
	modalCardMessage.innerHTML = card.message;

	if (card.tags != null){
		var tagsArray = card.tags.split(',');
		for (var i = 0; i < tagsArray.length;i++){
			var tagTag = document.createElement("div");
			tagTag.innerHTML = tagsArray[i]; 
			tagTag.className = "tag";
			modalCardTags.append(tagTag);
		}
	}
	if (card.date != null){
		var dateTag = document.createElement("div");
		dateTag.innerHTML = card.date;
		dateTag.className = "tag";
		modalCardTags.append(dateTag);
	}
	if (card.source != null){
		var sourceTag = document.createElement("div");
		sourceTag.innerHTML = card.source;
		sourceTag.className = "tag";
		modalCardTags.append(sourceTag);
	}
	if (card.url != null){
		var urlTag = document.createElement("div"); 
		urlTag.innerHTML = card.url; 
		urlTag.clasName = "tag"; 
		modalCardTags.append(urlTag);
	}

	document.body.append(bg);
	modalCard.append(modalCardX);
	modalCard.append(modalCardMessage);
	modalCardActions.append(modalCardPromote);
	modalCardActions.append(modalCardDelete);
	modalCard.append(modalCardTags);
	modalCard.append(modalCardActions);
	document.body.append(modalCard);
}

function closeLargeCard(card) {
	var myNode = document.getElementById("modalCard");
	var bg = document.getElementById("backgroundCover");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
	myNode.parentNode.removeChild(myNode);
	bg.parentNode.removeChild(bg);
}


function drawSelectionModal(headers, file) {
	var bg = document.createElement("div");
	var modalCard = document.createElement("div");
	var modalCardX = document.createElement("div");
	var modalCardTitle = document.createElement("div");
	var modalCardOptions = document.createElement("div");
	var modalButton = document.createElement("div");
	console.log("headers", headers);
	for (var i = 0; i < headers.length; i++){
		var option = document.createElement("div");
		option.id = String(headers[i]);
		option.className = "selectionOption"; 
		option.innerHTML = String(option.id); 
		modalCardOptions.append(option); 
		option.addEventListener("click", function(ev, file){
			console.log("The selected option is: ", event.target.id); 
			document.getElementById(event.target.id).classList.toggle("selectedOption");
		});
	}
	modalCard.id = "modalCard";
	modalCardTitle.id = "modalCardTitle"; 
	modalCardX.id = "x";
	modalCardOptions.id = "modalCardOptions"; 
	modalButton.id = "modalButton"; 
	modalButton.innerHTML = "Next"; 
	modalButton.addEventListener("click", function (ev){
		var ids = []; 
		var foundOptions = document.getElementsByClassName("selectedOption");
		for (var i = 0; i < foundOptions.length; i++){
			ids.push(foundOptions[i].id); 
		} 
		parseWholeFile(file, ids[0], "", "Custom Source", headers, "");
		closeLargeCard(modalCard);
		return ids;
	});
	modalCardTitle.innerHTML = "Please select what you would like to use as a message";
	bg.id = "backgroundCover";
	modalCardX.innerHTML = "x";
	modalCardX.onclick = function() {
		closeLargeCard(modalCard);
	};

	document.body.append(bg);
	modalCard.append(modalCardX);
	modalCard.append(modalCardTitle);
	modalCard.append(modalCardOptions);
	modalCard.append(modalButton); 
	document.body.append(modalCard);
}

function generateModel(){
	var model = [[]]; 
	var buckets = document.getElementsByClassName("bucket"); 
	for (var i = 0; i < (buckets.length); i++){
		model[i] = []; 
		if (buckets[i].hasChildNodes()){
			var cards = buckets[i].childNodes; 
			for (var j = 0; j < cards.length; j++){
				model[i][j] = cards[j].id; 
			}
		}
	}
	return model; 
}

function updateBucket(cardID, fromBucketID, targetID) {
	console.log("from bucket id ", fromBucketID); 
	var fromPosition = -1;
	var buckets = generateModel(); 
	var toPosition = -1;
	var card = cardID.substring(4);
	var toBucket = -1;
	var fromBucket = fromBucketID.substring(6);
	var fromBucketCards = buckets[parseInt(fromBucket)];
	for (var i = 0; i < fromBucketCards.length; i++) {
		if (fromBucketCards[i].id === cardID) {
			fromPosition = i;
		} else {
			console.log("We couldn't find " + cardID + " in " + fromBucketID);
		}
	}
	if (document.getElementById(targetID).className == "bucket") {
		toBucket = targetID.substring(6);
		toPosition = buckets[parseInt(toBucket)].length;
	} else if (document.getElementById(targetID).className == "card") {
		toBucket = document.getElementById(targetID).parentNode.id.substring(6);
		toPosition = targetID.substring(4);
	}
	console.log(
		"We are moving card " +
			card +
			" from bucket " +
			fromBucket +
			" " +
			fromPosition +
			" to bucket " +
			toBucket +
			" " +
			toPosition
	);
}

// Drag handlers

function allowDrop(ev) {
    ev.preventDefault();
	ev.currentTarget.style.backgroundColor = "#ddd";    
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function dragend(ev) {
	//ev.currentTarget.style.border = "none";
}

function dragleave(ev) {
	ev.preventDefault();
	ev.currentTarget.style.backgroundColor = "#eeeeeeaa";
}

function drop(ev) {
	ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    buckets = generateModel(); 
	if (ev.target.className == "bucket") {
		updateBucket(data, document.getElementById(data).parentNode.id, ev.target.id);
		ev.target.appendChild(document.getElementById(data));
	} else if (ev.target.className == "card") {
		updateBucket(data, document.getElementById(data).parentNode.id, ev.target.id);
		ev.target.parentNode.insertBefore(document.getElementById(data), ev.target);
	}
	ev.currentTarget.style.backgroundColor = "#eeeeeeaa";
	document.getElementById("shortcut0").innerHTML = String(generateModel()[0].length);
	redraw(); 
}

function updateCardView(cardID, fromID, toArrayID, toPos) {
	var tempCard = document.getElementById(cardID);
	tempCard.parentNode.removeChild(tempCard);
	var toArray = document.getElementById(toArrayID);
	if (toArray.firstChild.nextSibling != null) {
		toArray.insertBefore(tempCard, toArray.firstChild.nextSibling);
	} else {
		toArray.appendChild(tempCard);
	}
}

function deleteCard(card){
	var thisCard = document.getElementById(card.id); 
	var thisBucket = thisCard.parentNode; 
	thisBucket.removeChild(thisCard); 
	//ideally we would then save the card and its position here
}

document.addEventListener("keydown", function(event) {
    var buckets = generateModel(); 
    var key = event.keyCode;
	var tempID = -1; 
	if (!document.getElementById("bucket0").firstChild.nextSibling){
		return; 
	}
    var cardID = document.getElementById("bucket0").firstChild.nextSibling.id;
	if (key >= 49 && key <= 58) {
        if (key-48 >= buckets.length){
            drawBucket(buckets.length);
            tempID = "bucket" + String(buckets.length);
        } else {
            tempID = "bucket" + String(key - 48);

			var whichKey = document.getElementById("bucketActions" + String(key-48));
            var parent = whichKey.parentNode; 
            whichKey.parentNode.removeChild(whichKey);
            parent.insertBefore(whichKey, parent.firstChild); 

        }
		updateCardView(cardID, "bucket0", tempID, 0);
		redraw(); 
	}
});

function redraw(){
	var cardsRemaining = generateModel()[0].length - 1; 
	document.getElementById("shortcut0").innerHTML = String(cardsRemaining);
	for (var i = 1; i < generateModel().length; i++){
		var tempBucketID = "cardCount" + String(i);
		var tempCardsInBucket = generateModel()[i].length - 1;
		document.getElementById(tempBucketID).innerHTML = tempCardsInBucket + " cards";
	}
	if (cardsRemaining <= 0){
		document.getElementById("bucket0").style.display = "none"; 
	}
}

function about(){
	var aboutCard = new Card(
	"If you work in industry, you probably collect data from feedback widgets. "+ 
	"You can usually export that data as a .CSV file. " +
	"Affinity CSV puts that data into a format where you can organize data into like columns to crystallize insights." ,
	"21 December 2018", //date
	"", //source
	"", //url
	"", //tag
	String( Math.floor((Math.random() * 1000000) + 1)), //generate a random ID
	);
	drawLargeCard(aboutCard); 
}