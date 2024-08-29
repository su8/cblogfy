import {postTemplate} from '../templates/mustache-post';
import {rantTemplate} from '../templates/mustache';
import {ajax} from './post-ajax';
import {Ztorage} from './post-storage';

/* The mardown parser */
const convertMDtoHTML = md => {
    const regularTable = new RegExp('<table>', 'g'),
        converter = new showdown.Converter({
            simplifiedAutoLink: true,
            strikethrough: true,
            tables: true,
            ghCodeBlocks: true,
            tasklists: true,
            extensions: ['codehighlight']
        });
    return converter.makeHtml(md).replace(regularTable,
            '<table class="table table-hover">');
};

const innerPostContent = stripURL => {
    document.getElementById('details-body').innerHTML =
        blog.cachedPost[stripURL][1];
};

/* Save the blog post in the localStorage */
const cacheItLocally = stripURL => {
    if (Ztorage.available) {
        Ztorage.zize +=
            blog.cachedPost[stripURL][1].length;
        if (Ztorage.zize >= Ztorage.oneMB) {
            localStorage.clear();
        }
        if (!Ztorage.expireDate) {
            localStorage.setItem(
                'expireDate', Ztorage.expireTwoDaysLater);
        }
        localStorage[stripURL] =
            blog.cachedPost[stripURL][1];
    }
};

/* Get some blog post and cache it for the next 2 days */
blog.matchNdownload = () => {
    let url,
        x = blog.reverse,
        stripURL,
        postPage = document.location.href.split('=')[1];

    while (x--) {
        if (postPage === metaPool[x][0]) {
            stripURL = metaPool[x][0];
            url = `./markdown/${stripURL}.md`;
            break;
        }
    }
    if (url) {
        document.title = metaPool[x][1];

        if (!blog.cachedPost[stripURL]) {
            blog.cachedPost[stripURL] = [
                postTemplate(
                    [x, metaPool[x][3].toLowerCase().split(',')]
            )];
        }
        document.getElementById('entries-wrapper').innerHTML =
            blog.cachedPost[stripURL][0];
        document.getElementById('details-title').textContent = metaPool[x][1];
        document.getElementById('md-src').setAttribute('href', url);

        if (Ztorage.available) {
            if (!!localStorage[stripURL]) {
                blog.cachedPost[stripURL][1] =
                    localStorage[stripURL];
            }
        }
        if (!blog.cachedPost[stripURL][1]) {
            ajax(url)
                .then(resp => {
                    blog.cachedPost[stripURL][1] =
                        convertMDtoHTML(resp);
                    innerPostContent(stripURL);
                    cacheItLocally(stripURL);
                    setTimeout(() => {
                        const progressBar = document.getElementById('progress-bar');
                        if (progressBar) {
                           progressBar.setAttribute('class', 'hide');
                        }
                    }, 1000);
                });
        } else {
            innerPostContent(stripURL);
        }

    } else {
        blog.innerData(rantTemplate(''), [], 'entries-wrapper', true);
    }
};
blog.postJsHere = true;
