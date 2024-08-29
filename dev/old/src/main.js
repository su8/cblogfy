(function(w) {
    'use strict';
    var metaLen = metaPool.length;
    var blog = {
        reverse: metaLen,
        reverseNum: metaLen,
        cachedPost: {},
        shortMeta: [],
        categories: [],
        cats_clean: [],
        catsMeta: [],
        cats_num: 0,
        start: 0,
        end: 0,
        cats: '',
        dummyvar: '',
        showedSidebars: false,
        postJsRecursion: 0
    };

    blog.trimTitle = function(text) {
        return text.length > 35 ? text.slice(0, 35) + '...' : text;
    };
    blog.capFirst = function(text) {
        return text.charAt(0).toUpperCase() +
            text.slice(1).toLowerCase();
    };
    blog.categoriesMatchNum = function(category) {
        var x = metaLen,
            taggedEntries = [];

        while (x--) {
            if (metaPool[x][3].toLowerCase()
                    .indexOf(category) !== - 1) {
                taggedEntries[taggedEntries.length] =
                    metaPool[x][3];
                blog.catsMeta[blog.catsMeta.length] =
                    metaPool[x];
            }
        }
        return taggedEntries.length;
    };
    blog.innerData = function(partialTemplate, data, id) {
        var template = document.createElement('div'),
            container = document.querySelector('#' + id);
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        template.innerHTML = tmpl(partialTemplate, data);
        container.appendChild(template);
    };
    var generateEntriesMeta = function(isIndexPage) {
        blog.shortMeta = [];
        blog.start = metaLen;
        blog.end = blog.start - (metaLen > 10 ? 10 : metaLen);
        while (isIndexPage ?
                (blog.start-- > blog.end) :
                (blog.start--)) {
            blog.shortMeta[blog.shortMeta.length] =
                metaPool[blog.start];
        }
    };
    var showSideBars = function() {
        blog.innerData(blog.recentPostsTemplate, blog.shortMeta, 'recent-posts');
        blog.innerData(blog.categoriesTemplate, blog.categories.sort(), 'tags-div');
        blog.showedSidebars = true;
    };
    var matchCategory = function(category) {
        var arr = [],
            catsArr = [],
            foundCat = false,
            num = blog.catsMeta.length;
        while (num--) {
            catsArr = blog.catsMeta[num][3].toLowerCase().split(',');
            if (catsArr.indexOf(category) !== -1 &&
                    arr.indexOf(blog.catsMeta[num]) === -1) {
                arr[arr.length] = blog.catsMeta[num];
                foundCat = true;
            }
        }
        arr = arr.sort(function(keyA, keyB) {
            keyA = new Date(keyA[2]);
            keyB = new Date(keyB[2]);
            return ((keyA < keyB) ? 1: ((keyA > keyB) ? - 1: 0));
        });
        return foundCat ? arr : foundCat;
    };
    var repeatSomethin = function(setTitle, metaBool) {
        if (setTitle) {
            document.title = setTitle;
        }
        generateEntriesMeta(metaBool);
        if (!blog.showedSidebars) {
            showSideBars();
        }
    };

    // Just the categories names
    while (blog.reverseNum--) {
        blog.cats = metaPool[blog.reverseNum][3];
        if (blog.cats !== '') {
            blog.cats_clean = blog.cats.toLowerCase()
                .replace(' ', '').split(',');
            blog.cats_num = blog.cats_clean.length;
            while (blog.cats_num--) {
                if (blog.categories.indexOf(
                            blog.cats_clean[blog.cats_num]) === - 1) {
                    blog.categories[blog.categories.length] =
                            blog.cats_clean[blog.cats_num];
                }
            }
        }
    }

    blog.route = function() {
        var otherPage = document.location.hash.split('=');

        switch (otherPage[0]) {
            case '#!archive':
                blog.reverseNum = metaLen;
                repeatSomethin('Archive', false);
                blog.innerData(blog.archiveTemplate(true),
                        blog.shortMeta, 'entries-wrapper');
                break;
            case '#!category':
                repeatSomethin('Categories', true);
                blog.dummyvar = matchCategory(otherPage[1]);
                blog.innerData(blog.dummyvar ?
                        blog.archiveTemplate(false) :
                        blog.rantTemplate(''), blog.dummyvar || [],
                        'entries-wrapper');
                break;
            case '#!search':
                repeatSomethin('Search', true);
                blog.searchPage();
                break;
            case '#!post':
                generateEntriesMeta(true);
                checkPostEngineSrc();
                break;
            default:
                repeatSomethin('Aarons Blog', true);
                blog.innerData(blog.entriesTemplate,
                        blog.shortMeta, 'entries-wrapper');
        }
    };

    blog.init = function() {
        blog.route();
        if (!blog.showedSidebars) {
            showSideBars();
        }
        w.addEventListener('hashchange', blog.route, false);
    };

    w.addEventListener('load', blog.init, false);

    // `sed' will add the rest js files below this line

    w.blog = blog;
} (window));
