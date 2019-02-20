let letters = ['A', 'B', 'C', 'D', 'E'];
let correct = null;
let score, runningScore = 0;
let currentQuestion, questionsAnswered=8;
let quizContainer = $('.quizContainer');
let questionTimer, counterId, counter;
let triviaCompleted = 0, questionQty = 10, difficulty;
let queryURL;

function start() {
    quizContainer.empty();
    if(runningScore > 0 || triviaCompleted > 0) {
        quizContainer.append($('<p>').addClass('statusText').html(`Correct Answers: ${score} <br>Incorect Answers: ${questionQty - score}`))
        quizContainer.append($('<button>').addClass('startGame').text('Continue'));
    }
    $('.counter').empty();
    quizContainer.append($('<button>').addClass('startOver').text('New Game'))
    addDifficulty();
    currentQuestion = 0;
    questionsAnswered = 0;
    score = 0;
   
}
function addDifficulty(){
    let myOptions = {
        any : 'Any',
        easy : 'Easy',
        medium : 'Medium',
        hard : 'Hard'
    };
    let selectArea = $('<select>').addClass('difficulty');
    quizContainer.append(selectArea);
    $.each(myOptions, function(val, text) {
        selectArea.append($('<option>').val(val).html(text));
    });

}

function getQuestion() {
    if(!difficulty || difficulty === 'any') {
        queryURL = `https://opentdb.com/api.php?amount=1`
    } else {
        queryURL = `https://opentdb.com/api.php?amount=1&difficulty=${difficulty}`;
    }
    // console.log(queryURL)
    if(questionsAnswered >= questionQty) {
        triviaCompleted++;
        start();
        return
    }

    const options = {
        url: queryURL,
        method: 'GET'
    };

    $.ajax(options)
        .then( response => {
            // console.log(response)
            showQuestion(response.results[0]);
        })
        .catch(err => console.log(`Error: ${err}`));
}
function runCounter() {
    clearInterval(counterId);
    counter = 10;
    let counterDiv = $('.counter').html(`Time Left: ${counter}`);
    counterId = setInterval(function() {
        if(counter < 0) {
            counter = 10;
            clearInterval(counterId)
        }
        counter--;
        // console.log(`Time Left: ${counter}`)
        counterDiv.html(`Time Left: ${counter}`);
    }, 1000);
}

function showQuestion(res) {
    clearTimeout(questionTimer)
    runCounter()

    questionTimer = setTimeout(function() {
        clearInterval(counterId);
        checkAnswer('TIME-UP');
    }, 10000);
    currentQuestion++;
    $('#currentQuestion').text(`Current Question: ${currentQuestion} / 10`);
    // console.log(res)
    correct = res.correct_answer;
    let unshuffled = [...res.incorrect_answers, res.correct_answer];
    let answers = shuffle(unshuffled);
    let answerList = $('<ul>');
    // console.log(answers)
    quizContainer.empty().text(`Score: ${runningScore}`)
        .append($('<p>').text(`Trivia Completed: ${triviaCompleted}`))
        .append($('<p>').addClass('question').html(res.question))
        .append(answerList);
    for(let i = 0; i < answers.length; i++) {
        answerList.append($('<li>')
            .addClass('answers').attr('data-answer', answers[i])
            .html(`${letters[i]}. ${answers[i]}`));
    }
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function checkAnswer(answer) {
    clearTimeout(questionTimer);
    clearInterval(counterId);
    // console.log(answer)
    quizContainer.empty();
    $('.counter').empty();
    let statusText = $('<p>').addClass('statusText').empty();
    questionsAnswered++;
    setTimeout(getQuestion, 2500);
    if(answer === 'TIME-UP') {
        // console.log('Times up!');
        quizContainer.append(statusText.html(`Times up! The correct answer was ${correct}.`));
        return
    }
    if(answer === correct) {
        score++;
        runningScore++;
        quizContainer.append(statusText.html(`Correct! ${answer}`));   
    }else{
        quizContainer.append(statusText.html(`Wrong! The correct answer was ${correct}.`));
    } 
}
$(document).on('click', '.startGame', function() {
    getQuestion();
    difficulty = $('.difficulty').val();
    
});
$(document).on('click', '.startOver', function() {
    difficulty = $('.difficulty').val();
    triviaCompleted = 0;
    runningScore = 0;
    getQuestion();
})
$(document).on('click', '.answers', function() {
    checkAnswer($(this).attr('data-answer')) 
});

start();