# Github API Challenge
This is a simple API project to call the [Github API](https://developer.github.com/v3/). There are two API endpoints in this project:
* [Followers Endpoint](docs/followers.md)
* [Repos and Stargazers Endpoint](docs/repos-and-stargazers.md)

This API is built with [Express](https://expressjs.com/) and [Nodejs](https://nodejs.org/en/). Download Node on your local machine to run the API locally.

## Testing
To test the API I would recommend using [postman](https://www.getpostman.com/). Once installed you can open the postman config file in the postman folder in the root of the project.

There are a couple of pieces that postman needs in order to test the API.
#### User Parameter
![User Parameter](docs/img/parameter.png)
This fills out the parameter in the url and uses this user for retrieving data.
#### Authorization
![Authorization](docs/img/authorization.png)
In order to bypass the rate limit of the github API a github account must be used when calling the API. You will need to fill out the username and password of your github account and select "Basic Auth" in the type dropdown. Press "Preview Request" and an Authorization header will be added to your requests.
#### Environment
![Environment](docs/img/environment.png)
You can select the environment for your tests in the upper right hand of postman. The development environment will send the request to the API locally and production will send it to the live API.


### Development
Once you've downloaded the source code open a command prompt window and enter:
```
npm install
```
This will install the code dependencies. To run the API on your local machine run the following in a command prompt window while in the root of the project:
```
npm start
```
Make sure Environment is set to development then you can run the different endpoints in the postman app.
### Production
In postman switch the Environment to production and run the requests like normal.