export const Ztorage = {
    zize                : 0,
    oneMB               : 1048576, // ~160 converted posts
    expireDate          : null,
    expireTwoDaysLater  : null,
    available           : false
};

/* Check for the localStorage availability */
(() => {
    try {
        let storage = localStorage,
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        Ztorage.available = true;
    }
    catch(e) {
        Ztorage.available = false;
    }
})();

const calculateLocalStorage = () => {
    let keys = Object.keys(localStorage),
        num = localStorage.length;

    while (num--) {
        switch (keys[num]) {
            case 'key':
            case 'length':
            case 'getItem':
            case 'setItem':
            case 'removeItem':
            case 'clear':
            case 'expireDate':
                continue;
        }
        Ztorage.zize +=
            localStorage[keys[num]].length;
    }
    if (Ztorage.zize >= Ztorage.oneMB) {
        localStorage.clear();
    }
};

/* Calc the localStorage size and expiration date */
if (Ztorage.available) {
    let today = new Date().getTime(),
        advance = new Date();

    Ztorage.expireTwoDaysLater =
        advance.setDate(advance.getDate() + 2),
    Ztorage.expireDate = parseInt(
            localStorage.getItem('expireDate')) || 0;

    if (Ztorage.expireDate &&
            today > Ztorage.expireDate) {
        localStorage.clear();
    } else {
        calculateLocalStorage();
    }
}

