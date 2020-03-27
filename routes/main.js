'use strict';
/*eslint-env node*/

//Dependencies
const express = require('express');
const router = express.Router();


//GET Routes
router.get('/', (req, res) => {
    res.json({
        status: 'Alles Gut!'
    })
});

//Export the Module
module.exports = router;
