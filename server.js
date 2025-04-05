const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User= require('./Models/Users');
const Product= require('./Models/Products');
const Order= require('./Models/Orders');
const dotenv = require('dotenv');
dotenv.config();
const { products, userinfo ,orders} = require('./data');
const passport = require('passport');
const users = require('./Auth/auth');
const user = require('./routes/user');
const admin = require('./routes/admin');
const Owner =require('./routes/Business');
const upload=require('./upload/upload');
const path = require('path');

// Serve the uploads folder statically


const app = express();
app.use(cors({
    origin: 'http://localhost:3000' // Your React app's URL
  }));
  app.use('/Images', express.static(path.join(__dirname, 'Images')));
// Middleware to parse JSON and URL-encoded data
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));  // Parse incoming JSON data

app.use(passport.initialize());

// Passport config
require('./Passport/passport')(passport);


mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error(err));
// Routes
app.use('/api/auth', users);
app.use('/api/user', user);
app.use('/api/admin', admin);
app.use('/api', upload);
app.use('/owner', Owner);


app.get('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id; // Get the 'id' parameter from the
        const product = await Product.findById(productId); // Pass the id to find the product
        if (product) {
            res.json(product); // Send the product if found
        } else {
            res.status(404).json({ message: 'Product not found' }); // Send 404 if no product is found
        }
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
});


app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find(); 
        res.json(products); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
