// Simple music generation using Web Audio API
document.getElementById('playBtn').addEventListener('click', () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
    const musicLines = [];

    function playNote(note, duration, time) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(midiToFrequency(note), audioContext.currentTime);

        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

        oscillator.start(time);
        oscillator.stop(time + duration);
    }

    function midiToFrequency(note) {
        const noteMap = {
            'C4': 261.63,
            'D4': 293.66,
            'E4': 329.63,
            'F4': 349.23,
            'G4': 392.00,
            'A4': 440.00,
            'B4': 493.88,
            'C5': 523.25
        };
        return noteMap[note];
    }

    function generateMusicLine() {
        let musicLine = [];
        for (let i = 0; i < 8; i++) { // Generate 8 notes per line
            const randomNote = notes[Math.floor(Math.random() * notes.length)];
            musicLine.push(randomNote);
        }
        return musicLine;
    }

    let startTime = audioContext.currentTime;
    const noteDuration = 0.5; // half a second per note

    // Generate 4 lines of music
    for (let line = 0; line < 4; line++) {
        const musicLine = generateMusicLine();
        musicLines.push(musicLine);

        // Play each note in the line
        musicLine.forEach((note, index) => {
            playNote(note, noteDuration, startTime + (index + line * 8) * noteDuration);
        });
    }

    // Display the music lines on the webpage
    displayMusicLines(musicLines);
});

function displayMusicLines(musicLines) {
    const musicLinesContainer = document.getElementById('musicLines');
    musicLinesContainer.innerHTML = ''; // Clear previous lines

    musicLines.forEach((line, index) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'music-line';
        lineDiv.innerText = `Line ${index + 1}: ${line.join(' - ')}`;
        musicLinesContainer.appendChild(lineDiv);
    });
}
