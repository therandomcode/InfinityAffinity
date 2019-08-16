function isMinimallyInteresting(str){
	if (str == "undefined" || str == ""){
		console.log("isMinimallyInteresting says something went wrong! str does not exist.");
		return;
	}
	if (str.split(" ").length < 9){
		return false; 
	}
	if (str.includes("bitbounce")){
		return false;
	}
	if (isUselessPraise(str)){ 
		return false; 
	}
	if (isObscene(str)) { 
		return false; 
	}
	return cleanMessage(str);
}

function cleanMessage(str){
	if (str == "undefined" || str == ""){
		console.log("cleanMessage says something went wrong! str does not exist.");
		return;
	}
	str = trimMessage(str);
	str = removeEmail(str);
	str = removeURL(str);
	return str; 
}

function trimMessage(userMessage){
	/* Get rid of annoying email chains, footers, long links, 
	automated emails and support's responses */
	userMessage = userMessage.toLowerCase();
	var newMessage = userMessage; 
	var badstrings = [ 
		"Este email puede contener",
		"Hung from Smallpdf",
		"Frodo at Smallpdf",
		"Hung at Smallpdf",
		"Frodo from Smallpdf", 
		"The information contained in",
		"info@smallpdf.com",
		"Sent from",
		"mailto",
		"Smallpdf wrote", 
		"YOUR SMALLPDF PRO SUBSCRIPTION",
		"This e-mail is confidential",
		"This email is confidential", 
		" | ",
		"Please consider the environment before printing",
		"privileged information",
		"Manuel wrote",
		"This email and any", 
		"the information contained", 
		"this email is confidential", 
		"the information in this", 
		"intended solely for the use",
		"legally privileged",
		"is a registered trademark",
		"not the intended recipient",
		"The info contained in",
		"tel:",
		"mobile:",
		"sent from my iphone"
	];

	for (var i = 0; i < badstrings.length; i++){
		var badstring = badstrings[i].toLowerCase();
		newMessage = newMessage.split(badstring)[0]; // get only first part of split message
	}
	if (newMessage.length <= 1 || newMessage == userMessage){ 
		return userMessage;
	}
	return newMessage; 
}

function isObscene(str){
	/* If the feedback appears to only contain red flags, 
	don't show*/
	var originalstring = str; 
	var redflags = [
		"suck my",
		"porn",
		"fuck you",
		"dick",
		"cunt",
		"blowjob", 
		"motherfucking", 
		"fuck",
		"none of your business"
	]
	str = str.toLowerCase();
	str = str.replace(/'/g, ''); //remove punctuation bc users tend to not use
	str = str.replace ("it is", "its"); 
	for (var i = 0; i < redflags.length; i++){
		str = str.replace(redflags[i], '');
	}
	if (str.split(" ").length < 5){
		return true;
	}
	return false; 
}

function isUselessPraise(str){
	/* If the feedback appears to only contain red flags, 
	don't show*/
	var newMessage = str; 
	//var oldstring = str; 
	var redflags = [
		"wonderful job",
		"no nothing",
		"nothing it",
		"its perfect", 
		"its perfect",
		"i love it",
		"i like it",
		"good job",
		"thank you",
		"perfect",
		"smallpdf is awesome",
		"great work",
		"literally nothing", 
		"great tool",
		"grate",
		"i like it",
		"no thank you",
		"as is",
		"great",
		"perfect",
		"thanks from",
		"its fine",
		"should be free",
		"the way you are",
		"very good tool",
		"thanks a lot",
		"thanks",
		"nothing",
		"easy to use",
		"nothing is missing",
		"i dont think so",
		"wonderful tool",
		"i use it", 
		"is the best",
		"love",
		"thanks so much",
		"per day",
		"free limit reached", 
		"two conversion",
		"wait", 
		"2 time", 
		"more than one", 
		"of cost",
		"free limit", 
		"it didnt work",
		"really",
		"very good",
		"nope",
		"this tool",
		"isnt working",
		"for now",
		"as it is",
		"its awesome",
		"thanx", 
		"es muy bueno",
		"lo mejor",
		"super",
		"util", 
		"easy", 
		"rapido",
		"veloce", 
		"sehr gutes", 
		"fácil", "facil", 
		"gracias", 
		"mas", "more", "mehr", "very", "très", "tres", "muy", "muito", 
		"porque", "pratique", 
		"e", "and", "is", "eh", 
		"simples", 
		"bueno",
		"limit",
		"per hour"
	]
	newMessage = newMessage.toLowerCase();
	newMessage = newMessage.replace(/'/g, ''); //remove punctuation bc users tend to not use
	newMessage = newMessage.replace ("it is", "its");
	for (var badstring = 0; badstring < redflags.length; badstring++){
		newMessage = newMessage.replace(redflags[badstring], '');
	}
	newMessage = (newMessage.split(" ")).join(" "); //get rid of duplicate spaces 
	if (newMessage.split(" ").length < 4){
		return true;
	}
	return false; 
}

function cleanSmallpdfUrl(str){
	str = str.replace("https://smallpdf.com/",'');
	str = str.replace('https://support.smallpdf.com/','');
	return str; 
}

function removeURL(str){
	/* Removes URLs from string completely. */
	var words = str.split(" ");
	var newstr = ""; 
	for (var i = 0; i < words.length; i++){
		var word = words[i];
		if (!(word.includes("http")) && !(word.includes("www."))){
			newstr = newstr + " " + word; 
		} 
	}
	return newstr.trim(); 
}

function removeEmail(str){
	/* Removes the email for privacy reasons. 
	Replaces with the word '[Email]' so we know they included the info. */ 
	var words = str.split(" ");
	var newstr = ""; 
	for (var i = 0; i < words.length; i++){
		var word = words[i];
		if (word.includes("@")){
			newstr = newstr + " " + "[email]"; 
		} else {
			newstr = newstr + " " + word; 
		}
	}
	return newstr.trim(); 
}

function isInterestingTag(str){
	str = str.replace(/\s+/g,' '); 
	if ( str != ""
	&& str.replace(" ", "") != ""
	&& str.length < 30
	&& str.length > 4
	&& (str.indexOf('@') < 0) // string is not just an email 
	&& (str.replace(/\d/g, "").length > 0) // string is not entirely numbers
	&& str != "other"
	&& str != "No company"
	&& str != "Closed"
	&& str != "general"
	&& str != "No Group"
	){
		return true;
	} else {
		return false; 
	}
}

function trimTag(str){
	if (str == null || str == ""){
		return "";
	}
	if (str.length > 30){
		str = str.split(" ").slice(0,4).join(" ");
		str = str.trim();
		str += "...";
	}
	return str; 
}

/* Test functions */
function runTests(){
	console.log("Testing...\n" ); 
	var message0 = "hello, pizza, this email is confidential. Please do not redistribute the content if it wasn't intended for you.";
	var message1 = "Hello, this is a simple user message. The information contained in this email may be confidential.";
	var message2 = "no thank you";
	var message3 = "Nothing, its perfect";
	var message5 = "Hi, I use ilovepdf (https://ilovepdf.com). My email is bob@dylan.com. I don't like marshmellows.";
	var message6 = "fuck you I hate this softare";
	var message7 = "suck my dick"
	var message8 = "fuck this software, but I also have some useful-ish feedback. There is something wrong in part 3. I wasted a ton of time on this. Fuck you again.";
	var message9 = "Here is something else: [www.somethingoranother.com.br/somethingelse.jpg]";
	var message10 = "there was something or another in a message, from john doe, assistant to jane doe [www.weufhwohfweiufh.co.in address1, address2 line, some town, USA. 089-1232-4112]";

	console.log("Testing isUselessPraise()..."); 
	if (isUselessPraise(message2) == false){
		console.log("⚠ TEST FAILED on message2");
	} 
	if (isUselessPraise(message3) == false){
		console.log("⚠ TEST FAILED on message3");
	}
	console.log("...isUselessPraise() passed!\n");
	
	console.log("Testing trimMessage()...");
	if (trimMessage((message0)).length > 40){
		console.log("⚠ TEST FAILED on message0");
	}
	if (trimMessage(message1).length > 40){
		console.log("⚠ TEST FAILED on message1"); 
	}

	console.log("Testing removeURL()...");
	if (removeURL(message5) != "Hi, I use ilovepdf My email is bob@dylan.com. I don't like marshmellows."){
		console.log("⚠ TEST FAILED on message5");
	}
	if (removeURL(message9) != "Here is something else:"){
		console.log("⚠ TEST FAILED on message9"); 
	}

	console.log("Testing cleanMessage()...");
		if (cleanMessage(message10).length > 275){
			console.log("⚠ TEST FAILED on message10");
		}

	console.log("Testing trimTag...");
		if (trimTag(message0) != "there was something or..."){
			console.log("⚠ TEST FAILED on message10"); 
		}
	
	console.log("Tests passed!");
}