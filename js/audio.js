const audio = document.getElementById("audio");
const bgm = document.getElementById("bgm");
const {Player} = TextAliveApp;
// 音量
audio.volume = 0.5;
bgm.volume = 0.3;

// 音解禁済み？
let unlocked = false;

// BGM開始済み？
let bgmStarted = false;

let songUrl = "http://www.youtube.com/watch?v=3Wtx6k2vInU"

const player = new Player({
    app: {token:"BFWsFTi8eAJBC7UW"},
    //mediaElement: document.querySelector("#media")
});

const playBtn = document.querySelector("#play");
const jumpBtn = document.querySelector("#jump");
const pauseBtn = document.querySelector("#pause");
const rewindBtn = document.querySelector("#rewind");



player.addListener({
    onAppReady(app){
        player.createFromSongUrl(songUrl);
        console.log("aaaaaaaaaaaaa");
        playBtn.addEventListener("click", () => player.video && player.requestPlay());
    jumpBtn.addEventListener("click", () => player.video && player.requestMediaSeek(player.video.firstPhrase.startTime));
    pauseBtn.addEventListener("click", () => player.video && player.requestPause());
    rewindBtn.addEventListener("click", () => player.video && player.requestMediaSeek(0));
    },
    onTimerReady() {
  document
    .querySelectorAll("button")
    .forEach((btn) => (btn.disabled = false));
    
  //let p = player.video.firstPhrase;
  //jumpBtn.disabled = !p;

  // set `animate` method
  //while (p && p.next) {
    //p.animate = animatePhrase;
    //p = p.next;
  //}
}
});

const animateWord = function (now, unit) {
  if (unit.contains(now)) {
    document.querySelector("#text").textContent = unit.text;
  }
};
// 最初のクリックで音解禁
function unlockAudio() {

    if (!unlocked) {

        bgm.play().then(() => {

            bgm.pause();
            bgm.currentTime = 0;

        }).catch(() => {});

        unlocked = true;
    }
}

// 効果音再生
function playSE() {

    audio.currentTime = 0;

    audio.play().catch(() => {});
}

// BGM再生
function playBGM() {

    // 1回だけ
    if (!bgmStarted) {

        bgm.play().catch(() => {});

        bgmStarted = true;
    }
}