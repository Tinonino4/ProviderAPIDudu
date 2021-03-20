// Import dependencies
const express = require('express');
const path = require('path');
const router = express.Router();

let MAIN_PATH = '/.././views'

// MAIN

// Home
router.get('/', function (req, res) {
    res.sendFile('home.html', {
        root: path.join(__dirname, MAIN_PATH)
    })
});

module.exports = router;
