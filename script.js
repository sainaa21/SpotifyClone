console.log("JavaScript Timeee!");
let currentSong = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {
    document.querySelector(".welcomeText").style.display = "none";
    document.querySelector(".songList").style.display = "block";

    currFolder = folder;

    // 🔹 fetch songs list JSON
    let res = await fetch(`${folder}/songs.json`);
    let data = await res.json();

    songs = data.songs;

    let songUL = document
        .querySelector(".songList")
        .getElementsByTagName("ul")[0];

    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                </div>
                <div class="playNow">
                    <span>Play Now</span>
                    <img class="invert" src="play.svg" alt="">
                </div>
            </li>`;
    }

    // attach click listeners
    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info div").innerText.trim());
        });
    });
}


function secondsToMinuteSeconds(seconds) {
    seconds = Math.floor(seconds); // ensure whole number
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    // pad with leading zero if needed
    const mm = String(minutes).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');

    return `${mm}:${ss}`;
}

const playMusic = (track, pause = false) => {
    // let audio=new Audio("/songs/" + track);
    currentSong.src = `${currFolder}/${track}`;

    document.querySelector(".welcomeBlock").style.display = "none";
    document.querySelector(".playbar").style.display = "block";
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }

    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    let res = await fetch("songs/songs.json");
    let data = await res.json();

    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    data.albums.forEach(album => {
        let card = document.createElement("div");
        card.className = "card";
        card.dataset.folder = album.folder;

        card.innerHTML = `
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <circle cx="12" cy="12" r="12" fill="#1ed760"/>
                    <path d="M9.5 11.2v1.6c0 1.52 0 2.28.456 2.586
                    .456.307 1.079-.033 2.325-.712l1.468-.8
                    C15.25 13.056 16 12.647 16 12
                    s-.75-1.056-2.25-1.874l-1.468-.8
                    c-1.246-.679-1.869-1.019-2.325-.712
                    C9.5 8.92 9.5 9.68 9.5 11.2z" fill="black"/>
                </svg>
            </div>

            <img src="songs/${album.folder}/cover.jpg" alt="">
            <h2>${album.title}</h2>
            <p>${album.description}</p>
        `;

        card.addEventListener("click", () => {
            getSongs(`songs/${album.folder}`);
        });

        cardContainer.appendChild(card);
    });
}




async function main() {

    //getting list of all songs


    //load the first song automatically on the playbar after reloading the page

    //Display all the albums on the page
    displayAlbums()

    //Attach an event listener to play next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${secondsToMinuteSeconds(currentSong.currentTime)}/${secondsToMinuteSeconds(currentSong.duration)}`

        //sliding the seekbar
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add eventListener to seekbar to manually adjust the seekbar
    document.querySelector(".seekBar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //Add an event listener for hamburger(when we click it, sidebar library appears)
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add an event listener for close(when we click it, sidebar library disappers)
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //Add an event listener to previous
    previous.addEventListener("click", () => {
        console.log("Previous clicked")
        console.log(currentSong)
        let currentTrack = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    //Add an event listener to next
    next.addEventListener("click", () => {
        console.log("Next clicked")
        console.log(currentSong)
        let currentTrack = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //Add an event to change volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting Volume to ", e.target.value, "/100")
        currentSong.volume = parseInt(e.target.value) / 100
    })

    //Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })


}
main();
