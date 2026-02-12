const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/usersRoutes');

const app = express();

const allowedOrigins = [
  //process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174'
];

const crossOptions = {
  origins : (origin, callback) => {

          if(!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by cors"));
          }
  },
  optionsSuccessStatus : 204
};

app.use(cors(crossOptions));
app.use(express.json());

app.get('/', (req, res) => {
res.status(204).json({message : "Examino API is running successfully!"});
});

//API will go hear---------------
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Your surver is running on port no. ${PORT}`);
});