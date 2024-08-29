// version 1
//    script.
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


//version 2
//    script.
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
            //if (xhrRunner.firstRun) {
            //    xhrRunner.getAsyncFile('./css/bootstrap-theme1.min.css');
            //    xhrRunner.firstRun = false;
            //}
            w.xhrRunner = xhrRunner;
        }(window));


      //script.
        (function() {
            'use strict';
            xhrRunner.getAsyncFile(
              'https://fonts.googleapis.com/css?family=Roboto:400,700'
            );
        }());



    // Eliminate roundtrips
    //link(href='https://fonts.gstatic.com', rel='preconnect', crossorigin='anonymous')
    //link(href='https://fonts.googleapis.com', rel='preconnect', crossorigin='anonymous')

// version 3
//    script.
        (function() {
            'use strict';
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
             xhr.open('GET',
               'https://fonts.googleapis.com/css?family=Roboto:400,700', true);
             xhr.send(null);
        }());
