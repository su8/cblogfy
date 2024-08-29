
---

Here's how to use function that takes many arguments and returns back one long string.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define VLA 256

char GLOBAL_BUF[VLA] = {'\0'};

static char *mk_str(const char *fmt, ...);

static char *mk_str(const char *fmt, ...) {
  char *ptr = GLOBAL_BUF;
  va_list ap;

  va_start(ap, fmt);
  vsnprintf(ptr, (size_t)VLA-1, fmt, ap);
  va_end(ap);

  return ptr;
}

int main(void) {
  printf("%s\n", mk_str("%s %s %s", "one", "two", "three"));
  return EXIT_SUCCESS;
}
```

You can achieve something similar with `va args`.

```c
#define DEBUG(...)  printf(__VA_ARGS__)
```

The same functionality as `mk_str()`, but with less code.