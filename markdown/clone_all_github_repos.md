
---

Ever wondered how to export all of your GitHub projects ? Replace **USER\_NAME\_GOES\_HERE** with your GitHub account name.

```bash
repos_to_ignore=(
  'project1.git'
  'project2.git'
  'project3.git'
)
mkdir -p --mode=700 "${HOME}/git-repos"
cd "${HOME}/git-repos"

wget --quiet --output-document=- \
   'https://api.github.com/users/USER_NAME_GOES_HERE/repos?per_page=500' | \
  gawk '/clone_url/ { gsub("[,\"]",""); print $2; }' | \
  while read x
  do
    [[ ! " ${repos_to_ignore[@]} " =~ " ${x##*/} " ]] && {
      git clone "${x}"
    }
  done
```
