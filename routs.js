'use strict';
var mapButtons=new Map();

function findButton(nameValue, mousePos) {
    let result=false; 
    if (mapButtons.get(nameValue)){
        result=mapButtons.get(nameValue).isThisButton(nameValue, mousePos);
    }
    return result;    
}

function isButtonBack(mousePos) {  // проверяет, нажата ли кнопка Back на странице. Это выход в меню
    return findButton("Back", mousePos);
}

function isButtonGame(mousePos) {  // проверяет, нажата ли кнопка ВХОД В ИГРУ на странице.
    return findButton("Play", mousePos);
    
}

function isButtonAbout(mousePos) {  // проверяет, нажата ли кнопка О НАС на странице. Это выход в меню
    return findButton("About", mousePos);
}

function isButtonRepeat(mousePos) {  // проверяет, нажата ли кнопка О НАС на странице. Это выход в меню
    return findButton("Repeat", mousePos);
}

function isButtonTableResults(mousePos) {  // проверяет, нажата ли кнопка РЕЗУЛЬТАТЫ ИГРЫ на странице. Это выход в меню
    return findButton("Result", mousePos);
}

function isButtonUserName(mousePos) {  // проверяет, нажата ли кнопка ИМЯ ПОЛЬЗОВАТЕЛЯ на странице. Это выход в меню
    return findButton("InsertName", mousePos);
}