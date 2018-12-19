buckets = [];
currentModel = []; 
var numBuckets = 0;

function drawSortingScreen(){
    console.log("We're trying to redraw here");
    while (document.body.firstChild && document.body.firstChild.id != "file") {
        document.body.removeChild(document.body.firstChild);
    }

    if (buckets.length < 1){
        console.log("Something went wrong during upload."); 
        return; 
    } 
    drawBucket(0);
    for (var i = 0; i < buckets[0].length; i++){
        drawCard(buckets[0][i]); 
    }
}

function drawBucket(bucketNumber) {
    console.log("We're drawing bucket ", bucketNumber); 
    console.log("Current number of buckets, hopefully: ", buckets, buckets.length); 
    
	var bucket = document.createElement("div");
	bucket.className = "bucket";
    bucket.id = "bucket" + String(bucketNumber);
    if (document.getElementById(bucket.id)){
        return; 
    }
	bucket.ondrop = function() {
		drop(event);
	};
	bucket.ondragover = function() {
		allowDrop(event);
	};
	bucket.ondragleave = function() {
		dragleave(event);
    };
    
    var shortcut = document.createElement("div");
    shortcut.className = "shortcut";
    shortcut.id = "shortcut"+ String(bucketNumber);
    shortcut.innerHTML = String(bucketNumber);
    bucket.append(shortcut);  
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

function randomMessage() {
	var messages = [
		"hello",
		"I don't like your software",
		"This webapp is fun",
		"This is a random message",
		"The owl had a haircut",
		"Snails have always been consistent",
		"Three silver cars sit beside a red car in the lot",
		"These messages are going to keep getting longer and longer so that I might have the opportunity to test cropping them."
	];
	return messages[randomNumber(0, messages.length)];
}

function randomDate() {
	var dates = ["10-10-10", "11-10-19", "5th August 2009", "JUL-12-2006"];
	return dates[randomNumber(0, dates.length)];
}

function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function drawCard(card) {
    if (!card){
        console.log("There is a problem with this card!");
        return -1; 
    }
	// this will make the card a little more "real"
	var physicalCard = document.createElement("div");
	var tags = document.createElement("div");
	physicalCard.draggable = "true";
	physicalCard.id = card.id;
	physicalCard.className = "card";
	physicalCard.innerHTML = card.message;
	physicalCard.onclick = function() {
		drawLargeCard(card);
	};
	physicalCard.ondragstart = function() {
		drag(event);
	};
	physicalCard.ondragend = function() {
		dragend(event);
	};
	tags.className = "tags";
	tags.innerHTML = card.id + " " + card.date + " " + card.source + " " + card.url;
	physicalCard.append(tags);
	document.getElementById("bucket0").append(physicalCard);
	return -1;
}

function drawLargeCard(card) {
	var bg = document.createElement("div");
	var modalCard = document.createElement("div");
	var modalCardX = document.createElement("div");
	var modalCardMessage = document.createElement("div");
	var modalCardTags = document.createElement("div");
	var modalCardDelete = document.createElement("div");
	modalCard.id = "modalCard";
	modalCardX.id = "x";
	modalCardMessage.id = "modalCardMessage";
	modalCardTags.id = "modalCardTags";
	modalCardDelete.id = "modalCardDelete";
	bg.id = "backgroundCover";

	modalCardX.innerHTML = "x";
	modalCardDelete.innerHTML = "Delete";

	modalCardDelete.onclick = function() {
		closeLargeCard(card);
		deleteCard(card); 
	};
	modalCardX.onclick = function() {
		closeLargeCard(card);
	};
	modalCardMessage.innerHTML = card.message;
	modalCardTags.innerHTML = card.date + " " + card.source + " " + card.url;

	document.body.append(bg);
	modalCard.append(modalCardX);
	modalCard.append(modalCardMessage);
	modalCardTags.append(modalCardDelete);
	modalCard.append(modalCardTags);
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

function generateModel(){
	console.log("generating model");
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
	console.log("final model: ", model);
	return model; 
}

function updateBucket(cardID, fromBucketID, targetID) {
	var fromPosition = -1;
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
        console.log("dropping on a bucket");
        console.log(ev.target.id); 
		updateBucket(data, document.getElementById(data).parentNode.id, ev.target.id);
		ev.target.appendChild(document.getElementById(data));
	} else if (ev.target.className == "card") {
		updateBucket(data, document.getElementById(data).parentNode.id, ev.target.id);
		ev.target.parentNode.insertBefore(document.getElementById(data), ev.target);
	}
	ev.currentTarget.style.backgroundColor = "#eeeeeeaa";
}

function updateCardView(cardID, fromID, toArrayID, toPos) {
	console.log("updateCardView");
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
    var cardID = document.getElementById("bucket0").firstChild.nextSibling.id;
	if (key >= 49 && key <= 58) {
        console.log(String(key-48) + "was pressed"); 
        if (key-48 >= buckets.length){
            console.log("We don't have enough buckets!"); 
            drawBucket(buckets.length);
            tempID = "bucket" + String(buckets.length);
            console.log("tempID ", tempID);  
        } else {
            console.log("Looks like we have enough buckets.");
            tempID = "bucket" + String(key - 48);

            var whichKey = document.getElementById("shortcut" + String(key-48));
            var parent = whichKey.parentNode; 
            whichKey.parentNode.removeChild(whichKey);
            parent.insertBefore(whichKey, parent.firstChild); 

        }
		updateCardView(cardID, "bucket0", tempID, 0);
	}
});