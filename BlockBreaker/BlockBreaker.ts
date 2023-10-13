console.log("deneme");
let player: HTMLElement | null;
let playerPositionX: number;
let ballHTML: HTMLElement | null;
let ballHTMLX: number;
let ballHTMLY: number;
let ballSpeedX: number = 3;
let ballSpeedY: number = 3;
let ballArea: HTMLElement | null;
let blocks: HTMLElement[] | null;
let blocksArea: HTMLElement | null;
let blockHeight: number;
let gameSetting: HTMLElement | null;


document.addEventListener("mousemove", platformMovement)

window.onload = () => {
    player = document.getElementById("player");
    ballHTML = document.getElementById("ball");
    ballArea = document.getElementById("gameBoard");
    blocks = Array.from(document.querySelectorAll(".block"));
    blocksArea = document.getElementById("blockArea");
    gameSetting = document.getElementById("gameSettings");
    console.log(blocks);

}

function platformMovement(event:MouseEvent) {
    const rect:DOMRect | undefined = ballArea?.getBoundingClientRect();

    if(rect != undefined && player != null){
        playerPositionX = event.clientX - rect.left; // Fare pozisyonu (x) div'in içinde

        if(playerPositionX > 0 && playerPositionX < Number(ballArea?.getBoundingClientRect().width) - Number(player.getBoundingClientRect().width)){
            player.style.left = playerPositionX + "px";
        }
    }
}

function ballStartPosition() {
    if(player != null && ballHTML != null){
        let style = window.getComputedStyle(player);
        ballHTMLX = parseInt(style.getPropertyValue("left"))
        ballHTMLX += player.getBoundingClientRect().width /2;
        ballHTMLX -= ballHTML.getBoundingClientRect().width /2;

        ballHTML.style.left = `${ballHTMLX}px`;


        ballHTMLY = parseInt(style.getPropertyValue("top"))
        ballHTMLY -= ballHTML.getBoundingClientRect().width;

        ballHTML.style.top = `${ballHTMLY}px`;
    }
}

function ballMovement(collider:HTMLElement) {
    if(ballHTML != null && ballArea != null && player != null){
    ballHTMLX += ballSpeedX;
    ballHTMLY += ballSpeedY;

    // Topun çarpışma kontrolü
    if (ballHTMLX + ballHTML.offsetWidth > ballArea.offsetWidth || ballHTMLX < 0) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballHTMLY < 0) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballHTMLY + ballHTML.offsetHeight > ballArea.offsetHeight) {
        console.log("oyun bitti");
    }

    // Platform ile çarpışma kontrolü
    if (ballHTMLY + ballHTML.offsetHeight > collider.offsetTop &&
        ballHTMLY + ballHTML.offsetHeight < collider.offsetTop + collider.offsetHeight &&
        ballHTMLX + ballHTML.offsetWidth > collider.offsetLeft &&
        ballHTMLX < collider.offsetLeft + collider.offsetWidth) {
            ballSpeedY = -ballSpeedY;
    }

    ballHTML.style.left = ballHTMLX + "px";
    ballHTML.style.top = ballHTMLY + "px";

    requestAnimationFrame(() => ballMovement(collider));
    }
}

function detectCollider() {
    let hasCollided = false; // Topun çarpışıp çarpmadığını izleyen bir bayrak

    if (ballHTML != null && blocks != null){
        for (let i = 0; i < blocks.length; i++) {
            if (!hasCollided && ballHTMLY + ballHTML.offsetHeight > blocks[i].offsetTop &&
                ballHTMLY < blocks[i].offsetTop + blocks[i].offsetHeight &&
                ballHTMLX + ballHTML.offsetWidth > blocks[i].offsetLeft &&
                ballHTMLX < blocks[i].offsetLeft + blocks[i].offsetWidth) {
                    blocks[i].style.backgroundColor = "rgba(0,0,0,0)";
                    console.log("here");
                    ballSpeedY = -ballSpeedY;
                    blocks.splice(i, 1);
                    hasCollided = true;
                    gameOver();
            }            
        }
    }
    requestAnimationFrame(detectCollider);

}

function gameOver() {
    if(blocks?.length == 0 && gameSetting != null && ballArea != null){
        gameSetting.style.display = "grid";
        ballArea.style.display = "none";
        gameSetting.innerHTML = `
        <h3>WINNER</h3>        `
    }
}


function play() {
    if(gameSetting != null && blocksArea != null){
        gameSetting.style.display = "none";
        if(player != null){
            ballMovement(player);
        }
    
        detectCollider();
        ballStartPosition();
    }
}

// function setBlocks() {
//     let blockAreaHeight = (blocksArea?.getBoundingClientRect().height);
//     if(blockAreaHeight != null && blocksArea != null && blocks != null){
//         blockHeight = 20;
//         let blockColumn = Math.floor(blockAreaHeight / blockHeight)
//         console.log(blockColumn);
//         for (let i = 0; i < blockColumn * 6; i++) {
//             let tile = document.createElement("div");
//             blocksArea?.append(tile);
//             tile.classList.add("block");              
//         }
//     }    

//     detectCollider();
// }