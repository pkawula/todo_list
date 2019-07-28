"use strict";

// service worker registration - remove if you're not going to use it

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('serviceworker.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// place your code below

const allQuests = [];

const quests = document.getElementById('quests-container');

const addQuest = (title, content, questNumber, isDone) => {
    const f = `<div class="single-quest-container quest-${questNumber} ${isDone}">
        <span class="checkbox">
            <input type="checkbox" id="check-${questNumber}" class="check-quest">
            <label for="check-${questNumber}"></label>
        </span>
        <h3 class="title" title="Click to see details">${title}</h3>
        <div class="delete-quest" title="Delete quest"><span>&times;</span></div>
        <p class="details">${content}</p>
        </div>`;
    quests.innerHTML += f;
}

let get = item => JSON.parse(item);
let send = item => JSON.stringify(item);

const existQuests = get(localStorage.getItem('quests'));

const voiceTitle = document.getElementById('voice-title'),
    voiceContent = document.getElementById('voice-content'),
    SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition,
    recognitionTitle = new SpeechRecognition(),
    recognitionContent = new SpeechRecognition();

recognitionTitle.onresult = ev => {
    const currentTitle = ev.resultIndex;
    const transcriptTitle = ev.results[currentTitle][0].transcript;

    questTitle.value = transcriptTitle;
};
recognitionContent.onresult = ev => {
    const currentContent = ev.resultIndex;
    const transcriptContent = ev.results[currentContent][0].transcript;

    questContent.innerText = transcriptContent;
};

voiceTitle.addEventListener('click', () => {
    recognitionTitle.start();
});

voiceContent.addEventListener('click', () => {
    recognitionContent.start();
});

const mainFunctions = () => {
    let deleteQuest = document.querySelectorAll('.delete-quest');
    deleteQuest.forEach(deleteBtn => {
        deleteBtn.addEventListener('click', function () {
            this.parentElement.classList.add('deleted');
            setTimeout(() => {
                this.parentElement.remove();

                const quests = document.querySelectorAll(".single-quest-container");
                let title, desc, id;
                localStorage.clear();
                for (let i = 0; i < quests.length; i++) {
                    title = quests[i].children[1].textContent;
                    desc = quests[i].children[3].textContent;
                    id = i + 1;
                    const quest = {
                        'id': id,
                        'title': title,
                        'content': desc,
                        'checked': false
                    };
                    allQuests.push(quest);

                    localStorage.setItem('quests', send(allQuests));
                };



            }, 400);

        }, false);
    });

    let checkQuest = document.querySelectorAll('.check-quest');
    let questDone;
    let check = element => {
        questDone = setTimeout(() => {
            let getId = element.id.length;
            const eId = element.id.split('-')[1];
            const currentQuests = get(localStorage.getItem('quests'));
            const checkQuest = (elementId) => {
                const isChecked = get(localStorage.getItem('quests'))[elementId - 1].checked;
                const current = currentQuests[elementId - 1];
                const currentTitle = current.title;
                const currentContent = current.content;
                const currentId = current.id;

                if (isChecked === false) {

                    const newState = {
                        'id': currentId,
                        'title': currentTitle,
                        'content': currentContent,
                        'checked': true
                    }

                    currentQuests.splice(eId - 1, 1, newState);

                    localStorage.clear();
                    localStorage.setItem('quests', send(currentQuests));

                } else if (isChecked === true) {

                    const newState = {
                        'id': currentId,
                        'title': currentTitle,
                        'content': currentContent,
                        'checked': false
                    }

                    currentQuests.splice(eId - 1, 1, newState);

                    localStorage.clear();
                    localStorage.setItem('quests', send(currentQuests));

                }
            }
            switch (getId) {
                case 7:
                    checkQuest(eId);
                    break;
                case 8:
                    checkQuest(eId);
                    break;
                case 9:
                    checkQuest(eId);
                    break;
                case 10:
                    checkQuest(eId);
                    break;
            }
            element.parentElement.parentElement.classList.add("done");
            if (element.parentElement.parentElement.classList.contains('opened')) {
                element.parentElement.parentElement.classList.remove("opened");
            }

        }, 700);
    };

    checkQuest.forEach(done => {
        done.addEventListener('click', function () {

            if (this.checked == 1) {
                check(this);
            } else {
                window.clearTimeout(questDone);
                if (this.parentElement.parentElement.classList.contains('done')) {
                    this.parentElement.parentElement.classList.remove("done");
                }
            }
        });
    });

    const reveal = document.querySelectorAll('.single-quest-container');
    reveal.forEach(title => {
        title.addEventListener('click', function () {
            this.classList.toggle('opened');
        });
    });
};

if (existQuests == null) {
    mainFunctions();
} else {
    for (let i = 0; i < existQuests.length; i++) {
        let isDoneOrNot;
        if (existQuests[i].checked === true) {
            isDoneOrNot = 'done';
        } else {
            isDoneOrNot = '';
        };
        addQuest(existQuests[i].title, existQuests[i].content, existQuests[i].id, isDoneOrNot);

        mainFunctions();
    };
}

let questsNum = document.querySelectorAll('.single-quest-container').length + 1;
let questTitle = document.getElementById('quest-title'),
    questContent = document.getElementById('quest-content');

const btn = document.getElementById('btn');
let showMessage = (type, content) => {
    const messageContainer = document.querySelector('.message-container');
    let message = document.createElement('p');
    message.innerHTML = `${content}`;
    message.classList.add('message');
    messageContainer.appendChild(message);
    setTimeout(() => {
        message.classList.add(`${type}`);
    }, 20);
    setTimeout(() => {
        message.classList.remove(`${type}`);
    }, 4700);
    setTimeout(() => {
        message.remove();
    }, 5000);
};

btn.addEventListener('click', (e) => {
    e.preventDefault();

    let questsNum = document.querySelectorAll('.single-quest-container').length + 1;
    let questTitle = document.getElementById('quest-title'),
        questContent = document.getElementById('quest-content');

    if (questTitle.value != '' & questContent.value != '') {

        addQuest(questTitle.value, questContent.value, questsNum);
        let newQuest = {
            'id': questsNum,
            'title': questTitle.value,
            'content': questContent.value,
            'checked': false
        };

        let existingQuests = get(localStorage.getItem('quests'));

        let newQuestsArray = [];
        newQuestsArray.push(newQuest);

        let newQuests = [];

        if (existingQuests !== null) {
            newQuests = [].concat(existingQuests, newQuestsArray);
            localStorage.setItem('quests', send(newQuests));
        } else {
            localStorage.setItem('quests', send(newQuestsArray));
        }

        showMessage('success', 'The quest is added!');

        questTitle.value = '';
        questContent.value = '';

    } else {
        showMessage('error', 'The quest is not added! \n Check the fields!');
    }

    let deleteQuest = document.querySelectorAll('.delete-quest');
    deleteQuest.forEach(deleteBtn => {
        deleteBtn.addEventListener('click', function () {
            this.parentElement.classList.add('deleted');
            setTimeout(() => {
                this.parentElement.remove();

                const quests = document.querySelectorAll(".single-quest-container");
                let title, desc, id;
                localStorage.clear();
                for (let i = 0; i < quests.length; i++) {
                    title = quests[i].children[1].textContent;
                    desc = quests[i].children[3].textContent;
                    id = i + 1;
                    const quest = {
                        'id': id,
                        'title': title,
                        'content': desc,
                        'checked': false
                    };
                    allQuests.push(quest);

                    localStorage.setItem('quests', send(allQuests));
                };
            }, 400);
        }, false);
    });

    let checkQuest = document.querySelectorAll('.check-quest');
    let questDone;
    let check = element => {
        questDone = setTimeout(() => {
            let getId = element.id.length;
            const eId = element.id.split('-')[1];
            const currentQuests = get(localStorage.getItem('quests'));
            const checkQuest = (elementId) => {
                const isChecked = get(localStorage.getItem('quests'))[elementId - 1].checked;
                const current = currentQuests[elementId - 1];
                const currentTitle = current.title;
                const currentContent = current.content;
                const currentId = current.id;

                if (isChecked === false) {

                    const newState = {
                        'id': currentId,
                        'title': currentTitle,
                        'content': currentContent,
                        'checked': true
                    }

                    currentQuests.splice(eId - 1, 1, newState);

                    localStorage.clear();
                    localStorage.setItem('quests', send(currentQuests));

                } else if (isChecked === true) {

                    const newState = {
                        'id': currentId,
                        'title': currentTitle,
                        'content': currentContent,
                        'checked': false
                    }

                    currentQuests.splice(eId - 1, 1, newState);

                    localStorage.clear();
                    localStorage.setItem('quests', send(currentQuests));

                }
            }
            switch (getId) {
                case 7:
                    checkQuest(eId);
                    break;
                case 8:
                    checkQuest(eId);
                    break;
                case 9:
                    checkQuest(eId);
                    break;
                case 10:
                    checkQuest(eId);
                    break;
            }
            element.parentElement.parentElement.classList.add("done");
            if (element.parentElement.parentElement.classList.contains('opened')) {
                element.parentElement.parentElement.classList.remove("opened");
            }

        }, 700);
    };

    checkQuest.forEach(done => {
        done.addEventListener('click', function () {
            if (this.checked == 1) {
                check(this);
            } else {
                window.clearTimeout(questDone);
                if (this.parentElement.parentElement.classList.contains('done')) {
                    this.parentElement.parentElement.classList.remove("done");
                }
            }
        });
    });

    const reveal = document.querySelectorAll('.single-quest-container');
    reveal.forEach(title => {
        title.addEventListener('click', function () {
            this.classList.toggle('opened');
        });
    });
});