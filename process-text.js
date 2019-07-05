function isMinimallyInteresting(str){
	if (str.split(" ").length < 5){
		return false; 
	}
	if (isUselessPraise(str)){ 
		return false; 
	}
	if (isObscene(str)) { 
		return false; 
	}
	return true;
}

function trimMessage(str){
	/* Get rid of annoying email chains, footers, long links, 
	automated emails and support's responses */
	var newstr = str; 
	var strings = [ 
		"Este email puede contener",
		"Hung from Smallpdf",
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
		"not the intended recipient"
	];
	for (var i = 0; i < strings.length; i++){
		newstr = str.split(strings)[0]; 
		if (newstr.length <= 1 || newstr == str){ 
			str = removeEmail(str);
			str = removeURL(str);
			return str;
		}
		newstr = removeEmail(newstr);
		newstr = removeURL(newstr);
		return newstr; 
	}
}

function deSmallpdf(str){
    var newstr = str.replace('https://smallpdf.com/','');
    newstr.replace('https://support.smallpdf.com/','');
    return newstr; 
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
		"fuck"
	]
	str = str.toLowerCase();
	str = str.replace(/'/g, ''); //remove punctuation bc users tend to not use
	str = str.replace ("it is", "its"); 
	for (var i = 0; i < redflags.length; i++){
		str = str.replace(redflags[i], '');
	}
	if (str.split(" ").length < 5){
		console.log("****************");
		console.log(oldstring);
		console.log(str); 
		return true;
	}
	return false; 
}

function isUselessPraise(str){
	/* If the feedback appears to only contain red flags, 
	don't show*/
	var oldstring = str; 
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
		"limit"
	]
	str = str.toLowerCase();
	str = str.replace(/'/g, ''); //remove punctuation bc users tend to not use
	str = str.replace ("it is", "its");
	for (var i = 0; i < redflags.length; i++){
		str = str.replace(redflags[i], '');
	}
	if (str.split(" ").length < 3){
		console.log("****************");
		console.log(oldstring);
		console.log(str); 
		return true;
	}
	return false; 
}

function cleanSmallpdfUrl(str){
	return str.replace("https://smallpdf.com/",'');
}

function removeURL(str){
	/* Removes URLs from string completely. */
	var words = str.split(" ");
	var newstr = ""; 
	for (var i = 0; i < words.length; i++){
		var word = words[i];
		if (!(word.includes("http"))){
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
	&& str.length < 40
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