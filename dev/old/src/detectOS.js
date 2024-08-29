// operating system detection
// will be shown at the very bottom of each page
(function() {
    'use strict';
    var detect =
    {
        mobile:  ['Android', 'iPhone', 'iPod', 'iPad', 'Symbian', 'Windows Phone', 'BlackBerry'],

        shorter: ['Linux', 'Free', 'Open', 'NetBSD', 'BSD', 'Mac',
                  'Win', 'Sun', 'HP', 'Play', 'Web', 'QNX', 'BeOS', 'X11', 'OS/2'],

        longer:  ['Linux', 'FreeBSD', 'OpenBSD', 'NetBSD', 'BSD', 'Macintosh',
                  'Windows', 'SunOS', 'Hewlett-Packard', 'PlayStation',
                  'WebTV OS', 'QNX', 'BeOS', 'UNIX', 'OS/2'],

        foundOS: 'unknown',
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
        }
    };

    if (detect.itsmobile) {
        detect.findOS(detect.mobile, navigator.userAgent, true);
    } else {
        detect.findOS(detect.shorter, navigator.platform, false);
    }

    document.getElementById('detect-os').textContent = detect.foundOS;
}());
