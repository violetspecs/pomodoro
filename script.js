console.log("test")

navigator.serviceWorker.register('service-worker.js');

const startButton = document.querySelector("#start")
const stopButton = document.querySelector("#stop")
const resetButton = document.querySelector("#reset")
const standardButton = document.querySelector("#standard")
const shortButton = document.querySelector("#short")
const longButton = document.querySelector("#long")
const breakDisplay = document.querySelector("#breakDisplay")
const minutesDisplay = document.querySelector("#min")
const secondsDisplay = document.querySelector("#sec")
const sessionsDisplay = document.querySelector("#sessions")
const timerState = {
    STANDARD: 0,
    SHORT: 1,
    LONG: 2
}

let timer
let time
let currentTime
let currentState = timerState.STANDARD
let totalCycles = 0

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

function setLongBreak() {
    time = 15*60
    currentTime = time
    setClockDisplay()
    setTextDisplay("Long break")
}

function setSessionsDisplay() {
    sessionsDisplay.innerHTML = totalCycles.toString()
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
            if (currentState == timerState.SHORT || currentState == timerState.LONG) {
                setStandardTimer()
                currentState = timerState.STANDARD
            } else {
                totalCycles += 1
                setSessionsDisplay()
                if (totalCycles % 4 == 0) {
                    setLongBreak()
                    currentState = timerState.LONG
                } else {
                    setShortBreak()
                    currentState = timerState.SHORT
                }
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
    switch (currentState) {
        case timerState.STANDARD:
            setStandardTimer()
            break;
        case timerState.SHORT:
            setShortBreak()
            break;
        case timerState.LONG:
            setLongBreak()
            break
    }
}

function timeUpNotification() {
    const options = {
        body: "Time's up!",
        requireInteraction: true
    }
    let displayText = "Time start!"
    switch (currentState) {
        case timerState.SHORT:
            displayText = "Time for Short Break"
            break;
        case timerState.LONG:
            displayText = "Time for Long Break"
            break
    }

    let notification = new Notification(displayText, options);
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
    currentState = timerState.STANDARD
    resetTimer()
})

shortButton.addEventListener('click', (event) => {
    console.log('click short')
    currentState = timerState.SHORT
    resetTimer()
})

longButton.addEventListener('click', (event) => {
    console.log('click long')
    currentState = timerState.LONG
    resetTimer()
})

setStandardTimer()

Notification.requestPermission().then((result) => {
    if (result === "granted") {
        //timeUpNotification();
    }
});



