
---

Create a file named `false.c`

```c
#include <stdlib.h>

int main(void) {
  return EXIT_FAILURE;
}
```

Compile it with `gcc -Wall -Wextra -O2 -o main false.c`.