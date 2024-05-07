# writer

## interface
```
var w = writer({repo,owner,token})

w.get(fileName)
w.time(fileName) //modify time
w.write(fileName,content) //create and update, always check sha
w.list(withTimeFlg) //withTimeFlg is option

```
