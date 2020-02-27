require('dotenv').config()
module.exports = {  
    // Database connection information
    'database_cloud': `mongodb+srv://fgomez:Andre2019..@mongodbinclass-p6ryn.mongodb.net/inventory?retryWrites=true&w=majority`,
    // Setting port for server
    'port': process.env.PORT || 3000   
};

