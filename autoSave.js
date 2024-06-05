import "https://hashsan.github.io/writer/writer.js"

const o = getGithubInfo(location.href);
if(o){
  let {owner,repo,path} = o;
  let w = writer(owner,repo);
  
  window.autoSave = async function(data){
    return await w.set(path,data)    
  }
}else{
  window.autoSave = null ///
}
