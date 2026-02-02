const axios = require('axios');
require(`dotenv`).config();

const postsService = async(query) => {
    return await axios.get(`${process.env.serviceURL}posts?${query}`);
}
module.exports = {
    postsService
}