const User = require('../model/UserModel');
const bcrypt = require('bcrypt');

module.exports.registration = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;

        const userNameCheck = await User.findOne({username});

        if (userNameCheck) {
            return res.json({msg: 'Username is already used', status: false});
        }

        const userEmailCheck = await User.findOne({email});

        if (userEmailCheck) {
            return res.json({msg: 'Email is already exists', status: false});
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({email, username, password: hashPassword});

        delete user.password;

        return res.json({status: true, user});
    } catch (e) {
        next(e)
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if (!user) {
            return res.json({msg: 'Username is not exist', status: false});
        }

        const comparedPassword = await bcrypt.compare(password, user.password);

        if (!comparedPassword) {
            return res.json({msg: 'Wrong username or password', status: false});
        }


        delete user.password;

        return res.json({status: true, user});
    } catch (e) {
        next(e)
    }
}

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const user = await User.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarImage,
            },
            {new: true}
        );
        return res.json({
            user,
        });
    } catch (e) {
        next(e)
    }
}

module.exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json({users});
    } catch (e) {
        next(e);
    }
};
