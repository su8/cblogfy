
---

Let the compiler do the heavy lifting and D.R.Y. some repetitive code.

Instead makeing a couple functions, you just have to let the preprocessor the job for you.

```c
/* declare the functions before they get defined */
static void do_myCodeIsGreat(void);
static void do_myOranges(void);
static void do_mySuperPower(void);

#define LAUNCH_FUNCTION(function,  msg1, msg2, msg3)     \
    static void do_##function(void)                      \
    {                                                    \
    /* here goes your code */                            \
    }

/* and use the LAUNCH_FUNCTOIN like this */
LAUNCH_FUNCTION(myCodeIsGreat, "hello", "world", "apples");
LAUNCH_FUNCTION(myOranges, "oranges", "strawberry", "three");
LAUNCH_FUNCTION(mySuperPower, "hi", "country", "four");
```

Withe the above example all you have is one "function" to represent your repetitive code, sweet isn't it :} ?