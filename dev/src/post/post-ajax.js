import {rantTemplate} from '../templates/mustache';

/* The post fetcher */
export const ajax = url => {
    return new Promise((resolve, reject) => {
        document.getElementById('progress-bar')
            .setAttribute('class', 'progress');
        let curProgress = document.getElementById('cur-progress');
        const setProgress = percent => {
            curProgress.setAttribute('style', `width: ${percent}%`);
        };
        let xhr = new XMLHttpRequest();
        xhr.timeout = 8000;
        xhr.overrideMimeType('text/plain; charset=UTF-8');
        xhr.ontimeout = () => {
            blog.innerData(rantTemplate(`Requested timeout ${url}`),
                    [], 'entries-wrapper', true);
        };
        xhr.onerror = () => {
            blog.innerData(rantTemplate(
                        `An error occurred while transferring ${url}`),
                    [], 'entries-wrapper', true);
        };
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.responseText);
            }
        };
        xhr.onprogress = woof => {
            if (woof.lengthComputable) {
                setProgress((Math.floor((
                    woof.loaded / woof.total) * 100)));
            }
        };
        xhr.onloadstart = () => {
            setProgress(10);
        };
        xhr.onloadend = () => {
            setProgress(100);
        };
        xhr.open('GET', url, true);
        xhr.send(null);
    });
};
