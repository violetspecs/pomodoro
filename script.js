console.log("test")

navigator.serviceWorker.register('service-worker.js');

let timer
let time
let currentTime
let isBreak = false

const startButton = document.querySelector("#start")
const stopButton = document.querySelector("#stop")
const resetButton = document.querySelector("#reset")
const standardButton = document.querySelector("#standard")
const shortButton = document.querySelector("#short")
const breakDisplay = document.querySelector("#breakDisplay")
const minutesDisplay = document.querySelector("#min")
const secondsDisplay = document.querySelector("#sec")

function setClockDisplay() {
    let mins = Math.floor(currentTime / 60)
    let secs = currentTime - (mins * 60)
    minutesDisplay.innerHTML = String(mins).padStart(2, '0')
    secondsDisplay.innerHTML = String(secs).padStart(2, '0')
}

function setTextDisplay(text) {
    breakDisplay.innerHTML = text
}

function setStandardTimer() {
    time = 25*60
    currentTime = time
    setClockDisplay()
    setTextDisplay("Timer")
}

function setShortBreak() {
    time = 5*60
    currentTime = time
    setClockDisplay()
    setTextDisplay("Short break")
}

function startTimer() {
    let start = Date.now();
    timer = setInterval(() => {
        let delta = Date.now() - start;
        currentTime = time - Math.floor(delta/1000)
        if (currentTime < 0) {
            // time's up
            clearInterval(timer)
            timeUpNotification()
            if (isBreak) {
                setStandardTimer()
                isBreak = false
            } else {
                setShortBreak()
                isBreak = true
            }
        }
        setClockDisplay()
    }, 100)
}

function stopTimer() {
    time = currentTime
    clearInterval(timer)
}

function resetTimer() {
    stopTimer()
    if (isBreak) {
        setShortBreak()
    } else {
        setStandardTimer()
    }
}

function timeUpNotification() {
    const options = {
        body: "Time's up!",
        requireInteraction: true
    }
    let notification
    if (isBreak) {
        notification = new Notification("Time start!", options);
    } else {
        notification = new Notification("Time for Short Break", options);
    }
    notification.addEventListener('click', (event) => {
        startTimer()
    })
}

startButton.addEventListener('click', (event) => {
    console.log('click start')
    startTimer()
})

stopButton.addEventListener('click', (event) => {
    console.log('click stop')
    stopTimer()
})

resetButton.addEventListener('click', (event) => {
    console.log('click reset')
    resetTimer()
})

standardButton.addEventListener('click', (event) => {
    console.log('click pomodoro')
    isBreak = false
    resetTimer()
})

shortButton.addEventListener('click', (event) => {
    console.log('click short')
    isBreak = true
    resetTimer()
})

setStandardTimer()

Notification.requestPermission().then((result) => {
    if (result === "granted") {
        //timeUpNotification();
    }
});



