Development and minification process:

In order to build highlightjs you must use **node** version above than 0.12.6

You can add more bash keywords that will be highlighted, add them in the **main** script.

```bash
npm install
chmod +x main
./main 'setup'
./main 'build'

# Only for Development purpose

# Automatically rebuild jblogfy and
# refresh the webserver
# http://localhost:8000/index.html
node_modules/.bin/watch './main build' src &
http-server .. -c5 -p 8000

# The above command will run in infinite loop.
```

Every single time a post is requested it will be converted and added in temporary cache,
but if the page is refreshed the cache will be emptied, thus the conversion process is
triggered again, we utilize the browser localStorage to store the converted posts.

1 MB of localStorage usage should be enough to hold approximately 160 converted posts.
