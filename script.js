const text = document.getElementById("text");
const audio = document.getElementById("audio");

const bgm = document.getElementById("bgm");
bgm.volume = 0.3;

let bgmStarted = false;

const message = "ミク！！！";
let index = 0;

let unlocked = false;

// クリックでスタート
text.addEventListener("click", () => {

    // 🔥最初の1回だけBGM再生
    if (!bgmStarted) {
        bgm.play().catch(() => {});
        bgmStarted = true;
    }

    // 音解禁（今まで通り）
    if (!unlocked) {
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(() => {});
        unlocked = true;
    }

    // 文字リセット
    text.textContent = "";
    index = 0;

    showText();
});

function showText() {
    if (index < message.length) {

        const span = document.createElement("span");
        span.className = "char";
        span.textContent = message[index];

        text.appendChild(span);

        setTimeout(() => {
            span.classList.add("show");
        }, 50);

        // 音（ここ大事）
        if (unlocked) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }

        index++;
        setTimeout(showText, 400);
    }

    console.log(bgm);
}
