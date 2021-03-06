const params = parse_params();

const QUESTIONS = JSON.parse(params['questions'] || '[]');
const ANSWERS = JSON.parse(params['answers'] || '[]');
const LETTERS = JSON.parse(params['letters'] || '[]');

const FIRST_CIRCLE_ANGLE = -45;
const STARTING_ANGLE = FIRST_CIRCLE_ANGLE - 90;
let speed = 0.08;

let disableInput;
let enableInput;
let setScoreString;
let setQuestionString;
let showResults;
let hideResults;
let clearInput;
let setCircleBackgroundColor;
let hideCircles;
let getAnswerValue;
let addInputListener;
let removeInputListeners;
let setCircleBackgroundColorForAnswer;
let setCircleBackgroundColorToActiveFromIncomplete;

let num_questions;

function angleOf(i, num_questions) {
    return FIRST_CIRCLE_ANGLE + 360/num_questions * i++;
}

function addCurrentLetters() {
    const ruleta = document.querySelector('.ruleta');

    function append_circ(text, fragment) {
        const circ = document.createElement('div');
        circ.classList.add('circ');
        circ.textContent = text;
        fragment.appendChild(circ);
    }

    const fragment = document.createDocumentFragment();

    for (c of LETTERS) {
        append_circ(c, fragment);
    }

    ruleta.appendChild(fragment);
}

function redirectToEditor() {
    window.location.href = `editor.html${window.location.search}`;
}

function onload() {
    addCurrentLetters();

    const circs = document.getElementsByClassName('circ');  
    num_questions = Math.min(circs.length, LETTERS.length, QUESTIONS.length, ANSWERS.length);
    
    const question_div = document.getElementById('question');
    
    const check_button = document.getElementById('check-button');
    const answer_input = document.getElementById('answer');
    const result_div = document.querySelector('.result');
    const score_element = document.getElementById('score');

    const edit_button = document.getElementById('edit-button');
    edit_button.addEventListener('click', ev => redirectToEditor());
    
    disableInput = function () {
        answer_input.disabled = true;
        check_button.disabled = true;
    }
    
    enableInput = function () {
        answer_input.disabled = false;
        check_button.disabled = false;
    }
    
    setScoreString = function (text) {
        score_element.textContent = text;
    }
    
    setQuestionString = function (text) {
        question_div.textContent = text;
    }
    
    showResults = function () {
        result_div.classList.remove('hidden');
    }
    
    hideResults = function () {
        result_div.classList.add('hidden');
    }
    
    runAngleAnimationStep = function (angle) {
        let i = 0;
        for (circ of circs) {
            const final_angle = angleOf(i++, num_questions);
            const current_angle = Math.min(angle, final_angle);
            circ.classList.add('atomic-opacity--1');

            circ.style.setProperty('--rotation-angle', `${current_angle}deg`);
    
            if (current_angle != final_angle) {
                break;
            }
        }
    }
    
    clearInput = function () {
        answer_input.value = '';
    }
    
    setCircleBackgroundColorForAnswer = function (circle_idx, color_css) {
        const circ = circs[circle_idx];

        circ.classList.remove('atomic-background-color--var--circ-active-color');
        circ.classList.add(`atomic-background-color--${color_css}`);
    }

    setCircleBackgroundColorToActiveFromIncomplete = function (circle_idx, color_css) {
        const circ = circs[circle_idx];

        circ.classList.remove('atomic-background-color--var--circ-incomplete-color');
        circ.classList.add('atomic-background-color--var--circ-active-color');
    }

    setCircleBackgroundColor = function (circle_idx, color_css) {
        const circ = circs[circle_idx];

        circ.classList.remove('atomic-background-color--var--circ-complete-correct-color');
        circ.classList.remove('atomic-background-color--var--circ-complete-incorrect-color');
        circ.classList.remove('atomic-background-color--var--circ-incomplete-color');
        circ.classList.remove('atomic-background-color--var--circ-active-color');

        circ.classList.add(`atomic-background-color--${color_css}`);
    }
    
    hideCircles = function () {
        for (circ of circs) {
            circ.classList.remove('atomic-opacity--1');

            circ.classList.remove('atomic-background-color--var--circ-active-color');
            circ.classList.remove('atomic-background-color--var--circ-complete-correct-color');
            circ.classList.remove('atomic-background-color--var--circ-complete-incorrect-color');

            circ.classList.add('atomic-background-color--var--circ-incomplete-color');
        }
    }
    
    getAnswerValue = function () {
        return answer_input.value;
    }

    addInputListener = function (func) {
        createEventListener(check_button, 'click', ev => func());
        createEventListener(answer_input, 'keydown', ev => {
            const ENTER_KEYCODE = 13;
            if (ev.keyCode == ENTER_KEYCODE) {
                func();
            }
        });
    }

    removeInputListeners = removeEventListeners;

    speed = 0.1;
    startGame();
}

function setQuestion(question_idx) {
    setQuestionString(QUESTIONS[question_idx]);
    setCircleBackgroundColorToActiveFromIncomplete(question_idx);
}

let question_idx = 0;
let num_correct_answer = 0;

function gameover() {
    setScoreString(`${num_correct_answer}/${num_questions}`);
    showResults();
    removeInputListeners();
    disableInput();
}

function checkAnswer() {
    const answer_value = getAnswerValue();
    const is_correct = answer_value.toLowerCase() == ANSWERS[question_idx].toLowerCase();

    num_correct_answer += is_correct;
    const color = is_correct ? 'var--circ-complete-correct-color' : 'var--circ-complete-incorrect-color';

    setCircleBackgroundColorForAnswer(question_idx, color);
    clearInput();

    if (question_idx == num_questions - 1) {
        gameover();
    } else {
        setQuestion(question_idx += 1);
    }
}

function resetState() {
    removeInputListeners();

    num_correct_answer = 0;
    question_idx = 0;

    disableInput();
    hideResults();

    setQuestionString('Pregunta:');
    
    hideCircles();
}

function startGame() {
    resetState();

    let angle = STARTING_ANGLE;
    const interval = setInterval(() => {
        runAngleAnimationStep(angle += 1.0);
        if (angle >= angleOf(num_questions-1, num_questions)) {
            clearInterval(interval);
            addInputListener(checkAnswer);
            if (num_questions > 0) {
                setQuestion(0);
            }
            enableInput();
        }
    }, 1/speed);
}

window.addEventListener('load', ev =>  onload());