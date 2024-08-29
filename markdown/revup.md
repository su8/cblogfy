
---

I have reached and completed all of my blog goals when I ported my home made static website generator to geminiblog so far except one: decrease my blog loading time.

When I used blogfy I could go as lower as 54ms for the blog to load, but with geminiblog I was suprised to see that the loading time has gone up to 800ms.

Before:

![](img/file/revup/1.png)

After:

![](img/file/revup/2.png)

Past two days was really intensive, and I take my hat off once again to google [page speed](https://developers.google.com/speed/docs/insights/rules#speed-rules).

Since my blog is entirely hosted by GitHub (and their CDN), I am unable to configure any server related rules such as: server reponse time, leverage browser cache, resource compression, etags and so on.

Let's move to the rules and find out how some of them gave me a hint and helped me to reduce my blog loading time step by step.

## Rule 1/16, Avoid langing page redirects

This rule actually hinted me how costly the network roundtrips are. And [Pingdom](http://tools.pingdom.com/fpt/) confirmed it. My "Australian" blog visitors will have to spend more than 90% of their time in roundtrips (DNS lookup, TCP handshake, TLS negotiation).

Solution: Stop relying on maxcdn to deliver the minified twitter bootstrap framework for my blog and utilize the parallel downloads per hostname (4 or 6 in total). In plain English: sourcing the **bootstrap.min.css** from my blog, instead maxcdn.

Forgot to mention that I removed the glyphicon classes and replaced them with true [HTML alternatives](http://www.w3schools.com/html/html_symbols.asp). My blog can still use some icons, but without the need to download any glyphicons. One more network round trip saved.

Just by doing this, my "Australian" visitors was enjoying 50% faster loading time.

## Rule 2/16, Avoid plugins
Obviously my blog isn't doing anything crazy to require plugins.

## Rule 3/16, Configure viewport
That's a good one. Nowadays you have to take care how your blog will interact with your mobile visitors. If you right click and choose to see this page source, you'll stumble upon this:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
```

## Rules 4, 6 and 7
I have no say over Enable compression, Improve server response time, Leverage browser caching.

## Rule 5/16, Inline CSS
You know what they say in YouTube videos: **surprise motherf....**

This rule hinted me that I can actually take the advantage of inlining css into the page itself. I've been using two stylesheet files for my blog in attempts to keep bootstrap.min.css **vanilla**.

Pingdom showed me that my blog highlighting template takes 90ms of the total time. And as we learned, each roundtrip has it's price.

Solution: Inlined the highlighting template in **index.html**, and for the fun I `base64` it.

The bad: The browser won't be able to cache this stylesheet.


## Rule 8/16, Minify resources
This is a pure win-win rule.

It also reminded me that I can combine multiple resources in a single file and save even more roundtrips.

So I combined the following scripts in single file called `engine.min.js`, it contains the following scripts **marked** -> **geminiblog** -> **highlight**. At the end I saved two roundtrips.

## Rule 9/16, Optimize Images
I always think about that - first.

## Rule 10/16, Optimize CSS delivery
This one is a tricky rule. Long story short, if you are not going to become the next amazon or google where every ms counts against your profit just ignore it.

This rule is encouraging you to inline small amount of your css code in the page, which would help on the CSSOM and time to first paint.

What you should consider:

It's difficult to implement it properly if you don't understand DOM, CSSOM and the render tree model, or your CSS knowledge is bit "rusty", as you'll have to re-write some of the code to make it happen in first place.

## Rule 11/16, Prioritize visible content
None of what you see and read exist as real page, all of it is rendered entirely by your browser. Skipping this rule.

## Rule 12/16, Remove Render-Blocking Javascript
Say what ? Remove Javascript ?!

This rule reminded me that I can delay the loading of the scripts. Example:

```javascript
<script defer src="oh-my-js-gosh.js"></script>
```

It's better to demonstrate you what this "defer" does with a couple of images:

Stage 1: 0ms
![](img/file/revup/demo1.png)

Stage 2: 100ms
![](img/file/revup/demo2.png)

Stage 3: 200ms
![](img/file/revup/demo3.png)

And now without "defer"

Stage 1: 0ms
![](img/file/revup/demo1.png)

Stage 2: 200ms
![](img/file/revup/demo3.png)

It's all about providing "feedback" to the visitor that my blog is actually loading. They won't have to watch "blank" page for undefined ammount of time, especially if they are Australians where the loading takes a couple of seconds.

## Rules 13, 14, 16
The twitter bootstrap takes care of: Size Content to Viewport, Size Tap Targets Appropriately, Use Legible Font Sizes

## Rule 15, Use asynchronous scripts
I don't play Russian roulette, especially when my blog posts and blog configuration reside in it's own file and `engine.min.js` is the one who have to make my blog happen in the order specified by configuration file.

---

I did a research to find out what can be done for the costly roundtrips and turned out that I can tell to the browser what connections and sockets are needed ahead of time by adding **preconnect** in my page head.

My blog template is using Roboto fonts that are served by Google. It uses the normal and bold variants, and each of the variants have to be downloaded, which means costly 2 roundtrips. So by adding **preconnect**, [the newer browsers](http://caniuse.com/link-rel-preconnect) will be able to take advantage of this resource hint and decrease my blog loading time - significantly.

```html
<link href='https://fonts.gstatic.com' rel='preconnect' crossorigin="anonymous">
```

But that wasn't enough as unless the fonts was downloaded my blog wouldn't be rendered. See:

![](img/file/revup/font1.png)

Then I opened the bootstrap.min.css file and removed the `@import` rule, since the link was pointing to stylesheet, I could "defer" the font loading, while utilizing the parallel downloading.

So I added the font stylesheet to the bottom of my index.html:

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet" type="text/css">
```

And it wasn't surprise to see that the stylesheet was now downloaded in parallel with my javascripts.

![](img/file/revup/font2.png)

Even before running a new Pingdom test, on my 4Mbps DSL internet speed I saw 100ms decreased loading time.

At the end I learned how important the parallel downloading over relying on CDN is, and how much is the "cost" for each round trip.

The home page has a new look, by the way I added **os** detection [function](https://github.com/wifiextender/wifiextender.github.io/blob/master/dev/geminiblog.js#L682), notice the "rendered by":

![](img/file/revup/new_look.png)
