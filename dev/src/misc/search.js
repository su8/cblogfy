import {archiveTemplate, rantTemplate} from '../templates/mustache';

/* The search "engine" function */
export const searchPage = () => {
    let x = blog.reverse,
        arr = [],
        incNum = 0,
        foundPosts = false,
        uzerQuery = document.getElementById('uzer-infut')
            .value.toLowerCase();

    if (!uzerQuery) {
        blog.innerData(rantTemplate(''), arr, 'entries-wrapper', true);
        return false;
    }

    while (x--) {
        if (metaPool[x][1].toLowerCase().match(uzerQuery)) {
            arr[incNum++] = metaPool[x];
            foundPosts = true;
        }
    }
    blog.innerData(foundPosts ? archiveTemplate :
        rantTemplate(''), arr,
        'entries-wrapper', !foundPosts);
};
