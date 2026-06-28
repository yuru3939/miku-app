


const songs = document.querySelectorAll(".song-card");

const lyricScreen = document.getElementById("lyric-screen");
const lyricText = document.getElementById("lyric-text");

let selectedSong = "";

let src;
// 仮の歌詞データ
const lyricsData = {

    miku: ["ミ", "ク", "！！！"],

    sora: ["空", "に", "免じて"],

    kotae: ["こ", "た", "え", "て"]

};

songs.forEach(card => {

    card.addEventListener("click", () => {

    console.log("setBGM");
    playSE();

    // 曲名取得
    let songName = card.getAttribute("data-song");

    selectedSong = songName;

    // 曲確認画面
    const readyScreen =
        document.getElementById("ready-screen");

    const songImage =
        document.getElementById("song-image");

    const songTitle =
        document.getElementById("song-title");

    // 画面切替
    songScreen.classList.add("hidden");

    readyScreen.classList.remove("hidden");

    // 曲情報表示
    songTitle.textContent = songName;

    songImage.src = "image/" + songName + ".png";

});

});

// 歌詞表示
function playLyrics(lyrics) {

    lyricText.textContent = "";

    let index = 0;

    function showNext() {

        if (index < lyrics.length) {

            lyricText.textContent = lyrics[index];

            index++;

            setTimeout(showNext, 800);

        }

    }

    showNext();
}


/*const boat = document.getElementById("boat");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let boatX = mouseX;
let boatY = mouseY;

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateBoat() {

    boatX += (mouseX - boatX) * 0.01;
    boatY += (mouseY - boatY) * 0.01;

    boat.style.left = boatX + "px";
    boat.style.top = boatY + "px";

    requestAnimationFrame(animateBoat);
    
    console.log("boat test");
}
animateBoat();
*/

const world = document.getElementById("world");

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});



let worldX = 0;
let worldY = 0;

function animateWorld() {

    const dx = mouseX - window.innerWidth / 2;
    const dy = mouseY - window.innerHeight / 2;

    worldX += (-dx - worldX) * 0.05;
    worldY += (-dy - worldY) * 0.05;

    world.style.transform = `translate(${worldX}px, ${worldY}px)`;

    requestAnimationFrame(animateWorld);
}

animateWorld();




// 歌詞飛ばし
function spawnLyric(text) {

    const container =
        document.getElementById("lyrics-container");

    const lyric =
        document.createElement("div");

    lyric.classList.add("fly-lyric");

    lyric.textContent = text;

    /* 出現位置 */
    const spawn = document.getElementById("spawn-point");
        lyric.style.left = spawn.offsetLeft + "px";
        lyric.style.top = spawn.offsetTop + "px";
        
    container.appendChild(lyric);

    setTimeout(() => {
        lyric.remove();
    }, 3000);

}

console.log("歌詞生成");


document.getElementById("start-button").addEventListener("click", () => {

    document.getElementById("ready-screen")
        .classList.add("hidden");

    document.getElementById("game-screen")
        .classList.remove("hidden");

    document.getElementById("lyric-screen")
        .classList.remove("hidden");

    run(selectedSong);

    const menuSelect =
        document.querySelector(".menuButton");

    menuSelect.classList.remove("active");

});



// 泡飛ばし
function spawnBubble(){

    const container =
        document.getElementById("bubble-container");

    const bubble =
        document.createElement("div");

    bubble.classList.add("bubble");

    bubble.style.left =
        Math.random() * window.innerWidth + "px";

    bubble.style.bottom = "-20px";

    const size =
        Math.random() * 75 + 5;

    bubble.style.width = size + "px";
    bubble.style.height = size + "px";

    container.appendChild(bubble);

    setTimeout(()=>{

        bubble.remove();

    },8000);

}

setInterval(spawnBubble,500);