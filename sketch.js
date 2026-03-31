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
      
      let altitude = 1-normDistanceFromCenter; // Più vicino al centro, più alto

      fill(altitude * 255);
      rect(x, y, 1, 1);

    }
  }
} 
