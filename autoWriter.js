import "https://hashsan.github.io/writer/writer.js"

const o = getGithubInfo(location.href);
if(o){
  let {owner,repo,path} = o;
  let w = writer(owner,repo);
  w.name = replaceExtension(path,''); //nameは拡張子をカットしている。注意。
  window.autoWriter = w
}else{
  window.autoWriter = null ///
}
