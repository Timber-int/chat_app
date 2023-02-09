const User = require("../model/UserModel");
module.exports.checkIsUserExist = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById({_id: userId});
        if (!user) {
            return res.json({
                msg: 'User is doesn\'t exist',
            });

        }

        next()
    } catch (e) {
        next(e)
    }
}
