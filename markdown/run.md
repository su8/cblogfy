Today I had a little bit more spare time than usual and decided to play with my blog loading speed. Tried several different techniques to asynchronously fetch the most important resources, so my blog loading time to be decreased.

The last speed improvement:

![](img/file/revup/2.png)

The new speed improvement:

![](img/file/run/9.png)

The following **head** script example is what Yahoo, and other companies will recommend you to "asynchronously" fetch your stylesheet.

```javascript
<script>
      (function() {
          'use strict';
          var head = document.getElementsByTagName('head')[0];
          var bootnap = document.createElement('link');
          bootnap.rel = 'stylesheet';
          bootnap.href = './css/bootstrap-theme1.min.css';
          head.appendChild(bootnap);
      }());
</script>
```

We want to use some popular and eyecandy fonts, added before the closing body tag

```html
<link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
```
Result:

![](img/file/run/result1.png)

![](img/file/run/result11.png)

---

Google **css media only x** to learn moar. As usual, this example goes into your **head**.

```javascript
<script>
      (function() {
          'use strict';
          var head = document.getElementsByTagName('script')[0];
          var bootnap = document.createElement('link');
          bootnap.rel = 'stylesheet';
          bootnap.href = './css/bootstrap-theme1.min.css';
          bootnap.media = 'only x';
          head.parentNode.insertBefore(bootnap, head);
          setTimeout(function() {
            bootnap.media = 'all';
          });
      }());
</script>
```
Added before the closing body tag

```html
<link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
```

Result:

![](img/file/run/result2.png)

![](img/file/run/result22.png)

---

Let's test the built-in **XMLHttpRequest**, which strongly encourages you to fetch files asynchronously.

The **head** script:

```javascript
<script>
      (function() {
          'use strict';
          var head = document.getElementsByTagName('script')[0];
          var bootnap = document.createElement('link');
          bootnap.rel = 'stylesheet';
          bootnap.href = './css/bootstrap-theme1.min.css';
          bootnap.media = 'only x';
          head.parentNode.insertBefore(bootnap, head);
          setTimeout(function() {
            bootnap.media = 'all';
          });
      }());
</script>
```

Added before the closing body tag

```javascript
<script>
      (function() {
          'use strict';
          var xhr = new XMLHttpRequest();
          xhr.timeout = 4000;
          xhr.overrideMimeType('text/css; charset=UTF-8');
          xhr.onreadystatechange = function() {
              if (xhr.readyState === 4 && xhr.status === 200) {
                  var style = document.createElement('style'),
                      lastJS = document.getElementsByTagName('script')[2];
                  style.appendChild(document.createTextNode(xhr.responseText));
                  lastJS.appendChild(style);
              }
          };
          xhr.open('GET', 'https://fonts.googleapis.com/css?family=Roboto:400,700', true);
          xhr.send(null);
      }());
</script>
```

Result:

![](img/file/run/result3.png)

![](img/file/run/result33.png)

---

So far all the above examples wasn't playing nice with our eyes as the reflow/repaint process was getting in our way really nasty.

The sweet spot is to inline critical above-the-fold css into the page itself and fetch asynchronously the bootstrap theme. Let's install **grunt-uncss** and inline the needed css into the page itself.

```bash
npm install grunt
npm install grunt-uncss
```

**Gruntfile.js**

```javascript
module.exports = function(grunt) {
    grunt.initConfig({
        uncss: {
            dist: {
                files: {
                    'inline.css' : ['your-blog-page.html']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-uncss');
    grunt.registerTask('default', ['uncss']);
};
```

**your-blog-page.html** must have valid link to the currently used page stylesheet file.

Run `grunt` and unminified **inline.css** will be created containing only the critical css for that page, minify and inline it directly into the page.

Add the following script before the closing body tag

```javascript
<script>
    (function() {
        'use strict';
        var getAsyncFile = function(fileStr) {
            var xhr = new XMLHttpRequest();
            xhr.timeout = 4000;
            xhr.overrideMimeType('text/css; charset=UTF-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var style = document.createElement('style'),
                        head = document.getElementsByTagName('head')[0];
                    style.appendChild(document.createTextNode(xhr.responseText));
                    head.appendChild(style);
                }
            };
            xhr.open('GET', fileStr, true);
            xhr.send(null);
        };
        getAsyncFile('./css/bootstrap-theme1.min.css');
        getAsyncFile('https://fonts.googleapis.com/css?family=Roboto:400,700');
</script>
```

The result:

![](img/file/run/4.png)

The Desktop score went from 94 to 96 using this example.

---

I want the bootstrap theme to be fetched as early as possible, the fetching now starts at 180ms - best so far.

The head script:

```javascript
<script>
    (function(w) {
        'use strict';
        var xhrRunner = {
            firstRun: true
        };
        xhrRunner.getAsyncFile = function(fileStr) {
            var xhr = new XMLHttpRequest();
            xhr.timeout = 4000;
            xhr.overrideMimeType('text/css; charset=UTF-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var style = document.createElement('style'),
                        head = document.getElementsByTagName('head')[0];
                    style.appendChild(document.createTextNode(xhr.responseText));
                    head.appendChild(style);
                }
            };
            xhr.open('GET', fileStr, true);
            xhr.send(null);
        };
        if (xhrRunner.firstRun) {
            xhrRunner.getAsyncFile('./css/bootstrap-theme1.min.css');
            xhrRunner.firstRun = false;
        }
        w.xhrRunner = xhrRunner;
    }(window));
</script>
```

Added before the closing body tag

```javascript
<script>
    (function() {
        'use strict';
        xhrRunner.getAsyncFile(
        'https://fonts.googleapis.com/css?family=Roboto:400,700'
        );
    }());
</script>
```


The result:

![](img/file/run/5.png)

~~The overall speed improvement as tested from my DSL internet is 150ms. It was 800ms when I started the test and went down to 650ms with the last example.~~

---

One day later:

**grunt-uncss** proved to be rock solid and used it once again, this time I made seperate page that includes all the classes that my blog is using. It looks like I've been using only 10% (13KB out of 126KB) of the bootstrap framework.

After minifying and inlining the newly created file into the test page itself, google pagespeed insights increased the mobile rank with 1 point up to 90.

---

After quick research for Roboto fonts alternative, this image appeared among the first page results:

![](img/file/run/ohsnap.gif)

What happened next is that 3 requests are saved, actually 4 since all the blog css is inlined into the page itself.

![](img/file/run/7.png)

~~~The overall speed improvement as tested from my DSL internet is 470ms. It was 800ms when I started the test and went down to 330ms with the font removal, and css inlining.~~~

---

Four days later:

Separated the blog engine in two parts, post engine and blog engine. Also utilized the localStorage with exipration after 2 days for storing the converted blog posts by the browser. There is no need to carry the post engine logic unless a post is requested.

Just by doing this I shaved 80ms off the loading time, went down to 250ms. I'm curious to find out what numbers Pingdom will show me.

![](img/file/run/8.png)

![](img/file/run/9.png)

![](img/file/run/result44.png)

The blog look was updated several days later, the blog also feels and performs the very same way, except it loads much more faster. "What I don't need" was what drove me all the time.
