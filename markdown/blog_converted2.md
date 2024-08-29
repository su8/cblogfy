
---

So long blogfy, and welcome geminiblog. It's happening again, my entire blog get converted and I have moved to another static website generator.

Mentioned in my previous post that I went working in Europe and the only **computer** that I had all the time with me was my droid fellow.

There was a few moments that I wanted to quickly share in this blog, but my static website generator required a lot of time to be dedicated. You have to have python, text editor, terminal emulator. The pitfal is that you have to operate it all the time from the terminal.

On April 01 decide that it's time to seek another static generator.

It didn't took me too long until I stumbled upon geminiblog. The best of all is that geminiblog isn't static neither dynamic generator. Let me clear the confusion with the following comparison.

The typical static blog generator: write the post, initialize the **X** static blog generator to convert your post and rewrite all local html files, push all the rewritten files.

In comparison geminiblog: write the post, register it in `js/config.js`

```javascript
register("./marktest.md", "Markdown Test", "December 10, 2014");
```

and push the markdown post + config.js, that's all. All the magic (post convertion, rendering, etc) happens in the blog visitor browser. Don't believe me ? Google "Javascript linux emulator", or use [this](https://github.com/copy/v86) hint.

So after spending around 2 hours with geminiblog I had to make the most important decision: do I have what it takes to make the jump ?

![](img/file/blog_converted2/ello_geminiblog.png)

Every single hard-HTML-coded blog posts was manually edited (most of the heavy lifting was done with `find` and `gawk`) in order to make it markdown compatible. The day after that was spend on polishing the website look and finding more of the hard-coded html tags in my posts.

I did forked geminiblog from the very first day I met it. Wanted to make it even more attractive for others out there, but be mobile friendly no matter what.

Here is what I did with my geminiblog fork so far (as of april 05)

- [x] Transitioned the default theme that it came to the bootstrap framework. You can easily swap bootstrap themes, all you have to do is point the new theme in **index.html**, it's that simple.
- [x] Display Recent Posts sidebar in every page.
- [x] Download small number of markdown posts whenever the main blog page is loaded. The archive page and search form doesn't download any markdown posts.
- [x] Set window title according to the requested page.
- [x] Include syntax highlighting while your blog posts remain written in markdown. The highlighting script and highlighting languages are crammed and minified in single file.
- [x] Easily enable/disable prevnextLinks in `config.js`, if you don't want <-previous next-> button links.
- [x] Make use of CDN with integrity checks
- [x] Include in-house search form. It parses your blog post titles, the one that you register in **js/config.js**.

It will be a jaw dropping moment for those of you that ever used static website generators, as the idea of "static" versus "dynamic" is taken to a new level. And you can edit/create/delete blog posts [on the go so easily](http://faudroids.org/MrHyde/).

I'm sad to end this post with the news that two of my blog posts are lost forever.
