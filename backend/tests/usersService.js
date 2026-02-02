const axios = require('axios');
require(`dotenv`).config();

const usersService = async(query) => {
    return await axios.get(`${process.env.serviceURL}users?${query}`);
}
module.exports = {
    usersService
}