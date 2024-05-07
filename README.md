# writer

## interface
```
var w = writer();
var content = w.get(filename)
var {content,title,date} = w.get(filename,withSummary)
var ary = w.list()

function makeMessage(data){
  var date = new Date().toISOString().split('T')[0]
  var title = data.trim().split('\n')[0]
  return data +','title
}
function getSummary(message){
  var ary = message.split(',')
  return {date:ary[0], title:ary[1]}
}
```

## !!old!! interface
```
var w = writer({repo,owner,token})

w.get(fileName)
w.time(fileName) //modify time
w.write(fileName,content) //create and update, always check sha
w.list(withTimeFlg) //withTimeFlg is option

//utility
encode(str) //string to base64
decode(base64) //base64 to string
```
