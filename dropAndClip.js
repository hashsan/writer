import "https://hashsan.github.io/counter/getUUID.js"
import { Octokit } from "https://esm.sh/@octokit/rest";

function isBlob(obj) {
  return obj instanceof Blob;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function makeName(){
  var jp =9*60*60*1000;
  var iso = new Date(Date.now()+jp).toISOString()
  var name = iso.replace(/[-:]/g,'').replace('T','_').split('.').at(0)
  return name + '.jpg'
}

window.imgStock = {};
imgStock.repo='i'
imgStock.owner='hashsan'
var {repo,owner} = imgStock;
var octokit =  new Octokit({
  auth: getUUID()
});
imgStock.octokit = octokit
imgStock.base = `https://${owner}.github.io/${repo}/`
imgStock.base_dl =`https://raw.githubusercontent.com/${owner}/${repo}/main/`

// 
imgStock.up=async(data)=>{
  if (isBlob(data)) {
    const base64 = await blobToBase64(data);
    return await imgStock.up(base64);
  }

  const path = makeName()

  const content = /,/.test(data) ? data.split(',')[1] : data;

  try {
    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Upload ${path}`,
      content
    });
    //console.log(response)
    //return response.data.content.download_url

    return imgStock.base_dl + path
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }

}

////
imgStock.dl=(name)=>{
  return imgStock.base_dl + name

}

/*
//////////////
//<input type="file" id="fileInput">
const fileInput = document.getElementById('fileInput');

fileInput.onchange=async()=>{
  const file = fileInput.files[0];
  const url = await imgStock.up(file)
  popupImage(url)
}
*/
function popupImage(url){
  var img = new Image();
  img.src = url
  img.style=`
  display:flex;position:fixed;bottom:0.5rem;right:0.5rem;
  width:256px;height:256px;object-fit:cover;z-index:1000;  
  `
  img.onclick =()=>{
    navigator.clipboard.writeText(url)
     .then(d=>img.remove())
  }
  document.body.append(img)     
}


function dropAndClip(selector, callback) {
  const dropZone = document.querySelector(selector);

  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.style.borderColor = '#000';
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#ccc';
  });

  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.style.borderColor = '#ccc';

    const files = event.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        callback(reader.result, file.type);
      };
      reader.readAsDataURL(file);
    }
  });

  dropZone.addEventListener('paste', (event) => {
    const items = (event.clipboardData || window.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = () => {
          callback(reader.result, blob.type);
        };
        reader.readAsDataURL(blob);
        break;  // 最初の画像のみ処理する
      }
    }
  });

}

/*check the body height
body{
  margin:auto;
  background:orange;
  width:100%;
  min-height:100vh;
}
*/

console.log('use dropAndClip')

dropAndClip('body', async(base64, type) => {
  const url = await imgStock.up(base64)
  popupImage(url)  

});

