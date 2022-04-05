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
    },
    editCar: async (req, res) => {
        console.log("editCar");
        try {
            let newCar = {...req.body};
            newCar._id = new ObjectId(req.body.id);
            let car = await Car.findOne({_id: new ObjectId(req.body.id)});
            if (car) {
                Object.entries(newCar).forEach(([key, value]) => {
                    car[key] = newCar[key] ?? value;
                })
                await Car.replaceOne({_id: new ObjectId(req.body.id)}, car);
                sendResult(res, 'Success', {
                    ...car._doc
                });
            } else {
                sendError(res, 400, 'Car is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    deleteCar: async (req, res) => {
        console.log("deleteCar");
        try {
            const car = await Car.findOne({_id: new ObjectId(req.params.id)});
            if (car) {
                await Car.deleteOne(car);
                sendResult(res, 'Success', {
                    ...car._doc
                });
            } else {
                sendError(res, 400, 'Car is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
}
