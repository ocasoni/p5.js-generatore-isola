let PERLIN_SCALE = 50;


function setup() {
  createCanvas(200, 200);

  background(0);
  noStroke();

 let centralX = width / 2;
 let centralY = height / 2;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      //Calcola distanza dal centro 
      let distanceFromCenter = dist(centralX, centralY, x, y);
      let normDistanceFromCenter = distanceFromCenter / (width / 2);
      
      //Calcola altitudine in base alla distanza dal centro
      let altitude = 1-normDistanceFromCenter; // Più vicino al centro, più alto
      
      //Perlin
      noiseDetail(6); // Imposta dettagli e persistenza del rumore Perlin
      let Perlin = noise(x/PERLIN_SCALE, y/PERLIN_SCALE);
      altitude *= Perlin;
      
      //Calcola colore
      let seaLevel = 0.2; // Livello del mare al 50% dell'altitudine massima
      let beachLevel = 0.25; // Livello della spiaggia al 60% dell'altitudine massima
      if (altitude < seaLevel) {
        fill(0, 0, 255);
      } else if (altitude < beachLevel) {
        fill(255, 255, 0);
      } else {
        fill(0, 255, 0);
      }
      
      
      rect(x, y, 1, 1);

    }
  }
} 
