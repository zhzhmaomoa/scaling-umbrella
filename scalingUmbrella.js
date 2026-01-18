const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const path = require("path");
app.use("/",express.static(path.join(__dirname,"./public")));
app.use('/api', createProxyMiddleware({ 
    target: "http://localhost:59998/api", 
    changeOrigin: true,
}));
app.use('/platform', createProxyMiddleware({ 
    target: "http://localhost:59999", 
    changeOrigin: true,
    pathRewrite: {'^/platform': ''},
}));
const port = 59999;
const address = 'localhost';
app.listen(port,address,()=>{
	console.log("http://"+address+":"+port);
});
