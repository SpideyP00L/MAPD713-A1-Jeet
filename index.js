let SERVER_NAME = 'Assignment 1'
let PORT = 5000;
let HOST = '127.0.0.1';
let errors = require('restify-errors');
let restify = require('restify')

  // Get a persistence engine for the products
  , productsSave = require('save')('products')

  // Create the restify server
let server = restify.createServer({ name: SERVER_NAME });

let getRequestCounter = 0; // Counter for GET requests
let postRequestCounter = 0; // Counter for POST requests

server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url);
  console.log('Endpoints %s/products Method : GET, POST and DELETE',server.url)
});

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Middleware to count GET and POST requests and log their values
server.use(function (req, res, next) {
  if (req.method === 'GET') {
    getRequestCounter++;
  } else if (req.method === 'POST') {
    postRequestCounter++;
  }
  console.log(`Processed Request Count--> Get:${getRequestCounter}, Post:${postRequestCounter}`);
  next();
});

// Get all products in the system
server.get('/products', function (req, res, next) {
  console.log('GET /products params=>' + JSON.stringify(req.params));

  // Find every entity within the given collection
  productsSave.find({}, function (error, products) {
    // Return all of the products in the system
    res.send(products);
  });
});

// Get a single product by their user id
server.get('/products/:id', function (req, res, next) {
  console.log('GET /products/:id params=>' + JSON.stringify(req.params));

  // Find a single product by their id within save
  productsSave.findOne({ _id: req.params.id }, function (error, user) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    if (user) {
      // Send the user if no issues
      res.send(user)
    } else {
      // Send 404 header if the user doesn't exist
      res.send(404)
    }
  });
});

// Create a new Product
server.post('/products', function (req, res, next) {
  console.log('POST /products params=>' + JSON.stringify(req.params));
  console.log('POST /products body=>' + JSON.stringify(req.body));

  // validation of mandatory fields
  if (req.body.pId === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Product ID is mandatory'))
  }
  
  if (req.body.pname === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Product Name is mandatory'))
  }

  if (req.body.pprice === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Product Price is mandatory'))
  }

  if (req.body.pquantity === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Product Quantity is mandatory'))
  }

  let newProduct = {
		pId: req.body.pId, 
		pname: req.body.pname,
    pprice: req.body.pprice,
    pquantity: req.body.pquantity
	}

  // Create the product using the persistence engine
  productsSave.create( newProduct, function (error, product) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send the product if no issues
    res.send(201, product)
  });
});

// Delete all products
server.del('/products', function (req, res, next) {
  console.log('DELETE /products');

  // Delete all products in the persistence engine
  productsSave.deleteMany({}, function (error) {
    if (error) {
      // If there are any errors, pass them to next in the correct format
      return next(new Error(JSON.stringify(error.errors)));
    }

    // Send a 204 No Content response to indicate that all products were deleted
    res.send(204);
  });
});