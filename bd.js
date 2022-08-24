// wichtige Variabeln
const gridDisplay = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 670;
const boardHeight = 400;
let timerId;
let xDirection = 2;
let yDirection = 2;
let score = 0;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;



// Wir erstellen eine Klasse, die uns hilft, 
// die Blöcke an den richtigen Stellen hinzuzufügen.
class Block{
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis,yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    };
};


// Wir erstellen eine Blockliste, 
// die alle Blöcke des Spiels in der richtigen Breite und Höhe enthält
const blocks = [
    new Block(10, 370),
    new Block(120,370),
    new Block(230,370),
    new Block(340,370),
    new Block(450,370),
    new Block(560,370),
    new Block(10, 340),
    new Block(120, 340),
    new Block(230, 340),
    new Block(340, 340),
    new Block(450, 340),
    new Block(560, 340),
    new Block(10, 310),
    new Block(120, 310),
    new Block(230, 310),
    new Block(340, 310),
    new Block(450, 310),
    new Block(560, 310),
    new Block(10, 280),
    new Block(120, 280),
    new Block(230, 280),
    new Block(340, 280),
    new Block(450, 280),
    new Block(560, 280)
];


// Verwenden Sie mit dieser Funktion eine for-Schleife, 
// um die Blöcke im Raster hinzuzufügen
function addBlocks() {
    for(let i = 0; i < blocks.length; i++){
        const blockDisplay = document.createElement("div");
        blockDisplay.classList.add("block");
        blockDisplay.style.left = blocks[i].bottomLeft[0] + "px";
        blockDisplay.style.bottom = blocks[i].bottomLeft[1] + "px";
        gridDisplay.appendChild(blockDisplay);
        console.log(blocks[i].bottomLeft)
    }
}

addBlocks()




// Wir fügen den Benutzer hinzu
const userDisplay = document.createElement("div");
userDisplay.classList.add("user");
drawUser()
gridDisplay.appendChild(userDisplay);


// Wir fügen den Ball hinzu
const ballDisplay = document.createElement("div");
ballDisplay.classList.add("ball");
drawBall()
gridDisplay.appendChild(ballDisplay);


/*
    Mit dieser Funktion bringen wir den Benutzer dazu, 
    sich mit der switch-Anweisung nach links und rechts zu bewegen, 
    und dann erstellen wir einen Ereignis-Listener, der jede Bewegung 
    dieser Funktion durch Drücken der Taste abhört
*/
function moveUser(m) {
    switch(m.key){
        case 'ArrowLeft':
            if (currentPosition[0] > 0){
                currentPosition[0] -= 10;
                drawUser();
            }
            break;
        case "ArrowRight":
            if(currentPosition[0] < boardWidth - blockWidth){
                currentPosition[0] += 10;
                drawUser();
            }
            break;
    }
}
document.addEventListener("keydown", moveUser)



// Mit dieser Funktion ziehen wir den Benutzer
function drawUser() {
    userDisplay.style.left = currentPosition[0] + "px";
    userDisplay.style.bottom = currentPosition[1] + "px";
}


// Mit dieser Funktion zeichnen wir den Ball
function drawBall() {
    ballDisplay.style.left = ballCurrentPosition[0] + "px";
    ballDisplay.style.bottom = ballCurrentPosition[1] + "px";
}



/*
    Mit dieser Funktion bewegen wir den Ball, 
    indem wir die aktuelle Position des Balls zu seiner Position 
    addieren und die setInterval-Methode festlegen,
    die ihn in bestimmten Intervallen (in Millisekunden) aufruft.
*/
function moveBall(){
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall()
    checkForCollisions()
}
timerId = setInterval(moveBall, 20);


/*
    Mit dieser Funktion stellen wir sicher, 
    dass der Ball die Richtung ändert, 
    wenn die aktuelle Position des Balls auf einen Block trifft.
*/
function changeDirection(){
    if(xDirection === 2 && yDirection === 2){
        yDirection = -2;
        return
    }

    if(xDirection === 2 && yDirection === -2){
        xDirection = -2
        return
    }

    if(xDirection === -2 && yDirection === -2){
        yDirection = 2
        return
    }

    if(xDirection === -2 && yDirection === 2){
        xDirection = 2
        return 
    }
}




/*
    Und schließlich mit dieser Funktion überprüfen wir die Kollisionen und jedes Mal, 
    wenn die aktuelle Position des Balls auf einen Block trifft, 
    wird der Block entfernt und ein Punkt zur Punktzahl hinzugefügt.
*/
function checkForCollisions() {
    for(let i=0; i < blocks.length; i++){
        if(
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) && 
            (ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1]){
                const allBlocks = Array.from(document.querySelectorAll(".block"))
                allBlocks[i].classList.remove("block");
                blocks.splice(i, 1);
                changeDirection()
                score++;
                scoreDisplay.innerHTML = score

                /*
                Hier überprüfen wir, ob alle Blöcke weg sind, der Benutzer hat gewonnen, 
                und um das Spiel zu stoppen, rufen wir das clearInterval auf, um den Ball nicht mehr zu rufen, 
                damit er sich in bestimmten Intervallen bewegt, und wir stoppen den Benutzer, damit er sich bewegen kann, 
                indem wir hinzufügen der removeEventListenter
                */
                if(blocks.length === 0){
                    scoreDisplay.innerHTML = "You Win"
                    clearInterval(timerId)
                    document.removeEventListener("keydown", moveUser);
                }          
        }
    }

    // Hier überprüfen wir, ob die Richtung jedes Mal geändert wird, 
    // wenn die aktuelle Position der Kugeln auf einen Block trifft.
    if(ballCurrentPosition[0] >= (boardWidth - ballDiameter) || 
    ballCurrentPosition[1] >= (boardHeight - ballDiameter) || 
    ballCurrentPosition[0] <= 0){
        changeDirection()
    }

    // Hier stellen wir sicher, dass der Ball den Benutzer trifft
    if((ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) && 
    (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)){
        changeDirection()
    }

    // Hier prüfen wir, ob das Spiel vorbei ist
    if (ballCurrentPosition[1] <= 0){
        clearInterval(timerId)
        scoreDisplay.innerHTML = "You lose"
        document.removeEventListener("keydown", moveUser)
    }
}

