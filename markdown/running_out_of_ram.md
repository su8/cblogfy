
---

Why your computer is using fracture of your RAM when it boot up, but sooner you are running out of RAM ?

Actually, I would be more worried if all of my RAM wasn't used, let me explain it in details.

The kernel is designed to **cache** every single process that's tirggered at some point, so if you launched your favourite web browser and closed it after a while, instead releasing the used memory the kernel will allocate that memory as cache, so every next web browser launching will be blazing faster.

Long story short - there is no need to use the same computing power for process that's going to be used more than once.

This doesn't mean if a memory hungry program is executed it will use your swap (in case you got swap). Part of that cache will be released, so the hungry program can continue it's operation.
