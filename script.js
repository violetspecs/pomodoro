console.log("test")

let timer
let time
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
    let mins = Math.floor(time / 60)
    let secs = time - (mins * 60)
    minutesDisplay.innerHTML = String(mins).padStart(2, '0')
    secondsDisplay.innerHTML = String(secs).padStart(2, '0')
}

function setTextDisplay(text) {
    breakDisplay.innerHTML = text
}

function setStandardTimer() {
    time = 10
    setClockDisplay()
    setTextDisplay("Timer")
}

function setShortBreak() {
    time = 5
    setClockDisplay()
    setTextDisplay("Short break")
}

function startTimer() {
    timer = setInterval(() => {
        time -= 1
        if (time == -1) {
            // time's up
            clearInterval(timer)
            if (isBreak) {
                setStandardTimer()
                isBreak = false
            } else {
                setShortBreak()
                isBreak = true
            }
            timeUpNotification()
        }
        setClockDisplay()
    }, 1000)
}

function stopTimer() {
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
        body: "Time's up!"
    }
    new Notification("Timer", options);
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
        timeUpNotification();
    }
});



