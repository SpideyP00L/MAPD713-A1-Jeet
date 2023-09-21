let SERVER_NAME = 'Assignment 1'
let PORT = 5000;
let HOST = '127.0.0.1:5000';

let errors = require('restify-errors');
let restify = require('restify')

  // Get a persistence engine for the products
  , usersSave = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server : %s listening at : %s', server.name, server.url)
  console.log('Endpoints : %s/products method : GET and POST', server.url)  
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all products in the system
server.get('/products', function (req, res, next) {
  console.log('GET /products params=>' + JSON.stringify(req.params));

  // Find every entity within the given collection
  productsSave.find({}, function (error, products) {

    // Return all of the users in the system
    res.send(products)
  })
})

// Get a single product by their user id
server.get('/products/:id', function (req, res, next) {
  console.log('GET /products/:id params=>' + JSON.stringify(req.params));

  // Find a single product by their id within save
  usersSave.findOne({ _id: req.params.id }, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    if (user) {
      // Send the user if no issues
      res.send(user)
    } else {
      // Send 404 header if the user doesn't exist
      res.send(404)
    }
  })
})

// Create a new user
server.post('/products', function (req, res, next) {
  console.log('POST /products params=>' + JSON.stringify(req.params));
  console.log('POST /productss body=>' + JSON.stringify(req.body));

  // validation of manadatory fields
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
  })
})

// Update a product by their id
server.put('/products/:id', function (req, res, next) {
  console.log('POST /products params=>' + JSON.stringify(req.params));
  console.log('POST /products body=>' + JSON.stringify(req.body));
  // validation of manadatory fields
  if (req.body.pId === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Product ID is Mandatory'))
  }
  if (req.body.pname === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Product Name is Mandatory'))
  }
  if (req.body.pprice === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Product Price is Mandatory'))
  }
  if (req.body.pquantity === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Product Quantity is Mandatory'))
  }

  let newProduct = {
		pId: req.body.pId,
		pname: req.body.pname, 
		pprice: req.body.pprice,
    pquantity: req.body.pquantity
	}
  
  // Update the Product with the persistence engine
  productsSave.update(newProduct, function (error, product) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})

// Delete product with the given id
server.del('/products/:id', function (req, res, next) {
  console.log('POST /products params=>' + JSON.stringify(req.params));
  // Delete the Product with the persistence engine
  productsSave.delete(req.params.id, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))

    // Send a 204 response
    res.send(204)
  })
})


