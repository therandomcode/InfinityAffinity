function isMinimallyInteresting(str){
	if (str.split(" ").length < 5){
		return false; 
	}
	return true;
}

function trimMessage(str){
	var newstr = str;
	if (str.split("Sent from").length > 1){
		newstr = str.split("Sent from")[0];
	}
	if (str.split("Hung from Smallpdf").length > 1){
		newstr = str.split("Hung from Smallpdf")[0];
	}
	if (str.split("The information contained in").length > 1){
		newstr = str.split("The information contained in")[0];
	}
	if (str.split("info@smallpdf.com").length > 1){
		newstr = str.split("info@smallpdf.com")[0];
	}
	if (newstr != str){
		console.log(str, newstr);
		return newstr;
	}
	return str;
}

function deSmallpdf(str){
    var newstr = str.replace('https://smallpdf.com/','');
    newstr.replace('https://support.smallpdf.com/','');
    return newstr; 
}