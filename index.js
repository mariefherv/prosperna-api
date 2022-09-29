const express = require("express");
const port = process.env.PORT || 4000;
const app = express();

app.use(express.json());

//for userRoutes
const userRoutes = require('./routes/userRoutes');
app.use('/users',userRoutes);

//for productRoutes
const productRoutes = require('./routes/productRoutes');

app.use('/products',productRoutes);

app.listen(port,()=>console.log("API running at localhost:4000"))