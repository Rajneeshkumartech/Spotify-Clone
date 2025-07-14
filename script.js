
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
async function main(){ 
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
    // console.log(`${song.replaceAll('%20'," ")}`)
   }
    //play the first song
    // const random = Math.floor(Math.random()*7+1)
    var audio = new Audio(songs[0]);  
    audio.play(); 

    // audio.addEventListener('loadeddata',()=>{
    //     let duration = audio.duration;
    //     console.log(duration);  
    // })
}
main();
    //  