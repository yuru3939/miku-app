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
let a = document.querySelector("#wordText");
let tes;
function changetext(unit){
    if(tes != unit.text){
        tes = unit.text;
        
        return true;
    }
    
    return false;
    
}
let progressTime = 1;
let stt = 0;
b = document.querySelector("#wordLyric");
const animateWord = function (now, unit) {
  if (unit.startTime <= now && unit.endTime > now) {
    if(stt >  musicPosition){
        console.log("a");
        return;
    }
    /*if(changetext(unit)){
        console.log("changetext");
        console.log("text:" + unit.text);
        a.classList.remove("touch");
    }
    
    //console.log(unit.progress(now));
    a.textContent = unit.text;*/
    //console.log("unit.progress:" + unit.progress(now));
    
    if(progressTime > unit.progress(now)){
        console.log("changetext");
        console.log("progressTime:" + progressTime);
        console.log("unit.progress:" + unit.progress(now));
        console.log("text:" + unit.text);
        a.classList.remove("touch");
        const spawn = document.getElementById("spawn-point");
        a.style.left = spawn.offsetLeft + "px";
        a.style.top = spawn.offsetTop + "px";
        a.classList.remove("fly-lyric");
        progressTime = unit.progress(now);
        a.textContent = unit.text;
        var nowText = document.createElement('p');
        nowText.textContent = unit.text;
        nowText.classList.add("txt");
        nowText.classList.add("fly-lyric");
        b.appendChild(nowText);
        return;
    }
    a.classList.add("fly-lyric");
    //console.log(unit.progress(now));
    
    progressTime = unit.progress(now);
  }

  
};
const animatePhrase = function (now, unit) {
  if (unit.contains(now)) {
    //console.log(unit.progress(now));
    //console.log("phrase:" + unit.text);
    document.getElementById("phraseText").textContent = unit.text;

  }
  
};

b.addEventListener("click", function(event){
    if(!event.target.classList.contains("touch")){
        event.target.classList.add("touch");
        console.log("click");
    }
    
});

a.addEventListener("click", function(){
    console.log("click");
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
            console.log(player.findBeat(player.timer.position).position);
            console.log("a",unit.progress(now));
            console.log("b",player.timer.position);
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