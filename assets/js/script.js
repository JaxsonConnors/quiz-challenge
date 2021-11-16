let initialTime = 60;
let time = 60;
let score = 0;
let quizCount = 0;
let setTime;
let answers = document.querySelectorAll('#quizHolder button');
let clock;
let recordsArray = [];


const questions = [
  {
      title: "The Answer is 1",
      choices: ["1", "2", "3", "4"],
      answer: "1"
  },
  {
      title: "The Answer is 2",
      choices: ["1", "2", "3", "4"],
      answer: "2"
  },
  {
      title: "The Answer is 3",
      choices: ["1", "2", "3", "4"],
      answer: "3"
  },
  {
      title: "The Answer is 4",
      choices: ["1", "2", "3", "4"],
      answer: "4"
  },
  {
      title: "The Answer is 1",
      choices: ["1", "2", "3", "4"],
      answer: "1"
  },
  {
      title: "The Answer is 2",
      choices: ["1", "2", "3", "4"],
      answer: "2"
  },
  {
      title: "The Answer is 3",
      choices: ["1", "2", "3", "4"],
      answer: "3"
  },
  {
      title: "The Answer is 4",
      choices: ["1", "2", "3", "4"],
      answer: "4"
  }
];

let userScores = []


const pageContentEl = function(element) {
	return document.querySelector(element);
};

const myTimer = function() {
	if (time > 0) {
		time = time - 1;
		pageContentEl('#time').innerHTML = time;
	} else {
		clearInterval(clock);
		pageContentEl('#score').innerHTML = score;
		onlyDisplaySection("#finish");
	}
};


const onlyDisplaySection = function(element) {
	let sections = document.querySelectorAll("section");
	Array.from(sections).forEach(function(userItem) {
		userItem.classList.add('hide');
	});
	pageContentEl(element).classList.remove('hide');
};

const quizUpdate = function(answerCopy) {
	pageContentEl('#scoreAlert p').innerHTML = answerCopy;
	pageContentEl('#scoreAlert').classList.remove('invisible', scoreAlert());
	Array.from(answers).forEach(answer =>
	{
		answer.classList.add('disable');
	});

	setTimeout(function() {
		if (quizCount === questions.length) {
			onlyDisplaySection("#finish");
			time = 0;
			pageContentEl('#time').innerHTML = time;
		} else {
			setQuestionData();
			Array.from(answers).forEach(answer => {
				answer.classList.remove('disable');
			});
		}
	}, 1000);
};


const setQuestionData = function() {
	pageContentEl('#quizHolder p').innerHTML = questions[quizCount].title;
	pageContentEl('#quizHolder button:nth-of-type(1)').innerHTML = `1. ${questions[quizCount].choices[0]}`;
	pageContentEl('#quizHolder button:nth-of-type(2)').innerHTML = `2. ${questions[quizCount].choices[1]}`;
	pageContentEl('#quizHolder button:nth-of-type(3)').innerHTML = `3. ${questions[quizCount].choices[2]}`;
	pageContentEl('#quizHolder button:nth-of-type(4)').innerHTML = `4. ${questions[quizCount].choices[3]}`;
};

const scoreAlert = function() {
	clearTimeout(setTime);
	setTime = setTimeout(function() {
		pageContentEl('#scoreAlert').classList.add('invisible');
	}, 1000);
};

const errorAlert = function() {
	clearTimeout(setTime);
	setTime = setTimeout(function() {
		pageContentEl('#errorAlert').classList.add('invisible');
	}, 3000);
};

const enterInitials = function() {
	let initialsRecord = pageContentEl('#initials').value;
	if (initialsRecord === ''){
		pageContentEl('#errorAlert p').innerHTML = "You need at least 1 character";
		pageContentEl('#errorAlert').classList.remove('invisible', errorAlert());
	} else if (initialsRecord.match(/[[A-Za-z]/) === null) {
		pageContentEl('#errorAlert p').innerHTML = "Only letters for initials allowed.";
		pageContentEl('#errorAlert').classList.remove('invisible', errorAlert());
	} else if (initialsRecord.length > 5) {
		pageContentEl('#errorAlert p').innerHTML = "Maximum of 5 characters allowed.";
		pageContentEl('#errorAlert').classList.remove('invisible', errorAlert());
	} else {
		recordsArray.push({
			"initialRecord": initialsRecord,
			"score": score
		});
		
		localStorage.setItem('recordsArray', JSON.stringify(recordsArray));
		pageContentEl('#highScores div').innerHTML = '';
		onlyDisplaySection("#highScores");
		recordsHtmlReset();
		pageContentEl("#initials").value = '';
		}
};

const clearHighScores = function () {
	recordsArray = [];
	pageContentEl('#highScores div').innerHTML = "";
	localStorage.removeItem('recordsArray');
};

const quizReset = function () {
	time = initialTime;
	score = 0;
	quizCount = 0;
	onlyDisplaySection("#intro");
};

const startQuiz = function () {
    setQuestionData();
	onlyDisplaySection("#quizHolder");
	clock = setInterval(myTimer, 1000);
};

const viewHighScores = function (e) {
	e.preventDefault();
	clearInterval(clock);
	pageContentEl('#time').innerHTML = 0;
	time = initialTime;
	score = 0;
	quizCount = 0;
	onlyDisplaySection("#highScores");
	recordsHtmlReset();
};

const scoreTimeAdjust = function () {
	if (this.innerHTML.substring(3, this.length) === questions[quizCount].answer) {
		score = score + 1;
		quizCount = quizCount + 1;
		quizUpdate("Correct");
	}else{
		time = time - 5;
		quizCount = quizCount + 1;
		quizUpdate("Incorrect");
	}
};


const recordsHtmlReset = function() {
	pageContentEl('#highScores div').innerHTML = "";
	let i = 1;
	recordsArray.sort((a, b) => b.score - a.score);
	Array.from(recordsArray).forEach(check =>
	{
		const scores = document.createElement("div");
		scores.innerHTML = i + ". " + check.initialRecord + " - " + check.score;
		pageContentEl('#highScores div').appendChild(scores);
		i = i + 1;
	});
	i = 0;
	Array.from(answers).forEach(answer => {
		answer.classList.remove('disable');
	});
};


(localStorage.getItem('recordsArray')) ? recordsArray = JSON.parse(localStorage.getItem('recordsArray')): recordsArray = [];

Array.from(answers).forEach(check => {check.addEventListener('click', scoreTimeAdjust);});

pageContentEl("#intro button").addEventListener("click", startQuiz);

pageContentEl("#records button").addEventListener("click", enterInitials);

pageContentEl("#clearScores").addEventListener("click", clearHighScores);

pageContentEl("#reset").addEventListener("click", quizReset);

pageContentEl("#scores").addEventListener("click", viewHighScores);