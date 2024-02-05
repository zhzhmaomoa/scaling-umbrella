const express = require("express");
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname,"public")));
const port = 8081;
const address = '0.0.0.0';
app.listen(port,address,()=>{
	console.log("http://"+address+":"+port);
});
