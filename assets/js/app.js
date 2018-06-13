let letters = ['A', 'B', 'C', 'D', 'E'];
let currentQuestion;
let correct = null;
let score, runningScore = 0;
let questionsAnswered;
let questionTimer;
let quizContainer = $('.quizContainer');
let counterId;
let counter;
let triviaCompleted, questionQty = 10, difficulty;
let queryURL;

function start() {
    quizContainer.empty();
    if(runningScore >= 1) {
        quizContainer.append($('<button>').addClass('startGame').text('Continue'));
    }
    $('.counter').empty();
    quizContainer.append($('<button>').addClass('startOver').text('New Game'))
    addDifficulty();
    currentQuestion = 0;
    questionsAnswered = 0;
    score = 0;
    console.log($('.difficulty').val())
   
}
function addDifficulty(){
    var myOptions = {
        easy : 'Easy',
        medium : 'Medium',
        hard : 'Hard',
        any : 'Any'

    };
    let selectArea = $('<select>').addClass('difficulty');
    quizContainer.append(selectArea);
    $.each(myOptions, function(val, text) {
        selectArea.append($('<option>').val(val).html(text));
    });

}

function getQuestion() {
    if(!difficulty || difficulty === 'any') {
        queryUrl = `https://opentdb.com/api.php?amount=1`
    } else {
        queryURL = `https://opentdb.com/api.php?amount=1&difficulty=${difficulty}`;
    }
    if(questionsAnswered >= questionQty){
        start();
        return
    }

    $.ajax({url: queryURL, method: 'GET'})
        .then( response => {
            showQuestion(response.results[0]);
        });
}
function runCounter() {
    counter = 10;
    let counterDiv = $('.counter').html(`Time Left: ${counter}`);
    counterId = setInterval(function() {
        counter--;
        console.log(`Time Left: ${counter}`)
        counterDiv.html(`Time Left: ${counter}`);
    }, 1000);
}

function showQuestion(res) {
    clearTimeout(questionTimer)
    runCounter()

    questionTimer = setTimeout(function() {
        clearInterval(counterId);
        checkAnswer();
    }, 10000);
    currentQuestion++;
    $('#currentQuestion').text(`Current Question: ${currentQuestion} / 10`)
    // console.log(res)
    correct = res.correct_answer;
    let unshuffled = [...res.incorrect_answers, res.correct_answer];
    let answers = shuffle(unshuffled);
    let answerList = $('<ul>')
    // console.log(answers)
    quizContainer.empty().text(`Score: ${runningScore}`)
        .append($('<p>').addClass('question').html(res.question))
        .append(answerList)
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
    
    if(!answer) {
        console.log('Times up!');
    }
    if(answer === correct) {
        score++;
        runningScore++;
        $('.counter').empty();
        quizContainer.html('Correct!' + answer);
        
    }else{
        quizContainer.html('Wrong! The answer is ' + correct);
    }
    questionsAnswered++;
    setTimeout(getQuestion, 2500);
}
$(document).on('click', '.startGame', function() {
    getQuestion();
    difficulty = $('.difficulty').val();
    console.log(difficulty)
});
$(document).on('click', '.startOver', function() {
    difficulty = $('.difficulty').val();
    runningScore = 0;
    getQuestion();
})
$(document).on('click', '.answers', function() {
    checkAnswer($(this).attr('data-answer')) 
});

start();