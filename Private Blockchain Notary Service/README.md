# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
```
- Type npm install to install all the dependencies mentioned in the package.json file.
```


## Node.js framework

```
- I have used Express.js as a Node framework in my project.
- More about Express.js - Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

```
## Express Get Block Endpoint

``` 
- app.get(path, callback [, callback ...])
  Routes HTTP GET requests to the specified path with the specified callback functions.
  Example-
        app.get('/', function (req, res) {
          res.send('GET request to homepage');  
        });

- For more info- https://expressjs.com/en/4x/api.html#app.get.method
```

## Express post Block Endpoint

```
- app.post(path, callback [, callback ...])
  Routes HTTP POST requests to the specified path with the specified callback functions.
  Example-
          app.post('/', function (req, res) {
            res.send('POST request to homepage');
          });

- For more info- https://expressjs.com/en/4x/api.html#app.post.method
```


## Testing

To test code:
```
1. Open the command prompt and type- node app.js
2. Open the browser or your favorite testing tool like Postman.
3. Visit https://localhost:8000/block/{blockHeight} to get a block.
4. To post a block using post method: https://localhost:8000/block.
```

## Deployment

```
I have used postman as a testing tool to test my project.

To fetch the block type: https://localhost:8000/block/{blockHeight}

To post a block using post method: https://localhost:8000/block
post your data.

```
