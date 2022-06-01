try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
} catch (e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}
const kolayTekerlemeler = [
    'Explict',
    'Unadulterated',
    'Through',
    'Congratulations',
    'Knife',
    'Know',
    'Schedule',
    'Scissors',
    'Squirrel',
    'Refrigerator',
    'Knee',
    'Live',
    'Unique',
    'Scientific',
    'Vehicle',
    'Occur',
    'Rhythm',
    'Recyclable',
    'Recipe',
    'Appointment'
]
const startButton = document.getElementById('start-record-btn')
const yeniSoruBtn = document.getElementById('yeniSoru')
const dogru = document.getElementById('dogru')
const yanlis = document.getElementById('yanlis')
const pauseButton = document.getElementById('pause-btn')
const soruText = document.getElementById('soru');
const game = {tekerleme: kolayTekerlemeler, numara: 0, sonuc: false, dogru: 0, yanlis: 0};
const noteTextarea = document.getElementById('note-textarea');
const instructions = document.getElementById('recording-instructions');
const stopInstructions = document.getElementById('stop-instructions');
var notesList = document.getElementById('ul#notes');

var noteContent = '';
// Get all notes from previous sessions and display them.


/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function (event) {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far.
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current === 1 && transcript === event.results[0][0].transcript);

    if (!mobileRepeatBug) {
        noteContent += transcript;
        noteTextarea.innerText = noteContent;
        stopInstructions.innerText = 'Stopped';
        instructions.innerText = 'Start';
        cevabiKontrolEt(noteContent);
    }
};

recognition.onstart = function () {
    instructions.innerText = 'Started';
    stopInstructions.innerText = 'Stop';
}


recognition.onerror = function (event) {
    if (event.error === 'no-speech') {
        instructions.innerText = 'No sound detected. Try again.';
    }
}
window.addEventListener('load', (e) => {

    yeniOyun();

});

yeniSoruBtn.addEventListener('click', (e) => {
    yeniSoru();
})


/*-----------------------------
      App buttons and input 
------------------------------*/

startButton.addEventListener('click', function (e) {
    noteTextarea.innerText = ''
    noteContent = '';
    if (noteContent.length) {
        noteContent += ' ';
    }
    recognition.start();
});

pauseButton.addEventListener('click', function (e) {
    recognition.stop();
    instructions.innerText = 'Start';

})

function yeniOyun() {
    soruText.innerText = game.tekerleme[game.numara];
    dogru.innerText = 'Total Correct Answers: ' + game.dogru;
    yanlis.innerText = 'Total Wrong Answers: ' + game.yanlis;
}

function cevabiKontrolEt(cevap) {
    let tekerleme = game.tekerleme[game.numara].toLowerCase();
    let sonucTekerleme = '';
    for (let i = 0; i < tekerleme.length; i++) {
        if (tekerleme[i] !== ',' && tekerleme[i] !== '.' && tekerleme[i] !== '?') {
            sonucTekerleme += tekerleme[i];
        }
    }
    game.sonuc = sonucTekerleme === cevap.toLowerCase();
    if (game.sonuc === false){
        game.yanlis++;
        document.getElementById('body').style.backgroundColor =  '#DB1F48';
    }
    else {
        game.dogru++;
        document.getElementById('body').style.backgroundColor =  '#18A558';
    }
    console.log(sonucTekerleme);
    console.log(cevap);
    console.log(game.sonuc);
    setTimeout(() => {
        yeniSoru();
    }, 2000);

}

function yeniSoru() {
    dogru.innerText = 'Total Correct Answers: ' + game.dogru;
    yanlis.innerText = 'Total Wrong Answers: ' + game.yanlis;
    document.getElementById('body').style.backgroundColor =  '#E1C340';
    game.numara++;
    if (game.numara === 20){
        game.numara = 0;
    }
    stopInstructions.innerText = 'Stop';
    soruText.innerText = game.tekerleme[game.numara];
}








