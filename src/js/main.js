"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nn_1 = require("./nn");
const sessionsSpan = document.querySelector("#sessions");
const errorLabel = document.querySelector("#error");
const predictionDiv = document.querySelector("#prediction");
const body = document.querySelector("body");
const comp = document.querySelector("#compliment");
const next = document.querySelector("#next");
const train = document.querySelector("#train");
const brain = new nn_1.NeuralNetwork(3, 5, 3);
let sessions = 0;
let predictValues = [0, 0, 0];
let testValues = [0, 0, 0];
const pickRandomColor = () => {
    testValues[0] = Math.random();
    testValues[1] = Math.random();
    testValues[2] = Math.random();
};
const nextColor = () => {
    pickRandomColor();
    predictValues = brain.predict(testValues);
    const target = complementryRGBColor(testValues[0] * 255, testValues[1] * 255, testValues[2] * 255);
    const err = calculateError(predictValues, target);
    errorLabel.innerHTML = `${Math.floor(err * 100)}%`;
    setBackgroundColor(body, testValues);
    setBackgroundColor(comp, target);
    setBackgroundColor(predictionDiv, predictValues);
};
next.addEventListener("mouseup", () => {
    nextColor();
});
train.addEventListener("click", (e) => {
    for (let i = 0; i < 500; i++) {
        pickRandomColor();
        const t = complementryRGBColor(testValues[0] * 255, testValues[1] * 255, testValues[2] * 255);
        brain.train(testValues, t);
        sessions++;
    }
    sessionsSpan.innerHTML = sessions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    ;
});
const calculateError = (a, b) => {
    let deltaR = Math.abs(a[0] - b[0]);
    let deltaG = Math.abs(a[1] - b[1]);
    let deltaB = Math.abs(a[2] - b[2]);
    return (deltaR + deltaG + deltaB) / 3;
};
/**
 * Calculates the complementry color of a given value
 * This function is only used for training the Neural-Network
 * @param r R value between 0 and 255
 * @param g G-Value between 0 and 255
 * @param b B-VAlue between 0 and 255
 * @returns An array containing 3 normalized numbers between 0 and 1 for r g and b
 */
const complementryRGBColor = (r, g, b) => {
    if (Math.max(r, g, b) == Math.min(r, g, b)) {
        return [255 - r, 255 - g, 255 - b];
    }
    else {
        (r /= 255), (g /= 255), (b /= 255);
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s;
        let l = (max + min) / 2;
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h = Math.round(h * 60 + 180) % 360;
        h /= 360;
        function hue2rgb(p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
        return [r, g, b];
    }
};
/**
 * Will set the backgroundColor of an Element to a given value
 * @param el The element to change the background
 * @param colors An array containing three numbers between 0 and 1
 */
const setBackgroundColor = (el, colors) => {
    const r = colors[0] * 255;
    const g = colors[1] * 255;
    const b = colors[2] * 255;
    el.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
};
nextColor();
//# sourceMappingURL=main.js.map