import {itsMobile} from './misc/detectOS';
import * as template from './templates/mustache';
import {searchPage} from './misc/search';
import {checkPostEngineSrc} from './misc/check-post-engine';
import './misc/global_stuff';

/* Calculate the metapool elements number once */
const metaLen = metaPool.length;

/* Accessible across the modules and the `window' */
const Blog = class {

    /* Trim title when it exceeds 35 chars */
    trimTitle (text) {
        return text.length > 35 ?
            text.slice(0, 35) + '...' : text;
    }

    /* Capitalize the first char and lower the rest */
    capFirst (text) {
        return text.charAt(0).toUpperCase() +
            text.slice(1).toLowerCase();
    }

    /* Glue the metadata and template then inner it into the cur page */
    innerData (glueTemplate, data, id, errGlued) {
        const templ = document.createElement('div'),
            container = document.querySelector(`#${id}`);
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        templ.innerHTML = errGlued ? glueTemplate : glueTemplate(data);
        container.appendChild(templ);
    }

    /* Show how many entries are in each category */
    categoriesMatchNum (category) {
        let x = metaLen,
            catsMatchNum = 0,
            incNum2 = catsMeta.length;

        while (x--) {
            if (metaPool[x][3].toLowerCase()
                    .includes(category)) {
                catsMatchNum++;
                catsMeta[incNum2++] = metaPool[x];
            }
        }
        return catsMatchNum;
    }

    constructor() {
        this.reverse         = metaLen;
        this.cachedPost      = {};
        this.postJsRecursion = 0;
    }
};
let blog = new Blog();

/* locals */
let reverseNum = metaLen,
    cats = '',
    num = 0,
    incNum = 0,
    catsClean = [],
    catsMeta = [],
    categories = [],
    shortMeta = [],
    ramCache = {},
    catsCache = {},
    entriesWrapper = 'entries-wrapper',
    shared = 'shared',
    showedSidebars = false;

/* Metadata used by the templates to build post title and href link */
const generateEntriesMeta = (isIndexPage, anchor) => {
    let num = 0,
        start = metaLen,
        end = 0;

    if (!ramCache[anchor]) {
        shortMeta = [];
        if (isIndexPage) {
            end = (((metaLen - 10) > 9) ?
                (metaLen - 10) : 0);
        }

        while (start-- > end) {
            shortMeta[num++] = metaPool[start];
        }
        ramCache[anchor] = shortMeta;
    } else {
        shortMeta = ramCache[anchor];
    }
};

/* Show the Recent Posts and Categories sidebars once */
const showSideBars = () => {
    blog.innerData(template.recentPostsTemplate, shortMeta, 'recent-posts');
    blog.innerData(template.categoriesTemplate, categories.sort(), 'tags-div');
    showedSidebars = true;
};

/* Match and sort some category elems in descending order */
const matchCategory = category => {
    if (catsCache[category]) {
        return catsCache[category];
    }

    let arr = [],
        catsArr = [],
        foundCat = false,
        incNum = 0,
        num = catsMeta.length;
    while (num--) {
        catsArr = catsMeta[num][3].toLowerCase().split(',');
        if (catsArr.includes(category) &&
                !arr.includes(catsMeta[num])) {
            arr[incNum++] = catsMeta[num];
            foundCat = true;
        }
    }
    arr = arr.sort((keyA, keyB) => {
        keyA = new Date(keyA[2]);
        keyB = new Date(keyB[2]);
        return ((keyA < keyB) ? 1: ((keyA > keyB) ? - 1: 0));
    });

    if (foundCat) {
        catsCache[category] = arr;
        return arr;
    }
    return false;
};
const repeatSomethin = (setTitle, metaBool, anchor) => {
    document.title = setTitle;
    generateEntriesMeta(metaBool, anchor);
    if (!showedSidebars) {
        showSideBars();
    }
};

/* Get the categories names */
while (reverseNum--) {
    cats = metaPool[reverseNum][3];
    if (cats) {
        catsClean = cats.toLowerCase()
            .replace(' ', '').split(',');
        num = catsClean.length;
        while (num--) {
            if (!categories.includes(catsClean[num])) {
                categories[incNum++] = catsClean[num];
            }
        }
    }
}

/* The pre-defined router routes */
const route = {
    archive (args) {
        repeatSomethin(blog.capFirst(args[0]), false, args[0]);
        blog.innerData(template.archiveTemplate,
                shortMeta, entriesWrapper);
    },
    category (args) {
        repeatSomethin('Categories', true, shared);
        const dummyvar = matchCategory(args[1]);

        blog.innerData(dummyvar ?
                template.archiveTemplate :
                template.rantTemplate(''), dummyvar || [],
                entriesWrapper, !dummyvar);
    },
    search (args) {
        repeatSomethin(blog.capFirst(args[0]), true, shared);
        searchPage();
    },
    post (args) {
        if (!blog.postJsHere && itsMobile) {
            blog.innerData('Loading....',
                    [], entriesWrapper, true);
        }
        generateEntriesMeta(true, shared);
        checkPostEngineSrc();
    }
};

/* The router */
const INVOKE_ROUTER = () => {
    const arr = document.location.hash.substring(2).split('=');
    const path = arr[0];

    if (route[path]) {
        route[path](arr);
    } else {
        repeatSomethin('Linux Blog', true, shared);
        blog.innerData(template.entriesTemplate,
                shortMeta, entriesWrapper);
    }
};

window.addEventListener('load', () => {
    INVOKE_ROUTER();
    if (!showedSidebars) {
        showSideBars();
    }
    window.addEventListener('hashchange',
            INVOKE_ROUTER, false);
}, false);

window.blog = blog;
