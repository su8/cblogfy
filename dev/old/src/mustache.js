// "Mustache" templates
blog.entriesTemplate = [
    "{% var num = o.length > 9 ? 10 : o.length; %}",
    "{% for (var x=0; x < num; x++) { %}",
        "<h4 class='entry-title'>",
            "<a href='#!post={%=o[x][0]%}' class='snippet-title text-muted'>",
                "{%=blog.trimTitle(o[x][1])%}",
            "</a>",
        "</h4>",
        "<hr>",
    "{% } %}"
].join('');
blog.archiveTemplate = function(isArchivePage) {
    var template = [
        "{% var num = " + (isArchivePage ?
                "blog.reverse" : "o.length") + "; %}",
        "{% for (var x=0; x < num; x++) { %}",
            "<div class='page-header'>",
                "<h4 class='post-title'>",
                    "<a href='#!post={%=o[x][0]%}' class='post-title-url text-muted'>",
                        "{%=blog.trimTitle(o[x][1])%}",
                    "</a>",
                "</h4>",
                "<p class='meta text-muted'>",
                    "<span class='archive-post-separator'> » </span>",
                    "<span class='post-date label label-default'>",
                        "{%=o[x][2]%}",
                    "</span>",
                "</p>",
            "</div>",
        "{% } %}"
    ].join('');
    return template;
};
blog.recentPostsTemplate = [
    "{% var num = o.length > 5 ? 6 : o.length; %}",
    "{% for (var x=0; x < num; x++) { %}",
        "<a href='#!post={%=o[x][0]%}' class='list-group-item'>",
            "{%=o[x][1]%}",
        "</a>",
    "{% } %}"
].join('');
blog.categoriesTemplate = [
    "{% var num = o.length; %}",
    "{% for (var x=0; x < num; x++) { %}",
        "<a href='#!category={%=o[x]%}' class='list-group-item'>",
            "{%=blog.capFirst(o[x])%}",
            "<span class='badge'>",
                "{%=blog.categoriesMatchNum(o[x])%}",
            "</span>",
        "</a>",
    "{% } %}"
].join('');
blog.postTemplate = [
    "<div id='progress-bar' class='hide'>",
        "<div id='cur-progress' class='progress-bar'></div>",
    "</div>",
    "<article class='details-wrapper'>",
        "<div class='details-head'>",
            "<div class='details-head-wrapper'>",
                "<h6 id='details-title'></h6>",
                "{% if(o[1][0]) { %}",
                    "<span>",
                        "Post Categories: ",
                    "</span>",
                    "{% var num = o[1].length; %}",
                    "{% for (var x=0; x < num; x++) { %}",
                        "<a href='#!category={%=o[1][x]%}'>",
                            "<span class='label label-default'>",
                                "{%=blog.capFirst(o[1][x])%}",
                            "</span>",
                        "</a> ",
                    "{% } %}",
                "{% } %}",
            "</div>",
        "</div>",
        "<div id='details-body'>",
        "</div>",
        "<div class='details-footer'>",
            "<hr>",
            "<span>",
                "The source file for this entry can be found <a id='md-src'>Here</a>",
            "</span>",
        "</div>",
        "<ul class='pager'>",
            "{% if(metaPool[o[0] - 1]) { %}",
                "<li class='previous'>",
                    "<a href='#!post={%=metaPool[o[0]-1][0]%}'>",
                        "&larr; Older",
                    "</a>",
                "</li>",
            "{% } %}",
            "{% if(metaPool[o[0] + 1]) { %}",
                "<li class='next'>",
                    "<a href='#!post={%=metaPool[o[0]+1][0]%}'>",
                        "Newer &rarr;",
                    "</a>",
                "</li>",
            "{% } %}",
        "</ul>",
    "</article>"
].join('');

// on error or nothing is found
blog.rantTemplate = function(errStr) {
    var template = [
        "<hr>",
            "<div class='alert alert-" +
                (errStr ? 'danger' : 'info') +
            "'>",
                errStr ? errStr : "Nothing Found.",
            "</div>",
        "<hr>"
    ].join('');
    return template;
};
