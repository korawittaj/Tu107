
const timerDisplay = document.getElementById("timer");
const statusText = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const breakBtn = document.getElementById("breakBtn");
const breakCount = document.getElementById("breakCount");
const clearBtn = document.getElementById("clearBtn");

const STUDY_TIME = 20 * 60;
const BREAK_TIME = 20;

let remainingTime = STUDY_TIME;
let timer = null;
let mode = "study";

function showTime() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

function startTimer() {
    if (timer !== null) return;

    statusText.textContent =
        mode === "study"
            ? "กำลังเรียน ตั้งใจได้เลย!"
            : "พักสายตา มองไกล ๆ สบาย ๆ";

    timer = setInterval(() => {
        remainingTime--;
        showTime();

        if (remainingTime <= 0) {
            clearInterval(timer);
            timer = null;

            if (mode === "study") {
                alert("ถึงเวลาพักสายตาแล้ว 👀");
                startBreak();
            } else {
                alert("พักครบ 20 วินาทีแล้ว!");
                finishBreak();
            }
        }
    }, 1000);
}

function pauseTimer() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
        statusText.textContent = "หยุดชั่วคราว กดเริ่มเมื่อต้องการต่อ";
    }
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    mode = "study";
    remainingTime = STUDY_TIME;
    showTime();
    statusText.textContent = "พร้อมเริ่มเรียนแล้วหรือยัง?";
}

function startBreak() {
    clearInterval(timer);
    timer = null;
    mode = "break";
    remainingTime = BREAK_TIME;
    showTime();
    statusText.textContent = "พักสายตา มองสิ่งที่อยู่ไกลออกไป";
    startTimer();
}

function finishBreak() {
    clearInterval(timer);
    timer = null;

    mode = "study";
    remainingTime = STUDY_TIME;

    const today = new Date().toLocaleDateString("sv-SE");
    const savedDate = localStorage.getItem("studyBreakDate");

    let count = Number(localStorage.getItem("studyBreakCount")) || 0;

    if (savedDate !== today) {
        count = 0;
        localStorage.setItem("studyBreakDate", today);
    }

    count++;
    localStorage.setItem("studyBreakCount", count);

    updateCount();
    showTime();
    statusText.textContent = "เยี่ยมมาก! พร้อมกลับไปเรียนต่อแล้ว";
}

function updateCount() {
    const today = new Date().toLocaleDateString("sv-SE");
    const savedDate = localStorage.getItem("studyBreakDate");

    if (savedDate !== today) {
        localStorage.setItem("studyBreakDate", today);
        localStorage.setItem("studyBreakCount", "0");
    }

    breakCount.textContent =
        localStorage.getItem("studyBreakCount") || "0";
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

breakBtn.addEventListener("click", () => {
    pauseTimer();
    startBreak();
});

clearBtn.addEventListener("click", () => {
    const confirmed = confirm("ต้องการล้างสถิติการพักวันนี้หรือไม่?");

    if (confirmed) {
        localStorage.setItem("studyBreakDate",
            new Date().toLocaleDateString("sv-SE"));
        localStorage.setItem("studyBreakCount", "0");
        updateCount();
        statusText.textContent = "ล้างสถิติแล้ว พักสายตากันต่อได้เลย";
    }
});

showTime();
updateCount();
