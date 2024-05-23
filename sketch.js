let rows, cols;
let grid;
let cellSize = 20;
let rooms = [];
let sites;

function setup() {
  createCanvas(600, 600);
  numRooms = int(select('#numRooms').value());
  rows = int(select('#mapHeight').value());
  cols = int(select('#mapWidth').value());
  let generateButton = select('#generateButton');
  generateButton.mousePressed(generateDungeon);

}

function draw() {
  background(255);
  createEmptyGrid();
  drawDungeon();
}

function generateDungeon() {
  grid = createEmptyGrid(rows, cols);
  
  // Create T spawn room
  let tSpawnWidth = floor(random(3, 8));
  let tSpawnHeight = floor(random(3, 8));
  let tSpawnX = floor((cols - tSpawnWidth) / 2 + random(-8,8));
  let tSpawnY = 0;
  createRoom(tSpawnX, tSpawnY, tSpawnWidth, tSpawnHeight,3);
  
  // Create CT spawn room
  let ctSpawnWidth = floor(random(3, 8));
  let ctSpawnHeight = floor(random(3, 8));
  let ctSpawnX = floor((cols - ctSpawnWidth) / 2 + random(-8,8));
  let ctSpawnY = rows - ctSpawnHeight;
  createRoom(ctSpawnX, ctSpawnY, ctSpawnWidth, ctSpawnHeight,4);

  // Create A bombsite
  let bombsiteAWidth = floor(random(3, 8));
  let bombsiteAHeight = floor(random(3, 8));
  let bombsiteAX = 0;
  let bombsiteAY = floor((rows - bombsiteAHeight) / 2 + random(-8,8));
  createRoom(bombsiteAX, bombsiteAY, bombsiteAWidth, bombsiteAHeight,2);
  
  // Create B bombsite
  let bombsiteBWidth = floor(random(3, 8));
  let bombsiteBHeight = floor(random(3, 8));
  let bombsiteBX = cols - bombsiteBWidth;
  let bombsiteBY = floor((rows - bombsiteBHeight) / 2 + random(-8,8));
  createRoom(bombsiteBX, bombsiteBY, bombsiteBWidth, bombsiteBHeight,2);
  
  if (sites == 3){
    //create c spawn room in centre
    let bombsiteCWidth = floor(random(3, 8));
    let bombsiteCHeight = floor(random(3, 8));
    let bombsiteCX = (cols - bombsiteCWidth) /2 ;
    let bombsiteCY = floor((rows - bombsiteCHeight) / 2 + random(-8,8));
    createRoom(bombsiteCX, bombsiteCY, bombsiteCWidth, bombsiteCHeight,2);
  }
  
  // Create random rooms
  for (let i = 0; i < 4; i++) {
    let roomWidth = floor(random(3, 8));
    let roomHeight = floor(random(3, 8));
    let x = floor(random(cols - roomWidth));
    let y = floor(random(rows - roomHeight));
    createRoom(x, y, roomWidth, roomHeight,1);
  }

  // Connect rooms with corridors
  for (let i = 0; i < rooms.length - 1; i++) {
    let start = createVector(rooms[i].x + floor(rooms[i].w / 2), rooms[i].y + floor(rooms[i].h / 2));
    let end = createVector(rooms[i + 1].x + floor(rooms[i + 1].w / 2), rooms[i + 1].y + floor(rooms[i + 1].h / 2));
    createCorridor(start, end);
  }

  drawDungeon()
  
}

function createRoom(x, y, w, h,c) {
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      grid[j][i] = c;
    }
  }
  rooms.push({ x, y, w, h });
}

//diagonal corridors
function createCorridor(start, end) {
  let currentPosition = createVector(start.x, start.y);

  while (currentPosition.x !== end.x || currentPosition.y !== end.y) { 
    let moveX, moveY;

    if (end.x > currentPosition.x) {
      moveX = 1;
    } else if (end.x < currentPosition.x) {
      moveX = -1;
    } else {
      moveX = 0;
    }

    if (end.y > currentPosition.y) {
      moveY = 1;
    } else if (end.y < currentPosition.y) {
      moveY = -1;
    } else {
      moveY = 0;
    }

    if (currentPosition.x !== end.x && currentPosition.y !== end.y) {
      if (Math.abs(end.x - currentPosition.x) < Math.abs(end.y - currentPosition.y)) {
        currentPosition.x += moveX;
      } else {
        currentPosition.y += moveY;
      }
    } else if (currentPosition.x !== end.x) {
      currentPosition.x += moveX;
    } else if (currentPosition.y !== end.y) {
      currentPosition.y += moveY;
    }

    if (grid[currentPosition.y][currentPosition.x] === 0) {
      grid[currentPosition.y][currentPosition.x] = 1;
    }
  }
}

function createEmptyGrid(rows, cols) {
  let emptyGrid = [];
  for (let i = 0; i < rows; i++) {
    emptyGrid[i] = Array(cols).fill(0);
  }
  return emptyGrid;
}

function drawDungeon() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1) {
        fill(0);
        noStroke();
        rect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
      else if(grid[i][j] === 2) { //bomb sites
        fill(255,0,0);
        noStroke();
        rect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
      else if(grid[i][j] === 3) { //t spawn
        fill(255,189,108);
        noStroke();
        rect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
      else if(grid[i][j] === 4) { //ct spawn
        fill(48,51,88);
        noStroke();
        rect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }
  }
}
