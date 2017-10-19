const sphereRad = 120,
      radius_sp = 1;

function canvasApp() {
    const theCanvas = document.getElementById("canvasOne"),
          context = theCanvas.getContext("2d"),
          cache = { },
          state = { };

    state.displayWidth;
    state.displayHeight;
    state.wait;
    state.count;
    state.numToAddEachFrame;
    state.particleList;
    state.recycleBin;
    state.particleAlpha;
    state.r, state.g, state.b;
    state.fLen;
    state.m;
    state.projCenterX;
    state.projCenterY;
    state.zMax;
    state.turnAngle;
    state.turnSpeed;
    state.sphereCenterX, state.sphereCenterY, state.sphereCenterZ;
    state.particleRad;
    state.zeroAlphaDepth;
    state.randAccelX, state.randAccelY, state.randAccelZ;
    state.gravity;
    state.rgbString;

    state.p;
    state.outsideTest;
    state.nextParticle;
    state.sinAngle;
    state.cosAngle;
    state.rotX, state.rotZ;
    state.depthAlphaFactor;
    state.i;
    state.theta, state.phi;
    state.x0, state.y0, state.z0;
    state.doublePI;

    setInitState();

    function setInitState() {
        state.wait = 1;
        state.count = state.wait - 1;
        state.numToAddEachFrame = 8;
        state.doublePI = 2 * Math.PI;

        state.r = 0;
        state.g = 127;
        state.b = 163;

        state.rgbString = "rgba(" + state.r + "," + state.g + "," + state.b + ",";
        state.particleAlpha = 1;

        state.displayWidth = theCanvas.width;
        state.displayHeight = theCanvas.height;

        state.fLen = 320;

        state.projCenterX = state.displayWidth / 2;
        state.projCenterY = state.displayHeight / 2;

        state.zMax = state.fLen - 2;

        state.particleList = {};
        state.recycleBin = {};

        state.randAccelX = 0.1;
        state.randAccelY = 0.1;
        state.randAccelZ = 0.1;

        state.gravity = -0;

        state.particleRad = 2.5;

        state.sphereCenterX = 0;
        state.sphereCenterY = 0;
        state.sphereCenterZ = -3 - sphereRad;

        state.zeroAlphaDepth = -750;

        state.turnSpeed = state.doublePI / 1200;
        state.turnAngle = 0;

        setInterval(animateState, 10 / 24);
    }

    function animateState() {
        state.count++;
        if (state.count >= state.wait) {

            state.count = 0;
            for (i = 0; i < state.numToAddEachFrame; i++) {

                state.theta = Math.random() * state.doublePI;
                state.phi = Math.acos(Math.random() * 2 - 1);
                state.x0 = sphereRad * Math.sin(state.phi) * Math.cos(state.theta);
                state.y0 = sphereRad * Math.sin(state.phi) * Math.sin(state.theta);
                state.z0 = sphereRad * Math.cos(state.phi);

                const p = addParticle(
                    state.x0,
                    state.sphereCenterY + state.y0,
                    state.sphereCenterZ + state.z0,
                    0.002 * state.x0,
                    0.002 * state.y0,
                    0.002 * state.z0
                );

                p.attack = 50;
                p.hold = 50;
                p.decay = 100;
                p.initValue = 0;
                p.holdValue = state.particleAlpha;
                p.lastValue = 0;
                p.stuckTime = 90 + Math.random() * 20;

                p.accelX = 0;
                p.accelY = state.gravity;
                p.accelZ = 0;
            }
        }

        state.turnAngle = (state.turnAngle + state.turnSpeed) % (state.doublePI);
        state.sinAngle = Math.sin(state.turnAngle);
        state.cosAngle = Math.cos(state.turnAngle);

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, state.displayWidth, state.displayHeight);

        p = state.particleList.first;

        while (p != null) {

            state.nextParticle = p.next;
            p.age++;

            if (p.age > p.stuckTime) {
                p.velX += p.accelX + state.randAccelX * (Math.random() * 2 - 1);
                p.velY += p.accelY + state.randAccelY * (Math.random() * 2 - 1);
                p.velZ += p.accelZ + state.randAccelZ * (Math.random() * 2 - 1);

                p.x += p.velX;
                p.y += p.velY;
                p.z += p.velZ;
            }

            state.rotX = state.cosAngle * p.x + state.sinAngle * (p.z - state.sphereCenterZ);
            state.rotZ = -state.sinAngle * p.x + state.cosAngle * (p.z - state.sphereCenterZ) + state.sphereCenterZ;
            state.m = radius_sp * state.fLen / (state.fLen - state.rotZ);
            p.projX = state.rotX * state.m + state.projCenterX;
            p.projY = p.y * state.m + state.projCenterY;

            if (p.age < p.attack + p.hold + p.decay) {
                if (p.age < p.attack) {
                    p.alpha = (p.holdValue - p.initValue) / p.attack * p.age + p.initValue;
                }
                else if (p.age < p.attack + p.hold) {
                    p.alpha = p.holdValue;
                }
                else if (p.age < p.attack + p.hold + p.decay) {
                    p.alpha = (p.lastValue - p.holdValue) / p.decay * (p.age - p.attack - p.hold) + p.holdValue;
                }
            }
            else {
                p.dead = true;
            }

            if ((p.projX > state.displayWidth) ||
                (p.projX < 0) || (p.projY < 0) ||
                (p.projY > state.displayHeight) ||
                (state.rotZ > state.zMax)) {

                state.outsideTest = true;
            }
            else {
                state.outsideTest = false;
            }

            if (state.outsideTest || p.dead) {
                recycle(p);
            }

            else {
                state.depthAlphaFactor = (1 - state.rotZ / state.zeroAlphaDepth);
                state.depthAlphaFactor = (state.depthAlphaFactor > 1) ? 1 : ((state.depthAlphaFactor < 0) ? 0 : state.depthAlphaFactor);
                context.fillStyle = state.rgbString + state.depthAlphaFactor * p.alpha + ")";

                context.beginPath();
                context.arc(p.projX, p.projY, state.m * state.particleRad, 0, state.doublePI, false);
                context.closePath();
                context.fill();
            }

            p = state.nextParticle;
        }
    }

    function addParticle(x0, y0, z0, vx0, vy0, vz0) {
        let newParticle;

        if (state.recycleBin.first != null) {
            newParticle = state.recycleBin.first;

            if (newParticle.next != null) {
                state.recycleBin.first = newParticle.next;
                newParticle.next.prev = null;
            }
            else {
                state.recycleBin.first = null;
            }
        }

        else {
            newParticle = {};
        }

        if (state.particleList.first == null) {
            state.particleList.first = newParticle;
            newParticle.prev = null;
            newParticle.next = null;
        }
        else {
            newParticle.next = state.particleList.first;
            state.particleList.first.prev = newParticle;
            state.particleList.first = newParticle;
            newParticle.prev = null;
        }

        newParticle.x = x0;
        newParticle.y = y0;
        newParticle.z = z0;
        newParticle.velX = vx0;
        newParticle.velY = vy0;
        newParticle.velZ = vz0;
        newParticle.age = 0;
        newParticle.dead = false;

        if (Math.random() < 0.5) {
            newParticle.right = true;
        }
        else {
            newParticle.right = false;
        }
        return newParticle;
    }

    function recycle(p) {

        if (state.particleList.first == p) {
            if (p.next != null) {
                p.next.prev = null;
                state.particleList.first = p.next;
            }
            else {
                state.particleList.first = null;
            }
        } else {
            if (p.next == null) {
                p.prev.next = null;
            }
            else {
                p.prev.next = p.next;
                p.next.prev = p.prev;
            }
        }

        if (state.recycleBin.first == null) {
            state.recycleBin.first = p;
            p.prev = null;
            p.next = null;
        } else {
            p.next = state.recycleBin.first;
            state.recycleBin.first.prev = p;
            state.recycleBin.first = p;
            p.prev = null;
        }
    }
}