/*Make a simple 1D list into a Navbar*/
function makeNavBar(id, items) {
    if (items.length <= 0) {
        console.log("Navbar could not be created with no items.");
        return;
    }
    if (!document.getElementById(id)) {
        console.log("Navbar could not be created; Navbar id doesnot appear to exist");
    }
    for (var i = 0; i < items.length; i++) {   
        var temp = document.createElement.bind(document);
        var navItem = temp("div");
        alert(navItem.nodeName);
        navItem.className = "NavItem";
        navItem.id = toString(id) + "-" + toString(items[0]);
        console.log(navItem.id);
        navItem.innerHTML = toString(items[i]); 
        document.getElementById(id).append(navItem); 
    }
}