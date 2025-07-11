
async function getsongs(){
let a = await fetch("http://127.0.0.1:5500/songs/");
// console.log(a)
let response = await a.text();
// console.log(response)
let div = document.createElement("div")
div.innerHTML = response;
let as = div.getElementsByTagName("a");
// console.log(as)
let songs = []
for(let i = 0;i<as.length;i++){
    const element = as[i];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href)
    }
}
return songs
}

async function main(){
    let songs = await getsongs()
    console.log(songs);
    //play the first song
    var audio = new Audio(songs[1]);
    audio.play();
}
main()  
