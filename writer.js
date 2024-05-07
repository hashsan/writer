import "https://hashsan.github.io/counter/getUUID.js"
import { Octokit } from "https://esm.sh/@octokit/rest";
////
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
  async function set(path,text){
    try{
      const sha = await _sha(path)
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

      return response;
    }catch(error){
      console.error(error)
      return null;
    }
  }
  ////
  return {get,set,list}
}

window.writer = writer;
