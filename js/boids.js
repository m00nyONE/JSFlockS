class Boid{
    constructor() {
        this.position = createVector( random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2,4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 5;
        this.perceptionRadius = 50;
        this.inRadius = 0;
        this.size = boidSize;
        this.angle = 0;
        this.group = 0;
        this.avoidRadius = 100;
        this.avoidMouseRadius = 100;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.angle = atan2(this.velocity.y, this.velocity.x);
        this.acceleration.mult(0);
    }

    show() {
        strokeWeight(boidSizeSlider.value());
        if (!colorizeSwarms.checked()) {
            stroke(255);
        } else {
            if ( customColors.checked() ) {
                stroke(colorRSlider.value(), colorGSlider.value(), colorBSlider.value());
            }else {
                    stroke(map(this.inRadius, 5 , 20 , 0 , 255), map(this.inRadius, 0, 5, 50, 255), 0);
            }

        }
        push();
        translate(this.position.x, this.position.y);
        rotate(this.angle + PI/2 + 90);
        triangle(0, 0, 0.1, 0.5, -0.1, 0.5);
        pop();

        //point(this.position.x, this.position.y);
    }

    separation(boids) {
        let steering = createVector();
        let inRadius = 0;
        for (let other of boids) {
            let distance = dist( this.position.x, this.position.y, other.position.x, other.position.y );
            if ( other !== this && distance < this.perceptionRadius/2 ) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(distance);
                steering.add(diff);
                inRadius++;
            }
        }
        this.inRadius = inRadius;
        if ( inRadius > 0 ) {
            steering.div(inRadius);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    avoidBorders() {
        let steering = createVector();
        let inRadius = 0;
        let distanceTop = dist(this.position.x, this.position.y , this.position.x , 0);
        let distanceBottom = dist(this.position.x, this.position.y, this.position.x , height);
        let distanceLeft = dist(this.position.x, this.position.y, 0, this.position.y);
        let distanceRight = dist( this.position.x, this.position.y, width, this.position.y);

        if ( distanceTop < this.avoidRadius ) {
            let borderVect = createVector(this.position.x , 0);
            let diff = p5.Vector.sub(this.position, borderVect);
            diff.div(distanceTop);
            steering.add(diff);
            inRadius++;
        }
        if ( distanceBottom < this.avoidRadius ) {
            let borderVect = createVector(this.position.x , height);
            let diff = p5.Vector.sub(this.position, borderVect);
            diff.div(distanceBottom);
            steering.add(diff);
            inRadius++;
        }
        if ( distanceLeft < this.avoidRadius ) {
            let borderVect = createVector(0, this.position.y);
            let diff = p5.Vector.sub(this.position, borderVect);
            diff.div(distanceLeft);
            steering.add(diff);
            inRadius++;
        }
        if ( distanceRight < this.avoidRadius ) {
            let borderVect = createVector(width, this.position.y);
            let diff = p5.Vector.sub(this.position, borderVect);
            diff.div(distanceRight);
            steering.add(diff);
            inRadius++;
        }

        if ( inRadius > 0 ) {
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    avoidMouse() {
        let steering = createVector();
        let distance = dist(this.position.x, this.position.y , mouseX, mouseY );

        if ( distance < this.avoidMouseRadius ) {
            let borderVect = createVector(mouseX , mouseY);
            let diff = p5.Vector.sub(this.position, borderVect);
            diff.div(distance);
            steering.add(diff);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    align(boids) {
        let steering = createVector();
        let inRadius = 0;
        for (let other of boids) {
            let distance = dist( this.position.x, this.position.y, other.position.x, other.position.y );
            if ( other !== this && distance < this.perceptionRadius/2 ) {
                steering.add(other.velocity);
                inRadius++;
            }
        }
        this.inRadius = inRadius;
        if ( inRadius > 0 ) {
            steering.div(inRadius);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohesion(boids) {
        let steering = createVector();
        let inRadius = 0;
        for (let other of boids) {
            let distance = dist( this.position.x, this.position.y, other.position.x, other.position.y );
            if ( other !== this && distance < this.perceptionRadius ) {
                steering.add(other.position);
                inRadius++;
            }
        }
        this.inRadius = inRadius;
        if ( inRadius > 0 ) {
            steering.div(inRadius);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    flock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);
        let avoidBorders = this.avoidBorders();
        let avoidMouseButton = this.avoidMouse();

        alignment.mult(alignmentSlider.value());
        cohesion.mult(cohesionSlider.value());
        separation.mult(separationSlider.value());
        this.maxSpeed = maxSpeedSlider.value();
        this.perceptionRadius = perceptionRadiusSlider.value();

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
        if ( avoidBordersCheckbox.checked() ) {
            this.acceleration.add(avoidBorders);
        }
        if ( avoidMouseCheckbox.checked() ) {
            this.acceleration.add(avoidMouseButton);
        }

    }

    edges() {
        if ( this.position.x > width ) {
            this.position.x = 0;
        }else if ( this.position.x < 0 ) {
            this.position.x = width;
        }
        if ( this.position.y > height ) {
            this.position.y = 0;
        }else if ( this.position.y < 0 ) {
            this.position.y = height;
        }
    }
}
