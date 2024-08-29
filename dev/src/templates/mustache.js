/* The templates */
export const entriesTemplate = arr => `
     ${arr.map(el => `
        <h4 class='entry-title'>
            <a href='#!post=${el[0]}' class='snippet-title text-muted blur-link'>
                ${blog.trimTitle(el[1])}
            </a>
        </h4>
        <hr>
        `).join('')
     }
`;

export const archiveTemplate = arr => `
    ${arr.map(el => `
        <div class='page-header'>
            <h4 class='post-title'>
                <a href='#!post=${el[0]}' class='post-title-url text-muted blur-link'>
                    ${blog.trimTitle(el[1])}
                </a>
            </h4>
            <p class='meta text-muted'>
                <span class='archive-post-separator'> » </span>
                <span class='post-date label label-default'>
                    ${el[2]}
                </span>
            </p>
        </div>
        `).join('')
    }
`;

export const recentPostsTemplate = arr => `
    ${arr.slice(0,6).map(el => `
        <a href='#!post=${el[0]}' class='list-group-item'>
            ${el[1]}
        </a>
        `).join('')
    }
`;
export const categoriesTemplate = arr => `
    ${arr.map(el => `
        <a href='#!category=${el}' class='list-group-item'>
            ${blog.capFirst(el)}
            <span class='badge'>
                ${blog.categoriesMatchNum(el)}
            </span>
        </a>
        `).join('')
    }
`;

/* On error or nothing is found */
export const rantTemplate = errStr => {
    const alertType = errStr ? 'danger' : 'info';
    const errMsg = errStr || 'Nothing Found.';

    return `
        <hr>
            <div class='alert alert-${alertType}'>
                ${errMsg}
            </div>
        <hr>
    `;
};
