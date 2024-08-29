export const postTemplate = arr => `
    <div id='progress-bar' class='hide'>
        <div id='cur-progress' class='progress-bar'></div>
    </div>
    <article class='details-wrapper'>
        <div class='details-head'>
            <div class='details-head-wrapper'>
                <h6 id='details-title'></h6>
                ${arr[1][0] ?
                    `<span>
                        Post Categories:\u00A0
                    </span>` : '' }
                ${arr[1][0] ?
                    arr[1].map(curCat => `
                        <a href='#!category=${curCat}'>
                            <span class='label label-default'>
                                ${blog.capFirst(curCat)}
                            </span>
                        </a>\u00A0 
                    `).join('') : ''}
            </div>
        </div>
        <div id='details-body'>
            Loading...
        </div>
        <div class='details-footer'>
            <hr>
            <span>
                The source file for this entry can be found <a id='md-src'>Here</a>
            </span>
        </div>
        <ul class='pager'>
            ${metaPool[arr[0] - 1] ? `
                <li class='previous'>
                    <a href='#!post=${metaPool[arr[0]-1][0]}'>
                        &larr; Older
                    </a>
                </li>
            `: ''}
            ${metaPool[arr[0] + 1] ? `
                <li class='next'>
                    <a href='#!post=${metaPool[arr[0]+1][0]}'>
                        Newer &rarr;
                    </a>
                </li>
            ` : ''}
        </ul>
    </article>
`;

//str.replace(/\n\s+/g, ' ')
