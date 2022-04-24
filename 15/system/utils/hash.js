/*
    A Hash class that can be used to hash and compare passwords.
    @Author: Lance Parantar
*/
const md5 = require("md5");
class Hash {
    static encrypt(password) {
        return md5(password);
    }
}

module.exports = Hash;