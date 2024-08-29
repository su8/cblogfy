
---

Some short but helpful Service Worker tips.

The sw have to reside in the root directory of your website.

>For security reasons, a service worker can only control the pages that are in the same directory level or below it. This means that if you place the service worker file in a scripts directory it will be only able to be attached to pages inside the /scripts directory and below (/scripts/test/ for example).

I wish I knew this from the very beginning, as it caused me a lot of trouble (in my initial post where I saw the 'offline' page). I was able to cache '../img/this.png', but wasn't able to update it once the image was changed or the sw script itself was updated.

Get to know your web server caching policy, and lower the sw script caching if you are changing it too often.

If you want to update your sw to point to a new version, don't exchange single character such as: **1.2** to **1.3**, the correct approach will be **1.2.4.6.8**, so it will guarantee that the browser will detect the byte-by-byte difference. Currently most major browsers fail to detect the byte-by-byte difference 3 out of 10 attempts when a single character is changed.

Do not omit `console.log`s from your sw as the mobile browsers does not ship "developer tools", to see the logs and verify the script flow was as intended to be when on mobile head over to **chrome://serviceworker-internals**.

Always open the cache for reading when you'd like to query it, if nothing is found try fetching from the network. Do not assume that your browser vendor will follow the service worker spec closely, or implemented it bugfree - see the updating reference above.

The following example works as long as you are:

1. online
2. not refreshing the page while offline

You can summon the cached page by typing it's url directly, but once you try to refresh it, the offline Dinosaur will be shown. Also once the service worker is terminated you'll never get the chance to summon the page back.

```javascript
self.addEventListener('fetch', function(event) {
  event.respondWith(
      caches.match(event.request).then(function(response) {
        return (response || fetch(event.request));
      }).catch(function(error) {
        throw error;
      })
  );
});
```

Again, open the pre-defined CACHE NAME VARIABLE for reading and then query it. Notice the difference.

```javascript
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME_VARIABLE).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return (response || fetch(event.request));
      }).catch(function(error) {
        throw error;
      });
    })
  );
});
```

Depending on your caching strategy, you might want to (fetch as you go) put the fetch request and response in the cache afterwards. If you do prefer to fetch as you go, make sure that you're not putting the sw script itself into the cache.

Regardless how many times the offline page will be refreshed, the Dinosaur will never be shown.

---

Well, I actually went with fetch as you go strategy to allow my blog visitors to read my entire blog posts while offline. In the initial sw installation and registration stage, some pre-defined assets are cached straightaway. The upcoming fetch requests are long-term cached until the cache version is changed.

My very fist service worker:

```javascript
var expectedCache = 'static-v2';
var filesToCache = [
    '../index.html',
    './style.css',
    './some.fonts'
];

console.log(expectedCache);
function purgeCache(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCache !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  updateCache(event);
}

function updateCache(event) {
  event.waitUntil(
    caches.open(expectedCache)
    .then(function(cache) {
      cache.addAll(filesToCache);
    })
  );
}

self.addEventListener('install', updateCache);

self.addEventListener('activate', purgeCache);

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(expectedCache).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return (response || fetch(event.request));
      }).catch(function(error) {
        throw error;
      });
    }).catch(function(e) {
        purgeCache(event);
    })
  );
});
```

And here's the latest version, caching only the pre-defined assets and blog posts, whenever image request fails (requested offline) it's replaced with the offline.jpg image. The service worker also generates sitemap and RSS feed on-the-fly right after js/config.js is parsed and executed where it uses 'postMessage' to submit the metaPool to the sw which invokes the 'onmessage' listener.

```javascript
var expectedCache = '7.0.0.33.2.3.6';
var webPage = 'https://wifiextender.github.io';
var redirect = '<meta http-equiv="refresh" content="0; url=' + webPage + '/">';
var rssContentType = 'application/rss+xml, application/rdf+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8; charset=utf-8';
var filesToCache = [
    './index.html',
    './js/config.js',
    './js/blog-engine.min.js',
    './js/post-engine.min.js',
    './img/icons/icon.ico',
    './manifest.json',
    './img/offline.jpg',
    './xml/xml-stylesheet.css'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(expectedCache).then(function(cache) {
      console.log(expectedCache);
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames
        .filter(function(oldCache) {
          return oldCache !== expectedCache;
        })
        .map(function(oldCache) {
          return caches.delete(oldCache);
        })
      );
    })
  );
});

function itsImgRequest(req) {
  return (/\/img\/file/.test(req));
}

function genResponse(content, contentType) {
  return new Response(content, {
    headers: {
      'content-type': contentType
    }
  });
}

self.addEventListener('fetch', function(event) {
  var req = new URL(event.request.clone().url);
  event.respondWith(
    caches.open(expectedCache).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request.clone())
        .then(function(resp) {
          if (!(itsImgRequest(req.pathname))) {
            if (resp.status === 404) {
              return genResponse(redirect, 'text/html');
            }
            cache.put(event.request, resp.clone());
          }
          return resp;
        }).catch(function() {
          if (itsImgRequest(req.pathname)) {
            return cache.match('./img/offline.jpg');
          }
        });
      }).catch(function(error) {
        throw error;
      });
    })
  );
});

function genFeed(arr) {
  var head = [
    '<?xml version="1.0" encoding="UTF-8" ?>',
    '<?xml-stylesheet type="text/css" href="./xml/xml-stylesheet.css" ?>',
    '<rss version="2.0"><channel>',
      '<title>Linux Blog</title>',
      '<link>' + webPage + '</link>',
      '<description>Useful Linux Tips</description>'
  ].join('');
  var bottom = '</channel></rss>';

  var toNuke = ['\"', "'", '?', '&', '=', '^', '!', '@',
    ' #', '%', '*', '~', '(', ')', '{', '}', '<', '>',
    '[', ']', '|', ':', ' ; ', '$', '/', '\\'
  ];
  var nukeLen = toNuke.length;
  var x = 0;

  var content = arr.map(function(el) {
    var elem = el[1];
    x = nukeLen;
    while (x--) {
      elem = elem.split(toNuke[x]).join('');
    }
    return [
      '<item>',
        '<title>' + elem + '</title>',
        '<link>' + webPage + '/#!post=' + el[0] + '</link>',
        '<description>' + elem + '</description>',
      '</item>'
    ].join('');

  }).join('');

  return (head + content + bottom);
}

self.addEventListener('message', function(event) {
  var sitemap = JSON.parse(event.data);
  var startLen = sitemap.length;
  caches.open(expectedCache).then(function(cache) {
    cache.put('./sitemap.xml', genResponse(
      genFeed(sitemap), rssContentType));
    if (startLen >= 10) {
      var arr = [],
        end = startLen - 10,
        num = 0;
      while (startLen-- > end) {
        arr[num++] = sitemap[startLen];
      }
      cache.put('./feed.xml', genResponse(
        genFeed(arr), rssContentType));
    }
  });
});
```
