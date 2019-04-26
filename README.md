# Github API Challenge
This is a simple API project to call the [Github API](https://developer.github.com/v3/). There are two API endpoints in this project. Click on the links below to information related to the endpoints:
* [Followers Endpoint](https://github.com/RickCoxDev/Github-API-Challenge/blob/master/docs/followers.md)
* [Repos and Stargazers Endpoint](https://github.com/RickCoxDev/Github-API-Challenge/blob/master/docs/repos-and-stargazers.md)

This API is built with [Express](https://expressjs.com/), [Nodejs](https://nodejs.org/en/), and [ClaudiaJS](https://claudiajs.com/) for deployment. Download Node on your local machine to run the API locally.

## Testing
To test the API I would recommend using [postman](https://www.getpostman.com/). Once installed you can open the postman [config file](https://github.com/RickCoxDev/Github-API-Challenge/blob/master/postman/Github%20API%20Challenge.postman_collection.json) in the postman folder in the root of the project.

There are a couple of pieces that postman needs in order to test the API.
#### User Parameter
![User Parameter](https://github.com/RickCoxDev/Github-API-Challenge/blob/master/docs/img/parameter.PNG)
This fills out the parameter in the url and uses this as the Github user for retrieving data.
#### Authorization
![Authorization](https://github.com/RickCoxDev/Github-API-Challenge/blob/master/docs/img/authorization.PNG)
In order to bypass the rate limit of the github API a github account must be used when calling the API. You will need to fill out the username and password of your github account and select "Basic Auth" in the type dropdown. Press "Preview Request" and an Authorization header will be added to your requests.
#### Environment
![Environment](https://github.com/RickCoxDev/Github-API-Challenge/blob/master/docs/img/environment.PNG)
You can select the environment for your tests in the upper right hand of postman. The development environment will send the request to the API locally and production will send it to the live API.


### Development Testing
Once you've downloaded the source code open a command prompt window and enter:
```
npm install
```
This will install the code dependencies. To run the API on your local machine run the following in a command prompt window while in the root of the project:
```
npm start
```
Make sure Environment is set to development then you can run the different endpoints in the postman app.
### Production Testing
In postman switch the Environment to production and run the requests like normal. The url for testing the live API is https://jj8xd5foha.execute-api.us-east-1.amazonaws.com/latest.