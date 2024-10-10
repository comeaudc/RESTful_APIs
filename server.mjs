// Imports
import express from 'express';
import userRoutes from './routes/userRoutes.mjs';
import postRoutes from './routes/postRoutes.mjs';
import bodyParser from 'body-parser';
import error from './utilities/error.mjs';

// Api Keys
let apiKeys = ['perscholas', 'ps-example', 'hJAsknw-L198sAJD-l3kasx'];

// Create an instance of express
const app = express();
let PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// New logging middleware to help us keep track of
// requests during testing!
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
  ${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  if (Object.keys(req.body).length > 0) {
    console.log('Containing the data:');
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// Api Middleware
app.use('/api', function (req, res, next) {
  var key = req.query['api-key'];

  // Check for the absence of a key.
  if (!key) next(error(400, "API Key Required"));

  // Check for key validity.
  if (apiKeys.indexOf(key) === -1) next(error(401, 'Invalid API Key'))

  // Valid key! Store it in req.key for route access.
  req.key = key;
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

//More Middleware for error handling and 404 not found
app.use((req, res, next) => {
  next(error(404, "Resources Not Found"))
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

// Listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
