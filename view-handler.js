function drawSortingScreen(newCards){
	if (document.getElementsByClassName("bucket").length === 0){
		// If we haven't drawn the sorting screen once, do that
		while (document.body.firstChild && document.body.firstChild.id != "global-actions") {
        document.body.removeChild(document.body.firstChild);
    	}
	}
	// If we have previously sorted all the cards, add them back 

	var numBuckets = 6; //default to 6 buckets drawn on inital screen
	if (window.localStorage.getItem('cardDict') != null){
		console.log("we're tring to redraw but we've detected smtn in local storage");
		allCards = JSON.parse(window.localStorage.getItem('cardDict'));
		model = JSON.parse(window.localStorage.getItem('model'));
		numBuckets = model.length;
		for (var b = 0; b < numBuckets; b++){
			drawBucket(b);
			var bucketLength = model[b].length; 
			for (var c = 0; c < bucketLength; c++){
				drawCard(allCards[(model[b][bucketLength-c-1])], b); 
			}
		}
	} else {
		console.log("didn't find anything, must be new! ");
		for (var i = 0; i < numBuckets; i++){
			var bucketID = "bucket" + String(i);
			if (!document.getElementById(bucketID)){
				drawBucket(i);
			}
		}
		
		for (var i = 0; i < newCards.length; i++){
			drawCard(newCards[i], 0); 
		}
	}

	if (document.getElementsByClassName("bucket").length < 1){
		alert("Something went wrong during upload."); 
		return; 
	} 

	document.getElementById("add-more").style.visibility = "visible"; 
	document.getElementById("save-to-local").style.visibility = "visible"; 
	document.getElementById("start-over").style.visibility = "visible"; 
}

function drawBucket(bucketNumber) {
	var bucket = document.createElement("div");
	bucket.className = "bucket";
	bucket.draggable = "true"; 
    bucket.id = "bucket" + String(bucketNumber);
    if (document.getElementById(bucket.id)){
		console.log("This bucket already exists"); 
        return; 
	}
	/* For dragging the bucket */
	bucket.ondragstart = function (event){
		drag(event);
	}
	/* For dragging cards into the bucket */
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
	var addNewCard = document.createElement("div"); 

    shortcut.className = "shortcut";
    shortcut.id = "shortcut"+ String(bucketNumber);
	shortcut.innerHTML = String(bucketNumber);
	
	cardCount.className = "cardCount"; 
	cardCount.id = "cardCount" + String(bucketNumber);

	addNewCard.className = "addNewCard"; 
	addNewCard.id = "addNewCard" + String(bucketNumber); 
	addNewCard.innerHTML = "+▨";
	addNewCard.onclick = function() {
	var thiscard = addCard("", "Add a message here", "", "User researcher", "Researcher added");
	drawCard(thiscard, bucketNumber);
	};

	
	bucketActions.className = "bucketActions";
	bucketActions.id = "bucketActions" + String(bucketNumber);
	bucketActions.append(shortcut);  
	bucketActions.append(cardCount);
	bucketActions.append(addNewCard);
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

function drawCard(card, bucketNumber) {
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
	console.log(card.tags);
    //var str = String(card.tags + card.date + card.url + card.source + "ID: " + card.id); 
    tagsContainer.innerHTML = card.tags;
	physicalCard.append(tagsContainer);
	var whichBucket = "bucket"+ String(bucketNumber);
	//document.getElementById(whichBucket).append(physicalCard);
	var parentBucket = document.getElementById(whichBucket);
	parentBucket.insertBefore(physicalCard, parentBucket.childNodes[1]);
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
	var modalCardAddTranslation = document.createElement("div"); 
	modalCard.id = "modalCard";
	modalCardX.id = "x";
	modalCardMessage.id = "modalCardMessage";
	modalCardMessage.contentEditable="true";
	modalCardTags.id = "modalCardTags";
	modalCardActions.className = "modalCardActions";
	modalCardDelete.id = "modalCardDelete";
	modalCardPromote.id = "modalCardPromote";
	modalCardAddTranslation.id = "modalCardAddTranslation"; 
	modalCardDelete.className = "modalCardAction";
	modalCardPromote.className = "modalCardAction";
	modalCardAddTranslation.className = "modalCardAction"; 
	bg.id = "backgroundCover";

	modalCardX.innerHTML = "x";
	modalCardDelete.innerHTML = "Delete";
	console.log(card);
	console.log(card.id);
	if (card.id != "cardabout"){
		if (document.getElementById(card.id).classList.contains( "blueCard")){
			modalCardPromote.innerHTML = "Demote to normal card"; 
		} else {
			modalCardPromote.innerHTML = "Promote to blue card"; 
		}
	}

	//modalCardActions.innerHTML = "Add Translation"; 

	modalCardDelete.onclick = function() {
		closeLargeCard(card);
		deleteCard(card); 
	};
	modalCardPromote.onclick = function() {
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

	bg.onclick = function(){
		console.log("We're tring to close this card modal");
		closeLargeCard(card);
	}
	modalCardMessage.innerHTML = card.message;

	if (card.tags != null){
		var tagsArray = card.tags.split(',');
		for (var i = 0; i < tagsArray.length;i++){
			var tagTag = document.createElement("div");
			tagTag.innerHTML = tagsArray[i]; 
			tagTag.className = "tag";
			var toolColors = ["compress", "convert", "word", "ppt", "excel", "jpg", "merge", "split", "rotate", "edit", "delete", "sign", "unlock", "protect"];
			for (var c = 0; c < toolColors.length; c++){
				if ((tagTag.innerHTML.toLowerCase()).includes(toolColors[c])){
					tagTag.classList.add("color-"+toolColors[c]);
				} 
				if (tagTag.innerHTML.toLowerCase().includes("design")){
					tagTag.classList.remove("color-"+toolColors[c]);	
				}
			}
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
	modalCardActions.append(modalCardAddTranslation); 
	modalCardActions.append(modalCardPromote);
	modalCardActions.append(modalCardDelete);
	
	modalCard.append(modalCardTags);
	modalCard.append(modalCardActions);
	document.body.append(modalCard);
}

function updateCardText(card){
	if (document.getElementById("modalCardMessage") == null){
		return; 
	}
	var tempText = document.getElementById("modalCardMessage").innerHTML; 
	card.message = tempText; 
	document.getElementById(card.id).innerHTML = tempText;
	return;
}

function closeLargeCard(card) {
	updateCardText(card);
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
		console.log("about to call parseWholeFile");
		parseWholeFile(file, ids, "", "Custom Source", headers, "");
		closeLargeCard(modalCard);
		return ids;
	});
	modalCardTitle.innerHTML = "Please select what you would like to use as a message";
	bg.id = "backgroundCover";
	modalCardX.innerHTML = "x";
	modalCardX.onclick = function() {
		closeLargeCard(modalCard);
		return null;
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
	for (var b = 0; b < (buckets.length); b++){
		model[b] = []; 
		if (buckets[b].getElementsByClassName("card").length > 0){
			var morecards = (buckets[b]).getElementsByClassName("card");
			for (var j = 0; j < morecards.length; j++){
				model[b][j] = morecards[j].id; 
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
	//ev.currentTarget.classList.add("hover-bucket");   
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function dragend(ev) {
	//ev.currentTarget.style.border = "none";
}

function dragleave(ev) {
	ev.preventDefault();
	ev.currentTarget.style.backgroundColor = "#00000022";
	//ev.currentTarget.classList.remove("hover-bucket");
}

function drop(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text"); // the ID of the thing we're draggin around
	console.log("data: ", data);
	if (document.getElementById(data).classList.contains("bucket")){
		// Then we're moving a bucket around
		if (ev.target.className == "bucket"){
			console.log("bucket into bucket"); 
			ev.target.parentNode.insertBefore(document.getElementById(data), ev.target);
		} else if (ev.target.className == "card" || ev.target.className == "bucketActions"){
			console.log("Target is: ", ev.target.parentNode);
			ev.target.parentNode.parentNode.insertBefore(document.getElementById(data), ev.target.parentNode);
		} else {
			console.log("bucket into something not a bucket: ", ev.target);
		}
	} else if (document.getElementById(data).classList.contains("card")){
		//then we're dropping a card 
		buckets = generateModel(); 
		if (ev.target.className == "bucket") {
			updateBucket(data, document.getElementById(data).parentNode.id, ev.target.id);
			ev.target.appendChild(document.getElementById(data));
		} else if (ev.target.className == "card") {
			updateBucket(data, document.getElementById(data).parentNode.id, ev.target.id);
			ev.target.parentNode.insertBefore(document.getElementById(data), ev.target);
		}
	}
	ev.currentTarget.style.backgroundColor = "#00000022";
	//ev.currentTarget.classList.remove("hover-bucket");
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
	/* If there are no cards in original column, do nothing */
	if (countVisibleCardsInBucket("bucket0") < 1){
		return; 
	}
	//var cardID = document.getElementById("bucket0").firstChild.nextSibling.id;
	var cardID = getFirstVisibleCardInBucket("bucket0"); 
	if (key >= 49 && key <= 58) {
        if (key-48 >= buckets.length){
            drawBucket(buckets.length);
            tempID = "bucket" + String(buckets.length);
        } else {
            tempID = "bucket" + String(key - 48);

			/* Animates the bucket identifier to show where card was added */
			var whichKey = document.getElementById("bucketActions" + String(key-48));
			var parent = whichKey.parentNode; 
			whichKey.parentNode.removeChild(whichKey);
            parent.insertBefore(whichKey, parent.firstChild); 

        }
		updateCardView(cardID, "bucket0", tempID, 0);
		redraw(); 
	}
});

function getNumberOfCardsInBucket(bucketID){
	return document.getElementById(bucketID).getElementsByClassName("card").length;
}

function getFirstVisibleCardInBucket(bucketID){
	var bucket = document.getElementById(bucketID); 
	var cards = bucket.getElementsByClassName("card"); 
	if (!document.getElementById(bucketID).firstChild.nextSibling){
		return; 
	} 
	for (var i = 0; i < cards.length; i++){
		if (cards[i].style.display !== "none"){
			return cards[i].id;
		}
	}
	console.log("There are no visible cards in this bucket"); 
	return -1; 
}

function redraw(){
	document.getElementById("save-to-local").innerHTML = "💾"; 
	document.getElementById("save-to-local").style.backgroundColor = "";
	var cardsRemaining = generateModel()[0].length; 
	//var cardsRemaining = countVisibleCardsInBucket("bucket0"); // actual # of cards
	//document.getElementById("shortcut0").innerHTML = String(cardsRemaining); // # of hidden cards
	for (var i = 0; i < generateModel().length; i++){
		var tempBucketID = "cardCount" + String(i);
		var tempCardsInBucket = generateModel()[i].length;
		if (tempCardsInBucket == 0){
			document.getElementById(tempBucketID).innerHTML = "Drag and drop a card here to add it to this column <br><br> Or press '" + String(i) + "' <br><br>"; // # of hidden cards
			document.getElementById("bucket"+ String(i)).style.minHeight = "150px";
		} else if (tempCardsInBucket == 1){
			document.getElementById(tempBucketID).innerHTML = tempCardsInBucket + " card"; // # of hidden cards
		} else {
			document.getElementById(tempBucketID).innerHTML = tempCardsInBucket + " cards"; // # of hidden cards
		}
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
	"about", // ID is the text "about"
	);
	drawLargeCard(aboutCard); 
}

function showCard(cardID){
	document.getElementById(cardID).style.display = "";
}

function hideCard(cardID){
	/*Hides a card that has been imported 
	For example, if user only wants to sort cards with a certain tag */
	document.getElementById(cardID).style.display = "none";
}

function showCardsWithTag(tag){
	/* Hide all cards with tag, to allow users to filter by tag */
	var cards = document.getElementsByClassName("card");
	for (var i = 0; i < cards.length; i++){
		var cardID = cards[i].id; 
		var tags = document.getElementById(cardID).getElementsByClassName("tags")[0].innerHTML; 
		if (!(tags.includes(tag))){
			hideCard(cardID);
		}
	}
}

function hideCardsWithTag(tag){
	/* Hide all cards with tag, to allow users to filter by tag */
	var cards = document.getElementsByClassName("card");
	for (var i = 0; i < cards.length; i++){
		var cardID = cards[i].id; 
		var tags = document.getElementById(cardID).getElementsByClassName("tags")[0].innerHTML; 
		if (!(tags.includes(tag))){
			showCard(cardID);
		}
	}
}

function showAllCards(){
	var cards = document.getElementsByClassName("card");
	for (var i = 0; i < cards.length; i++){
		var cardID = cards[i].id; 
		document.getElementById(cardID).style.display = "";
	}
}

function countVisibleCardsInBucket(bucketID){
	console.log("count visible was called"); 
	var visibleCardCount = 0; 
	var cards = document.getElementById(bucketID).getElementsByClassName("card"); 
	for (var i = 0; i < cards.length; i++){
		var cardID = cards[i].id;
		if (document.getElementById(cardID).style.display !== "none"){
			visibleCardCount++; 
		}
	}
	return visibleCardCount; 
}