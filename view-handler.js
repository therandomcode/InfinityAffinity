buckets = [];
currentModel = []; 
var numBuckets = 0;

function drawSortingScreen(){
	console.log("We are trying to draw the sorting screen!"); 
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
	document.getElementById("add-more").style.visibility = "visible"; 
}

function drawBucket(bucketNumber) {
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
	physicalCard.onclick = function() {
		drawLargeCard(card);
	};
	physicalCard.ondragstart = function() {
		drag(event);
	};
	physicalCard.ondragend = function() {
		dragend(event);
	};
	tagsContainer.className = "tags";
    var str = String(card.tags + card.date + card.url + card.source + card.id); 
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


function drawSelectionModal(headers) {
	var bg = document.createElement("div");
	var modalCard = document.createElement("div");
	var modalCardX = document.createElement("div");
	var modalCardTitle = document.createElement("div");
	var modalCardOptions = document.createElement("div");
	var modalButton = document.createElement("div");
	for (var i = 0; i < headers.length; i++){
		var option = document.createElement("div");
		option.id = String(headers[i]);
		option.className = "selectionOption"; 
		option.innerHTML = String(option.id); 
		modalCardOptions.append(option); 
		option.addEventListener("click", function(ev){
			console.log("The selected option is: ", event.target.id); 
			document.getElementById(event.target.id).classList.toggle("selectedOption");
			//option.classList.toggle('selectedOption'); 
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
		console.log("We have clicked a button!"); 
		var foundOptions = document.getElementsByClassName("selectedOption");
		for (var i = 0; i < foundOptions.length; i++){
			ids.push(foundOptions[i].id); 
		} 
		console.log("The IDs are: ", ids); 

		var msgId = document.createElement("div");
		msgId.innerHTML = ids; 
		msgId.id = "ids"; 
		document.getElementById("getting-started").appendChild(msgId); 
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

            var whichKey = document.getElementById("shortcut" + String(key-48));
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
	if (cardsRemaining <= 0){
		document.getElementById("bucket0").style.display = "none"; 
	}
}

function about(){
	var aboutCard = new Card(
	"If you work in industry, you probably collect data from feedback widgets. "+ 
	"You can usually export that data as a .CSV file. " +
	"Affinity CSV puts that data into a format where you can organize data into like columns to crystallize insights." ,
	"21 December 2018", 
	"",
	"",
	"",
	"" 
	);
	drawLargeCard(aboutCard); 
}