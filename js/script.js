let currentsong = new Audio();
let songul;
let songs = [];
let currfolder;



async function getSongs(folder) {
    currfolder = folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    songul = document.querySelector(".songs").getElementsByTagName("ul")[0]
    songul.innerHTML = ""

    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <img class="invert" id="player" src="img/play.svg" alt="">
                            </div>
                        </li>`

    }



    // attach an event listener to each song  ---used for each loop 
    Array.from(document.querySelector(".songs").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    });



}
const playmusic = (track, pause = false) => {
    currentsong.src = decodeURI(`/${currfolder}/` + (track))
    if (!pause) {

        currentsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}



function sectominsec(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}


async function displayalbums() {
    let cardconatiner = document.querySelector(".card-container")
    let a = await fetch(`/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let folder = (e.href.split("/").slice(-2)[0]);
            let res = await fetch(`/songs/${folder}/info.json`);
            let response = await res.json()
            cardconatiner.innerHTML = cardconatiner.innerHTML + `<div data-folder="${folder}" class="card rounded">
                            <div class="play">
                                <img src="img/play.png" alt="play-button">
                            </div>
                                <img src="/songs/${folder}/cover.jpg"
                                alt="">
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                        </div>
                       `
        }


    }
    // load the playlist whenever user touches a card
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            let folder = e.getAttribute("data-folder");
            songs = await getSongs(`songs/${folder}`);
        });
    });

}





displayalbums()

async function main() {


    // get list of all songs
    await getSongs("songs/Angry_(mood)")
    playmusic(songs[0].replaceAll("%20", " "), true)

    // display all albums on page


    // play the first song
    let audio = new Audio(songs[0]);
    audio.muted = true;
    audio.play();
    document.addEventListener("click", () => {
        audio.muted = false;
    });




    // attach an event listener to play prev or next song
    play.addEventListener("click", () => {
        if (currentsong.paused) {

            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })





    // listen for time update event 
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${sectominsec(currentsong.currentTime)}/${sectominsec(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })


    // add event listener to seek bar 
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = ((e.offsetX / e.target.getBoundingClientRect().width) * 100)
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = (currentsong.duration * percent) / 100
    })


    // add evenet listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })


    // add evenet listener for close
    document.querySelector(".closesvg").addEventListener("click", () => {
        let close = document.querySelector(".left")
        close.style.left = "-130%"
        close.style.transition = "all 1s";
    })

    // add evenet listener for previous
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {

            playmusic(songs[index - 1])
        }
    })

    // add evenet listener for next
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index) < songs.length - 1) {
            playmusic(songs[index + 1])
        }
    })


    // event listener for thr volume button
    let hideTimeout;
    volicon.addEventListener("click", () => {
        if (volbar.style.display === "block") {
            volbar.style.display = "none";
            clearTimeout(hideTimeout);
        } else {
            volbar.style.display = "block";
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                volbar.style.display = "none";
            }, 5000);
        }
    });

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100

    })



    // toggle play pause on spacebar
    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            if (currentsong.paused) {
                currentsong.play();
                play.src = "img/pause.svg";
            } else {
                currentsong.pause();
                play.src = "img/play.svg";
            }
        }
    });

}

main()



