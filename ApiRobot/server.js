const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userController = require('./controllers/userController');
const robotController = require('./controllers/robotController');
const app = express();
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use(cors());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Connection à MongoDB
const uri = 'mongodb+srv://jdidiaziz38:b1bNji14KlHB6Gqr@cluster0.cmqfoyo.mongodb.net/urRobot';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to MongoDB successfully');
});

db.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Routes pour manipuler les utilisateurs
app.post('/sign-in', userController.SignIn);
app.post('/sign-up', userController.SignUp);

app.get('/users', userController.getUsers);

app.get('/users/:id', userController.getUserById);
app.post('/users', userController.createUser);
app.patch('/users/:id', userController.updateUser);
app.patch('/users', userController.updateUser);
app.delete('/users/:id', userController.deleteUser);

// Routes pour manipuler les robots
app.get('/robots', robotController.getRobots);
app.get('/robots/:id', robotController.getRobotById);
app.post('/robots', robotController.createRobot);
app.patch('/robots/:id', robotController.updateRobot);
app.delete('/robots/:id', robotController.deleteRobot);





