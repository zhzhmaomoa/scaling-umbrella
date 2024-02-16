const express = require("express");
require("dotenv").config();
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname,"public")));
app.use('/friendlyOctoCouscous', createProxyMiddleware({ 
    target: process.env.BASE_URL, 
    changeOrigin: true,
    pathRewrite: {'^/friendlyOctoCouscous': ''},
}));
const port = 59999;
const address = '0.0.0.0';
app.listen(port,address,()=>{
	console.log("http://"+address+":"+port);
});
