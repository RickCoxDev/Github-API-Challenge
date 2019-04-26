'use strict'
const app = require('express')();
const request = require('request');

app.get('/users/:userId/followers', (req, res) => {
    // Require authentication
    if (req.headers.authorization) {
        const auth = getAuthentication(req.headers.authorization);
        getFollowersClosure(req.params.userId, auth, 3).then((data) => {
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
    // Require authentication
    if (req.headers.authorization) {
        const auth = getAuthentication(req.headers.authorization);
        getRepoStargazersClosure(req.params.userId, auth, 2).then((data) => {
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

/*
* This Closure is necessary to avoid passing a global array
* into each recursion function call so duplicates and loops
* can be avoided.
**********************************************************/
async function getFollowersClosure (user, auth, levels = 0) {
    let globalFollowers = []

    return await getFollowers(user, auth, levels);

    async function getFollowers (user, auth, levels = 0) {
        return new Promise((resolve, reject) => {
            request.get({
                url: `https://api.github.com/users/${user}/followers`,
                auth: auth,
                headers: {
                    "User-Agent": 'Github-Api-Challenge'
                }
            }, (error, response, body) => {
                body = JSON.parse(body);
                
                if (!error && response.statusCode == 200) {
                    let followers = [];
    
                    // if there are less than 5 followers limit for loop
                    for(let i = 0; i < body.length; i++) {
                        let follower = body[i].login

                        if (followers.length == 5) {
                            // if the list of followers is 5 break out of the for loop
                            break;
                        }
    
                        // if the follower name isn't in the global followers array add it.
                        if (!globalFollowers.includes(follower)) {
                            followers.push({username: follower})
                            globalFollowers.push(follower)
                        }
                    }
                    
                    // If this is the final recursion step
                    if (levels == 0) {
                        resolve(followers);
                        return;
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
}

/*
* This Closure is necessary to avoid passing a global array
* into each recursion function call so duplicates and loops
* can be avoided.
? Should getRepoStargazers and getStargazers be combined
? into one function?
**********************************************************/
async function getRepoStargazersClosure(user, auth, levels = 0) {
    let globalRepos = [];

    return await getRepoStargazers(user, auth, levels);

    async function getRepoStargazers (user, auth, levels = 0) {
        return new Promise((resolve, reject) => {
            request.get({
                url: `https://api.github.com/users/${user}/repos`,
                auth: auth,
                headers: {
                    "User-Agent": 'Github-Api-Challenge'
                }
            }, (error, response, body) => {
                body = JSON.parse(body);
    
                if (!error && response.statusCode == 200) {
                    let repos = [];
    
                    // if there are less than 5 repos limit for loop
                    for (let i = 0; i < body.length; i++) {
                        let repo = body[i].name

                        if (repos.length == 3) {
                            // if the list of repos is 3 break out of the for loop
                            break;
                        }
    
                        // if the repo name isn't in the global Repos array add it.
                        if (!globalRepos.includes(repo)) {
                            repos.push({repoName: repo})
                            globalRepos.push(repo)
                        }
                    }
    
                    let promises = [];
                    // gather all promises for getting each repo's stargazers
                    repos.forEach((repo) => {
                        // Make sure that levels can't be less than 0
                        // No need to decrease the levels here since a repo's stargazers is considered one level
                        promises.push(getStargazers(user, repo.repoName, auth, levels > 0 ? levels: 0))
                    })
    
                    // wait for all promises to resolve.
                    Promise.all(promises).then((data) => {
                        repos.forEach((repo, index) => {
                            repo.stargazers = data[index];
                        })
                        resolve(repos);
                    }).catch((e) => {
                        // catch any error with the promises
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
    
    async function getStargazers(user, repo, auth, levels = 0) {
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
    
                    // if the list of stargazers is less than 3 limit for loop
                    for (let i = 0; i < body.length; i++) {
                        stargazers.push({username: body[i].login})
                    }
    
                    // if this is the last recursion step
                    if (levels == 0) {
                        resolve(stargazers);
                        return;
                    } else {
                        let promises = [];
    
                        stargazers.forEach((user) => {
                            promises.push(getRepoStargazers(user.username, auth, levels-1));
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

}