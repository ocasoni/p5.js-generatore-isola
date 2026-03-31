let PERLIN_SCALE = 200;
let TILE_SIZE = 10;
let SPRITES_SIZE= 20;


let acquaImage;
let pratoImage;
let sabbiaImage;
let fioreImage;
let fungoImage;


function preload() {
  acquaImage = loadImage("assets/tiles/Acqua.png");
  pratoImage = loadImage("assets/tiles/Prato.png");
  sabbiaImage = loadImage("assets/tiles/Sabbia.png");
  fioreImage = loadImage("assets/sprites/fiore.png");
  fungoImage = loadImage("assets/sprites/fungo.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  noStroke();


 let centralX = width / 2;
 let centralY = height / 2;

 //TILES 
  for (let x = 0; x < width; x= x +TILE_SIZE) {
    for (let y = 0; y < height; y= y +TILE_SIZE) {
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
      
      //Calcola colore
      let seaLevel = 0.2; // Livello del mare al 50% dell'altitudine massima
      let beachLevel = 0.25; // Livello della spiaggia al 60% dell'altitudine massima
      let img;
      
      //tiles
      if (altitude < seaLevel) {
        img = acquaImage;
      } else if (altitude < beachLevel) {
        img = sabbiaImage;
      } else {
        img = pratoImage;
      }
      
      image(img, x, y, TILE_SIZE, TILE_SIZE);

      
      
      

    }
  }
 
//SPRITES
  for (let x = 0; x < width; x= x +TILE_SIZE) {
    for (let y = 0; y < height; y= y +TILE_SIZE) {
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
      
      //Calcola colore
      let seaLevel = 0.2; // Livello del mare al 50% dell'altitudine massima
      let beachLevel = 0.25; // Livello della spiaggia al 60% dell'altitudine massima
      
    
      //fiore
      if (random() < 0.1 && altitude > beachLevel) {
        image(fioreImage, x, y, SPRITES_SIZE, SPRITES_SIZE);
      }
      //fungo
      if (random() < 0.05 && altitude > beachLevel) {
        image(fungoImage, x, y, SPRITES_SIZE, SPRITES_SIZE);
      }
      
      

    }
  }
}
