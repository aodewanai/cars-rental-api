const Client = require('../models/clientModel');
const {sendError, sendResult} = require('./baseController');
const {ObjectId} = require("mongodb");

module.exports = {
    addClient: async (req, res) => {
        console.log("addClient");
        try {
            const client = new Client(req.body);
            console.log(client);
            const found = await Client.findOne({"name": client.name});
            if (!found) {
                await client.save();
                sendResult(res, 'Success',
                    {
                        "id": client._id,
                        "surname": client.surname,
                        "name": client.name,
                        "middle_name": client.middle_name,
                        "address": client.address,
                        "telephone": client.telephone
                    });
            } else {
                sendError(res, 400, 'Client with this name already exists')
            }
        } catch (error) {
            sendError(res, 400, 'Bad request')
        }
    },
    getClients: async (req, res) => {
        console.log("getClients");
        try {
            const clients = await Client.find({});
            console.log(clients);
            if (clients.length) {
                sendResult(res, 'Success', clients.map((client) => {
                    return {
                        "id": client._id,
                        "surname": client.surname,
                        "name": client.name,
                        "middle_name": client.middle_name,
                        "address": client.address,
                        "telephone": client.telephone
                    }
                }));
            } else {
                sendError(res, 400, 'Clients are missing');
            }
        } catch (error) {
            sendError(res, 400, 'Bad request');
        }
    },
    getClient: async (req, res) => {
        console.log("getClient");
        try {
            const client = await Client.findOne({_id: new ObjectId(req.body.id)});

            if (client) {
                console.log('if');
                sendResult(res, 'Success', {
                    "id": client._id,
                    "surname": client.surname,
                    "name": client.name,
                    "middle_name": client.middle_name,
                    "address": client.address,
                    "telephone": client.telephone
                });
            } else {
                sendError(res, 400, 'Client is missing')
            }
        } catch (error) {
            sendError(res, 400, 'Bad request')
        }
    },
    deleteClient: async (req, res) => {
        console.log("deleteClient", req.params);
        try {
            const client = await Client.findOne({_id: new ObjectId(req.params.id)});
            if (client) {
                await Client.deleteOne(client);
                sendResult(res, 'Success',
                    {
                        "id": client._id,
                        "surname": client.surname,
                        "name": client.name,
                        "middle_name": client.middle_name,
                        "address": client.address,
                        "telephone": client.telephone
                    });
            } else {
                sendError(res, 400, 'Client doesnt exists')
            }
        } catch (error) {
            sendError(res, 400, 'Bad request')
        }
    }
}
