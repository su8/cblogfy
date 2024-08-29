
---

Today we will learn how to strip some information from our email headers.

From, to and date are mandatory in email headers, but the rest information can be eliminated or exchanged easily as we are about to learn.

Utilize the Tor network with Thunderbird for advanced anonymity. Open up the Thor err Tor browser, click over Edit, Preferences, Network, Settings. Keep the windows open and launch Thinderbird. Click Edit and Preferences again, Advanced, Network &amp; Disk Space, Settings. Apply the same network settings in Thunderbird as the one from the opened Tor network settings window, that's all you need to do.

Lets begin with stripping the email headers. Here is an example of regular email header without any tweaks.
```
From - Sat Jul 19 14:41:44 2014
X-Mozilla-Status: 0001
X-Mozilla-Status2: 00000000
Return-Path: my_email@address.none
Received: from 123.456.789.012
    by mail.my_email@address.none
    ; Sat, 19 Jul 2014 13:40:13
Message-ID: <the_troll@example.com>
Date: Sat, 19 Jul 2014 14:40:28
From: Santa Claus my_email@address.none
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:24.0) Gecko/20100101 Thunderbird/24.6.0
MIME-Version: 1.0
To: The Troll the_troll@example.horse
Subject: Test
X-Enigmail-Version: 1.6
Content-Type: text/plain; charset=ISO-8859-1
Content-Transfer-Encoding: 8bit

-----BEGIN PGP MESSAGE-----
Charset: ISO-8859-1
Version: GnuPG v2
Comment: Using GnuPG with Thunderbird - http://www.enigmail.net/
```


In Thunderbird, click Edit and Preferences once again, Advanced, General, and at the very bottom **Config Editor...**

```
network.protocol-handler.warn-external.https true
network.protocol-handler.warn-external.http true
network.protocol-handler.warn-external.ftp true
network.cookie.cookieBehavior 2
mailnews.send_default_charset UTF-8
mail.smtpserver.default.hello_argument string [127.0.0.1]
general.useragent.override string -> (leave it empty)
extensions.enigmail.addHeaders false
extensions.enigmail.useDefaultComment true
extensions.enigmail.mimeHashAlgorithm 5
extensions.enigmail.agentAdditionalParam --no-emit-version --no-comments --throw-keyids --display-charset utf-8 --keyserver-options no-auto-key-retrieve,no-try-dns-srv
network.proxy.socks_remote_dns True
mailnews.reply_header_type 1
mailnews.reply_header_authorwrote %s
# set all 'compose_html' to false
compose_html false
```

Some of the above options won't exist, so you will have to create them by right clicking and select new string (this is a string example, [127.0.0.1]), boolean (true/false), integer 1,2,3,4,5,6.

What does these options do ?
mimehash algorith:
```
0 - automatic selection, let GnuPG choose
1 - SHA1
2 - RIPEMD160
3 - SHA256
4 - SHA384
5 - SHA512
6 - SHA224
```

enigmail.addHeaders set to false will hide **X-Enigmail-Version**

enigmail.useDefaultComment will hide the GnuPG comment information
socks_remote_dns will ensure that DNS resolves aren't leaking information (it's important because we are using the tor network).

cookieBehavior:

```
0 : Enable all cookies (default)
1: Allow cookies from originating server only
2: Disable all cookies
3: Use P3P policy to decide
```

enigmail.agentAdditionalParam will hide the enigmail version.

mailnews - [http://kb.mozillazine.org/Reply_header_settings](http://kb.mozillazine.org/Reply_header_settings)

hello_argument will replace **Received: from 123.456.789.012** to **Received: from your internal ip (local network ip instead your public ip, eg: 192.168.1.1)**

useragent.override will hide your email client (the whole line **User-Agent:...** will not be included anymore

warn-external will always spawn an window which will ask you for an application to open up the given link.

compose_html (if you are serious about security, you should know why this option is set to false), send_default_charset (Charset: ISO-8859-1 -> Charset: UTF-8)
