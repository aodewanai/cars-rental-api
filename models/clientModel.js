const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//прізвище, ім’я, по батькові, адреса, телефон
const ClientSchema = new Schema({
    surname: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    middle_name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    fine: {
        type: Number,
        required: false
    }
});

const Client = mongoose.model('clients', ClientSchema);
module.exports = Client;
