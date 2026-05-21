


const songs = document.querySelectorAll(".song-card");

const lyricScreen = document.getElementById("lyric-screen");
const lyricText = document.getElementById("lyric-text");

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

        // 曲ID
        let songName = card.getAttribute("data-song");

        // 曲再生
        window.globalFunction.run(songName);

        // 画面切替
        const gameScreen = document.getElementById("game-screen");
        songScreen.classList.add("hidden");

        //gameScreen.classList.remove("hidden");
        lyricScreen.classList.remove("hidden");
        // 歌詞開始(旧)
        //playLyrics(lyricsData[songId]);

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

