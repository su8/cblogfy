blog.searchPage = function() {
    var x = blog.reverse,
        arr = [],
        foundPosts = false,
        uzerQuery = document.getElementById('uzer-infut').value.toLowerCase();

    if (uzerQuery === '') {
        blog.innerData(blog.rantTemplate(''), arr, 'entries-wrapper');
        return false;
    }

    while (x--) {
        if (metaPool[x][1].toLowerCase().match(uzerQuery)) {
            arr[arr.length] = metaPool[x];
            foundPosts = true;
        }
    }
    blog.innerData(foundPosts ? blog.archiveTemplate(false) :
            blog.rantTemplate(''), arr, 'entries-wrapper');
};

// uzer-infut 'input' / submitfutton 'click'
blog.submitIt = function() {
    var anchor = document.location.hash.split('=')[0];
    if (anchor === '#!search') {
        blog.searchPage();
    } else {
        document.location.href = '#!search';
    }
};
