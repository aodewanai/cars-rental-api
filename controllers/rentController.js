const Rent = require('../models/rentModel');
const Client = require('../models/clientModel');
const Car = require('../models/carModel');
const {sendError, sendResult} = require('./baseController');
const {ObjectId} = require("mongodb");

async function getOpenRentByClientId(clientId) {
    const found = await Rent.find({"clientId": clientId});
    return found.find((item) => !item.dateOfReturn);
}

function round(number) {
    return parseFloat(number.toFixed(2));
}

module.exports = {
    addRent: async (req, res) => {
        console.log("addRent");
        try {
            const rent = new Rent(req.body);
            if (!await getOpenRentByClientId(rent.clientId)) {
                const client = await Client.findOne({_id: new ObjectId(rent.clientId)});
                console.log(client);
                if (!client) {
                    sendError(res, 400, 'This client is missing');
                }
                const car = await Car.findOne({_id: new ObjectId(rent.carId)});
                console.log(car);
                if (!car.status) {
                    sendError(res, 400, 'This car is busy');
                }
                await rent.save();
                car.status = true;
                await car.save();
                sendResult(res, 'Success', {
                    "id": rent._id,
                    "clientId": rent.clientId,
                    "carId": rent.carId,
                    "dateOfIssue": rent.dateOfIssue,
                    "expectedReturnDate": rent.expectedReturnDate,
                    "dateOfReturn": rent.dateOfReturn || 'In progress',
                });
            } else {
                sendError(res, 400, 'Client already has a rent')
            }
        } catch (error) {
            sendError(res, 400, 'Bad request')
        }
    },
    getRents: async (req, res) => {
        console.log("getRents");
        try {
            const rents = await Rent.find({});
            if (rents.length) {
                sendResult(res, 'Success', rents.map((rent) => {
                    return {
                        "id": rent._id,
                        "clientId": rent.clientId,
                        "carId": rent.carId,
                        "dateOfIssue": rent.dateOfIssue,
                        "expectedReturnDate": rent.expectedReturnDate,
                        "dateOfReturn": rent.dateOfReturn || 'In progress',
                    }
                }));
            } else {
                sendError(res, 400, 'Rents are missing');
            }
        } catch (error) {
            sendError(res, 400, 'Bad request');
        }
    },
    getRent: async (req, res) => {
        console.log("getRent");
        try {
            const rent = await Rent.findOne({_id: new ObjectId(req.body.id)});
            if (rent) {
                sendResult(res, 'Success', {
                    "id": rent._id,
                    "clientId": rent.clientId,
                    "carId": rent.carId,
                    "dateOfIssue": rent.dateOfIssue,
                    "expectedReturnDate": rent.expectedReturnDate,
                    "dateOfReturn": rent.dateOfReturn || 'In progress',
                });
            } else {
                sendError(res, 400, 'Rent is missing')
            }
        } catch (error) {
            sendError(res, 400, 'Bad request')
        }
    },
    closeRent: async (req, res) => {
        console.log("closeRent");
        try {
            const rent = await Rent.findOne({_id: new ObjectId(req.body.id)});
            console.log(rent)
            if (rent && !rent.dateOfReturn) {
                const car = await Car.findOne({_id: new ObjectId(rent.carId)});
                const client = await Client.findOne({_id: new ObjectId(rent.clientId)});
                rent.dateOfReturn = new Date();
                console.log('1');
                console.log((rent.dateOfReturn - rent.dateOfIssue) / 60 / 60 / 24 / 1000);
                rent.cost = round((rent.dateOfReturn - rent.dateOfIssue) / 60 / 60 / 24 / 1000 * 15
                    + (car.yearOfManufacture > 2019 ? 10 : 0) + car.cost * 0.06);
                console.log('2');
                await rent.save();
                console.log('Save');
                console.log('if');
                const result = {
                    "id": rent._id,
                    "clientId": rent.clientId,
                    "carId": rent.carId,
                    "dateOfIssue": rent.dateOfIssue,
                    "expectedReturnDate": rent.expectedReturnDate,
                    "dateOfReturn": rent.dateOfReturn,
                    "cost": rent.cost
                };
                if (rent.expectedReturnDate < rent.dateOfReturn) {
                    result.fine = round(result.cost * 0.2);
                    client.fine ? client.fine += result.fine : client.fine = result.fine;
                    await client.save();
                }

                const rents = await Rent.findOne({clientId: new ObjectId(rent.clientId)});
                if (rents.length >= 3) {
                    result.discount = rent.cost * 0.05;
                }
                car.status = false;
                await car.save();

                sendResult(res, 'Success', result);
            } else {
                sendError(res, 400, 'This rent is not open');
            }
        } catch (error) {
            sendError(res, 400, 'Bad request')
        }
    }
}
