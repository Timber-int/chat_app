const {registration, getUsers} = require("../controllers/userController");
const {login} = require("../controllers/userController");
const {setAvatar} = require("../controllers/userController");
const {checkIsUserExist} = require("../middleware/userMiddelware");
const router = require('express').Router();

router.post('/registration', registration);
router.post('/login', login);
router.post('/setAvatar/:id', checkIsUserExist, setAvatar);
router.get('/users/:id', getUsers);

module.exports = router;
