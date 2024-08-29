
---

Everyone is going to tell you that you can't have search form in your static website, unless you use **something** external in order to process the search form queries. Guess what, Javascript is here to prove 'em wrong.

Here I'll present you dead simple and interactive search form that YOU can integrate so easily in **any** static page.

Try the [demo] first. Once you start typing you'll see the results immediately, no need to press "submit" or "search" buttons.

I'll split the javascript and html in separate files.

The **index.html** content:

```html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Zearch</title>

    <!-- Bootstrap -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>

    <div class="container">
      <div class="row">
        <div class="page-content col-md-6 col-sm-8">

          <h1>Type L</h1>
          <form>
            <div class="input-group custom-search-form">
              <input type="text" id="uzer-infut" class="form-control" placeholder="Ask me anything">
            </div>
          </form>

          <div id="queryMe"></div>

        </div><!--/.page-content-->
      </div><!--/.row-->
    </div><!--/.container-->

  <script defer src="search.min.js"></script>
  </body>
</html>

```

**search.js**, es6 isn't supported natively by most browsers, so we have to transpile it to es5.

```javascript
const nothingFoundTemplate = empty => `
    <hr>
      <div class='alert alert-info'>Nothing found.</div>
    <hr>
`;
const searchTemplate = arr => `
    ${arr.map(el => `
       <div class='page-header'>
         <h4>
           <a href='${el[1]}' class='text-muted'>
               ${el[0]}
           </a>
         </h4>
       </div>
     `).join('')
    }
`;
const entries = [
    //  title     url
    ['Lorem', 'http://ex0.com'],
    ['Little Joe', 'http://ex1.com'],
    ['ipsum', 'http://ex2.com'],
    ['next', 'http://ex3.com'],
    ['generation', 'http://ex4.com'],
    ['old', 'http://ex5.com'],
    ['school', 'http://ex6.com']
];

const innerData = (partialTemplate, data, id) => {
    const template = document.createElement('div'),
        container = document.querySelector(`#${id}`);
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    template.innerHTML = partialTemplate(data);
    container.appendChild(template);
};
const invokeSearch = () => {
    let x,
        arr = [],
        foundPosts = false,
        uzerQuery = document.getElementById('uzer-infut')
          .value.toLowerCase();

    if (!uzerQuery) {
        innerData(nothingFoundTemplate, arr, 'queryMe');
        return false;
    }

    entries.forEach(entry => {
        if (entry[0].toLowerCase().match(uzerQuery)) {
            arr.push(entry);
            foundPosts = true;
        }
    });
    innerData(foundPosts ? searchTemplate :
            nothingFoundTemplate, arr, 'queryMe');
};
document.getElementById('uzer-infut')
  .addEventListener('input', invokeSearch, false);
```

Transpiling ES6 to ES5.

```bash
npm install babel-cli babel-preset-es2015 rollup uglify-js

BIN=./node_modules/.bin

compile() {
  "${BIN}"/rollup --format iife -- 'search.js' | \
    "${BIN}"/babel --presets es2015 | \
    "${BIN}"/uglifyjs --compress \
    'unused=false,loops=false' --mangle - > 'search.min.js'
}

compile
```

## Hint

Store the entire `search.js` script as single line string in your static blog/page/website generator, and have the entries generated on-the-fly and concatenate to the script that is stored as string.

Something like

```bash
x = "script head" + ENTRIES +  "script bottom"

# open 'search.js' for writing and add the new content
```

---

Had to update this post to make it ES6 compatible, as in the previous we had to use external library to concatenate the templates and the data for us.

[demo]:  https://wifiextender.github.io/img/file/search_form/index.html
