'use strict';
/*eslint-env node*/

//Dependencies
const express = require('express');
const router = express.Router();


//GET Routes
router.get('/hello', (req, res) => {
    res.json({
        status: 'Alles Gut!',
        greeting: 'Hello World!'
    })
});

//Export the Module
module.exports = router;
