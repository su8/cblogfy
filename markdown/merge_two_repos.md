
---

Let's say you got two or more repositories containing different histories regarding the same project and want to merge their histories into single one.

Merging the history of repo2 into repo1:

```bash
git clone https://github.com/user/repo2

cd repo2
git remote set-url origin https://github.com/user/repo1.git
mv .git ..
rm -rf ./*
mv ../.git .

git fetch --all
git add -A
git commit -am 'merged'

git reset --hard
git merge --allow-unrelated-histories

cd ..
git clone https://github.com/user/repo1
rm -rf repo1/.git
cp -r repo1/* repo2/
cd repo2
git add -A
git commit -am 'merged'

# git log
git push
```
