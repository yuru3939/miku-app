const titleScreen = document.getElementById("title-screen");
const songScreen = document.getElementById("song-screen");
const ripple = document.getElementById("ripple");

let started = false;

window.addEventListener("click", (event) => {

    // 波紋
    const x = event.clientX;
    const y = event.clientY;

    ripple.style.display = "block";

    ripple.style.left = `${x - 10}px`;
    ripple.style.top = `${y - 10}px`;

    ripple.classList.remove("ripple-animation");

    void ripple.offsetWidth;

    ripple.classList.add("ripple-animation");

    // 最初の1回だけ
    if (!started) {

        started = true;

        unlockAudio();

        playSE();

        playBGM();

        setTimeout(() => {

            titleScreen.style.display = "none";

            songScreen.classList.remove("hidden");

        }, 700);
    }

});