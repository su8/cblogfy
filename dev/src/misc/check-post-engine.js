/* The blog and post engines are separated.
 * Get the post engine only when a post page is requested */
import {rantTemplate} from '../templates/mustache';
export const checkPostEngineSrc = () => {

    const lastJS = document.getElementsByTagName('script')[3];
    if (!lastJS) {
        let newJS = document.createElement('script');
        newJS.src = './js/post-engine.min.js';
        document.getElementsByTagName('body')[0]
            .appendChild(newJS);
    }

    if (blog.postJsRecursion < 1000) {
        if (!blog.postJsHere) {
            blog.postJsRecursion++;
            setTimeout(() => {
                checkPostEngineSrc();
            }, 50);
        } else {
            blog.matchNdownload();
        }
    }
};
