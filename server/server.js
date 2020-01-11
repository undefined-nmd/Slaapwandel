
import config from './config';

import express from 'express'
import http from 'http';
import path from 'path';


const express = require('express')
const app = express();
const http = require('http')

app.get('*', (req, res) => {
    if (config.nodeEnvironment === 'Production') {
        res.sendFile(path.join(__dirname, './index.html'));
    } else {
        res.sendFile(path.join(__dirname, './index.html'));
    }
  
});

// Global Application Error Handler
/*
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    const obj = {
        error: {
            message: error.message,
            status: error.status,
            timestamp: new Date().getTime(),
        },
    };


    if (req.xhr) {
        res.json(obj);
    } else if (!req.xhr && error.status === 404) {
        res.render('404', obj);
    } else {
        res.render('error', obj);
    }
    return next();
});
*/
// Create the http Node.js server

// Launch the http server: ip and port
const httpServer = http.Server(app);

// Launch the http server: ip and port
httpServer.listen(config.nodePort, config.nodeHostname, () => {
    logger.log({ level: 'info', message: `Server is running at http://${config.nodeHostname}:${config.nodePort} !` });
});

export default app