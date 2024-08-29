
---

Two days ago I've rewritten Blogfy from scratch and it is no more based on blogpy.

The older Blogfy's code was clutter and hard to read and maintain, it was using 5 dicts and 4 sets which is completly useless for it's purpose. In the newer code there is only one dict that holds all of the needed information, 2 separate classes to read/replace strings from the templates and write the changes.

That said repetitive code is almost none, a smart pagination and rss functions was also introduced, 5th template was added as well. The older website_settings module was deprecated and replaced by configparser. The markdown dependency was deprecated.

The reason to start learning python 9 months ago was because I loved blogpy. The same reason to deprecate the base is because it's code isn't at the level where it should be. For example, by saving couple lines from class or function creation and using globals instead locals is and will always be slower. I won't go deeper in details and start flamewar.

Blogfy's newer code allows it to be faster, python2 and python3 compatible, OS independent, without any 3rd party dependency.

By the time of writing, I did a test which unveals how faster Blogfy is than blogpy. To build 102 posts, each file 10.1 kilobytes with blogpy was done for 9.3 seconds. Blogfy generates 4600 posts for 8.8 seconds - including pagination, tags, rss and sitemap.
