const path = require("path");
const {
    v4: uuidv4,
} = require('uuid');

module.exports.saveFile = async (file) => {
    try {
        let filePath;

        const fileName = `${uuidv4()}.jpg`;

        filePath = path.resolve(__dirname, '../', 'fileDirectory', 'photos', fileName);

        file.mv(filePath);
        return fileName;
    } catch (e) {
        throw new Error(e.message);
    }
}
