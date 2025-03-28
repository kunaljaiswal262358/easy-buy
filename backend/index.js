const express = require('express');
const config = require('config')
const app = express();

require('./startup/db')()
require('./startup/routes')(app)

if(!config.get('jwtPrivateKey'))
    process.exit(1)

app.listen(5000, () => console.log(`Server running on ${5000}`));
