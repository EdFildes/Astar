let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

ctx.rect(0,0,canvas.width,canvas.height)
ctx.stroke()

let rows = 50
let cols = 50

let scalex = canvas.width/cols
let scaley = canvas.height/rows

let grid = new Array(rows)

// define a general square

class Square {
    constructor(y,x, wall = false){
        this.x = x,
        this.y = y,
        this.wall = wall
    }
    drawSquare(fill = "#FFF") {
        ctx.fillStyle = fill
        if(this.wall === true) {
            ctx.fillStyle = "#000"
        }
        ctx.fillRect(this.x*scalex, this.y* scalex, scalex, scaley)
        ctx.fillStyle = "#000"
        ctx.rect(this.x*scalex, this.y*scalex, scalex, scaley)
        ctx.stroke()
    }
}

// draw grid

function randomise() {
    if(Math.random() > 0.75){
        return true  
      }
}

for(let y=0; y<rows; y++){
    grid[y] = new Array(cols)
    for(let x=0; x<cols; x++){
        grid[y][x] = new Square(y,x, randomise())

        grid[y][x].drawSquare()
    }  
}


let openSet = []
let closedSet = []
let startSquare = grid[0][0]
startSquare.wall = false
startSquare.g = 0
let currentSquare = startSquare
let checkSquare
let endSquare = grid[rows-1][cols-1]
endSquare.wall = false
let tempSquare

openSet.push(startSquare)

startSquare.drawSquare("#00F")
endSquare.drawSquare("#F00")

function jump() {
    
    openSet.sort((valueA, valueB) => {valueA.f - valueB.f})
    closedSet.unshift(openSet.shift())
    currentSquare = grid[closedSet[0].y][closedSet[0].x]
    currentSquare.drawSquare("#0F0")
    startSquare.drawSquare("#00F")
}

// define f = g + h for an individual square

function findDistance(square){
    square.g = currentSquare.g + 1
    square.h = endSquare.x - square.x + endSquare.y - square.y;
    square.f = square.g + square.h;
}

//

function testSquare(checkSquare) {
    if(checkSquare.wall){

    }
    else if(closedSet.includes(checkSquare)) {
    }
    else if(!openSet.includes(checkSquare)) {
        tempSquare = checkSquare
        tempSquare.parent = new Square(currentSquare.y, currentSquare.x)
        findDistance(tempSquare);
        tempSquare.g = currentSquare.g + 1
        openSet.push(tempSquare);
        tempSquare.drawSquare("#FF0");
    }
    else if(openSet.includes(checkSquare)){
        tempSquare = checkSquare
        tempSquare.parent = new Square(currentSquare.y, currentSquare.x)
        findDistance(tempSquare)
        let getDuplicate = (element) => element.x === tempSquare.x && element.y === tempSquare.y
        let index = openSet.findIndex(getDuplicate);
        openSet[index] = tempSquare
        
  

    } 
}

// 

function findNeighbours() {
    if(currentSquare.x<cols - 1) {
        checkSquare = grid[currentSquare.y][currentSquare.x+1];
        testSquare(checkSquare)
    }
    if(currentSquare.x-1>=0) {
        checkSquare = grid[currentSquare.y][currentSquare.x-1]
        testSquare(checkSquare)
    }
    if(currentSquare.y + 1<rows) {
        checkSquare = grid[currentSquare.y + 1][currentSquare.x]; 
        testSquare(checkSquare)
    }
    if(currentSquare.y-1>=0) {
        checkSquare = grid[currentSquare.y - 1][currentSquare.x]
        testSquare(checkSquare)
    }
}




function next() {    
    jump()
    findNeighbours()
    if(closedSet.includes(endSquare)) {
        clearInterval(go)
        endSquare.drawSquare("#F00")
        let parent = closedSet[0].parent
        while(parent) {
            parent.drawSquare("#777")
            let checkParent = (element) => element.x === parent.x && element.y === parent.y
            let index = closedSet.findIndex(checkParent)
            parent = closedSet[index].parent
        }
        startSquare.drawSquare("#00F")
        console.log("DONE!!")
    }
    
    
}
let go=setInterval(()=>next(), 5)



