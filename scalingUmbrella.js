const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname,"public")));
app.use('/friendlyOctoCouscous', createProxyMiddleware({ 
    target: 'http://106.54.17.129:59998', 
    changeOrigin: true,
    pathRewrite: {'^/friendlyOctoCouscous': ''},
}));
const port = 59999;
const address = '0.0.0.0';
app.listen(port,address,()=>{
	console.log("http://"+address+":"+port);
});
