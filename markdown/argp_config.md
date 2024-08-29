
---

No need to use another language to parse your program options. Just code them in C/C++ and rely on `argp.h`.

Here's how to read from config file and use the program command line options in your configuration file.

Compile the c program `gcc -Wall -Wextra -O2 -o main prog.c` and execute it with `./main --conf YOUR_CONFIG.txt` where **YOUR_CONFIG.txt** is the config file with the CMD options in it.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <argp.h>

#define VLA 256

static void parse_opts(int argc, char *argv[], char *combined);
static error_t parse_opt(int key, char *arg, struct argp_state *state);
static void parse_konf(char *combined, const char *user_config);

const char *argp_program_version = "1.0.0";
const char *argp_program_bug_address = "https://github.com/su8 ";
static const char doc[] = "Program info";
static const struct argp_option options[] = {
  { .doc = "Available options:" },
  { .name = "one", .key = 'o', .doc = "The first option in this program"},
  { .name = "two", .key = 't', .doc = "The second option in this program"},
  { .doc = NULL }
};

struct arguments {
  char *all;
};

static const struct argp arg_parser = {
  .parser = parse_opt,
  .options = options,
  .doc = doc
};

static error_t parse_opt(int key, char *arg, struct argp_state *state) {

  struct arguments *arguments = state->input;
  switch(key) {
    case 'o':
        arguments->all += snprintf(arguments->all, VLA, "%s ", "first option");
        break;
    case 't':
        arguments->all += snprintf(arguments->all, VLA, "%s ", "second option");
        break;
    default:
      return ARGP_ERR_UNKNOWN;
  }
  return EXIT_SUCCESS;
}

static void parse_opts(int argc, char *argv[], char *combined) {
  struct arguments arguments = {
    .all = combined
  };
  argp_parse(&arg_parser, argc, argv, ARGP_IN_ORDER, NULL, &arguments);
}

static void parse_konf(char *combined, const char *user_config) {
  FILE *fp = NULL, *fp2 = NULL;
  char *ptr = NULL;
  char *ello[] = { (char *)"main", NULL };
  char buf[VLA], conf[VLA], temp[VLA], cmd[VLA], output[VLA];
  const char *const home = getenv("HOME") ? getenv("HOME") : "empty";
  struct arguments arguments = {
    .all = combined
  };

  if (NULL == user_config) {
    snprintf(conf, VLA-1, "%s%s", home, "/.pinky");
  }
  else {
    snprintf(conf, VLA-1, "%s", user_config);
  }
  if (NULL == (fp = fopen(conf, "r"))) {
    printf("%s %s\n", conf, "doesn't exist or $HOME is unset");
    return;
  }

  while (NULL != (fgets(buf, VLA-1, fp))) {
    if (EOF == (sscanf(buf, "%[^\n]", temp))) {
      fclose(fp);
      puts("Reached EOF.");
      return;
    }
    ptr = temp;
    while (0 != (isspace((unsigned char) *ptr))) {
      ptr++;
    }
    if ('-' == *ptr && '-' == *(ptr+1)) {
      if ('s' == *(ptr+2) && 'e' == *(ptr+4)) {
        if (EOF == (sscanf(ptr, "%*s %[^\n]", cmd))) {
          fclose(fp);
          printf("%s\n", "The shell requires argument, e.g: --shell echo 'hi'.");
        }
        if (NULL == (fp2 = popen(cmd, "r"))) {
          continue;
        }
        fscanf(fp2, "%[^\n]", output);
        arguments.all += snprintf(arguments.all, VLA, "%s", output);
        if (-1 == (pclose(fp2))) {
          puts("can't close popen");
          return;
        }
        continue;
      }
    }
    if ('#' == *ptr || '/' == *ptr || ';' == *ptr || 
        '*' == *ptr || '\0' == *(ptr+1) || '\0' == *ptr) {
      continue;
    }
    ello[1] = ptr;
    argp_parse(&arg_parser, 2, ello, ARGP_IN_ORDER, NULL, &arguments);
    temp[0] = '\0';
  }
  fclose(fp);
}

int main(int argc, char *argv[]) {
  char combined[VLA] = {'\0'};
  char *all = combined;
  char *combinedPtr = combined;

  if (argc == 3) {
    if (!strcmp(argv[1], "--conf")) {
      parse_konf(all, argv[2]);
    }
  }
  else {
    parse_opts(argc, argv, all);
  }


  for (; *combinedPtr; combinedPtr++) { ; } /* walk thru the entire array */
  *(--combinedPtr) = '\0'; /* remove the trailing space */

  puts(combined);

  return EXIT_SUCCESS;
}
```

`YOUR_CONFIG.txt`

```bash
--shell echo "three four "

# run the first option
--one

# run the sescond option
--two
```