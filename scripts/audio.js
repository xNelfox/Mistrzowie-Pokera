// Music
const music = new Audio('audio/music.mp3');
music.loop = true;

function playMusic() {
    music.play();
}

document.addEventListener('click', function() {
    playMusic();
});


// Sounds
function playSound(filePath) {
    let sound = new Audio(filePath);

    sound.play();
}