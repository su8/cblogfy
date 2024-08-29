import {searchPage} from './search';

const submitIt = e => {
    /* Cancel the default query submission */
    e.preventDefault();

    const anchor = document.location.hash.split('=')[0];
    if (anchor === '#!search') {
        searchPage();
    } else {
        document.location.href = '#!search';
    }
};

/* Bootstrap dropdown menu without jquery */
const classChildren = x => document.getElementsByClassName(`navbar-${x}`)[0];

/* Toggle the dropdown menu when the
 * hamburger button is clicked */
classChildren('toggle').addEventListener('click', () => {
    classChildren('collapse').classList.toggle('collapse');
}, false);

/* search form button */
document.getElementById('submitfutton')
    .addEventListener('click', submitIt, false);

/* search form input */
document.getElementById('uzer-infut')
    .addEventListener('input', submitIt, false);
