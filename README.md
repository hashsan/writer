# writer


## interface
```
var w = writer()

w.get(fileName)
w.set(fileName,content) //create and update, always check sha
w.list() //withTimeFlg is option

//utility
encode(str) //string to base64
decode(base64) //base64 to string
```
