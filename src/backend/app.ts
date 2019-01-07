import * as bodyParser from "body-parser";
import * as express from "express";
import path = require("path");

import { Capabilities } from "./Repository/Capabilities";
import { Data } from "./Repository/Data";
import { RestRouter } from "./Routes/REST";

const app = express();

const root = "dist";

// Resolve dependencies
const data = new Data();
const capabilities = new Capabilities();
const restApi = new RestRouter(data, capabilities).Router;

// Initialize app
app.use(express.static(path.resolve(root)));
app.use(bodyParser.json());

app.use("/REST", restApi);

export const main = {
    application: app,
    dependencies : {
        capabilitiesLayer: capabilities,
        dataLayer : data
    } };
