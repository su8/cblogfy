
---

For very first time I played with the service worker api and managed to make my blog reachable when offline.

Later on saw opportunity to make a "Add to Home Screen" installable app.

Few days ago I laughed how hilarious the Chrome store have become, where most "apps" redirect you to certain page - that's all they do, it's so silly that I am still unable to figure out who with the right mind will install any of these apps when all you can do is just bookmark your favourite websites. On a desktop machine the bookmarking makes really good job to organize what goes where, as well it's easy to share and sync your bookmarks with others and/or devices that you own.

On other hand when using touch screen device in order to visit some certain websites that you visit more frequently than others, you have to launch the browser, click the bookmarks button and search for the desired entry. Invoking the keyboard and typing is ... anything else but conveniet and time efficient.

Here come the web installable apps, you could promote a real web installable app or make your website installable to the user home screen.

Right now if you visit my blog from any mobile device and click the browser settings, you'll see the following:

![](img/file/blog-web-app/1.jpg)

Once Add to Home Screen is clicked you'll see my blog icon as if it was real app.

![](img/file/blog-web-app/2.jpg)

Let's test the offline version. I've opened the app earlier and closed it, so the resources to be cached, as each browser and app environment is sandboxed separately.

![](img/file/blog-web-app/3.jpg)

The pinguin in action, don't know where I found the icon as I've been using it extensively for my blog and various websites for more than 6 years.

![](img/file/blog-web-app/4.jpg)

Hurray the offline version works. Such "apps" will hide the navigation bar, trying to make you more comfortable as if you are using native app.

![](img/file/blog-web-app/5.jpg)

As long as post is not requested.

![](img/file/blog-web-app/6.jpg)

The main page, archive page, search function, tags are doing fine.

![](img/file/blog-web-app/7.jpg)

Even on a desktop computer you'll be able to leverage the offline capability when using the service worker api.

It's sad to see how broken the Installable App Banner concept is when Google will have their say **when** and under **which** conditions the banner will be shown, as those rules will change constantly.

Android and closed-source, so they want to close-source the development and improve the battery life as well several other rummored things. In a open-source and contirbution driven era that we all live on right now I can't imagine anything positive from that.

Why not taking a note from other closed-source OSs that became "in-love" with Linux and BSD recently in order to fix their image. Or give them Linux for example, relying on many contributors without being closed-source. With all the funds that Goofy has it's silly to even think about such decision.

It's not like the current Android updating system is working properly. The last time I received **critical** update from my device manufactor was ... let's see ... never. Yet every single day we see more devices that can be pwn'd even by script kiddie, just because the device manufactors are not forwarding the updates to their users, and the "excuse" that those manufactors use every single time is: the users will not purchase other mobile device. Come again ?!

To sum it up, you are spending certain amount of money for device that will never ever get critical updates, and some 7 years old boy ~~~can~~~ will empty your bank account in no time once critical vulrenability is found several months later.


3 hours later:

It turns out that after a few hours in sleeping mode my droid fellow didn't used the cached resources when I tried to visit my blog page while being offline:

![](img/file/blog-web-app/8.jpg)

The trick that I used was the following, didn't closed the tab where I tried to visit my blog page. Then manually closed the browser and re-opened it.

![](img/file/blog-web-app/9.jpg)

Tada, now the cache was used. I think this is due to the service worker life cycle.

![](img/file/blog-web-app/10.jpg)
