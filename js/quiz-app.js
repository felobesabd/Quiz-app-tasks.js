// Select Elements
let countSpan = document.querySelector('.count span'),
    bulletSpan = document.querySelector('.bullets .spans'),
    bullets = document.querySelector('.bullets'),
    quizArea = document.querySelector('.quiz-area'),
    answerArea =  document.querySelector('.answer-area'),
    submitButtons =  document.querySelector('.submit-buttons'),
    nextButton = document.getElementById('next'),
    prevButton = document.getElementById('prev'),
    countdown =  document.querySelector('.countdown'),
    results =  document.querySelector('.results');
// Set Options
let currentIndex = 0,
    theRightAnswer = 0,
    countdownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionscount = questionsObject.length;
            counterSpan(questionscount);
            // Add Question Data
            addQuestion(questionsObject[currentIndex], questionscount)
            // function Count Down
            // counterdown(150, questionscount)
            // Clicked Submit Buttons
            submitButtons.onclick = () => {
                // Set Right Answer
                let rightAnswer = questionsObject[currentIndex].right_answer;
                // Increase Current Index
                currentIndex++;
                // Function Check Right Answer
                checkRightAnswer(rightAnswer, questionscount);
                // Empty Prev Quiz Area And Answer Area
                quizArea.innerHTML = '';
                answerArea.innerHTML = '';
                // Add Question Data
                addQuestion(questionsObject[currentIndex], questionscount);
                // function Add class 'on' On All Spans
                handlespans();
                // Function Results
                showResults(questionscount)
                // // function Count Down
                // clearInterval(countdownInterval)
                // counterdown(150, questionscount)
                // function Next Button
                // next(questionscount)
                // document.addEventListener('click', function (e) {
                //     if (e.target.className === 'next') {
                //         currentIndex++;
                //     }
                // })
            };
            nextButton.onclick = function () {
                if (currentIndex === questionscount - 1) {
                    nextButton.classList.add('disabled')
                } else {
                    nextButton.classList.remove('disabled');
                    // Set Right Answer
                    let rightAnswer = questionsObject[currentIndex].right_answer
                    // Increase Current Index
                    currentIndex++;
                    // Function Check Right Answer
                    checkRightAnswer(rightAnswer, questionscount);
                    // Empty Prev Quiz Area And Answer Area
                    quizArea.innerHTML = '';
                    answerArea.innerHTML = '';
                    // Add Question Data
                    addQuestion(questionsObject[currentIndex], questionscount)
                    // function Add class 'on' On All Spans
                    handlespans()
                }
            }
            prevButton.onclick = function () {
                if (currentIndex === 0) {
                    prevButton.classList.add('disabled')
                }
                else {
                    prevButton.classList.remove('disabled');
                    // Increase Current Index
                    currentIndex--;
                    // Empty Prev Quiz Area And Answer Area
                    quizArea.innerHTML = '';
                    answerArea.innerHTML = '';
                    // Add Question Data
                    addQuestion(questionsObject[currentIndex], questionscount)
                    // function Add class 'on' On All Spans
                    removeOnspans()

                }
            }
        }
    };

    myRequest.open("GET", "html-questions.json", true);
    myRequest.send();
}
getQuestions();
function counterSpan(num) {
    // Add Value To Count Span
    countSpan.innerHTML = num;
    // Add Spans To Bullets Spans
    for (let i =0; i < num; i++) {
        // Create New Span
        let newSpan = document.createElement('span')
        // Add Class On To New Span
        if (i === 0) {
            // Add Class On
            newSpan.classList.add('on')
        }
        // Append New Span To Bullets Spans
        bulletSpan.appendChild(newSpan)
    }
}
function addQuestion(obj, count) {
    if (currentIndex < count) {
        // Create H2
        let h2 = document.createElement('h2'),
            h2Text = document.createTextNode(obj.title);
        // Append h2 Text To H2
        h2.appendChild(h2Text);
        // Append h2 To Quiz Area
        quizArea.appendChild(h2);
        // Create Answers
        for (let i = 1; i <= 4; i++) {
            // Create New Div
            let divAnswer = document.createElement('div')
            divAnswer.classList.add('answer')
            // Create Input
            let input = document.createElement('input')
            // Add Type + Name + Id + Data-Attribute To Input
            input.type = 'radio';
            input.name = 'question';
            input.id = `answer_${i}`;
            input.dataset.answer = obj[`answer_${i}`]
            // Add Checked To First Input
            if (i === 1) {
                input.checked = true;
            }
            // Create Label
            let label = document.createElement('label'),
                labelText = document.createTextNode(obj[`answer_${i}`])
            label.htmlFor = `answer_${i}`
            // Append label Text To label
            label.appendChild(labelText)
            // Append Input + Label To Div Answer
            divAnswer.appendChild(input)
            divAnswer.appendChild(label)
            // Append Div Answer To Answers Area
            answerArea.appendChild(divAnswer)
        }
    }
}
function checkRightAnswer(rAnswer, count) {
    let answers = document.getElementsByName('question'),
        choosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            choosenAnswer = answers[i].dataset.answer
        }
    }
    // console.log(rAnswer)
    // console.log(choosenAnswer)
    if (rAnswer === choosenAnswer) {
        theRightAnswer++;
    }
}

function handlespans() {
    let allSpansbullets = document.querySelectorAll('.bullets .spans span'),
    arraySpansbullets = Array.from(allSpansbullets);
    arraySpansbullets.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'on'
        }
    })
}
function removeOnspans() {
    let allSpansbullets = document.querySelectorAll('.bullets .spans span'),
        arraySpansbullets = Array.from(allSpansbullets);
    arraySpansbullets.forEach((span, index) => {
        if (currentIndex === index -1) {
            span.classList.remove('on')
        }
    })
}
function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitButtons.remove();
        bullets.remove();
        if (theRightAnswer > (count / 2) && theRightAnswer < count) {
            theResults = `<span class="good">Good</span> ${theRightAnswer}:${count}`
        }else if (theRightAnswer === count) {
            theResults = `<span class="perfect">Perfect</span> ${theRightAnswer}:${count}`
        } else {
            theResults = `<span class="bad">Bad</span> ${theRightAnswer}:${count}`
        }
        results.innerHTML = theResults;
    }
}

function counterdown(duration, count) {
    if (currentIndex === count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdown.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButtons.click();
            }
        }, 1000);
    }
}
// next prev slide
// nextButton.onclick = function () {
//     submitButtons.click();
//     if (currentIndex === 8) {
//         nextButton.classList.add('disabled')
//     }
// }
// document.addEventListener('click', function (e) {
//     if (e.target.className === 'next') {
//         currentIndex++;
//         addQuestion()
//     }
// })
// function next(count) {
//     if (currentIndex < count) {
//         nextButton.classList.add('disabled')
//     }
// }
/*
// next prev slide
var nextButton = document.getElementById('next')
var prevButton = document.getElementById('prev')
000000000000000000000000000000000000000000000000000000
// Next Slide Function
function nextslide(r) {
    if (nextButton.classList.contains('disabled')) {
        r = '';
    }else {
        currentSlide++;
        addActive()
    }
}
// prev Slide Function
function prevslide(r) {
    if (prevButton.classList.contains('disabled')) {
        r = '';
    }else {
        currentSlide--;
        addActive()
    }
}
000000000000000000000000000000000000000000000000000
    // Add Class Disabled To Button Prev
    if (currentSlide === 1) {
        prevButton.classList.add('disabled')
    } else {
        prevButton.classList.remove('disabled')
    }
    // Add Class Disabled To Button next
    if (currentSlide === sliderNum) {
        nextButton.classList.add('disabled')
    } else {
        nextButton.classList.remove('disabled')
    }
    0000000000000000000000000000000000000000000
*/



















