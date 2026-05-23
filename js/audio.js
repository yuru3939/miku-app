const se = document.getElementById("se");
const bgm = document.getElementById("bgm");
const {Player} = TextAliveApp;
// 音量
se.volume = 0.5;
bgm.volume = 0.3;

// 音解禁済み？
let unlocked = false;

// BGM開始済み？
let bgmStarted = false;

let songUrl = "http://www.youtube.com/watch?v=3Wtx6k2vInU"
let a = document.querySelector("#text p");
let tes;
function changetext(unit){
    if(tes != unit.text){
        tes = unit.text;
        return true;
    }
    return false;
    
}
const animatePhrase = function (now, unit) {
  if (unit.contains(now)) {
    if(changetext(unit)){
        console.log("changetext");
        a.classList.remove("touch");
    }
    
    //console.log(unit.progress(now));
    console.log("text:" + unit.text);
    a.textContent = unit.text;
  }
  
};

a.addEventListener("click", function(){
    a.classList.add("touch");
});

function run(songName){
    const player = new Player({
        app: {token:"BFWsFTi8eAJBC7UW"},
        mediaElement: document.querySelector("#media")
    });

    const playBtn = document.querySelector("#play");
    const jumpBtn = document.querySelector("#jump");
    const pauseBtn = document.querySelector("#pause");
    const rewindBtn = document.querySelector("#rewind");



    player.addListener({
        onAppReady(app){
            console.log("AppReady");
            songInfo = songData[songName];
            player.createFromSongUrl(songInfo.url,{
                video: {
                    beatId: songInfo.beatId,
                    chordId: songInfo.chordId,
                    repetitiveSegmentId: songInfo.repetitiveSegmentId,

                    lyricId: songInfo.lyricId,
                    lyricDiffId: songInfo.lyricDiffId
                },
            });
            
            playBtn.addEventListener("click", () => player.video && player.requestPlay());
            jumpBtn.addEventListener("click", () => player.video && player.requestMediaSeek(player.video.firstPhrase.startTime));
            pauseBtn.addEventListener("click", () => player.video && player.requestPause());
            rewindBtn.addEventListener("click", () => player.video && player.requestMediaSeek(0));
        },
        onTimerReady() {
            document
                .querySelectorAll("button")
                .forEach((btn) => (btn.disabled = false));
            console.log("ready");
            console.log("beatId:" + player.data.songMap.revisions.beatId);
            console.log("chordId:" + player.data.songMap.revisions.chordId);
            console.log("repetitiveSegemntId:" + player.data.songMap.revisions.repetitiveSegmentId);
            console.log("lyricId:" + player.data.video.lyricId);
            console.log("lyricDiffId:" + player.data.video.lyricDiffId);
            let p = player.video.firstWord;
            jumpBtn.disabled = !p;

            // set `animate` method
            while (p && p.next) {
                console.log("firstphrase:" + p + "| next:" + p.next);
                p.animate = animatePhrase;
                
                p = p.next;

                
            }
            console.log("p.class?" + p.children.children);
            if(!p.next){
                p.animate = animatePhrase;
                
            }
        }
    });
}

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

    se.currentTime = 0;

    se.play().catch(() => {});
}

// BGM再生
function playBGM() {

    // 1回だけ
    if (!bgmStarted) {

        bgm.play().catch(() => {});

        bgmStarted = true;
    }
}

window.globalFunction = {};
window.globalFunction.run = run;