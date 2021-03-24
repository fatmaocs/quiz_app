//Main variables 

let category_container = document.querySelector('.category');
let no_questions_container = document.querySelector('.count');

let quiz_container = document.querySelector('.quiz_container');
let img_container = document.querySelector('.img_container');

let bullets_container = document.querySelector('span.bullets');

let quiz_area = document.querySelector('.quiz_area');
let answers_container = document.querySelector('.answers');

let image_span = document.querySelector('.image');
let result = document.querySelector('.result');

let submit_button = document.querySelector('.submit_button');

let timer = document.querySelector('.count_down');


let countdownInterval;

let currentIndex = 0;
let correct_answers = 0;

document.addEventListener('click', function (e) {
    if (e.target.className == 'image') {
        get_questions_by_category(e.target.dataset.category);
    }
});

function get_questions_by_category(category) {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            img_container.style.display = "none";
            quiz_container.style.display = "block";

            let questionsObject = JSON.parse(this.responseText);
            let no_questions = questionsObject.length;

            no_questions_container.innerHTML = no_questions;
            category_container.innerHTML = category.toUpperCase();

            //set count down 
            count_down(5, no_questions);

            //create bulletes 
            create_bullets(no_questions);

            //add_questions_data
            add_questions_data(questionsObject[currentIndex], no_questions);

            //Submit button 
            submit_button.addEventListener('click', () => {

                check_answer(questionsObject[currentIndex]);

                check_bullet();

                currentIndex++;

                document.querySelector('.question').remove();
                answers_container.innerHTML = "";
                add_questions_data(questionsObject[currentIndex], no_questions);

                clearInterval(countdownInterval);
                count_down(5, no_questions);

            });

        }
    }

    if (category == "html") { request.open("get", "HTML_questions.json", true); }

    else if (category == "css") { request.open("get", "CSS_questions.json", true); }

    else { request.open("get", "JS_questions.json", true); }

    request.send();
}

function create_bullets(no_questions) {

    for (let index = 0; index < no_questions; index++) {
        let bullet = document.createElement('span');

        if (index === 0) {
            bullet.classList.add("on");
        }

        bullets_container.appendChild(bullet);

    }

}

function add_questions_data(object, no_questions) {

    if (currentIndex < no_questions) {

        //add answers of question
        let answers = object.answers;
        no_answers = Object.keys(answers).length;

        for (const key in answers) {

            let answer_div = document.createElement('div');
            answer_div.className = "answer";

            let radio_input = document.createElement('input');
            radio_input.name = "answer";
            radio_input.type = "radio";
            radio_input.id = currentIndex + '_' + key;
            radio_input.dataset.answer = key;
            radio_input.value = answers[key];


            //make first answer checked
            if (key == "a") {
                radio_input.checked = true;
            }

            let label = document.createElement('label');
            label.htmlFor = currentIndex + '_' + key;
            label.textContent = answers[key];

            answers_container.appendChild(answer_div);

            answer_div.appendChild(radio_input);
            answer_div.appendChild(label);

        }

        //add question text 

        let question = document.createElement("div");
        question.className = "question";
        question.textContent = object.question;
        quiz_area.insertBefore(question, answers_container);

    }


}

function check_answer(object) {

    let correct = object.correct_answer;
    answers = document.getElementsByName('answer');
    let checked_answer;


    for (const iterator of answers) {


        if (iterator.checked) {

            checked_answer = iterator.dataset.answer;
        }

    }

    if (correct == checked_answer) {
        correct_answers++;
    }

    //Add result to result sheet 

    parent_div = document.createElement('div');
    parent_div.className = "result_area";

    q_div = document.createElement('div');
    q_div.className = "content";
    q_div.textContent = object.question;

    parent_div.appendChild(q_div);

    s_div = document.createElement('div');
    s_div.className = "content";
    s_div.textContent = object.answers[checked_answer];

    parent_div.appendChild(s_div);

    c_div = document.createElement('div');
    c_div.className = "content";
    c_div.textContent = object.answers[correct];

    parent_div.appendChild(c_div);
    result.appendChild(parent_div);


    if (currentIndex == 9) {


        let final_result = document.createElement('div');
        final_result.className = "final_result";
        final_result.innerHTML = `Your Correct Answers ${correct_answers} of 10 Questions `;

        result.appendChild(final_result);
        result.style.display = "block";
        quiz_container.style.display = "none";
    }

}

function check_bullet() {

    let bullet_spans = document.querySelectorAll('.bullets span');

    bullet_spans.forEach((element, index) => {
        if (index <= currentIndex) {
            element.className = "on";
        }
    });
}

function count_down(duration, count) {

    if (currentIndex < count) {
        let mins, sec;

        countdownInterval = setInterval(() => {

            mins = parseInt(duration / 60);
            sec = parseInt(duration % 60);

            mins = (mins < 10 ? `0${mins}` : mins);
            sec = (sec < 10 ? `0${sec}` : sec);

            timer.innerHTML = `${mins} : ${sec} `;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submit_button.click();
            }

        }, 1000);
    }
}