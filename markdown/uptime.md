
---

Create a file named `uptime.c`

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <inttypes.h>
#include <time.h>

#if defined(__FreeBSD__) || defined(__OpenBSD__)
# include <sys/types.h>
# include <sys/sysctl.h>
#endif /* __FreeBSD__  || __OpenBSD__ */

#define UINT "%"PRIuMAX

int main(void) {
  uintmax_t now = 1;
  struct timespec tc = {0L, 0L};

#if defined(__linux__)
  if (-1 == (clock_gettime(CLOCK_BOOTTIME, &tc))) {
    fprintf(stderr, "%s\n", "clock_gettime() failed");
    return EXIT_FAILURE;
  }
  now = (uintmax_t)tc.tv_sec;

#elif defined(__FreeBSD__) || defined(__OpenBSD__)
  int mib[] = { CTL_KERN, KERN_BOOTTIME };
  time_t t;
  size_t len = sizeof(tc);

  if (0 != (sysctl(mib, 2, &tc, &len, NULL, 0))) {
    fprintf(stderr, "%s\n", "sysctl() failed");
    return EXIT_FAILURE;
  }
  if (-1 == (t = time(NULL))) {
    fprintf(stderr, "%s\n", "time() failed");
    return EXIT_FAILURE;
  }

  now = (uintmax_t)t - (uintmax_t)tc.tv_sec;
#endif /* __linux__ */

  if (0 != (now / 86400)) { /* days */
    printf("up " UINT "d " UINT "h " UINT "m\n",
        (now / 86400),
        ((now / 3600) % 24),
        ((now / 60) % 60));
    return EXIT_SUCCESS;
  }
  if (59 < (now / 60)) { /* hours */
    printf("up " UINT "h " UINT "m\n", ((now / 3600) % 24), ((now / 60) % 60));
    return EXIT_SUCCESS;
  }

  printf("up " UINT "m\n", ((now / 60) % 60));

  return EXIT_SUCCESS;
}
```

Compile it with `gcc -Wall -Wextra -O2 -o main uptiime.c`.