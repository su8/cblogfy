/*
   08/29/2024 https://github.com/su8/cblogfy
 
   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.
 
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
 
   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
   MA 02110-1301, USA.
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <dirent.h>
#include <unistd.h>

int main (void) {
  DIR *dp = NULL;
  char buf[4096] = {""};
  char dir[4096] = {""};
  char *dirPtr = dir;
  struct stat st = {0};
  struct dirent *entry = NULL;     

  if (NULL == (dp = opendir("markdown"))){
    goto err;
  }
  snprintf(buf, sizeof(buf) - 1, "generated");
  if (stat(buf, &st) == -1) mkdir(buf, 0700);

  while ((entry = readdir(dp))) {
    if (*(entry->d_name) == '.') continue;

    dirPtr = dir;
    for (char *entryPtr = entry->d_name; *entryPtr; entryPtr++) {
	  if (*entryPtr == '.') break;
	  *dirPtr++ = *entryPtr;
	}
	*dirPtr = '\0';

    snprintf(buf, sizeof(buf) - 1, "generated/%s", dir);
    if (stat(buf, &st) == -1) mkdir(buf, 0700);

    snprintf(buf, sizeof(buf) - 1, "pandoc -s -f markdown -t html5 -o generated/%s/index.html style.css markdown/%s --metadata title='%s'", dir, entry->d_name, dir);
    system(buf);
    buf[0] = '\0';
    dir[0] = '\0';
  }
  if ((closedir(dp)) == -1) {
    goto err;
  }
  return EXIT_SUCCESS;
 
err:
  return EXIT_FAILURE;
}
