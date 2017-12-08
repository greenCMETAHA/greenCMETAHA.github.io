'use strict';






var CANVAS_HEIGHT=document.documentElement.clientHeight-20
  , CANVAS_WIDTH=document.documentElement.clientWidth-20;
var gameCanvas=document.getElementById("gameCanvas");
var ctx     = gameCanvas.getContext('2d');
var gameHelper=new Game();
const GAME_SPEED=50, STEP=3;
var timeLine=new Array();
var isMobile=false;
var pressedKeys={};  //конструкция нужна чтобы определять нажать/отпустить клавишу. Иначе одновременно не обработаются 2 клавиши при движении.

downloadAllImages();
setting();
//start(); // --------------заглушка. Потом убрать.

function setting(params) {
    gameCanvas.height=CANVAS_HEIGHT;
    gameCanvas.width=CANVAS_WIDTH;
        
    isMobile=false;                 //проверить на мобильное устройство
    window.addEventListener('keydown', (e) => {
       // e.preventDefault();
       let player=gameHelper.getPlayer();
       

        switch (gameHelper.getView()) {
            case VIEW_GAME:
                if (gameHelper.isStarted()){
                    if (e.keyCode===27){
                        console.log("pause, code="+e.keyCode);
                        gameHelper.setStarted();
                    }
                    let coordinates=gameHelper.getPlayer().getCoordinates();
                    let halfSize=gameHelper.getPlayer().getSize()/2;
                    let firstPress=pressedKeys[e.keyCode]?false:true;  //если такой кнопки не было - значит undefined
                    pressedKeys[e.keyCode]=true;

                    if (player.isAlive()){            
                        if (pressedKeys[38] || pressedKeys[39] || pressedKeys[40] || pressedKeys[37]){
                            if (pressedKeys[38]){
                                console.log("forward, code="+e.keyCode);
                                coordinates[1]-=STEP;
                                coordinates[1]=coordinates[1]<(-halfSize)?CANVAS_HEIGHT+halfSize-1:coordinates[1];
                            } 
                            if (pressedKeys[40]){
                                console.log("backward, code="+e.keyCode);
                                coordinates[1]+=STEP;
                                coordinates[1]=coordinates[1]>(CANVAS_HEIGHT+halfSize)?-halfSize:coordinates[1];
                            }      
                            if (pressedKeys[37]){
                                console.log("left, code="+e.keyCode);
                                coordinates[0]-=STEP;
                                coordinates[0]=coordinates[0]<(-halfSize)?CANVAS_WIDTH+halfSize-1:coordinates[0];
                                player.setPosition(POSITION_LEFT);
                            }      
                            if (pressedKeys[39]){
                                console.log("right, code="+e.keyCode);
                                coordinates[0]+=STEP;
                                coordinates[0]=coordinates[0]>(CANVAS_WIDTH+halfSize)?-halfSize:coordinates[0];
                                player.setPosition(POSITION_RIGHT);
                            }
                        }       
            
                        if (pressedKeys[32]){  //space
                            console.log("hit, code="+e.keyCode);
                            if (!player.isAttack()){
                                player.setHit();
                                player.setAction(ACTION_HIT);
                                player.setFirstPhase(); //hit должен проиграться полностью. Всегда. Даже при движении. Причём, не начинать следующий, пока не закончится предыдущий
                            }
                        }                                                                    
                        player.setCoordinates(coordinates);
                    }
                }          
                break;
            case VIEW_USER_NAME:
                console.log(e.keyCode +","+ e.charCode);
                if (e.keyCode===8 && userNameTemp.length>0){  //backspace
                    userNameTemp=userNameTemp.substring(0,userNameTemp.length-1);
                    console.log("hit, code="+e.keyCode+" username = "+userNameTemp);
                    userName=userNameTemp;
                    showScreen();
                }
                break;
        }
    });
    window.addEventListener('keypress', (e) => {
        //e.preventDefault();
        console.log("keypress ");

        switch (gameHelper.getView()) {
             case VIEW_USER_NAME:
                console.log(e.keyCode +","+ e.charCode);
                if (e.charCode>=32 && e.charCode<=126 && userNameTemp.length<20){ //латиница и спецсимволы
                    userNameTemp+=String.fromCharCode(e.charCode);
                }else if (e.charCode>=1072 && e.charCode<=1103 && userNameTemp.length<20){//малые русские
                    userNameTemp+=String.fromCharCode(e.charCode);
                }else if (e.charCode>=1040 && e.charCode<=1071 && userNameTemp.length<20){ //большие русские
                    userNameTemp+=String.fromCharCode(e.charCode);
                }else if (e.charCode===13){ //Ввод. -------------------------------Проверить
                    userName=userNameTemp;
                    gameHelper.setView(VIEW_MENU);
                }                 
                showScreen();                
                break;            
    
        }
    });    
    window.addEventListener('keyup', (e) => {
        console.log("keyup"+e.keyCode);
        //pressedKeys[e.keyCode] = false;
        delete pressedKeys[e.keyCode];
        console.log(pressedKeys);
    });
    gameCanvas.addEventListener('mouseup', (e) => {
        console.log("mouseup");
        let mousePos =  getMousePos(gameCanvas, e);
        let gameMode=gameHelper.getView();
        if (gameMode===VIEW_MENU) {
                if (isButtonGame(mousePos)){
                    gameHelper.setView(VIEW_GAME);
                    start();
                    console.log("isButtonGame");
                    showScreen();
                }else if (isButtonAbout(mousePos)){
                    gameHelper.setView(VIEW_ABOUT);
                    console.log("isButtonAbout");
                    showScreen();
                }else if (isButtonRepeat(mousePos)){
                    gameHelper.setView(VIEW_REPEAT);
                    console.log("isButtonRepeat");
                    showMovie();                    
                }else if (isButtonTableResults(mousePos)){
                    gameHelper.setView(VIEW_TABLE);
                    console.log("isButtonTableResults");
                    showScreen();
                }else if (isButtonUserName(mousePos)){
                    gameHelper.setView(VIEW_USER_NAME);
                    console.log("isButtonUserName");
                    showScreen();
                }
        } else if (gameMode===VIEW_GAME){
                showForGame();            
        } else {                        //все остальные моды игры
            if (isButtonBack(mousePos)){
                console.log("isButtonBack");
                gameHelper.setView(VIEW_MENU);
                showScreen();
            }
        }
        
        function getMousePos(gameCanvas, evt) {
            var rect = gameCanvas.getBoundingClientRect();
            return {
              x: evt.clientX - rect.left,
              y: evt.clientY - rect.top
            };
          }

    });        

    //ctx.fillStyle = '#AF5200'; // меняем цвет клеток
    //ctx.fillRect(1, 1, 800, 600);



    showScreen(); 
    
    
}


function start(params) {  //------------------------------------------!!!!!!!!!!!!!!!!!!!---------------------------------
    gameHelper.setStarted();
    var player=new Player();
    player.setName(userName);
    player.setCoordinates(CANVAS_WIDTH/2,CANVAS_HEIGHT/2);  
    gameHelper.setPlayer(player); 
    console.log("gameHelper.setPlayer(player);"); 
    gameHelper.setTimer(START_TIMER_VALUE);
    let currentTime=new Date();
    let timeForMovie=currentTime;
    let lastTimerValue=gameHelper.getTimer();
    gameHelper.setLevel(1);
    gameHelper.setSpawns();
    gameHelper.removeBonuses();
    gameHelper.removeEnemies();
    
    var timerId = setTimeout(function go() {
        if (gameHelper.getView()===VIEW_GAME){
            addRemoveBonus();
            addRemoveEnemy();
            getCollisionsWithEneiesAndBonuses();
            moveEnemies();  //этих пидарасов нужно как-то подвигать к игроку.
            
            setActionForPerson();
            
            let currentTimeForMovie=new Date();
            saveMoves(currentTimeForMovie.getTime()-timeForMovie.getTime());
            timeForMovie=currentTimeForMovie;
        }
        showScreen();
        
        if (gameHelper.getTimer()<=0){
            lastTimerValue=lastTimerValue*gameHelper.getCoefficient();
            gameHelper.setTimer(lastTimerValue);
            gameHelper.addLevel();
            clearDeadEnemies();
            if (gameHelper.getLevel()===16){
                gameHelper.writeResults();
                gameHelper.setPlayer(null);
                console.log("player=null, 338");
                gameHelper.setStarted(false);
                gameHelper.setView(VIEW_MENU);
                showScreen(); 
                console.log("Вы выиграли!!!");
                return;
            }
        }else{
            let newTime=new Date();
            let delta=newTime.getTime()-currentTime.getTime();
            currentTime=newTime;
            gameHelper.setTimer(gameHelper.getTimer()-(delta/1000));
            //console.log("playing...  " +gameHelper.getTimer());

        }
        
        if (gameHelper.isStarted()) {
            setTimeout(go,GAME_SPEED);
        }else{
                gameHelper.writeResults();
                gameHelper.setPlayer(null);
                console.log("player=null, 359");
                gameHelper.setStarted(false);
                gameHelper.setView(VIEW_MENU);
                showScreen();                
                console.log("Game over");
                return;
        }
    }, GAME_SPEED);    
}

function getCollisionsWithEneiesAndBonuses() {
    let player=gameHelper.getPlayer();
    //console.log(player+","+player.getCoordinates());
    let playerCoordinates=player.getCoordinates();
    gameHelper.getBonuses().forEach(element=>{
        let coordinates=element.getCoordinates();
        let distance=element.getSize()/2;
        distance=distance-(distance/10); //10% перекрытия
        if (onDistance(player,element,true)){
            gameHelper.setScore(gameHelper.getScore()+element.getLife());
            player.setLife(player.getLife()+element.getLife());
            gameHelper.removeBonus(element);
        }

    },this);

   /* gameHelper.getEnemies().forEach(element=>{
        let coordinates=element.getCoordinates();
        let distance=player.getSize()+element.getSize();
        //distance=distance-(distance/10); //10% перекрытия
        if (Math.abs(playerCoordinates[0]-coordinates[0])<distance && Math.abs(playerCoordinates[1]-coordinates[1])<distance && element.isAlive()){
            gameHelper.setScore(gameHelper.getScore()-enemy.getLife());
            gameHelper.getPlayer().setLife(0);  //замокрили братуху
         }
    });     */
    
}

function setActionForPerson() {
    let player=gameHelper.getPlayer();
    player.setPhase();
    //console.log
    if (player.isAlive()){
        if (pressedKeys[32] && player.getAction()!=ACTION_HIT){
            player.setAction(ACTION_HIT);
            player.setFirstPhase();

        }
        if (player.getAction()===ACTION_HIT && player.isAttack()){
            let coordinates=player.getCoordinates();
            gameHelper.getEnemies().forEach(element => {
                if (element.isAlive()){
                    if (onDistance(player,element,true)){  //зомбарь дотянулся до нас)
                        if ((element.getCoordinates()[0]<=coordinates[0] && player.getPosition()===POSITION_LEFT) 
                            || (element.getCoordinates()[0]>=coordinates[0] && player.getPosition()===POSITION_RIGHT)){
                                let value=Math.min(element.getLife(),player.getLife());
                                gameHelper.setScore(gameHelper.getScore()+value);
                                element.setLife(element.getLife()-value);
                        }
                    }   
                }
            },this);

        }
        if (player.isLastPhase()){
            if(pressedKeys[37] || pressedKeys[38] || pressedKeys[39] || pressedKeys[40]){
                //if (player.getAction()!=ACTION_WALK){
                    player.setAction(ACTION_WALK);
                    player.setFirstPhase();
                //}
            }else if (pressedKeys[32]){
                player.setAction(ACTION_HIT);
                player.setFirstPhase();
            }else{
                player.setAction(ACTION_STAY);
                player.setFirstPhase();

            }
            
        }
   }else if (player.getAction()===ACTION_DYING){
        if (player.isLastPhase()){
            gameHelper.setStarted(false);  //ГГ сдох, и анимация его смерти отыгралась
        }

   }
    
}

function clearDeadEnemies() {
    if (gameHelper.enemies.length>0){  //отразим дохлых зомбаков
        gameHelper.enemies.forEach(element => {
            if (!element.isAlive()){
                gameHelper.removeEnemy(element);
            }
        });
    }    
}

function moveEnemies() {
    let player=gameHelper.getPlayer();
    let coordinates=player.getCoordinates();
    let that=this;
    gameHelper.getEnemies().forEach(element => {
        element.setPhase();
        //console.log(element+"  ----  "+element.getCoordinates()+" ---- "+element.getPhaseImage());
        if (element.isAlive()){
            if (element.isLastPhase()){
                if(onDistance(player,element,true) ){  //зомбарь дотянулся до нас
                    element.setAction(ACTION_HIT);
                    element.setFirstTarget();

                } else if (onDistance(player,element,false) ){ //зомбарь учуял на длинной дистанции
                        element.setAction(ACTION_WALK);
                        element.setFirstTarget();
                        if (element.getBaseSpeed()===element.getSpeed()){
                            element.setSpeed(element.getSpeed()*gameHelper.getCoefficient());
                        }

                }else{
                    element.setSpeed(element.getBaseSpeed());
                }
                element.setFirstPhase();  
            }else if (onDistance(player,element,true)){  //зомбарь дотянулся до нас)
                if (element.getAction()===ACTION_HIT && element.isAttack()){ //во время удара игрок оказался на расстоянии удара
                    player.setLife(player.getLife()-element.getLife());
                 //   if (!player.isAlive()){
                 //       player.setAction(ACTION_DYING);
                 //       player.setFirstPhase();
                 //   }
                }
            }


            let enemyCoordinates=element.getCoordinates();
            let target=element.getFirstTarget();
            element.setPosition(target[0]>enemyCoordinates[0]?POSITION_RIGHT:POSITION_LEFT);    //нету картинок, отображающих игроков, идущих вверх/вниз - поэтому только x
            if (element.getAction()!=ACTION_DYING){ //надо здвинуть зомбака по алгоритму
                element.setCoordinates(newEnemyCoordinates(player, target,enemyCoordinates,element.getSpeed())); //function
                //console.log(element);
            }
       }



    },this);
    
}

function onDistance(player,element,shortDistance) {
    let playerCoordinates=player.getCoordinates();
    let elementCoordinates=element.getCoordinates();
//    let distance=shortDistance?(element.getSize()/2)+(player.getSize()/2):element.getLookingRadius();
    let distance=shortDistance?(element.getSize()/4):element.getLookingRadius();
    let result=Math.max(Math.abs(elementCoordinates[0]-playerCoordinates[0]),Math.abs(elementCoordinates[1]-playerCoordinates[1]))<distance;

    //console.log("distance="+distance+",  "+result+", max="+Math.max(Math.abs(elementCoordinates[0]-playerCoordinates[0]),Math.abs(elementCoordinates[1]-playerCoordinates[1])));
    return result;
}

function newEnemyCoordinates(player,target,enemyCoordinates,speed) {
    let result=[enemyCoordinates[0],enemyCoordinates[1]];
    let xDistance=Math.floor(Math.abs(target[0]-enemyCoordinates[0]));
    let yDistance=Math.floor(Math.abs(target[1]-enemyCoordinates[1]));
    if (xDistance>(player.getSize()/5) || (yDistance>player.getSize()/10)){ //только если далеко от игрока. Если рядом - просто будет лупить

        if (xDistance===yDistance){
            let whither=target[0]===enemyCoordinates[0]?0:(target[0]>enemyCoordinates[0]?1:-1); //в какую сторону идти
            result[0]=enemyCoordinates[0]+(speed/1.3*whither);
            whither=target[1]===enemyCoordinates[1]?0:(target[1]>enemyCoordinates[1]?1:-1); //в какую сторону идти
            result[1]=enemyCoordinates[1]+(speed/1.3*whither);
            
        }else{
            let which=xDistance>yDistance?0:1; //по какой координате будем отсчитывать шаг. По той, которая длиннее.
            let which2=xDistance>yDistance?1:0; //по какой координате будем отсчитывать шаг. По той, которая длиннее.  
            let whither=target[which]===enemyCoordinates[which]?0:(target[which]>enemyCoordinates[which]?1:-1); //в какую сторону идти
            let distance=Math.abs(target[which]-enemyCoordinates[which]);
            result[which]=Math.floor(enemyCoordinates[which]+(speed*whither));
            whither=target[which2]===enemyCoordinates[which2]?0:(target[which2]>enemyCoordinates[which2]?1:-1); //в какую сторону идти
            result[which2]=Math.floor(enemyCoordinates[which2]+(Math.abs(target[which2]-enemyCoordinates[which2])/(distance/speed)*whither));
        }
        console.log("result = "+result);
        console.log("enemyCoordinates = "+enemyCoordinates);
    }
    
    return result;
}

function addRemoveBonus() {
    let bonuses=gameHelper.getBonuses();
    bonuses.forEach(element => {
        if (element.isExpired()){
            gameHelper.removeBonus(element); 
        }
    });
    bonuses=null;


    console.log("000  "+Math.floor(gameHelper.getTimer())+" 000   "+gameHelper.isCreatedBonus()+"   --- total bonuses = "+gameHelper.getBonuses().length);
    if (Math.floor(gameHelper.getTimer())%7===0){  //бонус появляется каждые 7 секунд
        console.log("111  "+Math.floor(gameHelper.getTimer())+" 111 "+gameHelper.isCreatedBonus()+"   --- total bonuses = "+gameHelper.getBonuses().length);
        if (!gameHelper.isCreatedBonus()){
            console.log("222  "+Math.floor(gameHelper.getTimer())+" 222 "+gameHelper.isCreatedBonus()+"   --- total bonuses = "+gameHelper.getBonuses().length);
            let bonus=new Bonus();
            let coordinates=getCoordinatesForBonus();
            bonus.setCoordinates(coordinates);
            gameHelper.setBonus(bonus);
            gameHelper.setCreatedBonus(true);
        }
    }else{
        console.log("333  "+Math.floor(gameHelper.getTimer())+" 333 "+gameHelper.isCreatedBonus()+"   --- total bonuses = "+gameHelper.getBonuses().length);
        gameHelper.setCreatedBonus(false);  //за ту секунду, что на таймере висит сенунда, делящаяся без остатка на 7, по функции успеет пройтись многократно, и бонусов насоздаёт штук 20
    }

        
    function getCoordinatesForBonus() {
        let result=returnRandomCoordinates();

        while (!isPerfectPlace(result)){
            result=returnRandomCoordinates();
        }

        return result;
        
    }

    function returnRandomCoordinates(){
        let x=CANVAS_WIDTH*Math.random();
        let y=CANVAS_HEIGHT*Math.random();

        return [x,y];
        
    }

    function isPerfectPlace(value) { //не близко ли они от врагов и игрока
        let result=false;

        let coordinates=gameHelper.getPlayer().getCoordinates();
        if (Math.abs(coordinates[0]-value[0])>100 && Math.abs(coordinates[1]-value[1])>100){
            result=true;
        }
        let enemies=gameHelper.getEnemies();
        enemies.forEach(element => {
            coordinates=element.getCoordinates();
            if (Math.abs(coordinates[0]-value[0])>100 && Math.abs(coordinates[1]-value[1])>100){
                result=true;
            }
        });

        return result;
        
    }
    
}



function addRemoveEnemy() {
    //if (gameHelper.getEnemies().length>=1) return;  //---------------------------------------------------------


    if (Math.floor(gameHelper.getTimer())%4===0){ //каждые 4 секунды появляется новый зомбарь/маг
        if (!gameHelper.isCreatedEnemy()){
            gameHelper.setEnemy(gameHelper.getEnemy()); //создаём зомбаря, придаём ему начальный вектор. Надо как-то ещё проработать линию его движения.
            gameHelper.setCreatedEnemy(true);
        }
    } else{
        gameHelper.setCreatedEnemy(false);  //за ту секунду, что на таймере висит сенунда, делящаяся без остатка на 7, по функции успеет пройтись многократно, и зомбарей насоздаёт штук 20
    }
    
    //убирать не будем. Будут лежать дохлые до конца игры. Хотя, мож, потом таймер добавлю
}




function saveMoves(deltaTime) {
    let arr=new Array();  //здесь будут лежать все объекты на секунду времени
    let player=gameHelper.getPlayer();
    console.log("player.getCoordinates()   "+player.getCoordinates());
    arr.push(new HistoryObject(player.getName(),[player.getCoordinates()[0],player.getCoordinates()[1]],player.getPosition()
                ,player.getPhaseImage(),player.getSize(),PLAYER,player.isAlive()));

    gameHelper.getBonuses().forEach(element => {
        arr.push(new HistoryObject(element.getName(),element.getCoordinates(),1
                    ,"",element.getSize(),BONUS));
    });
    gameHelper.getEnemies().forEach(element => {
        arr.push(new HistoryObject(element.getName(),element.getCoordinates(),element.getPosition()
                    ,element.getPhaseImage(),element.getSize(),element.getType(),element.isAlive()));
    });    
    
    let step={
        "time": deltaTime,
        "step": timeLine.length,
        "objects": arr,
        "timer":gameHelper.getTimer(),
        "level":gameHelper.getLevel(),
        "life":player.getLife(),
        "scores":gameHelper.getScore(),
        
    }
    timeLine.push(step);
}
