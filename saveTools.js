import "https://hashsan.github.io/talk/moca.js"
import "https://hashsan.github.io/writer/writer.js"

function makeTools(){
  var temp=`
<div id="saveTools"
 style="position:fixed;top:0.5rem;right:0.5rem;"
 >
  <button class="saveTools-file">...</button>
  <button class="saveTools-list">list</button>
  <style>#saveTools button{line-height:1.3;}</style>
</div>
  `.trim();
  var el=document.createElement('div')
  el.innerHTML = temp;
  return el.children[0]
}

async function saveTools(owner,repo){
  var $edit = document.querySelector('[contenteditable]')
  if(!$edit)return console.log('need contenteditable')
  
  var w = writer(owner,repo)
  var list = await w.list()
  list = list.filter(d=>/\.md$/.test(d)).join('|')
  var $tools = makeTools()
  document.body.append($tools);
  
  var $file = $tools.querySelector('.saveTools-file')
  var $list = $tools.querySelector('.saveTools-list')
  
  $edit.addEventListener('keydown',async (event)=>{
    if(event.ctrlKey && event.key==='s'){
      event.preventDefault()
      var file = getFile()
      if(!file)return;
      var text = $edit.textContent;
      $file.style.color='#f26';
      await w.set(file,text);
      $file.style.color=''
    }
  })
  ////
  $file.onclick =async()=>{
    var d= await moca(`
# 保存ファイル名を入力して下さい
owner:${owner}
repo:${repo}
[]`)
    if(!d)return;
    setFile(d[0])
    $file.textContent = getFile()
  }

  ////
  $list.onclick =async()=>{
    var d=await moca(`
# 読み込むファイルを選択して下さい。
owner:${owner}
repo:${repo}
現在の文書は破棄されます。
[${list}]`)
    
    if(!d) return; 
    setFile(d[0])
    $file.textContent = getFile();
    $edit.textContent = await w.get(getFile());
  }

  ///
  function setFile(file){
    $file.dataset.file=file
  }
  function getFile(){
    return $file.dataset.file
  }
  
}

/*usage
saveTools('hashsan','hermes')
*/
