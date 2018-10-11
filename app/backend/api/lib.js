var lib = {};
lib.cors = require('cors');
lib.cryptoJS = require('crypto-js');
lib.bodyParser = require('body-parser');
lib.express = require('express');
lib.fs = require ('fs');
lib.jsonwebtoken = require ('jsonwebtoken');
lib.http = require('http');
lib.path = require ('path');
lib.socketio = require('socket.io');
lib.base64 = require('./base64.js');

module.exports = lib;