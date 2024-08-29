var x,
    daMenus,
    variousListeners;

// Bootstrap dropdown menu without jquery
daMenus = {

    // Navbar and dropdowns
    toggle: document.getElementsByClassName('navbar-toggle')[0],
    collapse: document.getElementsByClassName('navbar-collapse')[0],

    toggleMenu: function() { // Toggle if navbar menu is open or closed
        daMenus.collapse.classList.toggle('collapse');
    },

    // Close dropdowns when screen becomes big enough to switch to open by hover
    closeMenusOnResize: function() {
        if (document.body.clientWidth >= 768) {
            daMenus.collapse.classList.add('collapse');
        }
    }
};

// dropdown menu listeners
w.addEventListener('resize', daMenus.closeMenusOnResize, false);
daMenus.toggle.addEventListener('click', daMenus.toggleMenu, false);

// register some global listeners
variousListeners = {
    'submitfutton': ['click', blog.submitIt], // search form button
    'uzer-infut': ['input', blog.submitIt]   // search form input
};

for (x in variousListeners) {
    document.getElementById(x).addEventListener(
            variousListeners[x][0],
            variousListeners[x][1],
    false);
}
