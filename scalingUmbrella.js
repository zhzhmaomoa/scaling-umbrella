const express = require("express");
require("dotenv").config();
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const path = require("path");
app.use('/platform',express.static(path.join(__dirname,"./public")));
app.use('/platform', createProxyMiddleware({ 
    target: process.env.BASE_URL, 
    changeOrigin: true,
    pathRewrite: {'^/platform': ''},
}));
const port = 59999;
const address = '0.0.0.0';
app.listen(port,address,()=>{
	console.log("http://"+address+":"+port);
});
