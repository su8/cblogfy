/*
 Copyright 2014 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// While overkill for this specific sample in which there is only one cache,
// this is one best practice that can be followed in general to keep track of
// multiple caches used by a given service worker, and keep them all versioned.
// It maps a shorthand identifier for a cache to a specific, versioned cache name.

// Note that since global state is discarded in between service worker restarts, these
// variables will be reinitialized each time the service worker handles an event, and you
// should not attempt to change their values inside an event handler. (Treat them as constants.)

// If at any point you want to force pages that use this service worker to start using a fresh
// cache, then edit the expectedCache string. It will kick off the service worker update
// flow and the old cache(s) will be purged as part of the activate event handler when the
// updated service worker is activated.
var expectedCache = 'static-v11';
var filesToCache = [
    '../index.html',
    './blog-engine.min.js',
    './post-engine.min.js'
];


// cache the following resources so we can load
// the blog when browsing offline, the app
// will be also able to leverage the cache as well
// just make sure to update the static-v version
// when making changes to the blog engines and index.html
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(expectedCache)
        .then(function(cache) {
            cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCache !== cacheName) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {

  event.respondWith(
    caches.open(expectedCache).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        if (response) {
          // If there is an entry in the cache for event.request, then response will be defined
          // and we can just return it. Note that in this example, only font resources are cached.
          return response;
        }

        // Otherwise, if there is no entry in the cache for event.request, response will be
        // undefined, and we need to fetch() the resource.

        // We call .clone() on the request since we might use it in a call to cache.put() later on.
        // Both fetch() and cache.put() "consume" the request, so we need to make a copy.
        // (see https://fetch.spec.whatwg.org/#dom-request-clone)
        return fetch(event.request.clone()).then(function(response) {

          if (response.status < 400) {
            // This avoids caching responses that we know are errors (i.e. HTTP status code of 4xx or 5xx).
            // We also only want to cache responses that correspond to fonts,
            // i.e. have a Content-Type response header that starts with "font/".
            // Note that for opaque filtered responses (https://fetch.spec.whatwg.org/#concept-filtered-response-opaque)
            // we can't access to the response headers, so this check will always fail and the font won't be cached.
            // All of the Google Web Fonts are served off of a domain that supports CORS, so that isn't an issue here.
            // It is something to keep in mind if you're attempting to cache other resources from a cross-origin
            // domain that doesn't support CORS, though!
            // We call .clone() on the response to save a copy of it to the cache. By doing so, we get to keep
            // the original response object which we will return back to the controlled page.
            // (see https://fetch.spec.whatwg.org/#dom-response-clone)
            cache.put(event.request, response.clone());
          }            

          // Return the original response object, which will be used to fulfill the resource request.
          return response;
        });
      }).catch(function(error) {
        // This catch() will handle exceptions that arise from the match() or fetch() operations.
        // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
        // It will return a normal response object that has the appropriate error code set.
        // return caches.match(filesToCache[0]);
        throw error;
      });
    })
  );
});
