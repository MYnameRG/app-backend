const bcrypt = require('bcryptjs');

module.exports = class PasswordHelpers {
    constructor() { }

    hashPassword = async (password) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash_password = await bcrypt.hash(password, salt);
            return hash_password;
        } catch (err) {
            throw new Error(err);
        }

    }

    checkPasswordCorrect = async (incoming_password, stored_password) => {
        try {
            const isPasswordCorrect = await bcrypt.compare(incoming_password, stored_password);
            return isPasswordCorrect;
        } catch (err) {
            throw new Error(err);
        }
    }
}