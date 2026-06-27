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
const spawn = document.getElementById("spawn-point");
const SpawnOffsetLeft = spawn.offsetLeft;
const SpawnOffsetTop = spawn.offsetTop;
const scoreBoard = document.querySelector("#scoreBoard");
let score = 0;

let progressTime = 1;
let stt = 0;
const wordContainer = document.querySelector("#wordLyric");
//　単語表示
const animateWord = function (now, unit) {
  if (unit.startTime <= now && unit.endTime > now) {
    if(stt >  musicPosition){
        console.log("posError");
        return;
    }
    //表示初期化
    if(progressTime > unit.progress(now)){
        console.log("changetext");
        console.log("progressTime:" + progressTime);
        console.log("unit.progress:" + unit.progress(now));
        console.log("text:" + unit.text);

        progressTime = unit.progress(now);
        let nowText = document.createElement('p');
        nowText.textContent = unit.text;
        nowText.style.left = SpawnOffsetLeft + "px";
        nowText.style.top = SpawnOffsetTop + Math.random() * 100 - 100 + "px";
        nowText.classList.add("txt");
        nowText.classList.add("fly-lyric");
        wordContainer.appendChild(nowText);
        return;
    }
    progressTime = unit.progress(now);
  }

  
};
//　下部フレーズの表示
const animatePhrase = function (now, unit) {
  if (unit.contains(now)) {
    //console.log(unit.progress(now));
    //console.log("phrase:" + unit.text);
    document.getElementById("phraseText").textContent = unit.text;

  }
  
};
// クリック判定
wordContainer.addEventListener("click", function(event){
    if(event.target.tagName !== "P") return;
    if(!event.target.classList.contains("touch")){
        event.target.classList.add("touch");
        console.log("click");
        score += 100;
        scoreBoard.textContent = "score:" + score;
    }
    
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
            player.video && (stt = player.video.firstPhrase.startTime);
            playBtn.addEventListener("click", () => player.video && player.requestPlay());
            jumpBtn.addEventListener("click", () => player.video && player.requestMediaSeek(player.video.firstPhrase.startTime));
            pauseBtn.addEventListener("click", () => player.video && player.requestPause());
            rewindBtn.addEventListener("click", () => player.video && player.requestMediaSeek(0));
        },

        onVideoReady(video) {
            console.log("VideoReady");
            console.log(player.data.song.name);
            tmp_name = player.data.song.name;
            
            document.getElementById("songTitle").textContent = tmp_name;
            console.log(player.data.song.artist.name);
            tmp_artist_name = player.data.song.artist.name;
            document.getElementById("songArtist").textContent = tmp_artist_name;
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
            let phraseP = player.video.firstPhrase;
            jumpBtn.disabled = !phraseP;

            // set `animate` method
            while (p && p.next) {
                console.log("firstphrase:" + p + "| next:" + p.next);
                p.animate = animateWord;
                p = p.next;
            }
            console.log("p.class?" + p.children.children);
            if(!p.next){
                p.animate = animateWord;
                
            }
            while (phraseP && phraseP.next) {
                console.log("firstphrase:" + phraseP + "| next:" + phraseP.next);
                phraseP.animate = animatePhrase;
                phraseP = phraseP.next;
            }
            if(!phraseP.next){
                phraseP.animate = animatePhrase;
            }
        },
        onTimeUpdate(position) {
            //console.log("update");
            musicPosition = position;
            //console.log(player.findBeat(player.timer.position).position);
            //console.log("a",unit.progress(now));
            //console.log("b",player.timer.position);

            let flyText = document.querySelector(".fly-lyric");
            let styles = getComputedStyle(flyText);
            let opac = styles.getPropertyValue('opacity');
            //console.log("opacity",opac);
            if(opac == 0){
                flyText.remove();
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