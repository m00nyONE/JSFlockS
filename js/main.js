const flock = [];

var placeMode = "boids";
var spawnCount = 75;
var boidSize = 4;
var avoidMouse = 0;
var boidsCount = 0;

let alignmentSlider, cohesionSlider, separationSlider, perceptionRadiusSlider, maxSpeedSlider, boidSizeSlider, randomSpawnCount, colorizeSwarms, customColors, colorRSlider, colorGSlider, colorBSlider, avoidBordersCheckbox, avoidMouseCheckbox;
var canvas;

window.onresize = function() {
    canvas.size(window.innerWidth, window.innerHeight);
    width = window.innerWidth;
    height = window.innerHeight;
};

function mousePressed() {
    switch (placeMode) {
        case "boids":
            if (!randomSpawnCount.checked()) {
                spawncount = 1;
            } else {
                spawncount = random(1, 10);
            }
            for ( var i = 0; i < spawncount; i++){
                newBoid = new Boid();
                newBoid.position.x = mouseX;
                newBoid.position.y = mouseY;
                flock.push(newBoid);
                boidsCount = boidsCount + 1;
            }
            break;
        case "wall":
            break;
        case "ball":
            break;
        default:
            break;
    }
}

function spawnRandomBoids() {
    for ( let i = 0; i < spawnCount; i++) {
        flock.push(new Boid());
        boidsCount = boidsCount + 1;
    }
}

function setup() {
    angleMode(DEGREES);
    canvas = createCanvas(window.innerWidth,window.innerHeight);
    textSize(15);

    alignmentSlider = createSlider(0, 2, 1, 0.1);
    cohesionSlider = createSlider(0, 2, 0.7, 0.1);
    separationSlider = createSlider(0, 2, 1.2, 0.1);
    perceptionRadiusSlider = createSlider(0, 500, 50, 1);
    maxSpeedSlider = createSlider( 0, 25, 4, 0.1);
    boidSizeSlider = createSlider( 2, 15, 6, 0.1);
    randomSpawnCount = createCheckbox("randomize SpawnCount");
    colorizeSwarms = createCheckbox("colorized swarms");
    customColors = createCheckbox("custom color swarms");
    avoidBordersCheckbox = createCheckbox("avoid Borders");
    avoidMouseCheckbox = createCheckbox("avoid Mouse");
    colorizeSwarms.attribute('checked',null);
    customColors.attribute('unchecked',null);
    avoidBordersCheckbox.attribute('unchecked', null);
    avoidMouseCheckbox.attribute('unchecked', null);
    colorRSlider = createSlider(0, 255, 50, 1);
    colorGSlider = createSlider(0, 255, 50, 1);
    colorBSlider = createSlider(0, 255, 50, 1);

    alignmentSlider.position(10,10);
    cohesionSlider.position(10,35);
    separationSlider.position(10,60);
    perceptionRadiusSlider.position(10,85);
    maxSpeedSlider.position(10,110);
    boidSizeSlider.position(10, 135);
    randomSpawnCount.position(10,160);
    colorizeSwarms.position(10,185);
    customColors.position(10,210);
    avoidBordersCheckbox.position(10,235);
    avoidMouseCheckbox.position(10,260);

    // will get replaced by a button
    spawnRandomBoids();
    //
}

function draw() {
   background(10,10,10);

   for ( let boid of flock ) {
       boid.edges();
       boid.flock(flock);
       boid.update();
       boid.show();
   }

   strokeWeight(4);
   stroke(255);

    if ( customColors.checked() )
    {
        colorRSlider.show();
        colorGSlider.show();
        colorBSlider.show();

        text('Red', colorRSlider.x * 2 + colorRSlider.width, colorRSlider.y + 15 );
        text('Green', colorGSlider.x * 2 + colorGSlider.width, colorGSlider.y + 15 );
        text('Blue', colorBSlider.x * 2 + colorBSlider.width, colorBSlider.y + 15 );

        colorRSlider.position(10, 285);
        colorGSlider.position(10, 310);
        colorBSlider.position(10, 335);
    }else
    {
        colorRSlider.hide();
        colorGSlider.hide();
        colorBSlider.hide();
    }

    text('alignment', alignmentSlider.x * 2 + alignmentSlider.width, alignmentSlider.y + 15);
    text('cohesion', cohesionSlider.x * 2 + cohesionSlider.width, cohesionSlider.y + 15 );
    text('separation', separationSlider.x * 2 + separationSlider.width, separationSlider.y + 15 );
    text('perception', perceptionRadiusSlider.x * 2 + perceptionRadiusSlider.width, perceptionRadiusSlider.y + 15 );
    text('Speed', maxSpeedSlider.x * 2 + maxSpeedSlider.width, maxSpeedSlider.y + 15 );

    text('Size', boidSizeSlider.x * 2 + boidSizeSlider.width, boidSizeSlider.y + 15);

    text('Amount: '+ (boidsCount), width - 120, 20)
}




