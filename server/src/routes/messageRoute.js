const {addMessage, getMessages,deleteMessageById, updateMessageById} = require("../controllers/messageController");
const router = require('express').Router();

router.post('/addMsg/', addMessage);
router.post('/getMsg/', getMessages);
router.delete('/deleteMsg/:id', deleteMessageById);
router.patch('/updateMsg/:id', updateMessageById);

module.exports = router;
