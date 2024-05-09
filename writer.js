import "https://hashsan.github.io/counter/getUUID.js"
import { Octokit } from "https://esm.sh/@octokit/rest";
////

// history
// v0 : launched
// v1 : rename対応、リネームはshaが維持されていれば変更可能なので、set関数は sha = await set() を返す。
console.log('writer v1') // 分かるように
///

// Base64エンコードを行う関数
function encode(str) {
  // 文字列をUTF-8エンコードしてバイト配列に変換
  const bytes = new TextEncoder().encode(str);
  // Base64にエンコードして返す
  return btoa(String.fromCharCode(...bytes));
}

// Base64デコードを行う関数
function decode(encoded, charset = 'utf-8') {
  // Base64をデコードしてバイト配列に変換
  const bytes = atob(encoded).split('').map(char => char.charCodeAt(0));
  // バイト配列を文字列にデコードして返す
  return new TextDecoder(charset).decode(new Uint8Array(bytes));
}

function orderTime(latestDate) {
  // latestDateが文字列である場合、Dateオブジェクトに変換する
  if (typeof latestDate === 'string') {
    latestDate = new Date(latestDate);
  }

  // 現在の時刻を取得
  const currentDate = new Date();
  // 現在時刻と最終更新時刻の差を計算（ミリ秒単位）
  const timeDiff = currentDate.getTime() - latestDate.getTime();
  // 1時間ごとにorder値を計算
  const orderValue = Math.floor(timeDiff / (1000 * 60 * 60));
  return orderValue;
}

////
function makeSummary(response){

  const content = decode( response.data.content )
  const title = content.trim().split('\n')[0];  
  const date = makeDate(response.headers["last-modified"])
  const {sha,name} = response.data
  const order = orderTime(date)

  return {content,title,date,sha,name,order}
}

////
function makeDate(dateString){
  return new Date(dateString).toISOString().split('T')[0];
}

////
function writer(owner,repo,token){
  owner = owner || 'hashsan'
  repo = repo || 'writer'
  token = token || getUUID()
  const octokit = new Octokit({ auth: token })
  
  /////////////////////
  /////////////////////
  async function list(){
    try{
      const response = await octokit.repos.getContent({
        owner,
        repo,
        //path
      });
      return response.data.filter(d=>d.type==='file').map(d=>d.name)
    }catch(error){
      console.error(error)
      return null;
    }
  }
  /////////////////////
  /////////////////////
  async function get(path,withSummary){
    try{
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path
      });
      const o = makeSummary(response)
      return withSummary? o : o.content
    }catch(error){
      console.error(error)
      return null;
    }
  }
  /////////////////////
  /////////////////////
  async function _sha(path){
    try{
      const response = await get(path,true)
      return response? response.sha : null   
    }catch(error){
      //console.error(error)
      return null;
    }
  }
  /////////////////////
  /////////////////////
  async function set(path,text,sha){
    try{
       sha = sha || await _sha(path)
      const content = encode(text)
      const message = text.slice(0,100);

      const response = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content,
        sha
      });

      return response.data.content.sha; //
    }catch(error){
      console.error(error)
      return null;
    }
  }
  ////
  return {get,set,list}
}

window.writer = writer;
window.getGithubInfo = getGithubInfo //util
window.replaceExtension = replaceExtension //

/////////////////////////
/////////////////////////
/////////////////////////
function pureUrl(url){
  return url.split('?')[0]  
}
function isEncodedUrl(url) {
  return /%[0-9A-Fa-f]{2}/.test(url);
}
function treatUrl(url){
  url = pureUrl(url)
  url = isEncodedUrl(url)?decodeURIComponent(url):url
  return url;
}

function replaceExtension(filename, newExtension) {
  // 最後のドット（.）以降の部分を置き換えるための正規表現
  const regex = /\.[^.]+$/;
  // 新しい拡張子を指定されたものに置き換える
  return filename.replace(regex, newExtension);
}

/*
// 例としてファイル名を渡して拡張子を入れ替える
const filename = 'xyz.old.html';
const newFilename = replaceExtension(filename, '.new.html');
console.log(newFilename); // 出力: xyz.old.new.html
*/

function getGithubInfo(url) {
  //https://{owner}.github.io/{repo}/{path}
  //https://hashsan.github.io/hermes/バレエあらすじ.html
  //owner = hashsan
  //repo = hermes
  //path = バレエあらすじ.html

  url = treatUrl(url)
  const regex = /https:\/\/([^/]+)\.github\.io\/([^/]+)\/(.+)/;
  const matches = url.match(regex);
  if (matches && matches.length === 4) {
    const owner = matches[1];
    const repo = matches[2];
    const path = matches[3];
    return { owner, repo, path };
  } else {
    return null; // URLが適切な形式ではない場合はnullを返す
  }
}


/*
// 例としてURLを渡して情報を取得
const url = 'https://hashsan.github.io/hermes/%E3%83%90%E3%83%AC%E3%82%A8%E3%81%82%E3%82%89%E3%81%99%E3%81%98.html';
let {owner,repo,path} = getGithubInfo(url);
path = replaceExtension(path,'.md')
console.log(owner,repo,path);
*/















