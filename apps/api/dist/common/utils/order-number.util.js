"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = generateOrderNumber;
function generateOrderNumber() {
    var year = new Date().getFullYear();
    var random = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
    return "ORD-".concat(year, "-").concat(random);
}
