
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
        songs.push(element.href.split("/songs/")[1])
    }
}
return songs
}

 
function playmusic(track){
    let audio = new Audio ("/songs/"+track)
    audio.play()
}
async function main(){ 

    let currentsong;
    let songs = await getsongs()
    console.log(songs);
    let songs_UL = document.querySelector(".song_list").getElementsByTagName("ul")[0];
   for (const song of songs) {
    songs_UL.innerHTML=songs_UL.innerHTML+ `<li><img class = 'music' src="./svg/music.svg" alt="music">
                    <div class="info">
                        <div>${song.replaceAll('%20'," ")}</div>
                        <div>R K </div>
                    </div>
                   <div class="play_now">
                    <span>Play Now</span>
                     <img class="invert" src="./svg/play.svg" alt="">
                   </div>
                </li>`

  

}
// atach an event listener to each song 
Array.from(document.querySelector(".song_list").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click",(element)=>{
       console.log(e.querySelector(".info").firstElementChild.innerHTML)
    playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
 
});  
}
main();
    //  