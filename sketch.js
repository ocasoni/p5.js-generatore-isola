let PERLIN_SCALE = 200;
let TILE_SIZE = 10;
let SPRITES_SIZE= 20;

let octopusPositions = []; // Array per memorizzare le posizioni degli octopus
let tilePositions = []; // Array per memorizzare le tile
let spritePositions = []; // Array per memorizzare gli sprite

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

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  noStroke();


 let centralX = width / 2;
 let centralY = height / 2;

 //TILES 
  for (let x = 0; x < width; x= x +TILE_SIZE) {
    for (let y = 0; y < height; y= y +TILE_SIZE) {
      let altitude = computeAltitude(x, y, centralX, centralY);
      
      //Calcola colore
      let seaLevel = 0.2; // Livello del mare al 50% dell'altitudine massima
      let beachLevel = 0.25; // Livello della spiaggia al 60% dell'altitudine massima
      let rockyLevel = 0.35; // Livello delle pietre
      let treesLevel = 0.45; // Livello degli alberi
      let img;
      
      //tiles
      if (altitude < seaLevel) {
        img = acquaImage;
      } else if (altitude < beachLevel) {
        img = sabbiaImage;
      } else if (altitude < rockyLevel) {
        img = pratoImage;
      } else if (altitude < treesLevel) {
        img = random() < 0.30 ? pietreImage : pratoImage;
      } else {
        img = random() < 0.12 ? TreeImage : pratoImage;
      }
      
      tilePositions.push({x: x, y: y, img: img, altitude: altitude}); // Memorizza tile
    }
  }
 
//SPRITES
  for (let x = 0; x < width; x= x +TILE_SIZE) {
    for (let y = 0; y < height; y= y +TILE_SIZE) {
      let altitude = computeAltitude(x, y, centralX, centralY);
      
      //Calcola colore
      let seaLevel = 0.2; // Livello del mare al 50% dell'altitudine massima
      let beachLevel = 0.25; // Livello della spiaggia al 60% dell'altitudine massima
      let pietreLevel = 0.35; // Livello delle pietre
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
      let rockyLevel = 0.35; // Livello delle pietre
      let treesLevel = 0.45; // Livello degli alberi
      
    
      //farfalla
      if (random() < 0.02 && altitude > beachLevel && altitude < rockyLevel) {
        spritePositions.push({x: x, y: y, img: farfallaImage});
      }
      //sun
      if (random() < 0.01 && altitude > beachLevel) {
        spritePositions.push({x: x, y: y, img: sunImage});
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
  
  // Disegna gli octopus con movimento ondulatorio
  for (let octopus of octopusPositions) {
    let waveOffset = sin(frameCount * 0.05 + octopus.x / 50) * 3; // Movimento ondulatorio
    image(octopusImage, octopus.x, octopus.y + waveOffset, SPRITES_SIZE, SPRITES_SIZE);
  }
}

