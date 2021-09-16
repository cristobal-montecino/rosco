const params = parse_params();

const QUESTIONS = JSON.parse(params['questions'] || '[]');
const ANSWERS = JSON.parse(params['answers'] || '[]');
const LETTERS = JSON.parse(params['letters'] || '[]');

function redirectToGame(letters, questions, answers) {
    url = `game.html?letters=${encode_base64(JSON.stringify(letters))}&questions=${encode_base64(JSON.stringify(questions))}&answers=${encode_base64(JSON.stringify(answers))}`;
    window.location.href = url;
}

function onload() {
    const num_questions = Math.min(LETTERS.length, ANSWERS.length, QUESTIONS.length);

    const input_holder = document.querySelector('.input-holder');

    function add_row() {
        const fragment = document.createDocumentFragment();

        const row_div = document.createElement('div');
        
        const letter_input = document.createElement('input');
        letter_input.setAttribute('type', 'text');
        letter_input.classList.add('letter-input');
        letter_input.placeholder = 'letter';

        const question_input = document.createElement('input');
        question_input.setAttribute('type', 'text');
        question_input.placeholder = 'question';
        question_input.classList.add('question-input');

        const answer_input = document.createElement('input');
        answer_input.setAttribute('type', 'text');
        answer_input.placeholder = 'answer';
        answer_input.classList.add('answer-input');

        const remove_button = document.createElement('button');
        remove_button.textContent = '-';
        remove_button.addEventListener('click', ev => row_div.remove());
        remove_button.classList.add('remove-button');

        fragment.appendChild(row_div);
        row_div.appendChild(letter_input);
        row_div.appendChild(question_input);
        row_div.appendChild(answer_input);
        row_div.appendChild(remove_button);

        input_holder.appendChild(fragment);

        return [letter_input, question_input, answer_input];
    }

    for (let i = 0; i < num_questions; i++) {
        [letter_input, question_input, answer_input] = add_row();

        letter_input.value = LETTERS[i];
        question_input.value = QUESTIONS[i];
        answer_input.value = ANSWERS[i];
    }

    const new_row_button = document.getElementById('new-row-button');
    new_row_button.addEventListener('click', ev => add_row());

    function play() {
        const inputs = input_holder.querySelectorAll('input[type=text]');
        
        const letters = []
        const questions = [];
        const answers = [];

        let current = [];
        let i = 0;

        for (input of inputs) {
            current.push(input.value);

            if (i++ == 2) {
                i = 0;
                letters.push(current[0]);
                questions.push(current[1]);
                answers.push(current[2]);
                current = [];
            }
        }

        redirectToGame(letters, questions, answers);
    }

    const play_button = document.getElementById('play-button');
    play_button.addEventListener('click', ev => play());
}

window.addEventListener('load', ev => onload());