const se = document.getElementById("se");
const bgm = document.getElementById("bgm");
const {Player} = TextAliveApp;
// 音量
se.volume = 0.5;

// 音解禁済み？
let unlocked = false;

// BGM開始済み？
let bgmStarted = false;

// 曲が終了したかどうか
let songFinished = false;
let songEndChecker = null;


let nowBeat = 0;
const scoreBoard = document.querySelector("#scoreBoard");
let score = 0;

let progressTime = 1;
let stt = 0;
const wordContainer = document.querySelector("#wordLyric");
const noteContainer = document.querySelector("#noteContainer");
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
        let spawn = document.getElementById("spawn-point");
        nowText.style.left = spawn.offsetLeft + "px";
        nowText.style.top = spawn.offsetTop - Math.random() * 400 + 80 + "px";
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

const controller = new AbortController();
const signal = controller.signal;
first = true;
const backSelectFunc =() => {
    location.reload();
}
function run(songName){
    
    const player = new Player({
        app: {token:"BFWsFTi8eAJBC7UW"},
        mediaElement: document.querySelector("#media")
    });
    if(first){
        first = false;
    }else{
        songInfo = songData[songName];
        player.video && player.onAppMediaChange(songInfo.url);
    }

    const menuSelect = document.querySelector('.menuButton');
    const nav = document.querySelector('.nav');
    let nowToggle = false;
    const menuSelectFunc = () => {
        
        if(!nowToggle){
            nowToggle = true;
            player.video && player.requestPause();
        }else{
            nowToggle = false;
            player.video && player.requestPlay();
        }
        console.log("menu");
        menuSelect.classList.toggle("active");
        nav.classList.toggle("active");
        
    };
    menuSelect.addEventListener('click', menuSelectFunc);
    const restart = document.querySelector('#restart');
    restart.addEventListener('click',function(){
        songFinished = false;
        nowToggle = false;
        player.video && player.requestMediaSeek(0);
        player.video && player.requestPlay();
        menuSelect.classList.toggle("active");
        nav.classList.toggle("active");
    });
    const backSelect = document.querySelector('#back');
    
    backSelect.addEventListener('click', backSelectFunc);

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
            document.getElementById("start-button").addEventListener("click", () => {

                document.getElementById("ready-screen")
                .classList.add("hidden");

                document.getElementById("game-screen")
                .classList.remove("hidden");

                document.getElementById("lyric-screen")
                .classList.remove("hidden");
                const menuSelect =
                document.querySelector(".menuButton");

                menuSelect.classList.remove("active");
                player.video && player.requestPlay();
            });
            
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
        onAppMediaChange(songUrl){
            
        },
        onTimerReady() {
            document
                .querySelectorAll("button")
                .forEach((btn) => (btn.disabled = false));
            document.querySelector("#ready-logo").textContent = "♪ NOW PLAYING ♪";
            console.log("ready");
            console.log("beatId:" + player.data.songMap.revisions.beatId);
            console.log("chordId:" + player.data.songMap.revisions.chordId);
            console.log("repetitiveSegemntId:" + player.data.songMap.revisions.repetitiveSegmentId);
            console.log("lyricId:" + player.data.video.lyricId);
            console.log("lyricDiffId:" + player.data.video.lyricDiffId);
            let p = player.video.firstWord;
            let phraseP = player.video.firstPhrase;
            

            //animateメソッドのセット
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
            musicPosition = position;
            
            if(nowBeat != player.findBeat(player.timer.position).position){
                nowBeat = player.findBeat(player.timer.position).position;
                let note = document.createElement('p');
                note.textContent = "♪";
                let spawn = document.getElementById("spawn-point");
                note.style.left = spawn.offsetLeft -170 + Math.random() * 100 -100 + "px";
                note.style.top = spawn.offsetTop -80 - Math.random() * 50 + "px";
                let r = Math.floor(Math.random() * 255);
                let g = Math.floor(Math.random() * 255);
                let b = Math.floor(Math.random() * 255);
                let color = `rgb(${r},${g},${b})`;
                note.style.color = color;
                note.classList.add("txt");
                note.classList.add("fly-note");
                noteContainer.appendChild(note);
            }
            if (!songFinished && player.video && position >= player.video.duration-300) {
                songFinished = true;
                console.log("曲が終了しました");
                const finalScore = document.querySelector("#finalScore");
                finalScore.textContent = "Score:" + score + "!!!"
                const background = document.querySelector("#background");
                background.classList.remove("hidden");
                menuSelect.removeEventListener('click', menuSelectFunc);
                const back2 = document.querySelector("#back2");
                back2.classList.remove("hidden");
                back2.addEventListener('click',backSelectFunc);
                return;
            }

            let flyText = document.querySelector(".fly-lyric");
            if (flyText) {
                let styles = getComputedStyle(flyText);
                let opac = styles.getPropertyValue('opacity');
                if (opac == 0) {
                    flyText.remove();
                }
            }
            let flyNote = document.querySelector(".fly-note");
            if (flyNote) {
                let styles = getComputedStyle(flyNote);
                let opac = styles.getPropertyValue('opacity');
                if (opac == 0) {
                    flyNote.remove();
                }
            }
        },
        delete(){
            player.video && player.requestPause();
        }
    },{signal: controller.signal}
    
);
}



// 効果音再生
function playSE() {

    se.currentTime = 0;

    se.play().catch(() => {});
}



