/* operating system detection
 * will be shown at the very bottom of each page */
export let itsMobile = false;
(() => {
    const detect =
    {
        mobile:  ['Android', 'iPhone', 'iPod', 'iPad', 'Symbian', 'Windows Phone', 'BlackBerry'],

        shorter: ['linux', 'free', 'open', 'netbsd', 'bsd', 'mac', 'win', 'sun', 'hp', 'play',
                  'web', 'qnx', 'beos', 'x11', 'os/2', 'cros'],

        longer:  ['Linux', 'FreeBSD', 'OpenBSD', 'NetBSD', 'BSD', 'Macintosh',
                  'Windows', 'SunOS', 'Hewlett-Packard', 'PlayStation',
                  'WebTV OS', 'QNX', 'BeOS', 'UNIX', 'OS/2', 'Chrome OS'],

        foundOS: 'unknown',
        itsmobile: navigator.userAgent.match(/(Android)|(iPod)|(iPad)|(Symbian)|(Phone)|(BlackBerry)/i),

        findOS (arr, os, mobileBool) {
            const num = arr.findIndex(x => os.includes(x));
            detect.foundOS = (num >= 0) ? (mobileBool ?
                    arr[num] : detect.longer[num]) : 'unknown';
        }
    };

    if (detect.itsmobile) {
        detect.findOS(detect.mobile, navigator.userAgent, true);
        itsMobile = true;
    } else {
        detect.findOS(detect.shorter, navigator.platform.toLowerCase(), false);
    }

    document.getElementById('detect-os').textContent = detect.foundOS;
})();
