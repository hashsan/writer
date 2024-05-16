# writer


## github.ioの場合はautoWriterが使える
```
import "https://hashsan.github.io/writer/dropAndClip.js"
import "https://hashsan.github.io/writer/autoWriter.js"

if(window.autoWriter){
 autoWriter.get
 autoWriter.set
 autoWriter.list
 autoWriter.name //拡張子が付いていないのでつけること。たとえば「index.html」なら「index」となる。
}
```

```
import "https://hashsan.github.io/writer/dropAndClip.js"
import "https://hashsan.github.io/writer/writer.js"
```
## function writer(owner,repo,token)
## var {owner,repo} = getGithubInfo(url)

```
async function main(){

  const w = writer()
  let response = await w.list()
  console.log('list',response)
  response = await w.get('aiueo.txt',true)
  console.log('get',response)  
  response = await w.get('aiueo.txt')
  console.log('get simple',response)  

  response = await w.set('aiueo.txt','foohaafoohaa1234\n日本語1234')
  console.log('set',response)

}

var btn = document.createElement('button')
btn.textContent = 'done'
btn.onclick = main
document.body.append(btn)
```

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
