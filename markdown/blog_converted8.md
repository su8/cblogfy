
---

The image file uploading function was added.

With that I think my geminiblog fork just became true CMS. You know what, I would not add so many features in my fork if it wasn't the mobile need, she is the one that made me excited.

![](img/file/blog_converted7/01.png)

Upload images clicked

![](img/file/blog_converted7/02.png)

Once image is selected, the modal dialog appears and ask for my GitHub password.

![](img/file/blog_converted7/03.png)

3 hours later:

Progress bar is added, showing the current uploading state while the data is sent to GitHub. Not a fake one, try uploading some 3-10 MB image.

![](img/file/blog_converted7/04.png)

I've uploaded the images way before this post to be fully written, so I could press the 'Preview' button while writing the post and see how the images will look like along with the rest of the post.

One hour later:

Listing the most important **in-browser** features that I've added, skipping the macho log-in form and code editing history.

Post writing

![](img/file/blog_converted7/overview/1.png)

More settings clicked

![](img/file/blog_converted7/overview/2.png)

Editing post

![](img/file/blog_converted7/overview/3.png)

Preview button clicked.

![](img/file/blog_converted7/overview/4.png)

The settings section

![](img/file/blog_converted7/overview/5.png)

GitHub modal dialogue to update/create/submit files to my repo.

![](img/file/blog_converted7/overview/6.png)

Using the search form

![](img/file/blog_converted7/overview/7.png)

The theme section in action

![](img/file/blog_converted7/overview/8.png)

---

On next day.

It took me a while to figure out a way to securely save and re-use my github password.

Long story short, I don't trust the browser Session or Local storages, that's why I did my best to avoid them for storing passwords.

Until now I had to re-enter my github password everytime whenever I wanted to submit files to my repo. This means if I write a blog post that has 20 images I had to re-enter my password at least 20 times.

So digging and playing with the OAuth API gave me the necessary information that I needed, and it is - scopes and tokens.

The application itself.

![](img/file/blog_converted7/6.png)

Making autorization request.

![](img/file/blog_converted7/7.png)

Visiting my application shows me that I'm in.

![](img/file/blog_converted7/9.png)

One-time code granted.

![](img/file/blog_converted7/8.png)

Exchanging the one-time code for access token.

![](img/file/blog_converted7/10.png)

And from now on all I had to do was redirect myself to

```html
https://github.com/login/oauth/authorize?client_id=APP_CLIENT_ID
```

which would grant me one-time code every single time I visit my blog and want to upload some files. The access token would be stored in variable just for the duration of my session.

At this point I thought it was really great, until I realized how cumbersome will be to implement a feature that would allow me to GET somehow my application **Client Secret**, you are probably confused at this point, just read the following:

![](img/file/blog_converted7/11.png)

My application Client ID is safe to be shared, but the secret itself have to remain secret, which means I cannot embed her in `engine.min.js`.

After some frustation how fu...d I was, as I had no backend or something else from where I could fetch and avoid CORS from getting in my way, my fake log-in form hinted me how much simpler the things could be.

The answer was let the browser itself save the password.

The experience and information that I gained just from playing with the OAuth API earlier gave me the necessary ingredients - scopes and tokens.

Whenever I log-in in GitHub, I can edit, delete, create, update content. That's what I expect, but if I logged-in from insecure network and leaked my password a rogue person could do some nasty things with my account.

The token is one-time gibberish password which is assigned to certain scopes.

Basically the scopes define what I can and cannot do, which means the rogue person will have limited **nasty** options over my account by using the gibberish token.

![](img/file/blog_converted7/12.png)

And here's what the token is:

![](img/file/blog_converted7/13.png)

From now on, all I have to do is generate as many tokens as I want for each device/computer, then copy & paste it in the password field. I've updated geminiblog to make a hint to the browser "hey there is a password in here".

![](img/file/blog_converted7/14.png)

The one-time token is securely stored in the browser itself, and placed automatically by my browser whenever I visit my blog.

Just by keeping the things simple I avoided huge cumbersome for my simplistic needs.
