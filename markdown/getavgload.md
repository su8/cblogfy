
---

Create a file named `getavgload.c`

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#if defined(__linux__)
# include <sys/sysinfo.h>
#endif /* __linux__ */

int main(void) {

#if defined(__linux__)
  struct sysinfo up;
  memset(&up, 0, sizeof(up));

  if (-1 == (sysinfo(&up))) {
    fprintf(stderr, "%s\n", "sysinfo() failed");
    return EXIT_FAILURE;
  }

  printf("%.2f %.2f %.2f\n",
      (float)up.loads[0] / 65535.0f,
      (float)up.loads[1] / 65535.0f,
      (float)up.loads[2] / 65535.0f);

#elif defined(__FreeBSD__) || defined(__OpenBSD__)
  double up[3] = { 0, 0, 0 };

  if (-1 == (getloadavg(up, 3))) {
    fprintf(stderr, "%s\n", "getloadavg() failed");
    return EXIT_FAILURE;
  }
  printf("%.2f %.2f %.2f\n",
      (float)up[0], (float)up[1], (float)up[3]);
#endif /* __linux__ */

  return EXIT_SUCCESS;
}
```

Compile it with `gcc -Wall -Wextra -O2 -o main getavgload.c`.