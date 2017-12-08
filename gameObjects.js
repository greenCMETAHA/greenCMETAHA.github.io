'use strict';

const MAX_LEVELS=15, START_TIMER_VALUE=30, VIEW_MENU=1, VIEW_GAME=2, VIEW_TABLE=3, VIEW_ABOUT=4, VIEW_USER_NAME=5, VIEW_REPEAT=6;

class Game{
    constructor(...args){
        this.enemies=new Array();
        this.bonuses=new Array();
        this.player=null;
        this.scores=0;
        this.level=0;   
        this.coefficient=1.2;   //Повышение скорости врага и времени уровня.
        this.timer=0;   // секунд. При повышении уровня будет умножаться на коэффициент
        this.started=false;
        this.view=VIEW_MENU; //+localStorage.getItem("game_arcada_9_Vasilchenko_page");//VIEW_MENU;
        this.spawns=new Array(); //это точки, откуда будут появляться замби. 40 штук, по 10 на каждую сторону канваса
        this.createdBonus=false;
        this.createdEnemy=false;
    }

    setCreatedBonus(value){
        this.createdBonus=value;

    }

    isCreatedBonus(){
       return this.createdBonus;

    }  
    
    setCreatedEnemy(value){
        this.createdEnemy=value;

    }

    isCreatedEnemy(){
       return this.createdEnemy;

    }       

    setSpawns(){ //отрабатывает 1 раз при запуске игры
        this.spawns.splice(0, this.spawns.length);
        for (let i = 0; i < 9; i++) {
            let current=[-10, CANVAS_HEIGHT/10*i];
            this.spawns.push(current);

            current=[CANVAS_WIDTH+10, CANVAS_HEIGHT/10*i];
            this.spawns.push(current);

            current=[CANVAS_WIDTH/10*i, -10];
            this.spawns.push(current);

            current=[CANVAS_WIDTH/10*i, CANVAS_HEIGHT+10];
            this.spawns.push(current);
        }
    }

    getSpawn(){
        let result=null;

        result=this.spawns[Math.floor(Math.random()*this.spawns.length)]; //случайный из 40
       
        return result;
    }

    getEnemy(){
        let result=null;
        let current= Math.floor(Math.random()*10);
        result=current<5?(new Zombie()):(new Wizard());
        result.setName((current<5?"Zombie":"Wizard")+(this.getEnemies().length+1));
        result.coordinates=this.getSpawn();

        return result;
    }

    getView(){
        return this.view;
    }

    setView(value){
        this.view = value;
    }

    setEnemy(value){
        this.enemies.push(value);
    }

    getEnemies(){
        return this.enemies;
    }

    setStarted(value=null){
        this.started = value===null?!this.started:value;
    }

    isStarted(){
        return this.started;
    }

    setPlayer(value){
        this.player=value;
    }

    getPlayer(){
        return this.player;
    }

    removeEnemy(current){
        for (let i = 0; i < this.enemies.length; i++) {
            if (current===this.enemies[i]){
                this.enemies.splice(i,1);
                break;
            }
            
        }
    }
    removeEnemies(){
        this.enemies=new Array();
    }    

    setBonus(value){
        this.bonuses.push(value);
    }

    getBonuses(){
        return this.bonuses;
    }

    removeBonus(current){
        for (let i = 0; i < this.bonuses.length; i++) {
            if (current===this.bonuses[i]){
                this.bonuses.splice(i,1);
                break;
            }
            
        }
    } 
    
    removeBonuses(){
        this.bonuses=new Array();
    }      

    setScore(value){
        this.scores=value;
    }

    getScore(){
        return this.scores;
    }

    setLevel(value){
        this.level=value;   
    }

    getLevel(){
        return this.level;   
    }

    addLevel(){
        this.level++;
        return this.level;
    }

    getCoefficient(){
        return this.coefficient;   
    }

    setTimer(value){
        this.timer = value;
    }

    getTimer(){
        return this.timer;
    }

    setLevel(value){
        this.level=value;   
    }
    
    writeResults(){
        let record=new Record(new Date, gameHelper.getPlayer().getName(),gameHelper.getScore());
        let arr=this.readResults();
        arr.push(record);
        localStorage.setItem("Arcade_Vasilchenko_resultsTable",JSON.stringify(arr));
    }

    readResults(){
        let result=[];
        let arr=localStorage.getItem("Arcade_Vasilchenko_resultsTable");
        let data=[];
        if (arr!=null){
            data=JSON.parse(arr);
            data.forEach(element => {
                let task=new Record(element["date"],element["name"],element["score"]); 
                result.push(task);
            });            
        }

        return result;

    }
}


class HistoryObject{
    constructor(name,coordinates,position,image,size,type,life=false){
        this.name=name;
        this.coordinates=coordinates;
        this.position=position;
        this.image=image;
        this.size=size;
        this.type=type;
        this.life=life;
    }

    getName(){
        return this.name;
    }

    getCoordinates(){
        return this.coordinates;
    }

    getPosition(){
        return this.position;
    }

    getImage(){
        return this.image;
    } 
    
    getSize(){
        return this.size;
    }  
    
    getType(){
        return this.type;
    }       

    isAlive(){
        return this.life;
    }       
}

class Button{
    constructor(name, x1,y1,x2,y2){
        this.name=name;
        this.x1=x1;
        this.y1=y1;
        this.x2=x2;
        this.y2=y2;
    }

    getName(){
        return this.name;
    }

    getCoordinates(){
        return {
            'x1':this.x1,
            'y1':this.y1,
            'x2':this.x2,
            'y2':this.y2,
        };
    }

    isThisButton(name, mousePos){
        let result = name===this.name && mousePos.x>=this.x1 && mousePos.y>=this.y1 && mousePos.x<=this.x2 && mousePos.y<=this.y2;

        return result;

    }

}

class Record{
    constructor(date, name, score){
        this.date=date;
        this.name=name;
        this.score=score;

    }

    getDate(){
        return this.date;
    }

    setDate(value){
        this.date=value;
    }

    getName(){
        return this.name;
    }

    setName(value){
        this.name=value;
    } 
    
    getScore(){
        return this.score;
    }

    setScore(value){
        this.score=value;
    }     

    toString(){
        let result=this.getName();
        let score=" "+this.getScore();
        for (let i = (result+score).length; i < 40; i++) {
            result+="."
            ;
        }
        result+=score;

        return result;
    }
}