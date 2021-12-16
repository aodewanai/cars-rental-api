const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RentSchema = new Schema({
    carId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    dateOfIssue: {
        type: Date,
        required: true
    },
    expectedReturnDate: {
        type: Date,
        required: true
    },
    dateOfReturn: {
        type: Date,
        required: false
    },
    cost: {
        type: Number,
        required: false
    }
});

const Rent = mongoose.model('rents', RentSchema);
module.exports = Rent;
