
---

Up until now if we wanted to do some string templating and data concatenation, we had to use some polyfills to do all the heavy lifting. ES6 brings template literals also known as string literals.

It might take you some time to wrap your head around the es6 syntax.

```javascript
const trimTitle = text => text.length > 20 ? text.slice(0, 20) : text;

const titlenLinkTemplate = arr => `
     ${arr.map(el => `
        <h4 class='entry-title'>
            <a href='#!post=${el[0]}' class='snippet-title text-muted'>
                ${trimTitle(el[1])}
            </a>
        </h4>
        <hr>
        `).join('')
     }
`;

const theData = [
    ['sane_gentoo_commands','Sane Gentoo Commands','May 7, 2016','Gentoo'],
    ['sane_gentoo_repo','Sane Gentoo Repository','May 8, 2016','Gentoo'],
    ['random_post3','Random post 3','May 19, 2016',''],
    ['run', 'Decreased the blog loading time - again', 'May 26, 2016', ''],
    ['back_to_the_future', 'Back to the future', 'May 31, 2016', ''],
    ['jblogfy', 'My 3rd static generator', 'June 01, 2016', ''],
    ['templating','Learn to love the ES6 native templating','June 04, 2016','']
];

console.log(titlenLinkTemplate(theData));
```

The `console.log` result:

```html
<h4 class='entry-title'>
    <a href='#!post=sane_gentoo_commands' class='snippet-title text-muted'>
        Sane Gentoo Commands
    </a>
</h4>
<hr>

<h4 class='entry-title'>
    <a href='#!post=sane_gentoo_repo' class='snippet-title text-muted'>
        Sane Gentoo Reposito
    </a>
</h4>
<hr>

<h4 class='entry-title'>
    <a href='#!post=random_post3' class='snippet-title text-muted'>
        Random post 3
    </a>
</h4>
<hr>

<h4 class='entry-title'>
    <a href='#!post=run' class='snippet-title text-muted'>
        Decreased the blog l
    </a>
</h4>
<hr>

<h4 class='entry-title'>
    <a href='#!post=back_to_the_future' class='snippet-title text-muted'>
        Back to the future
    </a>
</h4>
<hr>

<h4 class='entry-title'>
    <a href='#!post=jblogfy' class='snippet-title text-muted'>
        My 3rd static genera
    </a>
</h4>
<hr>

<h4 class='entry-title'>
    <a href='#!post=templating' class='snippet-title text-muted'>
        Learn to love the ES
    </a>
</h4>
<hr>
```

Can we hide/show certain parts of the html template when a condition is met ?

```javascript
const metaPool = [
    ['sane_gentoo_commands','Sane Gentoo Commands','May 7, 2016','Gentoo'],
    ['sane_gentoo_repo','Sane Gentoo Repository','May 8, 2016',''],
    ['random_post3','Random post 3','May 19, 2016',''],
    ['run', 'Decreased the blog loading time - again', 'May 26, 2016', ''],
    ['back_to_the_future', 'Back to the future', 'May 31, 2016', ''],
    ['jblogfy', 'My 3rd static generator', 'June 01, 2016', ''],
    ['templating','Learn to love the ES6 native templating','June 04, 2016','JavaScript,ES6,ESNEXT']
];

const capFirst = text => text.charAt(0).toUpperCase() +
            text.slice(1).toLowerCase();

const postTemplate = arr => `
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
                                ${capFirst(curCat)}
                            </span>
                        </a>\u00A0 
                    `).join('') : ''}
            </div>
        </div>
        <div id='details-body'>
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

console.log(postTemplate([
    1,
    metaPool[1][3].toLowerCase().split(',')
]));

console.log(postTemplate([
    6,
    metaPool[6][3].toLowerCase().split(',')
]));
```

The first `console.log` output, the pager has 2 links - previous and next, no categories links which means the Post Categories was hidden:

```html
<div id='progress-bar' class='hide'>
    <div id='cur-progress' class='progress-bar'></div>
</div>
<article class='details-wrapper'>
    <div class='details-head'>
        <div class='details-head-wrapper'>
            <h6 id='details-title'></h6>
            
            
        </div>
    </div>
    <div id='details-body'>
    </div>
    <div class='details-footer'>
        <hr>
        <span>
            The source file for this entry can be found <a id='md-src'>Here</a>
        </span>
    </div>
    <ul class='pager'>
        
            <li class='previous'>
                <a href='#!post=sane_gentoo_commands'>
                    &larr; Older
                </a>
            </li>
        
        
            <li class='next'>
                <a href='#!post=random_post3'>
                    Newer &rarr;
                </a>
            </li>
        
    </ul>
</article>
```

The second `console.log` output has 3 category links, the pager has only 1 link - previous.

```html
<div id='progress-bar' class='hide'>
    <div id='cur-progress' class='progress-bar'></div>
</div>
<article class='details-wrapper'>
    <div class='details-head'>
        <div class='details-head-wrapper'>
            <h6 id='details-title'></h6>
            <span>
                    Post Categories: 
                </span>
            
                    <a href='#!category=javascript'>
                        <span class='label label-default'>
                            Javascript
                        </span>
                    </a>  
                
                    <a href='#!category=es6'>
                        <span class='label label-default'>
                            Es6
                        </span>
                    </a>  
                
                    <a href='#!category=esnext'>
                        <span class='label label-default'>
                            Esnext
                        </span>
                    </a>  
                
        </div>
    </div>
    <div id='details-body'>
    </div>
    <div class='details-footer'>
        <hr>
        <span>
            The source file for this entry can be found <a id='md-src'>Here</a>
        </span>
    </div>
    <ul class='pager'>
        
            <li class='previous'>
                <a href='#!post=jblogfy'>
                    &larr; Older
                </a>
            </li>
        
        
    </ul>
</article>
```

Handling JSON, XML etc ? No problemo, the only restriction is your imagination.
