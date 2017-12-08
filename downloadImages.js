'use script';

var imagesForGame={};

function downloadAllImages() {
    let player=new Player();
    let zombie=new Zombie();
    let wizard=new Wizard();
    let img=new Image();
    img.src="images/bonus.png";
    imagesForGame["images/bonus.png"]=img;
    img=new Image();
    img.src="images/button.png";
    imagesForGame["images/button.png"]=img;   

    for (let i = 0; i < 4; i++) {
        downloadAllImagesFoeSprites(player,i);
        downloadAllImagesFoeSprites(zombie,i);
        downloadAllImagesFoeSprites(wizard,i);
    }
    console.log("Загрузили");

    function downloadAllImagesFoeSprites(current,i) {
        current.setAction(i);
        let sett=current.getCurrentSprite();
        for (let j = sett["numberFirst"]; j <= sett["numberLast"]; j++) {
            current.setPhaseByNumber(j);
            img=new Image();
            img.src=current.getPhaseImage();
            imagesForGame[current.getPhaseImage()]=img;
        }
        
    }
}



