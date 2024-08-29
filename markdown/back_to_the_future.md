
---

Five days ago learned how much I've slowed the blog loading speed by using the vanilla bootstrap framework.

I made the decision to dig into the bootstrap framework codebase and literary delete every single **Less** line that my blog is not using, while using the grunt-uncss as reference where and what to look for.

Approximately 2 hours later I managed to replicate my blog layout, while keeping the compiled css size to bare minimum.

It's not my first time using the bootstrap framework, but it's my first time touching it's **Less** source code.

I've spotted the maintenance nightmare when I used the grunt-uncss for very first time. The css that it produced wasn't that huge, but changing single colour etc. in future will be repetitive, trial and error task. Not to mention when different bootstrap release and/or bugfix is released I'll have to spend a lot of time in front of my computer comparing what's new and what have to be [CRUD].

On one hand the solution was simple use the **Less** source code, on the other hand the newer bootstrap (v4) release that's about to come will rely on **Sass** instead **Less**.

In honour of my very first time touching the bootstrap source code, I went back to the future and replicated my very first bootstrap blog layout that I made back in 2014.

[CRUD]: https://en.wikipedia.org/wiki/Create,_read,_update_and_delete
