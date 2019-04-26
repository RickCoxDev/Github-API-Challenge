'use strict'
const app = require('express')();
const request = require('request');

const port = 1000;

app.get('/users/:userId/followers', (req, res) => {
    // Require authentication
    if (req.headers.authorization) {
        const auth = getAuthentication(req.headers.authorization);
        getFollowers(req.params.userId, auth, 3).then((data) => {
            // Send success response
            res.status(200).send(data);
        }).catch((e) => {
            // Catch any errors
            res.status(e.statusCode).send({message: e.message})
        })
    } else {
        res.status(401).send({message: 'Unauthorized'});
    }

});

app.get('/users/:userId/repos/stargazers', (req, res) => {
    let globalRepos = [];

    // Require authentication
    if (req.headers.authorization) {
        const auth = getAuthentication(req.headers.authorization);
        getRepoStargazers(req.params.userId, auth, globalRepos, 3).then((data) => {
            // Send success response
            res.status(200).send(data);
        }).catch((e) => {
            // Catch any errors
            res.status(e.statusCode).send({message: e.message})
        })
    } else {
        res.status(401).send({message: 'Unauthorized'});
    }
})

module.exports = app;

function getAuthentication(authString) {
    let encoded = authString.split(' ')[1];
    let decoded = new Buffer.from(encoded, 'base64').toString('ascii');
    return {user: decoded.split(':')[0], pass: decoded.split(':')[1]}
}

async function getFollowers (user, auth, levels = 0) {
    return new Promise((resolve, reject) => {
        request.get({
            url: `https://api.github.com/users/${user}/followers`,
            auth: auth,
            headers: {
                "User-Agent": 'Github-Api-Challenge'
            },
            qs: {
                per_page: 5
            }
        }, (error, response, body) => {
            body = JSON.parse(body);
            
            if (!error && response.statusCode == 200) {
                let followers = [];

                // if there are less than 5 followers limit for loop
                for(let i = 0; i < body.length; i++) {
                    followers.push({username: body[i].login})
                }
                
                // If this is the final recursion step
                if (levels == 0) {
                    resolve(followers);
                } else {
                    let promises = [];
                    // gather all promises for a user's followers
                    followers.forEach((user) => {
                        promises.push(getFollowers(user.username, auth, levels-1))
                    })

                    // wait for all recursion promises to resolve
                    Promise.all(promises).then((data) => {
                        followers.forEach((user, index) => {
                            user.followers = data[index]
                        })
                        resolve(followers);
                    }).catch((e) => {
                        reject({
                            statusCode: e.statusCode ? e.statusCode : 500,
                            message: e.message
                        });
                    })
                }
                
            } else {
                // Something went wrong with the Github API, reject promise
                reject({
                    statusCode: response.statusCode,
                    message: body.message
                });
            }
        })
    })
}

async function getRepoStargazers (user, auth, globalRepos, levels = 0) {
    return new Promise((resolve, reject) => {
        request.get({
            url: `https://api.github.com/users/${user}/repos`,
            auth: auth,
            headers: {
                "User-Agent": 'Github-Api-Challenge'
            },
            qs: {
                per_page: 3
            }
        }, (error, response, body) => {
            body = JSON.parse(body);

            if (!error && response.statusCode == 200) {
                let repos = [];

                // if there are less than 5 followers limit for loop
                for (let i = 0; i < body.length; i++) {
                    let repo = body[i].name

                    if (!globalRepos.includes(repo)) {
                        repos.push({repoName: repo})
                        globalRepos.push(repo)
                    }
                }

                let promises = [];

                repos.forEach((repo) => {
                    promises.push(getStargazers(user, repo.repoName, auth, globalRepos, levels > 0 ? levels: 0))
                })

                Promise.all(promises).then((data) => {
                    repos.forEach((repo, index) => {
                        repo.stargazers = data[index];
                    })
                    resolve(repos);
                }).catch((e) => {
                    reject({
                        statusCode: e.statusCode ? e.statusCode : 500,
                        message: e.message
                    });
                })

                
            } else {
                // Something went wrong with the Github API, reject promise
                reject({
                    statusCode: response.statusCode,
                    message: body.message
                });
            }
        })
    })
}

async function getStargazers(user, repo, auth, globalRepos, levels = 0) {
    return new Promise((resolve, reject) => {
        request.get({
            url: `https://api.github.com/repos/${user}/${repo}/stargazers`,
            auth: auth,
            headers: {
                "User-Agent": 'Github-Api-Challenge'
            },
            qs: {
                per_page: 3
            }
        }, (error, response, body) => {
            body = JSON.parse(body);

            if (!error && response.statusCode == 200) {
                let stargazers = [];

                for (let i = 0; i < body.length; i++) {
                    stargazers.push({username: body[i].login})
                }

                if (levels == 0) {
                    resolve(stargazers);
                } else {
                    let promises = [];

                    stargazers.forEach((user) => {
                        promises.push(getRepoStargazers(user.username, auth, globalRepos, levels-1));
                    });

                    Promise.all(promises).then((data) => {
                        stargazers.forEach((user, index) => {
                            user.repos = data[index];
                        })
                        resolve(stargazers);
                    }).catch((e) => {
                        reject({
                            statusCode: e.statusCode ? e.statusCode : 500,
                            message: e.message
                        });
                    });
                }
            } else {
                // Something went wrong with the Github API, reject promise
                reject({
                    statusCode: response.statusCode,
                    message: body.message
                });
            }
        })
    })
}