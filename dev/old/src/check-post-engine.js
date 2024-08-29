var checkPostEngineSrc = function() {
    var lastJS = document.getElementsByTagName('script')[2];

    if (!lastJS)
    {
        var newJS = document.createElement('script');
        newJS.src = './js/post-engine.min.js';
        document.getElementsByTagName('body')[0]
            .appendChild(newJS);
    }

    if (blog.postJsRecursion < 1000) {
        if (!blog.postJsHere) {
            blog.postJsRecursion++;
            setTimeout(function() {
                checkPostEngineSrc();
            }, 50);
        } else {
            blog.matchNdownload();
        }
    }
};
