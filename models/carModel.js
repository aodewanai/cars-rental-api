const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//марка, вартість, тип, статус, рік випуску
const CarSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    yearOfManufacture: {
        type: Number,
        required: true
    }
});

const Car = mongoose.model('cars', CarSchema);
module.exports = Car;
