
---

Oh my Javascript Gosh !

Yesterday I made U turn from what I said in my previous chapter and made geminiBlog to be controlled from the browser.

The multitasking on mobile devices is PITA, that's why I decided that it's time to improve geminiBlog in the direction that would allow me **to just blog** and don't bother touching `config.js`.

Now I can  also create post(s) and adjust my website settings entirely from my browser. Thankfully the `localStorage` is here to cover several scenarios where the things can go wrong.

Here are some pics what looks like those funcs:

New Post (this is the very first post written in my browser)
![](img/file/blog_converted5/new_post.png)

Settings:
![](img/file/blog_converted5/settings2.png)

Once filename in the filename field is provided, every single keyboard stroke gets synced in my browser localstorage.

Try the following: in the filename field type **hello_world** , now in the text area type some text, **BE LOUD** , refresh the page or just close your browser. Open the new post page and just fill in the filename **hello_world**, and you'll see the exact text that you've typed in the text area prior to the event.

These funcs reside in their own sidebar panel with the hilarious title **Hacker Mode**.
