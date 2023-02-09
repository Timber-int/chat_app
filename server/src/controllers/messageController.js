const Message = require("../model/MessageModel");
const {saveFile} = require("../service/fileService");
const {CONSTANTS} = require("../constants/constants");
const path = require("path");
const fs = require("fs");


module.exports.addMessage = async (req, res, next) => {
    try {
        const {from, to, message} = req.body;
        const photo = req.files?.photo;
        let photoFilePath;
        if (photo) {
            const {
                size,
                mimetype,
            } = photo;
            if (size > CONSTANTS.PHOTO_MAX_SIZE) {
                return res.json({msg: 'Wrong photo format, photo to big'});
            }

            if (!CONSTANTS.PHOTOS_MIMETYPES.includes(mimetype)) {
                return res.json({msg: 'Wrong photo format, mimetype not found'});
            }

            photoFilePath = await saveFile(photo);
        }

        const data = await Message.create(photo ? {
            message: {text: message},
            users: [from, to],
            sender: from,
            photo: photoFilePath,
        } : {
            message: {text: message},
            users: [from, to],
            sender: from,
        });

        if (data) return res.json({message: data});

        return res.json({meg: 'Failed to add massage to the database'});
    } catch (e) {
        next(e);
    }
};

module.exports.updateMessageById = async (req, res, next) => {
    try {
        const {message} = req.body;
        const {id} = req.params;
        const photo = req.files?.photo;
        let photoFilePath;

        if (photo) {
            const {
                size,
                mimetype,
            } = photo;
            if (size > CONSTANTS.PHOTO_MAX_SIZE) {
                return res.json({msg: 'Wrong photo format, photo to big'});
            }

            if (!CONSTANTS.PHOTOS_MIMETYPES.includes(mimetype)) {
                return res.json({msg: 'Wrong photo format, mimetype not found'});
            }

            photoFilePath = await saveFile(photo);

            const messageFromDB = await Message.findById({_id: id})

            const photoFromDB = messageFromDB?.photo;

            if (photoFromDB) {
                await fs.unlink(path.join(__dirname, '../', 'fileDirectory', 'photos', messageFromDB.photo), (err => {
                    if (err) {
                        return res.json({msg: 'Can\'t find file'});
                    }
                }));
            }
        }

        await Message.findByIdAndUpdate({_id: id}, photoFilePath ? {
            message: {text: message},
            photo: photoFilePath,
        } : {message: {text: message}});

        const data = await Message.findById({_id: id})

        if (data) return res.json({message: data});

        return res.json({meg: 'Failed to update massage in the database'});
    } catch (e) {
        next(e);
    }
};
module.exports.getMessages = async (req, res, next) => {
    try {
        const {from, to} = req.body;

        const messages = await Message.find({
            users: {
                $all: [from, to],
            },
        }).sort({updatedAt: 1});

        const projectedMessages = [...messages].map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                _id: msg._id,
                photo: msg.photo,
            };
        });

        res.json({messages: projectedMessages})
    } catch (e) {
        next(e);
    }
};

module.exports.deleteMessageById = async (req, res, next) => {
    try {
        const {id} = req.params;

        const message = await Message.findById({_id: id})
        const photo = message?.photo;
        if (photo) {
            await fs.unlink(path.join(__dirname, '../', 'fileDirectory', 'photos', photo), (err => {
                if (err) {
                    return res.json({msg: 'Can\'t find file'});
                }
            }));
        }

        if (!message) {
            return res.json({meg: 'Failed to add massage to the database'});
        }

        await Message.deleteOne({_id: id});

        res.json({message});
    } catch (e) {
        next(e);
    }
};
