const Car = require('../models/carModel');
const {ObjectId} = require("mongodb");
const {sendError, sendResult} = require('./baseController');

function round(number) {
    return parseFloat(number.toFixed(2))
}

module.exports = {
    addCar: async (req, res) => {
        console.log("addCar");
        try {
            const car = new Car(req.body);
            car.status = false;
            car.cost = round(car.cost);
            console.log(car);
                await car.save();
                sendResult(res, 'Success',
                    {
                        "id": car._id,
                        "brand": car.brand,
                        "cost": car.cost,
                        "type": car.type,
                        "status": car.status?'Busy':'Free',
                        "yearOfManufacture": car.yearOfManufacture
                    });
        } catch (error) {
            sendError(res, 400, 'Bad request')
        }
    },
    getCars: async (req, res) => {
        console.log("getCars");
        try {
            console.log(Car);
            const cars = await Car.find({});
            console.log(cars);
            if (cars.length) {
                sendResult(res, 'Success', cars.map((car) => {
                    return {
                        "id": car._id,
                        "brand": car.brand,
                        "cost": car.cost,
                        "type": car.type,
                        "status": car.status?'Busy':'Free',
                        "yearOfManufacture": car.yearOfManufacture
                    }
                }));
            } else {
                sendError(res, 400, 'Cars are missing')
            }
        } catch (error) {
            sendError(res, 400, 'Bad request')
        }
    },
    getCar: async (req, res) => {
        console.log("getCar");
        try {
            const car = await Car.findOne({_id: new ObjectId(req.body.id)});
            if (car) {
                console.log('if');
                sendResult(res, 'Success', {
                    "id": car._id,
                    "brand": car.brand,
                    "cost": car.cost,
                    "type": car.type,
                    "status": car.status?'Busy':'Free',
                    "yearOfManufacture": car.yearOfManufacture
                });
            } else {
                sendError(res, 400, 'Car is missing')
            }
        } catch (error) {
            sendError(res, 400, 'Bad request')
        }
    }
}
