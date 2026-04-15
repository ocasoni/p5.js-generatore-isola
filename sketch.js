let PERLIN_SCALE = 200;
let TILE_SIZE = 10;
let SPRITES_SIZE= 20;

let octopusPositions = []; // Array per memorizzare le posizioni degli octopus
let tilePositions = []; // Array per memorizzare le tile
let spritePositions = []; // Array per memorizzare gli sprite
let sunPositions = []; // Array per memorizzare i sun
let farfallaPositions = []; // Array per memorizzare le farfalle animate

let farfallaSheet;
let farfallaFrames = 20; // numero di frame nella sprite sheet
let farfallaSw = 60; // larghezza di ogni frame
let farfallaSh = 60; // altezza di ogni frame
let farfallaCurrentFrame = 0;

let acquaImage;
let pratoImage;
let sabbiaImage;
let fioreImage;
let fungoImage;
let farfallaImage;
let octopusImage;
let sunImage;
let carImage;
let pietreImage;
let TreeImage;


function preload() {
  acquaImage = loadImage("assets/tiles/Acqua.png");
  pratoImage = loadImage("assets/tiles/Prato.png");
  sabbiaImage = loadImage("assets/tiles/Sabbia.png");
  fioreImage = loadImage("assets/sprites/fiore.png");
  fungoImage = loadImage("assets/sprites/fungo.png");
  farfallaImage = loadImage("assets/animals/Farfalla.png");
  octopusImage = loadImage("assets/animals/Octopus.png");
  sunImage = loadImage("assets/animals/Sun.png");
  carImage = loadImage("assets/sprites/car.png");
  pietreImage = loadImage("assets/tiles/pietre.png");
  TreeImage = loadImage("assets/tiles/Trees 3.png");
  farfallaSheet = loadImage("assets/animals/Farfalla.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(10);
  noStroke();


 let centralX = width / 2;
 let centralY = height / 2;

 //TILES - Prima pass: creazione tile base
  let treeCandidates = []; // Posizioni candidate per alberi
  let seaLevel = 0.2;
  let beachLevel = 0.25;
  let rockyLevel = 0.35;
  let treesLevel = 0.55;
  
  for (let x = 0; x < width; x= x +TILE_SIZE) {
    for (let y = 0; y < height; y= y +TILE_SIZE) {
      let altitude = computeAltitude(x, y, centralX, centralY);
      let img;
      
      //tiles
      if (altitude < seaLevel) {
        img = acquaImage;
      } else if (altitude < beachLevel) {
        img = sabbiaImage;
      } else if (altitude < rockyLevel) {
        img = pratoImage;
      } else if (altitude < treesLevel) {
        img = pietreImage;
      } else if (altitude >= treesLevel) {
        img = pratoImage; // Inizialmente metto prato
        treeCandidates.push({x: x, y: y, altitude: altitude}); // Memorizzo come candidato
      }
      
      tilePositions.push({x: x, y: y, img: img, altitude: altitude}); // Memorizza tile
    }
  }
  
  // Shuffle e raggruppa gli alberi in gruppi da 5
  shuffle(treeCandidates);
  for (let i = 0; i < treeCandidates.length; i += 5) {
    let groupSize = min(5, treeCandidates.length - i); // Ultimo gruppo potrebbe avere < 5
    for (let j = 0; j < groupSize; j++) {
      let candidate = treeCandidates[i + j];
      // Trova il tile corrispondente e cambia immagine
      let tile = tilePositions.find(t => t.x === candidate.x && t.y === candidate.y);
      if (tile) {
        tile.img = TreeImage;
      }
    }
  }
 
//SPRITES
  for (let x = 0; x < width; x= x +TILE_SIZE) {
    for (let y = 0; y < height; y= y +TILE_SIZE) {
      let altitude = computeAltitude(x, y, centralX, centralY);
      
      //Calcola colore
      let seaLevel = 0.2; // Livello del mare al 50% dell'altitudine massima
      let beachLevel = 0.25; // Livello della spiaggia al 60% dell'altitudine massima
      let pietreLevel = 0.40; // Livello delle pietre
      let treesLevel = 0.45; // Livello degli alberi
      
    
      //fiore
      if (random() < 0.03 && altitude > beachLevel && altitude < pietreLevel) {
        spritePositions.push({x: x, y: y, img: fioreImage});
      }
      //fungo
      if (random() < 0.05 && altitude > pietreLevel && altitude < treesLevel) {
        spritePositions.push({x: x, y: y, img: fungoImage});
      }
    }
  }
//ANIMALS
  for (let x = 0; x < width; x= x +TILE_SIZE) {
    for (let y = 0; y < height; y= y +TILE_SIZE) {
      let altitude = computeAltitude(x, y, centralX, centralY);
      
      //Calcola colore
      let seaLevel = 0.2; // Livello del mare al 50% dell'altitudine massima
      let beachLevel = 0.25; // Livello della spiaggia al 60% dell'altitudine massima
      let rockyLevel = 0.30; // Livello delle pietre
      let treesLevel = 0.45; // Livello degli alberi
      
    
      //farfalla animata
      if (random() < 0.08 && altitude > beachLevel && altitude < rockyLevel) {
        farfallaPositions.push({x: x, y: y, frameOffset: floor(random(farfallaFrames))});
      }
      //sun
      if (random() < 0.01 && altitude > beachLevel) {
        sunPositions.push({x: x, y: y, img: sunImage});
      }
      //octopus
      if (random() < 0.01 && altitude < seaLevel) {
        octopusPositions.push({x: x, y: y, altitude: altitude}); // Memorizza posizione
      }
    }
  }

}
function computeAltitude(x, y, centralX, centralY) {
  //Calcola distanza dal centro 
  let distanceFromCenter = dist(centralX, centralY, x, y);
  let normDistanceFromCenter = distanceFromCenter / (width / 2);
      
  //Calcola altitudine in base alla distanza dal centro
  let altitude = 1-normDistanceFromCenter; // Più vicino al centro, più alto
      
  //Perlin
  noiseDetail(6); // Imposta dettagli e persistenza del rumore Perlin
  let Perlin = noise(x/PERLIN_SCALE, y/PERLIN_SCALE);
  altitude *= Perlin;
  altitude += Perlin;
  altitude -= 0.5;

  return altitude;
}

function drawClouds() {
  // Disegna nuvole naturali generate con Perlin noise che ricoprono tutto il canvas
  fill(255, 255, 255, 100); // Bianco semi-trasparente
  noStroke();
  
  let cloudScale = 250;
  let gridSize = 150;
  
  // Movimento orizzontale continuo
  let horizontalMovement = frameCount * 0.8;
  
  for (let x = 0; x < width + gridSize * 2; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      // Usa Perlin noise per posizionare le nuvole
      let noiseVal = noise(
        (x + horizontalMovement) / cloudScale,
        y / cloudScale
      );
      
      // Se il valore di noise è sopra una soglia, disegna una nuvola
      if (noiseVal > 0.55) {
        let cloudX = (x + horizontalMovement) % (width + gridSize);
        let cloudY = y + sin(noiseVal * 10) * 30;
        let cloudOpacity = map(noiseVal, 0.55, 1, 80, 180);
        
        fill(255, 255, 255, cloudOpacity);
        
        // Disegna una nuvola grande con forma naturale (composizione di ellissi)
        ellipse(cloudX - 50, cloudY, 100, 80);
        ellipse(cloudX + 50, cloudY, 100, 80);
        ellipse(cloudX, cloudY - 30, 120, 90);
        ellipse(cloudX, cloudY + 30, 130, 85);
        ellipse(cloudX - 100, cloudY + 10, 80, 70);
        ellipse(cloudX + 100, cloudY + 10, 80, 70);
      }
    }
  }
}

function draw() {
  background(220); // Ridisegna lo sfondo per ogni frame
  
  // Disegna le tile con movimento ondulatorio per l'acqua
  for (let tile of tilePositions) {
    let offsetX = 0;
    let offsetY = 0;
    
    // Se è acqua, applica il movimento ondulatorio
    if (tile.img === acquaImage) {
      offsetY = sin(frameCount * 0.02 + tile.x / 100) * 2; // Onda sinusoidale verticale
      offsetX = cos(frameCount * 0.03) * 1; // Lieve movimento orizzontale
    }
    
    image(tile.img, tile.x + offsetX, tile.y + offsetY, TILE_SIZE, TILE_SIZE);
  }
  
  // Disegna gli sprite
  for (let sprite of spritePositions) {
    image(sprite.img, sprite.x, sprite.y, SPRITES_SIZE, SPRITES_SIZE);
  }
  
  // Disegna i sun più grandi
  for (let sun of sunPositions) {
    image(sun.img, sun.x, sun.y, 40, 40);
  }
  
  // Disegna gli octopus con movimento ondulatorio
  for (let octopus of octopusPositions) {
    let waveOffset = sin(frameCount * 0.05 + octopus.x / 50) * 3; // Movimento ondulatorio
    image(octopusImage, octopus.x, octopus.y + waveOffset, SPRITES_SIZE, SPRITES_SIZE);
  }
  
  // Disegna farfalle animate sparse sulla mappa
  for (let i = 0; i < farfallaPositions.length; i++) {
    let farfalla = farfallaPositions[i];
    let frame = (frameCount / 2 + farfalla.frameOffset) % farfallaFrames;
    let currentFrame = floor(frame);
    let farfallaSx = currentFrame * farfallaSw;
    let farfallaSy = 0;
    
    // Movimento orizzontale continuo con velocità diversa per ogni farfalla
    let speed = 3 + (i % 3) * 0.5; // velocità variabile
    let continuousX = (frameCount * speed) % (width + farfallaSw);
    
    // Leggero svolazzamento verticale
    let waveOffsetY = sin(frameCount * 0.08 + i) * 2;
    
    let displayX = continuousX;
    let displayY = farfalla.y + waveOffsetY;
    
    image(farfallaSheet, displayX, displayY, 32, 32, farfallaSx, farfallaSy, farfallaSw, farfallaSh);
  }
  
  // Disegna il livello di nuvole sopra tutto
  drawClouds();
}

