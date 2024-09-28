let queCount = document.querySelector(".que-count span");
let bullets = document.querySelector(".bullets")
let bulletsOutSpan = document.querySelector(".bullets .spans");
let queArea = document.querySelector(".que-area");
let answerArea = document.querySelector(".answer-area");
let submit = document.querySelector(".submit-button");
let countDownEle = document.querySelector(".countdown");
let results = document.querySelector(".result");

// Set Global Variables
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;

// Getting JSON File
function getRequest() {
    fetch("html_questions.json")
        .then(value => {
            if (value.ok)
                return value.json();
        })
        .then(value => {
            let qNum = value.length;
            createBullets(qNum);

            addQuestionArea(value[currentIndex], qNum);

            countdown(130, qNum);

            submit.onclick = function () {
                let theRightAnswer = value[currentIndex].right_answer;
                currentIndex++;

                checkAnswer(theRightAnswer, qNum);

                queArea.innerHTML = '';
                answerArea.innerHTML = '';
                addQuestionArea(value[currentIndex], qNum);

                handleBullet();

                clearInterval(countdownInterval);
                countdown(130, qNum);

                showResults(qNum);
            }
        }
        );
}

getRequest();

// Creating Span bullets 
function createBullets(num) {
    queCount.innerHTML = num;

    for (let i = 0; i < num; i++) {
        let bulletsInSpan = document.createElement("span");

        if (i === 0) {
            bulletsInSpan.classList.add("on");
        }

        bulletsOutSpan.append(bulletsInSpan);
    }
}

// Creating Question Area
function addQuestionArea(obj, count) {
    if (currentIndex < count) {
        let queTitle = document.createElement("div");
        queTitle.innerHTML = obj.title;
        queArea.append(queTitle);

        for (let i = 1; i <= 4; i++) {
            let answerDiv = document.createElement("div");
            answerDiv.classList.add("answer");

            let radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "answer-que";
            radio.id = `answer_${i}`;
            radio.dataset.answer = obj[`answer_${i}`];

            let label = document.createElement("label");
            label.innerHTML = obj[`answer_${i}`]
            label.htmlFor = `answer_${i}`;

            answerDiv.append(radio, label);
            answerArea.append(answerDiv);
        }
    }
}

// Getting The Right Answer
function checkAnswer(rAnswer, count) {
    let choosenAnswer;
    let allAnswer = document.getElementsByName("answer-que");

    for (let i = 0; i < allAnswer.length; i++) {
        if (allAnswer[i].checked) {
            choosenAnswer = allAnswer[i].dataset.answer;
        }
    }
    if (rAnswer === choosenAnswer) {
        rightAnswer++;
    }
}

// Handle The Bulttets
function handleBullet() {
    let allBulletSpans = document.querySelectorAll(".bullets .spans span");

    allBulletSpans.forEach((ele, index) => {
        if (index === currentIndex) {
            ele.classList.add("on");
        }
    })
}

// Show Result
function showResults(count) {
    if (currentIndex === count) {
        let theResult;
        queArea.remove();
        answerArea.remove();
        submit.remove();
        bullets.remove();
        if (rightAnswer >= count / 2 && rightAnswer < count) {
            theResult = `<span class="good">Good,</span> you got ${rightAnswer} of ${count}`
        }
        else if (rightAnswer === count) {
            theResult = `<span class="perfect">Perfect,</span> you got ${rightAnswer} of ${count}`
        }
        else if (rightAnswer < count / 2) {
            theResult = `<span class="bad">Bad,</span> you got ${rightAnswer} of ${count}`
        }
        results.innerHTML = theResult;
        results.style.cssText = "background-color:white;padding:10px";
    }
}

// Creating CountDown Timer
function countdown(duration, count) {
    if (currentIndex < count) {
        let min, sec;

        countdownInterval = setInterval(() => {

            min = parseInt(duration / 60);
            sec = parseInt(duration % 60);

            min = min < 10 ? `0${min}` : min;
            sec = sec < 10 ? `0${sec}` : sec;

            countDownEle.innerHTML = `${min}:${sec}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submit.click();
            }

        }, 1000)
    }
}