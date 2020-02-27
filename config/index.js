require('dotenv').config()
module.exports = {  
    // Database connection information
    'database_cloud': `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mongodbinclass-p6ryn.mongodb.net/inventory?retryWrites=true&w=majority`,
    // Setting port for server
    'port': process.env.PORT || 3000   
};

