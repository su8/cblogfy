(function() {
    'use strict';

    var storageAvailable = (function() {
        try {
            var storage = localStorage,
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return false;
        }
    }());

    if (storageAvailable) {
        var storageSize = 0,
            oneMB = 1048576, // ~160 converted posts
            storageObj = null,
            today = new Date().getTime(),
            advance = new Date(),
            expireTwoDaysLater =
                advance.setDate(advance.getDate() + 2),
            expireDate =
                localStorage.getItem('expireDate'),
            expireDate = expireDate ? parseInt(expireDate) : 0;
        for (storageObj in localStorage) {
            switch (storageObj) {
                case 'key':
                case 'length':
                case 'getItem':
                case 'setItem':
                case 'removeItem':
                case 'clear':
                case 'expireDate':
                    continue;
            }
            storageSize +=
                localStorage[storageObj].length;
        }
        if (storageSize >= oneMB) {
            localStorage.clear();
        }
        if (expireDate && today > expireDate) {
            localStorage.clear();
        }
    }

    var ajax = function(o) {
        document.getElementById('progress-bar')
            .setAttribute('class', 'progress');
        var curProgress = document.getElementById('cur-progress');
        var setProgress = function(percent) {
            curProgress.setAttribute('style',
                    'width:' + percent + '%');
        };
        var xhr = new XMLHttpRequest();
        xhr.timeout = 4000;
        xhr.overrideMimeType('text/plain; charset=UTF-8');
        xhr.ontimeout = function() {
            blog.innerData(blog.rantTemplate('Requested timeout ' + o.url),
                    [], 'entries-wrapper');
        };
        xhr.onerror = function() {
            blog.innerData(blog.rantTemplate(
                        'An error occurred while transferring ' + o.url),
                    [], 'entries-wrapper');
        };
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                o.success(xhr.responseText);
            }
        };
        xhr.onprogress = function(woof) {
            if (woof.lengthComputable) {
                setProgress((Math.floor((
                    woof.loaded / woof.total) * 100)));
            }
        };
        xhr.onloadstart = function() {
            setProgress(10);
        };
        xhr.onloadend = function() {
            setProgress(100);
        };
        xhr.open('GET', o.url, true);
        xhr.send(null);
    };

    var convertMDtoHTML = function(md) {
        var regularTable = new RegExp('<table>', 'g'),
            converter = new showdown.Converter({
                simplifiedAutoLink: true,
                strikethrough: true,
                tables: true,
                ghCodeBlocks: true,
                tasklists: true,
                extensions: ['codehighlight']
            });
        return converter.makeHtml(md).replace(regularTable,
                '<table class="table table-hover">');
    };

    var innerPostContent = function(stripURL) {
        document.getElementById('details-body').innerHTML =
            blog.cachedPost[stripURL][1];
    };

    blog.matchNdownload = function() {
        var url,
            x = blog.reverse,
            stripURL,
            postPage = document.location.href.split('=')[1];

        while (x--) {
            if (postPage === metaPool[x][0]) {
                stripURL = metaPool[x][0];
                url = './markdown/' +
                    stripURL + '.md';
                break;
            }
        }
        if (url) {
            document.title = metaPool[x][1];

            if (!blog.cachedPost[stripURL]) {
                blog.cachedPost[stripURL] = [tmpl(
                    blog.postTemplate,
                    [x, metaPool[x][3].toLowerCase().split(',')]
                )];
            }
            document.getElementById('entries-wrapper').innerHTML =
                blog.cachedPost[stripURL][0];
            document.getElementById('details-title').textContent = metaPool[x][1];
            document.getElementById('md-src').setAttribute('href', url);

            if (storageAvailable) {
                if (!!localStorage[stripURL]) {
                    blog.cachedPost[stripURL][1] =
                        localStorage[stripURL];
                }
            }
            if (!blog.cachedPost[stripURL][1]) {
                ajax({
                    url: url,
                    success: function(xhr) {
                        blog.cachedPost[stripURL][1] =
                            convertMDtoHTML(xhr);
                        innerPostContent(stripURL);
                        if (storageAvailable) {
                            storageSize +=
                                blog.cachedPost[stripURL][1].length;
                            if (storageSize >= oneMB) {
                                localStorage.clear();
                            }
                            if (!expireDate) {
                                localStorage.setItem(
                                    'expireDate', expireTwoDaysLater);
                            }
                            localStorage[stripURL] =
                                blog.cachedPost[stripURL][1];
                        }
                        setTimeout(function() {
                            document.getElementById('progress-bar')
                                .setAttribute('class', 'hide');
                        }, 1000);
                    }
                });
            } else {
                innerPostContent(stripURL);
            }

        } else {
            blog.innerData(blog.rantTemplate(''), [], 'entries-wrapper');
        }
    };
    blog.postJsHere = true;

}());
