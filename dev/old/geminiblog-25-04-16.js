! function(w) {
    "use strict";
    // !-- -------------------------------------------------------- -->
    // !-- Utilities												-->
    // !-- -------------------------------------------------------- -->
    // implementing $ with queryselector(+all)
    var $ = function(selector, rootNode) {
        return (rootNode || document).querySelector(selector);
    };
    /*var $$ = function(selector, rootNode) {
        return Array.prototype.slice.call((rootNode || document).querySelectorAll(selector));
    };*/
    var utils = {
        escapeRegExp: function(string) { // escape regex
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        },
        capFirst: function(text) { // capitalize first char, lower the rest
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        },
        clearElements: function(container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            return container;
        },
        hideElement: function(container) {
            container.style.opacity = "0";
        },
        showElement: function(container) {
            container.style.opacity = "1";
        },
        show: function(container) {
            container.style.display = "initial";
        },
        hide: function(container) {
            container.style.display = "none";
        },
        // register custom events
        registerEvent: function(event, bubbles, cancelable) {
            return (CustomEvent) ? new CustomEvent(event, {
                bubbles: bubbles,
                cancelable: cancelable
            }) : (document.createEvent('Event').initEvent(event, bubbles, cancelable));
        },
        // custom listeners
        registerListener: function(target, type, callback) { (target.addEventListener || target.attachEvent)(target.addEventListener ? type: 'on' + type, callback);
        },
        removeListener: function(target, type, callback) { (target.removeEventListener || target.detachEvent)(target.removeEventListener ? type: 'on' + type, callback);
        },
        // template string to dom element , remember to return el.childNodes[0] // or use element accordingly;
        str2WrappedDOMElement: function(html) {
            var el = document.createElement('div');
            el.innerHTML = html;
            // return el.childNodes[0];
            return el;
        },
        // minimal ajax // use this.<attr> in callbacks to access the xhr object directly
        ajax: function(o) {
            o.useAsync = o.useAsync || true;
            if (!o.method || ! o.url || ! o.success) return false;
            var xhr = w.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.timeout = geminiBlog.timeout || 4000;
            // throws syntax error otherwise
            if (o.mimeType) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
            xhr.ontimeout = function() {
                console.error("Request timed out: " + o.url);
            };
            xhr.onerror = o.error ? o.error: function() {
                console.log(xhr);
            };
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    o.success ? o.success(xhr) : (function() {
                        console.log(xhr);
                    })();
                    // } else {
                    //	   console.log(xhr);
                }
            }
            xhr.open(o.method, o.url, o.useAsync);
            xhr.send(null);
        },
    };
    // !-- -------------------------------------------------------- -->
    // !-- Variables												-->
    // !-- -------------------------------------------------------- -->
    // global var
    var geminiBlog = {
        blogTitle       : "Blog",       // main page title
        archiveTitle    : "Archive",    // archive page title
        searchTitle     : "Search",     // search page title
        categoriesTitle : "Categories",  // categories page title
        author			: "John Doe",   // post author
        entries			: [],			// holds meta of all entries
        frontPosts		: 7,			// how many entries to show in snippets
        recentPosts     : 7,            // how many recent posts to show
        showRecentBar   : true,         // Show/hide the recent posts sidebar
        showCategories  : true,         // Show/hide the categories sidebar
        CategoriesEmpty : true,         // don't touch <----------!
        kernelsFirstLoad: true,         // boolean to send only one "GET"
        showKernelsBar  : true,         // Show/hide the kernels sidebar
        hackButton      : false,
        tags            : [],           // da tags list
        templates		: [],			// for all templates
        variables		: [],			// for all variables in posts
        variablePrefix	: '{|',			// {|this|} is a variable
        variablePostfix : '|}',
        snippetLength	: 170,			// how many characters to show per entry snippet?
        prevnextLinks   : true,          // previous and next blog post button links at the bottom of each post
        repoBase		: "./markdown/", // all entries beginning with ./  are prepended this url
        useAsync		: true,			// whether to use synchronous HTTP requests (bad idea)
        timeout			: 10000,			// request timeout
        markDownloads	: false,		// whether markdown files can be downloaded by the viewers
    };
    // !-- -------------------------------------------------------- -->
    // !-- Templates												-->
    // !-- -------------------------------------------------------- -->
    // default templates, can be overridden in config
    geminiBlog.templates = {
        snippetViewTemplate : [
            "<div class='snippet-wrapper'>",
                "<h4 class='entry-title'>",
                    "<a class='snippet-title text-muted'></a>",
                "</h4>",
                "<hr>",
            "</div>"
        ].join(''),

        RecentPostsTemplate : [
            "<div class='recent-posts-wrapper'>",
                "<a class='list-group-item'></a>",
            "</div>"
        ].join(''),

        RecentKernelsTemplate : [
            "<div class='recent-kernels-wrapper'>",
                "<button type='button' class='list-group-item'></button>",
            "</div>"
        ].join(''),

        detailsViewTemplate : [
            "<article class='details-wrapper'>",
                "<div class='details-head'>",
                    "<div class='details-head-wrapper'>",
                        "<span class='details-separator'> » </span>",
                        "<span class='details-date label label-default'></span>",
                    "</div>",
                "</div>",
                "<div class='details-body'>",
                "</div>",
                "<div class='details-footer'>",
                    "<hr>",
                    "<div class='markdown-source'>",
                        "( The source markdown file for this entry can be found <a id='md-src'>Here</a> )",
                    "</div>",
                    "<ul class='pager'>",
                        "<li class='previous'>",
                            "<a id='previous-link'>&larr; Older</a>",
                        "</li>",
                        "<li class='next'>",
                            "<a id='next-link'>Newer &rarr;</a>",
                        "</li>",
                    "</ul>",
                "</div>",
            "</article>"
        ].join(''),

        archiveViewTemplate : [
            "<div class='page-header'>",
                "<h4 class='post-title'>",
                    "<a class='post-title-url text-muted'></a>",
                "</h4>",
                "<p class='meta text-muted'>",
                    "<span class='archive-post-separator'> » </span>",
                    "<span class='post-date label label-default'></span>",
                    " <a id='da-invisible-edi' class='btn btn-default btn-xs edi-button'>",
                        "<span title='Edit this post'>&#x270d;</span>",
                    "</a>",
                "</p>",
            "</div>"
        ].join(''),

        searchNoResultsTemplate : [
            "<div class='oh-search-snap'>",
                "<hr>",
                    "<div class='alert alert-info'>Nothing found.</div>",
                "<hr>",
            "</div>"
        ].join(''),

        tagTemplate : [
            "<div class='tags-wrapper'>",
                "<a class='list-group-item'></a>",
            "</div>",
        ].join(''),

        editTemplate : [
            "<div id='edit-template'>",
                "<button class='btn btn-info btn-xs' id='render-button'>",
                    "<span>&#x021C4; Preview</span>",
                "</button>",
                "<div id='render-txt'>",
                    "<div class='form-group'>",
                        "<label for='text-body'></label>",
                        "<textarea class='form-control' rows='20' id='text-body'></textarea>",
                    "</div>",
                "</div>",
                "<div id='render-html'></div>",
                "<hr>",
                "<a class='btn btn-default btn-xs' id='download-button'>",
                    "<span>&#x2193; Download</span>",
                "</a>",
            "</div>",
        ].join(''),

        newPostTemplate : [
            "<div id='edit-template'>",
                "<div class='form-group has-error'>",

                    "<input class='form-control' id='inputFilename' type='text' placeholder='Filename: hello_world'>",
                "</div>",
                "<div class='form-group has-warning'>",
                    "<input class='form-control' id='inputTitle' type='text' placeholder='Title: Some short description'>",
                "</div>",
                "<div class='form-group has-success'>",
                    "<input class='form-control' id='inputCategories' type='text' placeholder='Categories: this,and,that'>",
                "</div>",
                "<button class='btn btn-info btn-xs' id='render-button'>",
                    "<span>&#x021C4; Preview</span>",
                "</button>",
                "<div id='render-txt'>",
                    "<div class='form-group'>",
                        "<label for='text-body'></label>",
                        "<textarea class='form-control' rows='20' id='text-body'></textarea>",
                    "</div>",
                "</div>",
                "<div id='render-html'></div>",
                "<hr>",
                "<span class='text-muted'>",
                    "If you plan to write many posts, and/or edit the Settings, please click ",
                    "<span class='text-warning'>Save to localstorage</span>",
                    ". Later on, when you are done, please download <span class='text-success'>config.js</span>",
                    " This way you avoid multiple config.js downloads.",
                "</span>",
                "<hr>",
                "<label for='download-button'>1.</label>",
                " <a class='btn btn-default btn-xs' id='download-button' download='filename'>",
                    "<span>&#x2193; Download</span>",
                "</a>",
                " <span class='text-info'>&rarr;</span>",
                " <label for='download-button'>2.</label>",
                " <a class='btn btn-default btn-xs' id='jsdownload-button' download='config.js'>",
                    "<span>&#x2193; config.js</span>",
                "</a>",
                " <span class='text-info'>or</span>",
                " <label for='download-button'>2.</label>",
                " <a class='btn btn-default btn-xs' id='localstorage-button'>",
                    "<span>&#x267B; Save to localstorage</span>",
                "</a>",
            "</div>",
        ].join(''),

        settingsModeTemplate : [
            "<form>",

                "<div class='row form-group has-warning'>",
                    "<div class='col-xs-6'>",
                        "<input class='form-control' id='author' type='text'>",
                        "<span class='help-block'>Author</span>",
                    "</div>",

                    "<div class='col-xs-6'>",
                        "<input class='form-control' id='blogTitle' type='text'>",
                        "<span class='help-block'>Blog Title</span>",
                    "</div>",
                "</div>",

                "<div class='row form-group has-warning'>",
                    "<div class='col-xs-6'>",
                        "<input class='form-control' id='archiveTitle' type='text'>",
                        "<span class='help-block'>Archive Title</span>",
                    "</div>",

                    "<div class='col-xs-6'>",
                        "<input class='form-control' id='searchTitle' type='text'>",
                        "<span class='help-block'>Search Title</span>",
                    "</div>",
                "</div>",

                "<div class='row form-group has-warning'>",
                    "<div class='col-xs-6'>",
                        "<input class='form-control' id='categoriesTitle' type='text'>",
                        "<span class='help-block'>Categories Title</span>",
                    "</div>",

                    "<div class='col-xs-6'>",
                        "<input class='form-control' id='frontPosts' type='text'>",
                        "<span class='help-block'>Front page posts</span>",
                    "</div>",
                "</div>",

                "<div class='row form-group has-warning'>",
                    "<div class='col-xs-6'>",
                        "<input class='form-control' id='recentPosts' type='text'>",
                        "<span class='help-block'>Recent posts</span>",
                    "</div>",
                "</div>",
                "<hr>",

                "<div class='col-xs-6>'",
                    "<div class='checkbox'>",
                        "<label class='text-primary'>",
                            "<input id='showRecentBar' type='checkbox'> Show/hide Recent Posts sidebar",
                        "</label>",
                    "</div>",
                "</div>",

                "<div class='col-xs-6>'",
                    "<div class='checkbox'>",
                        "<label class='text-primary'>",
                            "<input id='showCategories' type='checkbox'> Show/hide Categories sidebar",
                        "</label>",
                    "</div>",
                "</div>",

                "<div class='col-xs-6>'",
                    "<div class='checkbox'>",
                        "<label class='text-primary'>",
                            "<input id='prevnextLinks' type='checkbox'> In-post Previous and Next page links",
                        "</label>",
                    "</div>",
                "</div>",

                "<div class='col-xs-6>'",
                    "<div class='checkbox'>",
                        "<label class='text-primary'>",
                            "<input id='markDownloads' type='checkbox'> Allow posts to be downloaded",
                        "</label>",
                    "</div>",
                "</div>",
                "<hr>",

                "<span class='text-muted'>",
                    "If you also plan to write a post(s), please click ",
                    "<span class='text-warning'>Save to localstorage</span>",
                    ". Later on, when you are done, please download <span class='text-success'>config.js</span>",
                    " This way you avoid multiple config.js downloads.",
                "</span>",
                "<hr>",

                " <a class='btn btn-default btn-xs' id='jsdownload-button' download='config.js'>",
                    "<span>&#x2193; config.js</span>",
                "</a>",
                " <a class='btn btn-default btn-xs' id='localstorage-button'>",
                    "<span>&#x267B; Save to localstorage</span>",
                "</a>",
            "</form>",
        ].join(''),

        themeModeTemplate: [
            "<div>",
                "<label>Choose theme</label>",
                "<div class='row'>",
                    "<div class='radio col-xs-4'>",
                        "<label>",
                            "<input id='theme1' checked='' type='radio' name='optionsRadios'>",
                            "<img src='img/themes/theme1.png' alt='' />",
                        "</label>",
                    "</div>",
                "</div>",
                "<div class='row'>",
                    "<div class='radio col-xs-4'>",
                        "<label>",
                            "<input id='theme2' type='radio' name='optionsRadios'>",
                            "<img src='img/themes/theme2.png' alt='' />",
                        "</label>",
                    "</div>",
                "</div>",
            "</div>",
        ].join(''),
    }
    // !-- -------------------------------------------------------- -->
    // !-- Functions												-->
    // !-- -------------------------------------------------------- -->
    geminiBlog.registerEntry = function(entryUrl, title, pubDate, tags) { // required entryUrl
        // register the .md file as an entry and add it to geminiBlog.entries
        var pd = new Date(pubDate) || null;
        title = title || entryUrl;
        var id = title.replace('.md', '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
        // if url begins with ./ replace it with repoBase, else leave as is and consider as full url
        var eurl = (entryUrl.slice(0, 2) === "./") ? geminiBlog.repoBase + entryUrl.slice(2) : entryUrl;
        var tags_clean = tags.toLowerCase().replace(" ", "").split(",");

        // create the entry object
        var entry = { // properties of each entry
            index: geminiBlog.entries.length,
            id: id,
            url: eurl,
            title: title,
            pubDate: pd,
            tags: tags_clean,
        };

        geminiBlog.entries.push(entry);

        if (tags && tags !== "") {
            geminiBlog.CategoriesEmpty = false;
            // push tag in tags_clean to geminiBlog.tags if not already in
            // accepts tagname= "Unatagged" useful in searching entries without tags
            for (var i = 0; i < tags_clean.length; i++) {
                if (geminiBlog.tags.indexOf(tags_clean[i]) == - 1) {
                    geminiBlog.tags.push(tags_clean[i]);
                }
            }
        }
    };
    // sort list by a key - default: pubDate
    geminiBlog.sortEntries = function(key, elist, reverse) {
        key = key || "pubDate" // "pubDate";
        elist = elist || geminiBlog.entries;
        reverse = reverse || true; // most recent first // highest value first
        elist.sort(function(a, b) {
            var keyA = a[key];
            var keyB = b[key];
            if (reverse) {
                return ((keyA < keyB) ? 1: ((keyA > keyB) ? - 1: 0));
            }
            else {
                return ((keyA < keyB) ? - 1: ((keyA > keyB) ? 1: 0));
            }
        });
    }
    // find entries by their id/index/tag
    geminiBlog.getEntryBy = function(itsTag, keyword, eid) {
        if (geminiBlog.entries.length === 0) {
            return false;
        }
        if (geminiBlog.entries.length === 1) {
            return geminiBlog.entries[0];
        }

        if (!itsTag) {
            for (var i in geminiBlog.entries) {
                // alert(geminiBlog.entries[i].id + " " + eid);
                if (geminiBlog.entries[i][keyword] === eid) {
                    return geminiBlog.entries[i];
                }
            }
            // alert(geminiBlog.entries[i].id+" "+eid);
            return false;
        }
        var tagged_entries = [];

        for (var i in geminiBlog.entries) {
            var entry = geminiBlog.entries[i];
            if (entry.tags.indexOf(keyword) !== - 1) {
                tagged_entries.push(entry);
            }
        }
        return (tagged_entries.length > 0) ? tagged_entries: false;
    }
    // markdown to html conversion function with variable replacement
    /* markdown2html parser https://github.com/chjj/marked/ */
    if (w.marked) {
        geminiBlog.markDownOptions = {
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false,
            //langPrefix: 'hljs ',
            highlight: function(code, lang) {
                return hljs.highlightAuto(code, [lang]).value
            }
        }
        // this function makes html from markdown
        geminiBlog.mdToHTML = function(md) {
            if (marked && geminiBlog.markDownOptions) {
                return marked(geminiBlog.handleVars(md), geminiBlog.markDownOptions);
            }
            return false;
        }
    }
    // parse and replace variables in entry
    geminiBlog.handleVars = function(markd, vname, vvalue) {
        // read vprefix and vpostfix from config
        // just replace if variable and value provided
        vname = vname || "";
        vvalue = vvalue || null;
        // if name and value provided, do just that
        if (vname !== "" && vvalue != null) {
            return markd.replace(new RegExp(utils.escapeRegExp(geminiBlog.variablePrefix + vname + geminiBlog.variablePostfix), 'g'), vvalue);
        }
        // else try defined variables
        for (var i = 0; i < geminiBlog.variables.length; i++) {
            vname = geminiBlog.variables[i].name;
            vvalue = geminiBlog.variables[i].value;
            markd = markd.replace(new RegExp(utils.escapeRegExp(geminiBlog.variablePrefix + vname + geminiBlog.variablePostfix), 'g'), vvalue);
        }
        return markd;
    }
    geminiBlog.createRecentPosts = function(entry) {
        var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.RecentPostsTemplate);
        var wrapper = $('.recent-posts-wrapper', snippetViewHTML);
        wrapper.setAttribute('id', entry.id);
        //wrapper.setAttribute("onclick", "document.location.href = '#!post=" + entry.id + "'");

        //set title
        $('.list-group-item', wrapper).setAttribute("href", "#!post=" + entry.id);
        $('.list-group-item', wrapper).textContent = (entry.title.length > 35) ? entry.title.slice(0, 35) + "...": entry.title;

        return snippetViewHTML.childNodes[0];

    }
    geminiBlog.createSnippet = function(entry, sliceAmount) {
        sliceAmount = sliceAmount || geminiBlog.snippetLength;

        var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.snippetViewTemplate);
        var wrapper = $('.snippet-wrapper', snippetViewHTML);
        wrapper.setAttribute('id', entry.id)
        //wrapper.setAttribute("onclick", "document.location.href = '#!post=" + entry.id + "'");

        var head = $('.entry-title', wrapper);

        //set title
        $('.snippet-title', head).setAttribute("href", "#!post=" + entry.id);
        $('.snippet-title', head).textContent = (entry.title.length > 35) ? entry.title.slice(0, 35) + "...": entry.title;

        // console.log(snippetViewHTML.innerHTML);
        // return inner dom
        return snippetViewHTML.childNodes[0];
    }
    geminiBlog.createDetails = function(entry) {
        var detailsViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.detailsViewTemplate);

        var head = $('.details-head-wrapper', detailsViewHTML);

        //set title
        //$('.details-title', head).setAttribute("href", "#!post=" + entry.id);
        $('.details-date', head).setAttribute("id", entry.id);
        //$('.details-title', head).textContent = entry.title;
        $('.details-date', head).textContent = "Posted by " + geminiBlog.author +
            " on " + entry.pubDate.toLocaleDateString();

        //set content
        $('.details-body', detailsViewHTML).innerHTML = entry.html;

        //footer
        var footer = $('.details-footer', detailsViewHTML);

        //markdown source
        if(geminiBlog.markDownloads) {
            $('#md-src', footer).setAttribute('href', entry.url);
        } else {
            utils.hide($('.markdown-source', footer));
        }

        if (geminiBlog.prevnextLinks)
        {
            // previous link
            if (entry.index > 0) {
                $('#previous-link', footer).setAttribute("href", "#!post=" + geminiBlog.getEntryBy(false, 'index', entry.index - 1).id);
                $('#previous-link', footer).setAttribute("title", geminiBlog.getEntryBy(false, 'index', entry.index - 1).title);
            } else {
                // remove link
                utils.hide($('#previous-link', footer));
            }
            // next link
            if (entry.index < geminiBlog.entries.length - 1) {
                $('#next-link', footer).setAttribute("href", "#!post=" + geminiBlog.getEntryBy(false, 'index', entry.index + 1).id);
                $('#next-link', footer).setAttribute("title", geminiBlog.getEntryBy(false, 'index', entry.index + 1).title);
            } else {
                // remove link
                utils.hide($('#next-link', footer));
            }
        } else {
            utils.hide($('#next-link', footer));
            utils.hide($('#previous-link', footer));
        }

        // console.log(detailsViewHTML.innerHTML);
        return detailsViewHTML.childNodes[0];
    }
    geminiBlog.createArchiveHtml = function(entry, edit_mode) {
        var archiveViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.archiveViewTemplate);
        var wrapper = $('.page-header', archiveViewHTML);
        //wrapper.setAttribute("onclick", "document.location.href = '#!post=" + entry.id + "'");

        var head = wrapper; //$('.archive-head', wrapper);

        //set title
        $('.post-title-url', head).setAttribute("href", "#!post=" + entry.id);
        $('.post-title-url', head).textContent = (entry.title.length > 35) ? entry.title.slice(0, 35) + "...": entry.title;
        $('.post-date', head).textContent = entry.pubDate.toLocaleDateString();

        if (edit_mode)
           $('.edi-button', head).setAttribute("href", "#!edit=" + entry.url);
        else
            utils.hide($('#da-invisible-edi', wrapper));

        // return inner dom
        return archiveViewHTML.childNodes[0];
    }

    // shows a subsection of entries in snippet mode, heading + a partial of content + meta
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
    }
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
    }
    geminiBlog.detailsView = function(entry, containerClass) {
        document.title = entry.title;
        var container = utils.clearElements($(containerClass || "#entries-wrapper"));

        geminiBlog.showRecentPosts();

        var detailsViewInstructions = function(entry) {
            //create and add snippet
            //console.log("Loaded entry: " + entry.index + ": " + entry.title + " " + entry.pubDate.toLocaleDateString());
            container.appendChild(geminiBlog.createDetails(entry));

            // scroll(0,posTop); // scroll to top after the entry loads, set the px value in config depending on header height
            // scroll upto entry.id anchor, markdown heading is just below
            document.getElementById(entry.id).scrollIntoView(true);
        }

        // fetch entry and process
        if (!entry.text) {
            utils.ajax({
                method: "GET",
                url: entry.url,
                mimeType: "text/plain; charset=x-user-defined",
                success: function(xhr) {
                    //console.log('processEntry(): Status: ' + xhr.status);
                    entry.text = xhr.responseText;
                    entry.html = geminiBlog.mdToHTML(xhr.responseText);

                    //generate
                    detailsViewInstructions(entry);

                },
                error: function() {
                    console.log("err");
                    return false;
                }
            })
        } else {
            //create and add details
            detailsViewInstructions(entry);
        }
    }
    geminiBlog.archiveView = function(givenArr, windowTitle, edit_mode) {
        document.title = windowTitle || geminiBlog.archiveTitle;
        scroll(0,0); // scroll to top, useful when on mobile device
        var container = utils.clearElements($("#entries-wrapper"));
        var entries = givenArr || geminiBlog.entries;

        entries.forEach(function(entry) {
            container.appendChild(geminiBlog.createArchiveHtml(entry, edit_mode));
        });
        geminiBlog.showRecentPosts();
    }

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
    }

    geminiBlog.createTagsView = function(tag) {
        var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.tagTemplate);
        var wrapper = $('.tags-wrapper', snippetViewHTML);
        wrapper.setAttribute('id', tag)
        //wrapper.setAttribute("onclick", "document.location.href = '#!tag=" + tag + "'");

        //category href and "badge" to show how many entires are in it
        $('.list-group-item', wrapper).setAttribute("href", "#!tag=" + tag);
        $('.list-group-item', wrapper).innerHTML = utils.capFirst(tag) + "<span class='badge'>" +
            geminiBlog.getEntryBy(true, tag).length + "</span>";

        return snippetViewHTML.childNodes[0];
    }

    geminiBlog.searchView = function() {
        document.title = geminiBlog.searchTitle;
        var container = utils.clearElements($("#entries-wrapper"));
        var foundPosts = false;

        geminiBlog.entries.forEach(function(entry) {
            if (entry.title.toLowerCase().match(
                        document.getElementById("uzer-infut").value.toLowerCase())) {
                container.appendChild(geminiBlog.createArchiveHtml(entry, false));
                foundPosts = true;
            }
        });

        if (!foundPosts) {
            var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.searchNoResultsTemplate);
            container.appendChild(snippetViewHTML.childNodes[0]);
        }

        geminiBlog.showRecentPosts();
    }

    geminiBlog.submitIt = function() {
        var anchor = document.location.hash.substring(2).toLowerCase();
            anchor === "search" ?
                geminiBlog.searchView() :
                document.location.href = "#!search";
    }

    geminiBlog.showKernels = function() {
        var container = utils.clearElements($("#kernels"));

        if (geminiBlog.showKernelsBar) {
            if (geminiBlog.kernelsFirstLoad) {
                utils.ajax({
                    method: "GET",
                    url: "https://www.kernel.org/feeds/kdist.xml",
                    success: function(xhr) {
                        var tag, x, release_version;

                        geminiBlog.kernelsFirstLoad = true;
                        tag = xhr.responseXML.getElementsByTagName("guid");

                        for (x = 0; x < 5; x++) {
                            release_version = tag[x].childNodes[0].nodeValue.split(",");
                            container.appendChild(geminiBlog.createKernels(release_version));
                        }
                    },
                    error: function() {
                        utils.hide($('#KernelsBar'));
                        return false;
                    }
                })
            }
        } else {
            utils.hide($('#KernelsBar'));
        }
    }

    geminiBlog.createKernels = function(entry) {
        var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.RecentKernelsTemplate);
        var wrapper = $('.recent-kernels-wrapper', snippetViewHTML);
        $('.list-group-item', wrapper).textContent = entry[1] + ' ' + entry[2];
        return snippetViewHTML.childNodes[0];
    }

    geminiBlog.hackerMode = function(entry, newPost, settingsMode) {
        scroll(0,0); // scroll to top, useful when on mobile device
        var container = utils.clearElements($("#entries-wrapper"));

        if (!newPost && !settingsMode) {
            document.title = "Hack Edit";
            var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.editTemplate);
            $('#download-button', snippetViewHTML).setAttribute('download',
                    entry.replace(geminiBlog.repoBase, ''));
            container.appendChild(snippetViewHTML.childNodes[0]);

            utils.ajax({
                method: "GET",
                url: entry,
                mimeType: "text/plain; charset=x-user-defined",
                success: function(xhr) {
                    document.getElementById('text-body').value = xhr.responseText;
                },
                error: function() {
                    console.log("err");
                    return false;
                }
            })
        } else if (newPost && !settingsMode) {
            document.title = "Hack New Post";
            var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.newPostTemplate);
            container.appendChild(snippetViewHTML.childNodes[0]);
            var inputFilename = document.getElementById('inputFilename');
            var download_btn = document.getElementById('download-button');

            document.getElementById('text-body').value = "\n---\n\nHello World";

            inputFilename.addEventListener('input', function() {
                var filename = inputFilename.value + '.md';
                download_btn.setAttribute('download', filename);

                if (localStorage.getItem(filename)) {
                    text_body.value = localStorage.getItem(filename);
                }
            }, false);
        } else if (settingsMode) {
            document.title = "Hack Settings";
            var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.settingsModeTemplate);
            container.appendChild(snippetViewHTML.childNodes[0]);

        }

        if (!settingsMode) {
            var text_body = document.getElementById('text-body');
            var download_button = document.getElementById('download-button');
            var rendertxt = true;

            document.getElementById('render-button').addEventListener('click', function() {

                    if (rendertxt) {
                        utils.hide($('#render-txt'));
                        document.getElementById('render-html').innerHTML =
                            geminiBlog.mdToHTML(text_body.value);
                        utils.show($('#render-html'));
                        rendertxt = false;
                    } else {
                        utils.hide($('#render-html'));
                        utils.show($('#render-txt'));
                        rendertxt = true;
                    }
            } , false);
        }

        var textFile = null,
          makeTextFile = function (text) {
            var data = new Blob([text], {type: 'text/plain'});
            if (textFile !== null) {
              window.URL.revokeObjectURL(textFile);
            }
            textFile = window.URL.createObjectURL(data);
            return textFile;
          };



        if (newPost || settingsMode) {
            var d = new Date();
            var mths = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            var jsdownload_button = document.getElementById('jsdownload-button');
            var udm = (localStorage.getItem("geminidump") ? JSON.parse(localStorage.getItem("geminidump")) :
                    JSON.parse(geminiBlog.inf));

            if (settingsMode) {
                for (name in udm['site'])
                {
                    switch(name) {
                        case "showRecentBar":
                        case "showCategories":
                        case "prevnextLinks":
                        case "markDownloads":
                            document.getElementById(name).checked = udm['site'][name]; // checkbox state
                            break;
                        default:
                            if (name !== "variables")
                                document.getElementById(name).value = udm['site'][name];
                    }
                }
            }

            var retJson = function(toLocalStorage) {
                if (newPost) {
                    udm['posts'][geminiBlog.entries.length] = ['./'+inputFilename.value+'.md',
                        document.getElementById('inputTitle').value,
                        mths[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(),
                        document.getElementById('inputCategories').value
                    ];
                } else {
                    for (name in udm['site'])
                        if (name !== "variables") {
                            switch(name) {
                                case "showRecentBar":
                                case "showCategories":
                                case "prevnextLinks":
                                case "markDownloads":
                                    var daVal = document.getElementById(name).checked; // checkbox state
                                    break;
                                case "frontPosts":
                                case "recentPosts":
                                    var daVal = parseInt(document.getElementById(name).value); // store as int
                                    break;
                                default:
                                    var daVal = document.getElementById(name).value; // store as str
                            }
                            switch(daVal) {
                                case "true":
                                case "false":
                                    udm['site'][name] = JSON.parse(daVal); // store as bool
                                    break;
                                default:
                                    udm['site'][name] = daVal;
                            }
                        }
                }

                if (toLocalStorage)
                    return JSON.stringify(udm)
                else
                    return "(function(){'use strict';var name,x,site,posts,infect;infect = " + JSON.stringify(udm) + ";site = infect.site;posts = infect.posts; for (name in site) geminiBlog[name] = site[name];for (x in posts) geminiBlog.registerEntry(posts[x][0], posts[x][1], posts[x][2], posts[x][3]);geminiBlog.inf = JSON.stringify(infect);})();"
            }

            document.getElementById('localstorage-button').addEventListener('click', function() {
                localStorage.setItem("geminidump", retJson(true));
            });

            jsdownload_button.addEventListener('click', function() {
                jsdownload_button.setAttribute('href', makeTextFile(retJson(false)));
                localStorage.setItem("geminidump", "");
            }, false);
        }

        if (!settingsMode) {
          text_body.addEventListener('input', function () {
              if (newPost) {
                  localStorage.setItem(
                          (inputFilename.value ? inputFilename.value : "AutoSavedPozt")
                          + '.md', text_body.value);
              }
              download_button.setAttribute('href', makeTextFile(text_body.value));
          }, false);
        }

        geminiBlog.showRecentPosts();
    }

    geminiBlog.hackerThemeMode = function() {
        scroll(0,0);
        document.title = "Hack Theme";
        var container = utils.clearElements($("#entries-wrapper"));
        var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.themeModeTemplate);
        container.appendChild(snippetViewHTML.childNodes[0]);

        var themesArr = ['theme1', 'theme2'];

        themesArr.forEach(function(theme) {
            document.getElementById(theme).addEventListener('click', function() {
                document.getElementById('currentTheme').href = './css/bootstrap-' + theme + '.min.css';
                localStorage.setItem('geminiTheme', theme);
            });
        });

        if (localStorage.getItem('geminiTheme')) {
            document.getElementById(localStorage.getItem('geminiTheme')).checked = true;
        }

        geminiBlog.showRecentPosts();
    }

    geminiBlog.uzerBruteForce = function() {
        var password = document.getElementById('inputPassword').value;

        // fake log-in form, fake password
        if (password === 'admin') {
            utils.hide($('#loginForm'));
            utils.show($('#hackerMode'));
            localStorage.setItem('uzerHackedIn', 'yup');
            document.getElementById('passwordError').setAttribute('class', 'form-group');
            document.getElementById('signinButton').setAttribute('class', 'btn btn-primary btn-block');
        } else {
            document.getElementById('passwordError').setAttribute('class', 'form-group has-error');
            document.getElementById('signinButton').setAttribute('class', 'btn btn-danger btn-block');
        }
    }

    geminiBlog.hackerMenu = function() {
        var menuList = document.getElementById('hackerMode').style.display;

        if (localStorage.getItem('uzerHackedIn')) {
            utils.hide($('#loginForm'));
            if (menuList === 'none') {
                utils.show($('#hackerMode'));
            } else {
                utils.hide($('#hackerMode'));
            }
        } else if (!geminiBlog.hackButton) {
            utils.show($('#loginForm'));
            geminiBlog.hackButton = true;
        } else {
            utils.hide($('#loginForm'));
            geminiBlog.hackButton = false;
        }
    }

    geminiBlog.detectOS = function() {
        var detect =
        {
            mobile:  ["Android", "iPhone", "iPod", "iPad", "Symbian", "Windows Phone", "BlackBerry"],

            shorter: ["Linux", "Free", "Open", "NetBSD", "BSD", "Mac",
                      "Win", "Sun", "HP", "Play", "Web", "QNX", "BeOS", "X11", "OS/2"],

            longer:  ["Linux", "FreeBSD", "OpenBSD", "NetBSD", "BSD", "Macintosh",
                      "Windows", "SunOS", "Hewlett-Packard", "PlayStation",
                      "WebTV OS", "QNX", "BeOS", "UNIX", "OS/2"],

            foundOS: "unknown",
            itsmobile: navigator.userAgent.match(/(Android)|(iPod)|(iPad)|(Symbian)|(Phone)|(BlackBerry)/i),

            findOS: function(arr, os, mobile_bool) {
                var x = arr.length;
                while (x--) {
                    if (os.indexOf(arr[x]) !== -1)
                    {
                        detect.foundOS = (mobile_bool ? arr[x] : detect.longer[x]);
                        break;
                    }
                }
            },
        };

        if (detect.itsmobile)
            detect.findOS(detect.mobile, navigator.userAgent, true);
        else
            detect.findOS(detect.shorter, navigator.platform, false);

        document.getElementById("detect-os").innerHTML = detect.foundOS;
    }
    geminiBlog.router = function() {
        // if anchored - show entry maching id with anchor or tag matching anchor or default page
        var anchor = document.location.hash.substring(2).toLowerCase(); // substring(2) removing hashbang

        if (anchor !== "") {

            // routing done here based on hashbang anchors
            switch (true) {
                case anchor === "frontpage" : return geminiBlog.snippetView();;
                case anchor === "archive"   : return geminiBlog.archiveView(false, false, false);;
                case anchor === "search"    : return geminiBlog.searchView();;
                case anchor === "new"       : return geminiBlog.hackerMode("", true, false);;
                case anchor === "edi"       : return geminiBlog.archiveView(false, "Why so serious", true);;
                case anchor === "settings"  : return geminiBlog.hackerMode("", false, true);;
                case anchor === "theme"     : return geminiBlog.hackerThemeMode();;

                // parse posts by regex
                case(/^post=(.*)/.test(anchor)):
                    if (geminiBlog.getEntryBy(false, 'id', anchor.match(/^post=(.*)/)[1])) {
                    return geminiBlog.detailsView(geminiBlog.getEntryBy(false, 'id', anchor.match(/^post=(.*)/)[1]));
                } else {
                    document.location.href = "#!frontpage";
                }
                break;

                // parse tags by regex
                case (/^tag=(.*)/.test(anchor)):
                    if (anchor.match(/^tag=(.*)/)[1]) {
                    return geminiBlog.archiveView(geminiBlog.getEntryBy(true, anchor.match(/^tag=(.*)/)[1]), geminiBlog.categoriesTitle, false);
                } else {
                    document.location.href = "#!frontpage";
                }
                break;

                case (/^edit=(.*)/.test(anchor)):
                    if (anchor.match(/^edit=(.*)/)[1]) {
                    return geminiBlog.hackerMode(anchor.match(/^edit=(.*)/)[1], false, false);
                } else {
                    document.location.href = "#!frontpage";
                }
                break;

                default:
                    document.location.href = "#!frontpage";
                break;
            }
        }

        // default - snippetview of fresh entries
        return geminiBlog.snippetView();
    }

    // setup = these functions are run after the page finishes loading
    geminiBlog.init = function() {
        // sort the lists
        geminiBlog.sortEntries("pubDate", geminiBlog.entries, false);
        geminiBlog.tags.sort();

        // populate sidebar with a list of entries - comment this out if sidebar is hidden
        // listView();
        // show view accordingly by router
        geminiBlog.router();
        utils.registerListener(w, 'hashchange', geminiBlog.router);
    }

    // Bootstrap dropdown menu without jquery
    var daMenus = {

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
        },
    };

    // !-- -------------------------------------------------------- -->
    // !-- Start the event listeners								-->
    // !-- -------------------------------------------------------- -->
    // fire geminiBlog.init() after page load or if the anchor changes
    utils.registerListener(w, 'load', geminiBlog.init);

    var clickListners = {
        'initHackerMode': geminiBlog.hackerMenu,
        'submitfutton': geminiBlog.submitIt,
        'signinButton': geminiBlog.uzerBruteForce,
    };

    for (var x in clickListners)
        document.getElementById(x).addEventListener('click', clickListners[x], false);

    // search form
    document.getElementById('uzer-infut').addEventListener('input', geminiBlog.submitIt, false);

    // log out from the "Hacker Mode"
    document.getElementById('logOut').addEventListener('click', function() {
        localStorage.setItem('uzerHackedIn', '');
        geminiBlog.hackButton = false;
        utils.hide($('#hackerMode'));
        document.location.href = "#!FlushTheWC";
    }, false);

    // dropdown menus
    utils.registerListener(w, 'resize', daMenus.closeMenusOnResize);
    daMenus.toggle.addEventListener('click', daMenus.toggleMenu, false);

    // debug
    w['geminiBlog'] = geminiBlog;

} (window);
