
---

Yesterday heard about [Mustache] and after trying it I had jaw dropping moment.

Let me show you the code used to make some of the following pages and sidebars:

**home page**

```javascript
geminiBlog.snippetViewTemplate = [
    "<div class='snippet-wrapper'>",
        "<h4 class='entry-title'>",
            "<a class='snippet-title text-muted'></a>",
        "</h4>",
        "<hr>",
    "</div>"
].join('');


geminiBlog.createSnippet = function(entry, sliceAmount) {
    sliceAmount = sliceAmount || geminiBlog.snippetLength;

    var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.snippetViewTemplate);
    var wrapper = $('.snippet-wrapper', snippetViewHTML);
    wrapper.setAttribute('id', entry.id);
    //wrapper.setAttribute("onclick", "document.location.href = '#!post=" + entry.id + "'");

    var head = $('.entry-title', wrapper);

    //set title
    $('.snippet-title', head).setAttribute("href", "#!post=" + entry.id);
    $('.snippet-title', head).textContent = (entry.title.length > 35) ? entry.title.slice(0, 35) + "...": entry.title;

    // console.log(snippetViewHTML.innerHTML);
    // return inner dom
    return snippetViewHTML.childNodes[0];
};

geminiBlog.snippetView = function(entries, containerClass, sliceLength) {
    document.title = geminiBlog.blogTitle;
    entries = entries || geminiBlog.entries.slice(0, geminiBlog.frontPosts);
    sliceLength = sliceLength || geminiBlog.frontPosts;
    var container = utils.clearElements($(containerClass || "#entries-wrapper"));

    geminiBlog.showRecentPosts(); // show the sidebars first

    entries.forEach(function(entry, index) {
            if (index === sliceLength) {return;}
            container.appendChild(geminiBlog.createSnippet(entry));
    });
};
```

**archive page**

```javascript
geminiBlog.archiveViewTemplate = [
    "<div class='page-header'>",
        "<h4 class='post-title'>",
            "<a class='post-title-url text-muted'></a>",
        "</h4>",
        "<p class='meta text-muted'>",
            "<span class='archive-post-separator'> » </span>",
            "<span class='post-date label label-default'></span>",
        "</p>",
    "</div>"
].join('');


geminiBlog.archiveView = function(givenArr, windowTitle, edit_mode) {
    document.title = windowTitle || geminiBlog.archiveTitle;
    scroll(0,0); // scroll to top, useful when on mobile device
    var container = utils.clearElements($("#entries-wrapper"));
    var entries = givenArr || geminiBlog.entries;

    entries.forEach(function(entry) {
        container.appendChild(geminiBlog.createArchiveHtml(entry, edit_mode));
    });
    geminiBlog.showRecentPosts();
};

geminiBlog.createArchiveHtml = function(entry, edit_mode) {
    var archiveViewHTML = utils.str2WrappedDOMElement(geminiBlog.archiveViewTemplate);
    var wrapper = $('.page-header', archiveViewHTML);
    //wrapper.setAttribute("onclick", "document.location.href = '#!post=" + entry.id + "'");

    var head = wrapper; //$('.archive-head', wrapper);

    //set title
    $('.post-title-url', head).setAttribute("href",
            edit_mode ? "#!edit=" + entry.url :
            "#!post=" + entry.id);
    $('.post-title-url', head).textContent = (entry.title.length > 35) ? entry.title.slice(0, 35) + "...": entry.title;
    $('.post-date', head).textContent = entry.pubDate.toLocaleDateString();

    // return inner dom
    return archiveViewHTML.childNodes[0];
};
```

**recent posts sidebar**

```javascript
geminiBlog.RecentPostsTemplate = [
    "<div class='recent-posts-wrapper'>",
        "<a class='list-group-item'></a>",
    "</div>"
].join('');

geminiBlog.createRecentPosts = function(entry) {
    var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.RecentPostsTemplate);
    var wrapper = $('.recent-posts-wrapper', snippetViewHTML);
    wrapper.setAttribute('id', entry.id);
    //wrapper.setAttribute("onclick", "document.location.href = '#!post=" + entry.id + "'");

    //set title
    $('.list-group-item', wrapper).setAttribute("href", "#!post=" + entry.id);
    $('.list-group-item', wrapper).textContent = (entry.title.length > 35) ? entry.title.slice(0, 35) + "...": entry.title;

    return snippetViewHTML.childNodes[0];

};

geminiBlog.showRecentPosts = function() {
    if (geminiBlog.showRecentBar) {
        var entries = geminiBlog.entries.slice(0, geminiBlog.recentPosts);
        var recent_container = utils.clearElements($("#recent-posts"));

        entries.forEach(function(entry) {
            recent_container.appendChild(geminiBlog.createRecentPosts(entry));
        });
    } else {
        utils.hide($('#recentBar'));
    }
    geminiBlog.showTags();
};
```

**categories sidebar**

```javascript
geminiBlog.tagTemplate = [
    "<div class='tags-wrapper'>",
        "<a class='list-group-item'></a>",
    "</div>",
].join('');

geminiBlog.showTags = function() {
    if (geminiBlog.showCategories && !geminiBlog.CategoriesEmpty) {
        var entries = geminiBlog.tags;
        var tagsContainer = utils.clearElements($("#tags-div"));

        entries.forEach(function(entry) {
            tagsContainer.appendChild(geminiBlog.createTagsView(entry));
        });
    } else {
        utils.hide($('#CategoriesBar'));
    }

    //geminiBlog.showKernels();
    geminiBlog.detectOS();
};

geminiBlog.createTagsView = function(tag) {
    var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.tagTemplate);
    var wrapper = $('.tags-wrapper', snippetViewHTML);
    wrapper.setAttribute('id', tag);
    //wrapper.setAttribute("onclick", "document.location.href = '#!tag=" + tag + "'");

    //category href and "badge" to show how many entires are in it
    $('.list-group-item', wrapper).setAttribute("href", "#!tag=" + tag);
    $('.list-group-item', wrapper).innerHTML = utils.capFirst(tag) + "<span class='badge'>" +
        geminiBlog.getEntryBy(true, tag).length + "</span>";

    return snippetViewHTML.childNodes[0];
};
```

I have not included some of the functions used by the above code, just for the readability and easy to follow sake.

---

## Do you have Mustache ?

Now let's compare that the following code by using some Mustache [alternative]:

```javascript
(function(w) {
    'use strict';
    var metaLen = Object.keys(metaPool).length;
    var blog = {
        reverse: metaLen,
        reverseNum: metaLen,
        shortMeta: [],
        categories: [],
        cats_clean: [],
        cats_num: 0,
        start: 0,
        end: 0,
        cats: ''
    };

    // "Mustache" templates
    blog.entriesTemplate = [
        "{% for (var x=0; x < 10; x++) { %}",
            "<h4 class='entry-title'>",
                "<a href='{%=o[x][0]%}' class='snippet-title text-muted'>",
                    "{%=blog.trimTitle(o[x][1])%}",
                "</a>",
            "</h4>",
            "<hr>",
        "{% } %}"
    ];
    blog.archiveTemplate = [
        "{% for (var x=0; x < blog.reverse; x++) { %}",
            "<div class='page-header'>",
                "<h4 class='post-title'>",
                    "<a href='{%=o[x][0]%}' class='post-title-url text-muted'>",
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
    ];
    blog.recentPostsTemplate = [
        "{% for (var x=0; x < 6; x++) { %}",
            "<div>",
                "<a href='{%=o[x][0]%}' class='list-group-item'>",
                    "{%=o[x][1]%}",
                "</a>",
            "</div>",
        "{% } %}"
    ];
    blog.categoriesTemplate = [
        "{% for (var x=0; x < o.length; x++) { %}",
            "<div>",
                "<a href='{%=o[x]%}' class='list-group-item'>",
                    "{%=blog.capFirst(o[x])%}",
                    "<span class='badge'>",
                        "{%=blog.categoriesMatchNum(o[x])%}",
                    "</span>",
                "</a>",
            "</div>",
        "{% } %}"
    ];

    blog.trimTitle = function(text) {
        return text.length > 35 ? text.slice(0, 35) + '...' : text;
    };
    blog.capFirst = function(text) {
        return text.charAt(0).toUpperCase() +
            text.slice(1).toLowerCase();
    };
    blog.categoriesMatchNum = function(category) {
        var x,
            tagged_entries = [];

        for (x in metaPool) {
            if (metaPool[x][3].toLowerCase()
                    .indexOf(category) !== - 1) {
                tagged_entries.push(metaPool[x][3]);
            }
        }
        return tagged_entries.length;
    };
    var innerData = function(partialTemplate, data, id) {
        var template = [
            "<div>",
                partialTemplate.join(''),
            "</div>"
        ].join('');
        document.getElementById(id).innerHTML =
            tmpl(template, data);
    };
    var generateEntriesMeta = function(isIndexPage) {
        blog.start = blog.reverse;
        blog.end = blog.start - 10;
        while (isIndexPage ?
                (blog.start-- > blog.end) :
                (blog.start--)) {
            blog.shortMeta.push(metaPool[blog.start]);
        }
    };

    // Just the categories names
    while (blog.reverseNum--) {
        blog.cats = metaPool[blog.reverseNum][3];
        blog.cats_clean = blog.cats.toLowerCase()
            .replace(' ', '').split(',');
        blog.cats_num = blog.cats_clean.length;

        if (blog.cats && blog.cats !== '') {
            while (blog.cats_num--) {
                if (blog.categories.indexOf(
                            blog.cats_clean[blog.cats_num]) === - 1) {
                    blog.categories.push(
                            blog.cats_clean[blog.cats_num]);
                }
            }
        }
    }

    var currentPage = document.location.href.split('/')[3];
    w.blog = blog;

    if (currentPage === '' || currentPage === 'index.html') {
        generateEntriesMeta(true);
        innerData(blog.entriesTemplate, blog.shortMeta, 'entries-wrapper');

    } else if (currentPage === 'archive.html') {
        blog.reverseNum = blog.reverse;
        generateEntriesMeta(false);
        innerData(blog.archiveTemplate, blog.shortMeta, 'entries-wrapper');
    }

    // Recent Posts and Categories Sidebars
    innerData(blog.recentPostsTemplate, blog.shortMeta, 'recent-posts');
    innerData(blog.categoriesTemplate, blog.categories.sort(), 'tags-div');

} (window));
```
That's all the code.

---

## Mustache vs some alternative

The Mustache logic-less syntax is no-no.

Mustache example:

```javascript
var template = [
    "<div>",
        "{{#.}}",
            "<h4 class='entry-title'>",
                "<a href='{{file}}' class='snippet-title text-muted'>",
                    "{{title}}",
                "</a>",
            "</h4>",
            "<hr>",
        "{{/.}}",
    "</div>"
].join('');

var entries = function() {
    var x,
        num = 0,
        arr = [],
        start = Object.keys(metaPool).length,
        end = start - 10;

    while (start-- > end)
    {
        arr.push({
            file: metaPool[start][0],
            title: metaPool[start][1]
        });
    }
    return arr;
};

var convert = Mustache.to_html(template, entries());
document.getElementById('entries-wrapper').innerHTML = convert;

// 31 lines
```

The Mustache downside is that you have to think ahead of time what you'll need.

You can't access any globally defined code, you don't have **{{@index}}** as in Handlebars, neither you can define true javascript variables inside it's syntax.

The [alternative]

```javascript
var template = [
    "<div>",
        "{% for (var x=0; x < 10; x++) { %}",
            "<h4 class='entry-title'>",
                "<a href='{%=o[x][0]%}' class='snippet-title text-muted'>",
                    "{%=o[x][1]%}",
                "</a>",
            "</h4>",
            "<hr>",
        "{% } %}",
    "</div>"
].join('');

var start = Object.keys(metaPool).length,
    end = start - 10,
    shortMeta = [];

while (start-- > end) {
    shortMeta.push(metaPool[start]);
}

var convert = tmpl(template, shortMeta);
document.getElementById('entries-wrapper').innerHTML = convert;

// 22 lines
```

The [alternative] allows me to index different parts of the array without thinking what I'll need ahead of time (in case of JSON object).

I can define variables inside it's syntax while having access to the globally defined one. I can also choose between for, while, do while loops, use some loop condition logic.

---

What do you think, was the older code easy to read and follow ?

~~I'll re-write most of the current code and also make use of Jade/Pug.~~

Few hours later:

- [x] Done in the following [1], [2] commits.

[Mustache]: https://github.com/janl/mustache.js/
[alternative]: https://github.com/wifiextender/JavaScript-Templates
[1]: https://github.com/wifiextender/wifiextender.github.io/commit/a1bb560c04611be2d445e4999f8ad7b53b471aab
[2]: https://github.com/wifiextender/wifiextender.github.io/commit/60905a98a4d9c49d2a66d9ce94bd8993339c54a2
