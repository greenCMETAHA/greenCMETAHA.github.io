'use strict';

var userName="Пупсик", userNameTemp="Пупсик";

function changeUserName() {
    ctx.strokeStyle = "#FF4500";
    ctx.strokeRect(CANVAS_WIDTH/5-2, CANVAS_HEIGHT/5-2, CANVAS_WIDTH/5*3+2, CANVAS_HEIGHT/4+2); // рисует обводку прямоугольника шириной 300 и высотой 150 px
    ctx.fillStyle = "#DAA520";
    ctx.fillRect(CANVAS_WIDTH/5-2, CANVAS_HEIGHT/5, CANVAS_WIDTH/5*3, CANVAS_HEIGHT/4); // заливка прямоугольника шириной 300 и высотой 150 
    
    ctx.font = 'bold 30px sans-serif';
    ctx.textBaseline = "start";
    ctx.textAlign = "left";
    ctx.fillStyle ="#800000";
    ctx.fillText("Ваше имя:", CANVAS_WIDTH/5+10, CANVAS_HEIGHT/5+((CANVAS_HEIGHT/5)/8));  
    
    ctx.strokeStyle = "#FF4500";
    ctx.strokeRect(CANVAS_WIDTH/5+20, CANVAS_HEIGHT/3.2, CANVAS_WIDTH/5*3-40, 45);

    ctx.fillStyle = "yellow";
    ctx.fillRect(CANVAS_WIDTH/5+20, CANVAS_HEIGHT/3.2, CANVAS_WIDTH/5*3-40, 45); // рисует обводку прямоугольника шириной 300 и высотой 150 px

    ctx.font = 'bold 40px sans-serif';
    ctx.textBaseline = "start";
    ctx.textAlign = "left";
    ctx.fillStyle ="black";
    ctx.fillText(userNameTemp, CANVAS_WIDTH/5+30,CANVAS_HEIGHT/3.2+20); 


    showButton((CANVAS_WIDTH/4*3),(CANVAS_HEIGHT/10*9), (CANVAS_HEIGHT/10)/10*8, (CANVAS_WIDTH/4)/10*9);    //Back    
}

function showMenu() {
        //ctx.scale(1,1);
    
        //фоновый прямоугольник для меню
        ctx.strokeStyle = "#FF4500";
        ctx.strokeRect(CANVAS_WIDTH/4-2, CANVAS_HEIGHT/10-2, CANVAS_WIDTH/2+2, CANVAS_HEIGHT/10*8+2); // рисует обводку прямоугольника шириной 300 и высотой 150 px
        ctx.fillStyle = "#DAA520";
        ctx.fillRect(CANVAS_WIDTH/4, CANVAS_HEIGHT/10, CANVAS_WIDTH/2, CANVAS_HEIGHT/10*8); // заливка прямоугольника шириной 300 и высотой 150 px
    
        //кнопки
        let heightRect=CANVAS_HEIGHT-(CANVAS_HEIGHT/10*2);
        let widthRect=CANVAS_WIDTH/2;
        let buttonHeight=heightRect/6;
        let buttonInterval=(heightRect-(buttonHeight*5))/7;
    
        showButton((CANVAS_WIDTH/4)+(widthRect/10),(CANVAS_HEIGHT/10)+buttonInterval, buttonHeight, widthRect/10*8,  "Play");
        showButton((CANVAS_WIDTH/4)+(widthRect/10),(CANVAS_HEIGHT/10)+(buttonInterval*2)+buttonHeight, buttonHeight, widthRect/10*8,  "InsertName");
        showButton((CANVAS_WIDTH/4)+(widthRect/10),(CANVAS_HEIGHT/10)+(buttonInterval*3)+(buttonHeight*2), buttonHeight, widthRect/10*8, "Repeat");
        showButton((CANVAS_WIDTH/4)+(widthRect/10),(CANVAS_HEIGHT/10)+(buttonInterval*4)+(buttonHeight*3), buttonHeight, widthRect/10*8, "Result");
        showButton((CANVAS_WIDTH/4)+(widthRect/10),(CANVAS_HEIGHT/10)+(buttonInterval*5)+(buttonHeight*4), buttonHeight, widthRect/10*8,  "About");
    
    }
    
    function showAbout() {   
        
        //фоновый прямоугольник для меню
        ctx.strokeStyle = "#FF4500";
        ctx.strokeRect(CANVAS_WIDTH/4-2, CANVAS_HEIGHT/10-2, CANVAS_WIDTH/2+2, CANVAS_HEIGHT/10*8+2); // рисует обводку прямоугольника шириной 300 и высотой 150 px
        ctx.fillStyle = "#DAA520";
        ctx.fillRect(CANVAS_WIDTH/4, CANVAS_HEIGHT/10, CANVAS_WIDTH/2, CANVAS_HEIGHT/10*8); // заливка прямоугольника шириной 300 и высотой 150 px

        let pic=new Image();
        pic.src="images/avatar.jpg";
        pic.onload=function() { 
            ctx.drawImage(pic,CANVAS_WIDTH/4+10,CANVAS_HEIGHT/10+10,CANVAS_WIDTH/4,CANVAS_WIDTH/4);   

            ctx.font = 'bold 15px sans-serif';
            ctx.textBaseline = "start";
            ctx.textAlign = "right";
            ctx.fillStyle ="#800000";
            ctx.fillText("Игру разработал Васильченко Глеб", CANVAS_WIDTH/4*3-10,CANVAS_HEIGHT/10+(CANVAS_HEIGHT/4)+40);
            
            ctx.fillText("aka GreenCMETAHA", CANVAS_WIDTH/4*3-10,CANVAS_HEIGHT/10+(CANVAS_HEIGHT/4)+80); 
        }

    
        showButton((CANVAS_WIDTH/4*3),(CANVAS_HEIGHT/10*9), (CANVAS_HEIGHT/10)/10*8, (CANVAS_WIDTH/4)/10*9);    //Back
    }
    
    function showTable() {
    
        //фоновый прямоугольник для меню
        ctx.strokeStyle = "#FF4500";
        ctx.strokeRect(CANVAS_WIDTH/4-2, CANVAS_HEIGHT/10-2, CANVAS_WIDTH/2+2, CANVAS_HEIGHT/10*8+2); // рисует обводку прямоугольника шириной 300 и высотой 150 px
        ctx.fillStyle = "#DAA520";
        ctx.fillRect(CANVAS_WIDTH/4, CANVAS_HEIGHT/10, CANVAS_WIDTH/2, CANVAS_HEIGHT/10*8); // заливка прямоугольника шириной 300 и высотой 150 px

        ctx.font = 'bold 30px sans-serif';
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle ="#800000";
        ctx.fillText("Таблица рекордов:", CANVAS_WIDTH/2, CANVAS_HEIGHT/10+40);
        
        let data=gameHelper.readResults();
        data.sort((a,b)=>{
            return (a.getScore()>b.getScore()?-1:1);
        })

        ctx.font = 'bold 15px sans-serif';
        ctx.fillStyle ="#000000";        
        for (let i = 0; i < (data.length<10?data.length:10); i++) {
            ctx.fillText(data[i].toString(), CANVAS_WIDTH/2, CANVAS_HEIGHT/10+90+(i*40));              
        }
    
        showButton((CANVAS_WIDTH/4*3),(CANVAS_HEIGHT/10*9), (CANVAS_HEIGHT/10)/10*8, (CANVAS_WIDTH/4)/10*9);    //Back
    }
    
    function showButton(x,y, height, width, value="Back") {
        let buttonNames={
            "Play":"Играть",
            "Back":"Назад",
            "InsertName":"Ваше имя",
            "Repeat":"Видео игры",
            "Result":"Результаты",
            "About": "О нас"  
        }

        let pic=imagesForGame["images/button.png"];  
        
        //pic.onload = function() { 
            //console.log(pic);
            ctx.drawImage(pic,x,y,width,height);
                 
            ctx.font = 'bold 30px sans-serif';
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle ="#800000";
            ctx.fillText(buttonNames[value], x+(width/2), y+(height/2));
            
            if (!mapButtons.get(value)){
                mapButtons.set(value, new Button(value,x,y,x+width,y+height));// запомним все кнопки, шоб кали ляпнем по канвасу мышью, оно само и проверило
            }
        //}
    
    }
    
    function showForGame() {
        
        gameHelper.getBonuses().forEach(element => {
            showBonus(element);
        });
        gameHelper.getEnemies().forEach(element => {//отразим дохлых зомбаков
            if (!element.isAlive()){
                showPerson(element);
            }
        });

        if (gameHelper.player){
            showPerson(gameHelper.player);
        }
        gameHelper.enemies.forEach(element => { //отразим живых зомбаков
            if (element.isAlive()){
                showPerson(element);
            }
        });
        showTimer(gameHelper.getTimer());
        showScore(gameHelper.getScore());
        showLevel(gameHelper.getLevel());
        showLife(gameHelper.getPlayer().getLife());
     
        if (isMobile){
    
        }
            
        
    }

    function showBonus(currentObject,image="images/bonus.png") {
        let pic=imagesForGame[image];  
       // pic.onload=function() { 
            let coordinates=currentObject.getCoordinates();
            console.log("выводим бонус"+coordinates);
            let halfSize=currentObject.getSize()/2; //чтобы курсор был посередине картинки
            ctx.drawImage(pic,coordinates[0]-halfSize,coordinates[1]-halfSize,halfSize,halfSize);
        //}
    }
    
    function showPerson(currentObject,image=undefined) {  //это и игрок, и 
        
        image=image || currentObject.getPhaseImage();
        let personImage=imagesForGame[image];//currentSprite || pic;

        let coordinates=currentObject.getCoordinates();
        let halfSize=currentObject.getSize()/2; //чтобы курсор был посередине картинки
        if (currentObject.getPosition()===POSITION_RIGHT){
            ctx.drawImage(personImage,coordinates[0]-halfSize,coordinates[1]-halfSize,halfSize,halfSize);
        }else if (currentObject.getPosition()===POSITION_LEFT){ 
            ctx.scale(-1, 1);
            ctx.drawImage(personImage,-(coordinates[0]-halfSize),coordinates[1]-halfSize,-halfSize,halfSize);
            ctx.scale(-1, 1);
        }
    }
    
    
    function showTimer(value) {  //
        ctx.font = 'bold 25px sans-serif';
        ctx.textBaseline = "start";
        ctx.textAlign = "left";
        ctx.fillStyle ="white";
        ctx.fillText("Время: "+Math.floor(value), 40,40); 
    }

    function showLevel(value) {  //
        ctx.font = 'bold 25px sans-serif';
        ctx.textBaseline = "start";
        ctx.textAlign = "left";
        ctx.fillStyle ="white";
        ctx.fillText("Уровень: "+value, 40,80); 
    }    
    
    function showScore(value) {  //
        ctx.font = 'bold 25px sans-serif';
        ctx.textBaseline = "start";
        ctx.textAlign = "right";
        ctx.fillStyle ="white";
        ctx.fillText("Очки: "+value, CANVAS_WIDTH-40,40);    
    }

    function showLife(value) {  //
        ctx.font = 'bold 25px sans-serif';
        ctx.textBaseline = "start";
        ctx.textAlign = "right";
        ctx.fillStyle ="white";
        ctx.fillText("Жизнь: "+(value<0?0:value), CANVAS_WIDTH-40,80);    
    }    

    
function showScreen() {
    //ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

   // var background = new Image();
   // background.src = "../images/background.jpg";
    
    // Make sure the image is loaded first otherwise nothing will draw.
   // background.onload = function(){
    //    ctx.drawImage(background,0,0 ,CANVAS_HEIGHT,  CANVAS_WIDTH);   
   // }​;
   let pic       = new Image();              // "Создаём" изображение
   pic.src    = 'images/background.jpg';  // Источник изображения, позаимствовано на хабре
   pic.onload = function() {    // Событие onLoad, ждём момента пока загрузится изображение
     ctx.drawImage(pic, 0, 0, CANVAS_WIDTH,CANVAS_HEIGHT);  // Рисуем изображение от точки с координатами 0, 0

     localStorage.setItem("game_arcada_9_Vasilchenko_page",gameHelper.getView());
    switch (gameHelper.getView()) {
        case VIEW_MENU:
            showMenu(); 
            break;
        case VIEW_GAME:
            showForGame();            
            break;
        case VIEW_ABOUT:
            showAbout();
            break;
        case VIEW_TABLE:
            showTable();
            break; 
        case VIEW_USER_NAME:
            changeUserName();
            break;            

    }
    
  }
}

//-----------------------------------------------------------------------------------------------------------

function showMovie() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let backgound      = new Image();              // "Создаём" изображение
    backgound.src    = 'images/background.jpg';  // Источник изображения, позаимствовано на хабре
    backgound.onload = function() {    // Событие onLoad, ждём момента пока загрузится изображение
        ctx.drawImage(backgound, 0, 0, CANVAS_WIDTH,CANVAS_HEIGHT);  // Рисуем изображение от точки с координатами 0, 0        

        if (timeLine.length===0){
            showButton((CANVAS_WIDTH/4*3),(CANVAS_HEIGHT/10*9), (CANVAS_HEIGHT/10)/10*8, (CANVAS_WIDTH/4)/10*9);    //Back
            
                if (isMobile){
            
                }
        }else{
            var index=0;
            var timeStep=timeLine[index];
            setTimeout(function go() {
                                    
                ctx.drawImage(backgound, 0, 0, CANVAS_WIDTH,CANVAS_HEIGHT);  // Рисуем изображение от точки с координатами 0, 0 
                
                let objects=timeStep["objects"];
                objects.forEach(element => {
                    if (element.getType()===BONUS){
                        showBonus(element);
                    }
                });

                objects.forEach(element => {//отразим дохлых зомбаков
                    if ((element.getType()===TYPE_WIZARD || element.getType()===TYPE_ZOMBIE) && !element.isAlive()){
                        showPerson(element,element.getImage());
                    }
                });
                showPerson(objects[0],objects[0].getImage());

                objects.forEach(element => {//отразим живых зомбаков
                    if ((element.getType()===TYPE_WIZARD || element.getType()===TYPE_ZOMBIE) && element.isAlive()){ 
                        showPerson(element,element.getImage());
                    }
                });            
    
                showTimer(timeStep["timer"]);
                showScore(timeStep["scores"]);
                showLevel(timeStep["level"]);
                showLife(timeStep["life"]);

                showButton((CANVAS_WIDTH/4*3),(CANVAS_HEIGHT/10*9), (CANVAS_HEIGHT/10)/10*8, (CANVAS_WIDTH/4)/10*9);    //Back
            
                if (isMobile){
            
                }
                index++;
                console.log("index="+index);
                if (gameHelper.getView()!=VIEW_REPEAT){
                    showScreen();
                    return;
                }
                if (index<timeLine.length){
                    timeStep=timeLine[index];
                    console.log("timeline="+timeStep["step"]);
                    setTimeout(go,timeStep["time"]);

                }else{
                    return;
                }
            },timeStep["time"]);

            
        }
    }

}