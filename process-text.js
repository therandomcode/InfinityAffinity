function isMinimallyInteresting(str){
	if (str.split(" ").length < 5){
		return false; 
	}
	return true;
}

function trimMessage(str){
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
		"intended solely for the use",
		"legally privileged",
		"is a registered trademark",
		"not the intended recipient"
	];
	for (var i = 0; i < strings.length; i++){
		newstr = str.split(strings)[0]; 
		if (newstr.length <= 1 || newstr == str){ 
			return str;
		}
		return newstr; 
	}
}

function deSmallpdf(str){
    var newstr = str.replace('https://smallpdf.com/','');
    newstr.replace('https://support.smallpdf.com/','');
    return newstr; 
}