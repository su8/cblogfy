
---

Benchmarking how fast the string replacement on a huge file among several programs is. Used [this](https://www.ietf.org/rfc/rfc3261.txt) document and copied it (`while true; do cat document >> document2;done`) several times until it reached 8.5GB. At line 3000 I added "sup machine" which is going to be replaced by the programs.

| \# | Program    | Time       |
|----|------------|------------|
| 1  | lua        | 4m31.443s  |
| 2  | python     | 3m56.490s  |
| 3  | sed        | 7m56.382s  |
| 4  | perl       | 2m6.496s   |
| 5  | gawk       | 1m59.993s  |
| 6  | ruby       | 5m45.179s  |
| 7  | javascript | 25m28.716s |
| 8  | go         | 8m32.207s  |
| 9  | php        | 7m0.795s   |

And the used commands:

```bash
# lua
time lua -e 'for line in io.lines("document2") do print((string.gsub(line,"sup machine","hello world")));end' >> dummy

# python
time python2 -c 'with open("document2","rt") as f:                                
   for line in f:
     print(line.replace("sup machine","hello world").rstrip("\n"))'>>dummy2

# gawk
time cat document2 | gawk '{gsub(/sup machine/,"hello world");print $0}' >> dummy3

# perl
time perl -pe 's|sup machine|hello world|g' document2 >>dummy4

# sed
cp document2 document3
time sed -i 's|sup machine|hello world|g' document3

# ruby
time ruby -pe "gsub(/sup machine/, 'hello world')" document2>>dummy5

# php
time php main.php >> dummy6

# javascript
time node main.js >> dummy7
```

Javascript:

```javascript
// https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('elo2')
});

lineReader.on('line', function (line) {
  console.log(line.replace('sup machine','hello world'));
});
```

Go lang:

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	fileHandle, _ := os.Open("elo2")
	defer fileHandle.Close()
	fileScanner := bufio.NewScanner(fileHandle)

	for fileScanner.Scan() {
    str := fileScanner.Text()
		fmt.Println(strings.Replace(str,"sup machine","hello world",-1))
	}
}
```

PHP:

```php
foreach (new SplFileObject("document2") as $line) {
    echo str_replace("sup machine", "hello world", $line);
}
```
