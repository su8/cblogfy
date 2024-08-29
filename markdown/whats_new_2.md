
---

I'm writing this post few meters away from the beach, while holding my tablet and enjoying the sea, sunset and all the madness that's happening around me.

My last post one month ago was from the same week when I was fired.

I was working as welder, but the company for which I was working for had more expenses than incomes, long story short - more production than clients, so they couldn't afford to pay the salaries to several people including me.

Nowadays the employers are seeking people with experience and no one cares if you got the necessary certificate for the given position or not.

The local job seeking office didn't offered me anything, but in same time I could not dissapoint my wife with more bad news.

On next day a friend of mine called me and told me that a company in next town is seeking computer technicians.

Went there and met the employer. They tested my skills and liked the facts that I knew excellent windows, bsd and gnu/linux, can program in several languages, repair broken computer parts, exchange them quickly, and diagnose which computer parts has caused a problem.

I was told to stay and work until the end of the day, that's how my computer technician career began.

I don't have certificate for that job, but I have a lot experience with hardware. Believe it or not but when you maintain 7 servers at home like me, sooner or later you'll be forced to DIY, repair, exchange and diagnose problems here and there.

One month ago in range of one week I was hired temporary to port 3 php websites in django, so I took a 2 weeks off from my primary job as welder. The payment was really good, but the truth is that python isn't used by many websites and or software companies, except google where it is strongly required. It is really hard to make a career with python.

Next month or so will post some of my hardware collection over the years and a lot useful tips.

Do you want to see the C code which I wrote that day during the different tests ? Please note that I'm still total noob in C, even after 2 read books and written all of the given excercises. The things that drives me crazy in C are it's lack of **strings**, the compiler that doesn't guarantee what will be executed first, higher precedence idiotism.

```cpp
#include <stdio.h>
int main(void)
{
    const unsigned int SQUARE = 1024 * 1024;
    const unsigned int CUBE   = 1024 * SQUARE;
    unsigned int i;
    unsigned int val = 0;

    for (i = 0; i < CUBE; i++)
    {
        val += i*i;
    }

    printf("%u\n", val);
    return 0;
}
``` 

Save the code as **test.c** and compile it firstable with `gcc -Wall -o "test" "test.c"`, use `time ./test`, then re-compile it with optimization flags `gcc -Wall -O3 -o "test" "test.c"` and **time** it to see the difference.

We are moving in that town currently and there isn't any land line nor wifi/hotspot neither cable tv companies around to connect the new house with internet. I'm terribly sorry for my inabillity to continue the education to all of you that I have been teaching in python.

Last but not least is a lot exchanged code in Blogfy. The last modification to it's code was back in april 2014. With the newer code it became 8 times more faster than before. It has more options, brings the total control to the user, and it has more horse power.

Even if you ever reach 500 blog posts, they will be generated every single time for 0.2 seconds (210ms). I have tested all known static website generators and no one is faster than Blogfy, so I can declare with huge smile on my face that Blogfy is the fastest (non-compiled) static website generator.

What do you think about the following 3 examples, which one is first, second and third when it comes to speed ?

```bash
time python2 -c 'a=[]; 
for x in range(10000000):
  a.append(x);'
```

```bash
time python2 -c 'a=list(); 
for x in range(10000000):
  a.append(x);'
```

```bash
time python -c '[x for x in range(10000000)]'
```

Dead simple random password generator:

```python
from random import choice
from string import printable, whitespace

class RandomPassword(object):
    def __init__(self):
        number = 20
        crazy  = str().join(x for x in printable if not x in whitespace)
        print(str().join(choice(crazy) for _ in range(number)))

if __name__ == '__main__':
    RandomPassword()
```
