// Variable declarations
let song_name = document.querySelector(".song_name");
let currentsong = new Audio();
let songs; // This will hold the array of song filenames
let play = document.querySelector("#play");
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");
let volumeRange = document.querySelector('#volume_range');
let volumeIcon = document.querySelector('.volume img');
let cardContainer = document.querySelector(".card_container");


// Function to convert seconds to formatted minutes:seconds 
function convertsecondtominute(totalseconds){
    if(typeof totalseconds !== 'number' || totalseconds < 0 || isNaN(totalseconds)){
        return "00:00";
    }
    const minute = Math.floor(totalseconds / 60);
    const second = Math.floor(totalseconds % 60);
    const formatedminutes = String(minute).padStart(2,'0');
    const formatedsecond = String(second).padStart(2,'0');
    return `${formatedminutes}:${formatedsecond}`;
}

// Function to fetch songs from the server
async function getsongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let fetchedSongs = [];
    for(let i = 0; i < as.length; i++){
        const element = as[i];
        if(element.href.endsWith(".mp3")){
            fetchedSongs.push(element.href.split("/songs/")[1]);
        }
    }
    return fetchedSongs;
}

// Function to play a song 
function playmusic(track, pause = false){
    currentsong.src = "/songs/" + track;
    song_name.innerText = track.replaceAll('%20'," ").split(".mp3")[0];

    if(!pause){
        currentsong.play();
        play.src = "svg/pause.svg";
    } else {
        currentsong.pause();
        play.src = "svg/play.svg";
    }
}

// Main function to initialize the player
async function main(){
    songs = await getsongs(); // Assign fetched songs to the global 'songs' variable

    // --- Populate the song list (left sidebar) ---
    let songs_UL = document.querySelector(".song_list").getElementsByTagName("ul")[0];
    if (songs_UL) {
        songs_UL.innerHTML = "";
        for (const song of songs) {
            songs_UL.innerHTML += `<li>
                <img class='music invert' src="./svg/music.svg" alt="music">
                <div class="info">
                    <div>${song.replaceAll('%20'," ").split(".mp3")[0]}</div>
                    <div>Artist Name</div>
                </div>
                <div class="play_now">
                    <span>Play Now</span>
                    <img class="invert" src="./svg/play.svg" alt="">
                </div>
            </li>`;
        }
    }

    // Attach click event listeners to each song in the left list 
    Array.from(document.querySelectorAll(".song_list ul li")).forEach(e => {
        e.addEventListener("click",()=>{
            const songToPlay = e.querySelector(".info").firstElementChild.innerText.trim() + ".mp3";
            playmusic(songToPlay);
            document.querySelector('.left').style.left = '-100%';
        });
    });

    // --- Dynamically generate cards for each song ---
    if (cardContainer && songs.length > 0) { // Ensure container exists and there are songs
        cardContainer.innerHTML = ""; // Clear existing content
        songs.forEach(song => {
            const songTitle = song.replaceAll('%20', ' ').split(".mp3")[0];
            const cardHTML = `
                <div class="cards" data-song="${song}">
                    <div class="play_button"><img src="./svg/play-button.png" alt=""></div>
                    <img src="https://i.scdn.co/image/ab67616d00001e020a47bbe7141fdfe0eb2cdba7" alt="Album Art"> <h2>${songTitle}</h2>
                    <p>Unknown Artist</p> </div>
            `;
            cardContainer.innerHTML += cardHTML;
        });

        // Attach click event listeners to each dynamically generated card
        Array.from(document.querySelectorAll(".cards")).forEach(card => {
            card.addEventListener("click", () => {
                const songToPlay = card.dataset.song; // Get the original song filename from data-song attribute
                playmusic(songToPlay);
            });
        });
    }

    // Play/Pause button functionality 
    play.addEventListener('click',()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src = "svg/pause.svg";
        } else {
            currentsong.pause();
            play.src = "svg/play.svg";
        }
    });

    // Update song time and seekbar circle position  
    currentsong.addEventListener('timeupdate',()=>{
        const currentTime = currentsong.currentTime;
        const duration = currentsong.duration;
        document.querySelector(".songtime").innerHTML = `${convertsecondtominute(currentTime)} / ${convertsecondtominute(duration)}`;
        if (duration > 0) {
            document.querySelector(".circle").style.left = (currentTime / duration) * 100 + "%";
        }
    });

    // Seekbar click functionality  
    document.querySelector('.seekbar').addEventListener('click',(e)=>{
        let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = percentage  + '%';
        if (currentsong.duration > 0) {
            currentsong.currentTime = (currentsong.duration * percentage) / 100;
        }
    });

    // Hamburger menu click to open sidebar  
    document.querySelector('.hamburger').addEventListener('click',()=>{
        document.querySelector('.left').style.left = '0';
    });

    // Close button click to hide sidebar 
    document.querySelector('.close').addEventListener('click',()=>{
        document.querySelector('.left').style.left = '-100%';
    });

    // Previous song functionality 
    previous.addEventListener('click',()=>{
        let currentTrackSrc = currentsong.src;
        let currentTrackFileName = currentTrackSrc.split("/").pop(); 
        
        let index = songs.indexOf(currentTrackFileName);
        
        if(index === -1 && songs.length > 0) {
            index = 0;
        } else if((index - 1) >= 0){
            index = index - 1;
        } else {
            index = songs.length - 1;
        }
        playmusic(songs[index]);
    });

    // Next song functionality 
    next.addEventListener('click',()=>{
        let currentTrackSrc = currentsong.src;
        let currentTrackFileName = currentTrackSrc.split("/").pop();
        
        let index = songs.indexOf(currentTrackFileName);

        if(index === -1 && songs.length > 0) {
            index = 0;
        } else if((index + 1) < songs.length){
            index = index + 1;
        } else {
            index = 0;
        }
        playmusic(songs[index]);
    });

    // Volume control 
    volumeRange.addEventListener('change',(e)=>{
        currentsong.volume = parseInt(e.target.value) / 100;
        if (currentsong.volume === 0) {
            volumeIcon.src = "./svg/mute.svg";
        } else {
            volumeIcon.src = "./svg/volume.svg";
        }
    });

    // Volume icon click to mute/unmute 
    volumeIcon.addEventListener('click', () => {
        if (currentsong.volume > 0) {
            currentsong.volume = 0;
            volumeIcon.src = "./svg/mute.svg";
            volumeRange.value = 0;
        } else {
            currentsong.volume = 0.5;
            volumeIcon.src = "./svg/volume.svg";
            volumeRange.value = 50;
        }
    });

    // Initialize playbar with the first song (paused) 
    if (songs.length > 0) {
        playmusic(songs[0], true);
        volumeRange.value = currentsong.volume * 100;
    }
}

main();