'use strict';

const PLAYER=1, TYPE_ZOMBIE=2, TYPE_WIZARD=3, BONUS=4, ACTION_STAY=0, ACTION_WALK=1, ACTION_HIT=2, ACTION_DYING=3, POSITION_LEFT=1, POSITION_RIGHT=2;

class Base{
    constructor(...args){
        this.life=100;
        this.name="";
        this.coordinates=[0,0];
        this.type=0;
        this.SIZE_OF_PICTURE=150;
    }

    getType(){
        return this.type;
    }

    getSize(){
        return this.SIZE_OF_PICTURE;
    }

    getLife(){
        return this.life;
    }

    setLife(value){
        if (this.life>0){
            this.life=value>100?100:value;
            if (this.life<=0){
                this.setAction(ACTION_DYING);
                this.setFirstPhase();
            }
        }
    }

    getName(){
        return this.name;
    }

    setName(value){
        this.name=value;
    } 

    setCoordinates(...args){
        this.coordinates=args.length===2?[args[0],args[1]]:args[0];
    }

    getCoordinates(){
        return this.coordinates;
    }     
}

class Personage extends Base{
    constructor(...args){
        super();
        this.type=0;
        this.spriteWalk={};
        this.spriteStay={};
        this.spriteHit={};
        this.spriteDying={};
        this.action=ACTION_STAY;
        this.currentPhase=1;
        this.position=POSITION_LEFT;  
        this.speed=5;
        this.degree=0;
        this.hit=false;
        this.hitPhase=false;              

    }

    getPosition(){
        return this.position;
    }

    setPosition(value=POSITION_LEFT){
        this.position=value;
    }    
    

    getAction(){
        return this.action;
    }

    setAction(value=ACTION_STAY){
        this.action=value;
    }

    getAction(){
        return this.action;
    }

    setPhase(){
        let sprite=this.getCurrentSprite();
        let result=this.phase;  
        if (this.isLastPhase()){
            result=this.isAlive()?sprite["numberFirst"]:result;
        }else{
            result=this.phase+1;
        }
        this.phase=result;
    }

    setPhaseByNumber(value){
        this.phase=value;
    }    

    getPhase(){ 
        return this.phase;
    }

    getPhaseImage(){
        let sprite=this.getCurrentSprite();

        return sprite["path"]+this.getPhase()+sprite["extention"];
    }

    getNextPhaseImage(){
        this.setPhase();

        return this.getPhaseImage();
    }

    setFirstPhase(){
        let sprite=this.getCurrentSprite();
        this.phase=sprite["numberFirst"];
    }

    isLastPhase(){ //зомбакам нужна смена анимации
        let sprite=this.getCurrentSprite();
        return this.phase===sprite["numberLast"];

    }

    getCurrentSprite(){
        let result=null;
        switch (this.getAction()) {
            case ACTION_STAY:
                result=this.spriteStay;
                break;
            case ACTION_WALK:
                result=this.spriteWalk;
                break;
            case ACTION_DYING:
                result=this.spriteDying;
                break;
            case ACTION_HIT:
                result=this.spriteHit;
                break;                                                
        }

        return result;

    }

    setSpeed(value){
        this.speed=value;
    }

    getSpeed(){
        return this.speed;
    }

    setDegree(value){
        this.degree=value;
    } 

    getDegree(){
        return this.degree;
    }  
    
    isAlive(){
        return this.getLife()>0?true:false;

    }

    setHit(value=null){
        this.hit = value===null?!this.hit:value;

    }

    isAttack(){
        let result=false;

        if (this.getAction()===ACTION_HIT && this.hitPhase===this.getPhase()){
            result=true;
        }
        
        return result;

    }    

    move(){
        //обработчик движения
    }    
}

class Enemy extends Personage{
    constructor(...args){
        super();
        this.firstTarget=new Array(); //начальные координаты, позиция игрока, к которой стремится зомбарь/маг при рождении
        let speedCorrector= Math.floor(Math.random()*10)-5;        
        this.setSpeed(this.getSpeed()+speedCorrector);
        this.setBaseSpeed(this.getSpeed()); //если враг потеряет игрока из вида, скорость уменьшится
        this.setPosition(this.getCoordinates()[0]<this.getFirstTarget()[0]?POSITION_RIGHT:POSITION_LEFT); //зомбарь должен смотреть изначально в сторону игрока.
        this.lookingRadius=this.getSize()+(this.getSize()*(1/3)); //c этого расстояния зомбарь/визард начинает видеть игрока. Начинают двигаться к нему, увелдичивают скорость
            this.baseSpeed=this.speed;
    }

    getFirstTarget(){
        return this.firstTarget;
    }

    setFirstTarget(){
        if (gameHelper.getPlayer()!=null){
            this.firstTarget=gameHelper.getPlayer().getCoordinates();
        }
    }

    getLookingRadius(){
        return this.lookingRadius;
    }

    getBaseSpeed(){
        return this.baseSpeed;
    }

    setBaseSpeed(value){
        this.baseSpeed=value;
    }


}

class Zombie extends Enemy{
    constructor(...args){
        super();
        this.speed=1.4;
        this.setBaseSpeed(this.getSpeed()); //если враг потеряет игрока из вида, скорость уменьшится
        this.life=30;
        this.type=TYPE_ZOMBIE;

        this.spriteWalk={"path":"images/zombie/walk",
                "numberFirst":1,
                "numberLast":31,
                "extention":".png"};
        this.spriteStay={"path":"images/zombie/idle",
                "numberFirst":1,
                "numberLast":33,
                "extention":".png"}
        this.spriteDying={"path":"images/zombie/dying",
                "numberFirst":1,
                "numberLast":23,
                "extention":".png"}
        this.spriteHit={"path":"images/zombie/throw",
                "numberFirst":1,
                "numberLast":21,
                "extention":".png"};  
        this.hitPhase=11;
        this.setFirstTarget();
        this.setAction(ACTION_WALK);
        this.setFirstPhase();        
            

    }
}

class Wizard extends Enemy{
    constructor(...args){
        super();
        this.speed=4;
        this.setBaseSpeed(this.getSpeed()); //если враг потеряет игрока из вида, скорость уменьшится
        this.life=50;
        this.type=TYPE_WIZARD;
        this.lookingRadius=this.getSize()+(this.getSize()*(2/3));

        this.spriteWalk={"path":"images/wizard/walk",
                "numberFirst":1,
                "numberLast":8,
                "extention":".png"};
        this.spriteStay={"path":"images/wizard/idle",
                "numberFirst":1,
                "numberLast":17,
                "extention":".png"}
        this.spriteDying={"path":"images/wizard/dying",
                "numberFirst":1,
                "numberLast":28,
                "extention":".png"}
        this.spriteHit={"path":"images/wizard/shooting1_",
                "numberFirst":1,
                "numberLast":16,
                "extention":".png"};
        this.hitPhase=5; 
        this.setFirstTarget(); 
        this.setAction(ACTION_WALK);
        this.setFirstPhase();         
    }
}

class Player extends Personage{
    constructor(...args){
        super();
        this.type=PLAYER;
        this.speed=50;
        this.spriteWalk={"path":"images/knight/walk",
                         "numberFirst":1,
                         "numberLast":8,
                         "extention":".png"};
        this.spriteStay={"path":"images/knight/idle",
                         "numberFirst":1,
                         "numberLast":28,
                         "extention":".png"}
        this.spriteDying={"path":"images/knight/dying",
                         "numberFirst":1,
                         "numberLast":17,
                         "extention":".png"}
        this.spriteHit={"path":"images/knight/Attack1_",
                         "numberFirst":1,
                         "numberLast":11,
                         "extention":".png"};  
        this.hitPhase=5;
        this.setAction(ACTION_STAY);
        this.setFirstPhase(); 
    }
}

class Bonus extends Base{
    constructor(...args){
        super();
        this.life=20;
        this.type=BONUS;
        this.timer=10;
        this.SIZE_OF_PICTURE=50;
        this.bornTime=new Date().getTime();
    }

    getTimer(){
        return this.timer;
    }

    setTimer(value){
        this.timer=value;
    }
    
    isExpired(){
        return (((new Date().getTime()-this.bornTime)/1000)>=this.getTimer()); //со времени появления бонуса прошло 10 сек
    }   
    
    
}
