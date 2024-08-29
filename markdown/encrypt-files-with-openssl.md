
---

When it come to encryption not many of you are familiar how to do this thing properly and most of the time you will be required to use special software. Must tell you that there is simple technique for single file encryption with openssl.


If openssl is not installed by default in your distribution then install it. In the following demonstration I will be encrypting a .txt file, but you are not limited to .txt files - you can encrypt whatever file extension you want, from password protected archives to .htaccess and etc.

That's the file that I want to encrypt.

![](img/file/encrypt_with_openssl/todo1.png)

I assume you already have your terminal opened.

```bash
openssl aes-256-cbc -a -salt -in todo.txt -out todoencrypted.txt
```

Just replace the **todo.txt** with yours, also it's up to you what name do you want for the output file - I used **todoencrypted.txt**, once you press enter you will be asked to insert some password - take your time and decide what password you want to use, the longer and complex the better.

The file is encrypted:

![](img/file/encrypt_with_openssl/todo2.png)

And it will create new file named todoencrypted.txt, if you open it you will see that the file does not containt the same information, but a random symbols - that's because you encrypted it. Next - decrypting.

```bash
openssl aes-256-cbc -d -a -salt -in todoencrypted.txt -out tododecrypted.txt
```

Again does not matter what kind of name you will choose for the **-out** output file. As I said in the beginning, you are not limited to .txt file encryption. The thing that I will recommend you to do is: password protected archive then encryption with openssl - that's double protection. Don't panic if you try to uncompress the archive without decrypting it with openssl in the first place.

![](img/file/encrypt_with_openssl/todo3.png)

