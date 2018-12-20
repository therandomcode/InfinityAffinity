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