
---

Create a file named `tac.c`

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

static void read_from_stdin(void);

static char *filename = "/tmp/tac3c5glqe92xns3128njrdtdsrdl234";

int main(int argc, char *argv[]) {
  char *buf = NULL, *tok = NULL, *filenam2 = NULL;
  char *ptrtofree = buf;
  char **arr;
  size_t dummy = 0, fz = 0;
  int fd = 0;
  long int x = 1;
  FILE *fp = NULL;
  off_t file_size = 0;
  struct stat st;

  if (1 == argc) {
    read_from_stdin();
  }

  filenam2 = 1 == argc ? filename : argv[1];
  if (-1 == (fd = open(filenam2, O_RDONLY))) {
    fprintf(stderr, "%s\n", "open() failed");
    return EXIT_FAILURE;
  }
  if (NULL == (fp = fdopen(fd, "r"))) {
    fprintf(stderr, "%s\n", "fdopen() failed");
    goto error;
  }

  if (0 != (fstat(fd, &st)) || (!S_ISREG(st.st_mode))) {
    fprintf(stderr, "%s\n", "The program operates only on filename(s)");
    goto error;
  }

  if (0 != fseeko(fp, 0, SEEK_END)) {
    fprintf(stderr, "%s\n", "fseeko() failed");
    goto error;
  }
  if (-1 == (file_size = ftello(fp))) {
    fprintf(stderr, "%s\n", "ftello() failed");
    goto error;
  }
  rewind(fp);
  
  fz = (size_t)file_size;

  buf = (char *)(malloc(fz));
  if (NULL == buf) {
    fprintf(stderr, "%s\n", "malloc() failed");
    goto error;
  }
  
  dummy = fread(buf, 1, fz, fp);
  (void)dummy;

  arr = (char **)(malloc(fz));
  while ((tok = strsep(&buf, "\n"))) {
    arr[x++] = tok;
  }
  for (; x > 0;x--) {
    if (arr[x]) {
      puts(arr[x]);
    }
  }

error:
  close(fd);
  if (NULL != fp) {
    fclose(fp);
  }
  if (NULL != ptrtofree) {
    free(ptrtofree);
  }
  if (NULL != arr[0]) {
    free(arr);
  }
  remove(filename);

  return EXIT_SUCCESS;
}

static void
read_from_stdin(void) {
  char buf[256] = {'\0'};
  size_t dummy = 0;
  FILE *fp = NULL;

  if (NULL != (fp = fopen(filename, "w"))) {
    while (0 != (dummy = fread(buf, 1, 255, stdin))) {
      buf[dummy] = '\0';
      fprintf(fp, "%s", buf);
    }
  }
  
  if (EOF == (fclose(fp))) {
    fprintf(stderr, "%s\n", "fclose() failed");
    exit(EXIT_FAILURE);
  }
}
```

Compile it with `gcc -Wall -Wextra -O2 -o main tac.c`.