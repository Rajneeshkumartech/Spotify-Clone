// let play = document.querySelector("#play")
let song_name = document.querySelector(".song_name")
let currentsong = new Audio()

function convertsecondtominute(totalseconds){
if(typeof totalseconds!=='number'||totalseconds<0){
return "Invalid input: Please provide a non-negative number of seconds.";
}
const minute = Math.floor(totalseconds /60);
const second = Math.floor(totalseconds % 60);

const formatedminutes = String(minute).padStart(2,'0');
const formatedsecond = String(second).padStart(2,'0');

return `${formatedminutes}:${formatedsecond}`

}



async function getsongs(){
let a = await fetch("http://127.0.0.1:5500/songs/");
let response = await a.text();
let div = document.createElement("div")
div.innerHTML = response;
let as = div.getElementsByTagName("a");
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
    currentsong.src = "/songs/"+track
    // let audio = new Audio ("/songs/"+track)
    currentsong.play();
    play.src = "svg/pause.svg";
    song_name.innerText = track;

}
async function main(){ 

   
    let songs = await getsongs()
    // console.log(songs);
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
    e.addEventListener("click",()=>{
    //    console.log(e.querySelector(".info").firstElementChild.innerHTML)
    playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

    })
 
});  

play.addEventListener('click',()=>{
    if(currentsong.paused){
currentsong.play();
play.src = "svg/pause.svg"
    }
    else{
currentsong.pause();
play.src = "svg/play.svg"
    }
})

currentsong.addEventListener('timeupdate',()=>{
document.querySelector(".songtime").innerHTML = `${convertsecondtominute(currentsong.currentTime)}/
${convertsecondtominute(currentsong.duration)}`;
document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
})

document.querySelector('.seekbar').addEventListener('click',(e)=>{
let percentage = (e.offsetX/e.target.getBoundingClientRect().width)*100;
document.querySelector('.circle').style.left = percentage  + '%';
currentsong.currentTime = (currentsong.duration*percentage)/100
})

document.querySelector('.hamburger').addEventListener('click',()=>{
    document.querySelector('.left').style.left = '0'
})

document.querySelector('.close').addEventListener('click',()=>{
 document.querySelector('.left').style.left = '-100%'
 console.log('close was clicked')
}
   
)

}
main();
