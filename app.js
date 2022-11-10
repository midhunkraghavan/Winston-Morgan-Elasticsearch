const express = require('express');
const morgan = require('morgan');
const logger = require('./logger');
const api = require('./api');

const app = express();

app.use(morgan(logger.morganFormat.json, {stream: logger.jsonStream}));

app.use("/api", api);

app.listen(3003, () => {
    logger.info("App started")
    console.log("App started");
});
