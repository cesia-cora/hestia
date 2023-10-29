const mysql = require("mysql");
require("dotenv").config();

const paginate = (page, size) => {
    const limit = size ? +size : 20;
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
  };
  
module.exports = { 
    paginate
}