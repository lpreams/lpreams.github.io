const FONT_SIZE = 160;
const MARGIN = 100;
const VELOCITY = 1  /* don't change after here, multiplier to scale velocity with font size */  * FONT_SIZE/64;
const opts = {
    sampleFactor: 0.2
};

let font, charSize;
function preload() {
    font = loadFont('JetBrainsMono-Bold.ttf');
}

function setup() {
    let str = '';
    for (let i=0; i<getTime().length; ++i) str = str + 'X';
    rect = font.textBounds(str, 0, 0, FONT_SIZE);
    createCanvas(rect.w + MARGIN*2, rect.h + MARGIN*2);
        
    let paths = font.textToPoints(getTime(), MARGIN, height-MARGIN, FONT_SIZE, opts);
    for (let pt of paths) points.push(new Vehicle(pt.x, pt.y, pt.x, pt.y));
}

function getTime() {
    function pad(x, n, p) {
        let ret = '';
        for (let i=0; i<n-x.toString().length; ++i) ret += p?p:"0";
        ret += '' + x;
        return ret;
    }
    let d = new Date();
    return `${pad(d.getHours(), 2, ' ')}:${pad(d.getMinutes(), 2)}:${pad(d.getSeconds(), 2)}`;
}

let lastText = getTime();
let points = [];
function draw() {
    background(0);
    points.forEach(p => p.update());
    let text = getTime();
    if (text === lastText) return;
    lastText = text;    
    let paths = font.textToPoints(text, MARGIN, height-MARGIN, FONT_SIZE, opts);
    if (points.length < paths.length) {
        for (let i=0; i<points.length; ++i) points[i].target = createVector(paths[i].x, paths[i].y);
        for (let i=points.length; i<paths.length; ++i) {
            let pos = points[points.length-1].pos;
            points.push(new Vehicle(paths[i].x, paths[i].y, pos.x, pos.y));
        }
    } else {
        for (let i=0; i<paths.length; ++i) points[i].target = createVector(paths[i].x, paths[i].y);
        points.splice(paths.length);
    }
}
