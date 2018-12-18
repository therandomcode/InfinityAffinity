
function parseFile(file, unsortedStack, sortedStacks){ 
	var count = 0; 
	var whichSource = "none"; 
	Papa.parse(file, {
	header: true,
	step: function(row) {
		// First, let's figure out if this is HotJar. We only run this check on the first entry. 	
		if (count == 0){
			console.log("Here is the data we are looking at", row.data[0]);
			/* If this is a HotJar .CSV */
			if 
				('Browser' in row.data[0] 
				&& 'Country' in row.data[0] 
				&& 'Date Submitted' in row.data[0]
				&& 'Device' in row.data[0]
				&& 'Email' in row.data[0]
				&& 'Message' in row.data[0])
			{
				whichSource = "hj";
			}
			/* If this is a FreshDesk .CSV */
			else if (
				'Ticket ID' in row.data[0]
				&& 'Subject' in row.data[0]
				&& 'Created time' in row.data[0] 
				&& 'Source' in row.data[0] 
				&& 'Description' in row.data[0])
			{
				whichSource = "fd";
			}
			else {
				console.log("This doesn't look like a CSV I know or understand yet");
			}
		}
		count++; 
		if (whichSource == "hj"){
			console.log("This is a hotjar document");
			if (row.data[0]["Message"] != undefined && isMinimallyInteresting(row.data[0]["Message"])){
				var newcard = new Card(
				trimMessage(row.data[0]["Message"]), //message field
				row.data[0]["Date Submitted"], //time
				"HotJar",
                deSmallpdf(row.data[0]["Source URL"]),//tag
                count // we'll use this as the ID for now. Probably should add something later. 
			);
			unsortedStack.push(newcard);
			}
		}
        else if (whichSource == "fd"){
			console.log("This is a freshdesk document");
			if (row.data[0]["Description"] != undefined && isMinimallyInteresting(row.data[0]["Description"])){
				var newcard = new Card(
				trimMessage(row.data[0]["Description"]), //message field
				row.data[0]["Created Time"], //time
				"FreshDesk",
                row.data[0]["Tags"],//tag
                count
			);
			unsortedStack.push(newcard);
			}
		}
	},
	complete: function() {
		console.log("All done!");
		if (sortedStacks.size == 0){
			if (whichSource == "none"){
				document.getElementById("getting-started").innerHTML += '<div class="error">This doesnt look like a CSV I know or understand yet. Try again :( </div>';
				return -1; 
			} else {
				redraw(unsortedStack);
				console.log("Drawing onboarding instructions");
				document.getElementById("sorted-cards").innerHTML = '<div id="onboarding"><h2>Press A to move the first card into a new column</h2></div>';
			}
		}
	}
});
return unsortedStack;
}