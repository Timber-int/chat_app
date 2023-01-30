const Message = require("../model/MessageModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        const {from, to, message} = req.body;

        const data = await Message.create({
            message: {text: message},
            users: [from, to],
            sender: from
        })
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

        await Message.findByIdAndUpdate({_id: id}, {
            message: {text: message}
        });

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

        if (!message) {
            return res.json({meg: 'Failed to add massage to the database'});
        }

        await Message.deleteOne({_id: id});

        res.json({message});
    } catch (e) {
        next(e);
    }
};
