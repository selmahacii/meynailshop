"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = generateOrderNumber;
function generateOrderNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
    return `ORD-${year}-${random}`;
}
//# sourceMappingURL=order-number.util.js.map