import { CanvasService, chars } from './canvas.service';

export const dtr = (v) => {
    return v * Math.PI / 180;
};
export const camera = {
    focus: 400,
    self: {
        x: 0,
        y: 0,
        z: 0
    },
    rotate: {
        x: 0,
        y: 0,
        z: 0
    },
    up: {
        x: 0,
        y: 1,
        z: 0
    },
    zoom: 1,
    display: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        z: 0
    }
};


const polarToRectangle = function (dX, dY, radius) {
    let x = Math.sin(dtr(dX)) * Math.cos(dtr(dY)) * radius;
    let y = Math.sin(dtr(dX)) * Math.sin(dtr(dY)) * radius;
    let z = Math.cos(dtr(dX)) * radius;
    return {x: y, y: z, z: x};
};

const vertex3d = function (param) {
    this.affineIn = {};
    this.affineOut = {};
    if (param.vertex !== undefined) {
        this.affineIn.vertex = param.vertex;
    } else {
        this.affineIn.vertex = {x: 0, y: 0, z: 0};
    }
    if (param.size !== undefined) {
        this.affineIn.size = param.size;
    } else {
        this.affineIn.size = {x: 1, y: 1, z: 1};
    }
    if (param.rotate !== undefined) {
        this.affineIn.rotate = param.rotate;
    } else {
        this.affineIn.rotate = {x: 0, y: 0, z: 0};
    }
    if (param.position !== undefined) {
        this.affineIn.position = param.position;
    } else {
        this.affineIn.position = {x: 0, y: 0, z: 0};
    }
};
vertex3d.prototype = {
    vertexUpdate: function () {
        this.affineOut = affine_process(
            this.affineIn.vertex,
            this.affineIn.size,
            this.affineIn.rotate,
            this.affineIn.position,
            camera.display
        );
    }
};

let affine_process = function (model, size, rotate, position, display) {
    let ret = world.size(model, size);
    ret = world.rotate.x(ret, rotate);
    ret = world.rotate.y(ret, rotate);
    ret = world.rotate.z(ret, rotate);
    ret = world.position(ret, position);
    ret = view.point(ret);
    ret = view.x(ret);
    ret = view.y(ret);
    ret = view.viewReset(ret);
    ret = view.righthandedReversal(ret);
    ret = CanvasService.perspective(ret);
    ret = CanvasService.display(ret, display);
    return ret;
};

export const world = {
    size: (p, size) => {
        return {
            x: p.x * size.x,
            y: p.y * size.y,
            z: p.z * size.z
        };
    },
    rotate: {
        x: function (p, rotate) {
            return {
                x: p.x,
                y: p.y * Math.cos(dtr(rotate.x)) - p.z * Math.sin(dtr(rotate.x)),
                z: p.y * Math.sin(dtr(rotate.x)) + p.z * Math.cos(dtr(rotate.x))
            };
        },
        y: function (p, rotate) {
            return {
                x: p.x * Math.cos(dtr(rotate.y)) + p.z * Math.sin(dtr(rotate.y)),
                y: p.y,
                z: -p.x * Math.sin(dtr(rotate.y)) + p.z * Math.cos(dtr(rotate.y))
            };
        },
        z: function (p, rotate) {
            return {
                x: p.x * Math.cos(dtr(rotate.z)) - p.y * Math.sin(dtr(rotate.z)),
                y: p.x * Math.sin(dtr(rotate.z)) + p.y * Math.cos(dtr(rotate.z)),
                z: p.z
            };
        }
    },
    position: function (p, position) {
        return {
            x: p.x + position.x,
            y: p.y + position.y,
            z: p.z + position.z
        };
    },
};
export const view = {
    point: (p) => {
        return {
            x: p.x - camera.self.x,
            y: p.y - camera.self.y,
            z: p.z - camera.self.z
        };
    },
    x: function (p) {
        return {
            x: p.x,
            y: p.y * Math.cos(dtr(camera.rotate.x)) - p.z * Math.sin(dtr(camera.rotate.x)),
            z: p.y * Math.sin(dtr(camera.rotate.x)) + p.z * Math.cos(dtr(camera.rotate.x))
        };
    },
    y: function (p) {
        return {
            x: p.x * Math.cos(dtr(camera.rotate.y)) + p.z * Math.sin(dtr(camera.rotate.y)),
            y: p.y,
            z: p.x * -Math.sin(dtr(camera.rotate.y)) + p.z * Math.cos(dtr(camera.rotate.y))
        };
    },
    viewReset: function (p) {
        return {
            x: p.x - camera.self.x,
            y: p.y - camera.self.y,
            z: p.z - camera.self.z
        };
    },
    righthandedReversal: function (p) {
        return {
            x: p.x,
            y: -p.y,
            z: p.z,
        };
    }
};


export class Sphere {
    flag;
    type;
    particleNum;
    center;
    targetCenter;
    radius;
    targetRadius;
    degree = [];
    freeDegreeSpeed = [];
    charsMap: any = {};
    veticies = [];
    ctx;
    vibrateFlag;

    constructor(arg, ctx, vibrateFlag) {
        this.ctx = ctx;
        this.vibrateFlag = vibrateFlag;
        this.flag = true;
        this.type = '_';
        this.particleNum = arg.particleNum;
        this.center = {x: 0, y: 0, z: 0};
        this.targetCenter = arg.center;
        this.radius = 100;
        this.targetRadius = arg.radius;
        for (let j = 0; j < this.particleNum; j++) {
            this.degree[j] = {theta: 0, phi: 0};
            this.freeDegreeSpeed[j] = {theta: 1 * Math.random() - 0.5, phi: 1 * Math.random() - 0.5};
        }

        for (let i in chars) {
            let buffer = document.getElementById(i)['getContext']('2d').getImageData(0, 0, 100, 100).data;
            this.charsMap[i] = [];
            let self = this;
            for (let j = 0; j < this.particleNum; j++) {
                let redo = function () {
                    let theta = Math.floor(Math.random() * 100);
                    let phi = Math.floor(Math.random() * 100);
                    if (buffer[(theta * 400 + (phi * 4))] === 0) {
                        self.charsMap[i].push({
                            theta: theta - 50 + 360 * Math.round(Math.random() * 2) - 1,
                            phi: phi - 50 + 360 * Math.round(Math.random() * 2) - 1
                        });
                    } else {
                        redo();
                    }
                };
                redo();
            }
        }
        this.charsMap['@'] = [];
        for (let i = 0; i < this.particleNum; i++) {
            this.charsMap['@'][i] = {theta: 360 * Math.random(), phi: 360 * Math.random()};
        }
        this.charsMap['_'] = [];
        for (let i = 0; i < this.particleNum; i++) {
            this.charsMap['_'][i] = {theta: 0, phi: 0};
        }

        for (let i = 0; i < this.particleNum; i++) {
            this.veticies[i] = new vertex3d({});
        }
    }

    update() {
        for (let i = 0; i < this.charsMap[this.type].length; i++) {
            // if (this.degree[i].theta >= 30 && this.degree[i].phi >= 30) {
            //     this.flag = true;
            //     break;
            // } else {
            //     this.flag = false;
            // }
        }
        // this.radius = this.radius + (this.targetRadius - this.radius) / 8;
        this.center.x = this.center.x + (this.targetCenter.x - this.center.x) / 8;
        this.center.y = this.center.y + (this.targetCenter.y - this.center.y) / 8;
        this.center.z = this.center.z + (this.targetCenter.z - this.center.z) / 8;
        for (let i = 0; i < this.charsMap[this.type].length; i++) {
            // if (this.type === '@') {
            //     this.charsMap[this.type][i].theta += this.freeDegreeSpeed[i].theta;
            //     this.charsMap[this.type][i].phi += this.freeDegreeSpeed[i].phi;
            // }
            //     this.charsMap[this.type][i].theta += this.freeDegreeSpeed[i].theta;
            //     this.charsMap[this.type][i].phi += this.freeDegreeSpeed[i].phi;

            this.degree[i].theta = this.degree[i].theta + (this.charsMap[this.type][i].theta - this.degree[i].theta) / (4 + 20 * Math.random());
            this.degree[i].phi = this.degree[i].phi + (this.charsMap[this.type][i].phi - this.degree[i].phi) / (6 + 20 * Math.random());

            let getPosition;

            if (this.vibrateFlag === true) {
                getPosition = polarToRectangle(this.degree[i].theta + 90, this.degree[i].phi, this.radius + Math.random() * 10);
            } else {
                getPosition = polarToRectangle(this.degree[i].theta + 90, this.degree[i].phi, this.radius);
            }

            this.veticies[i].affineIn.vertex = {
                x: getPosition.x,
                y: getPosition.y,
                z: getPosition.z
            };

            // this.center.x
            this.veticies[i].affineIn.position = {
                x: this.center.x,
                y: this.center.y,
                z: this.center.z
            };
            this.veticies[i].vertexUpdate();
        }
    }

    draw() {
        if (this.flag === true) {
            this.ctx.beginPath();
            for (let i = 0; i < this.veticies.length; i++) {
                for (let j = i; j < this.veticies.length; j++) {

                    let distance =
                        (this.veticies[i].affineOut.x - this.veticies[j].affineOut.x) * (this.veticies[i].affineOut.x - this.veticies[j].affineOut.x) +
                        (this.veticies[i].affineOut.y - this.veticies[j].affineOut.y) * (this.veticies[i].affineOut.y - this.veticies[j].affineOut.y);

                    if (distance <= this.radius * 3) {
                        this.ctx.moveTo(
                            this.veticies[i].affineOut.x,
                            this.veticies[i].affineOut.y
                        );
                        this.ctx.lineTo(
                            this.veticies[j].affineOut.x,
                            this.veticies[j].affineOut.y
                        );
                    }
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }
}
