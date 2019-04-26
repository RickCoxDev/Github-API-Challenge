# Repos and Stargazers
Gets a list of the Github user's repos and the stargazers for those repos and repeats this process for the stargazers' repos up to three levels deep.

**URL:** `/users/:user/repos/stargazers`

**Method:** `GET`

## URL Params
**User**
* Description: The username of the Github user to retrieve data for
* Type: `string`

## Success Response
**Code:** `200`

**Content**:
```json
[
    {
        "repoName": "api-pack",
        "stargazers": [
            {
                "username": "stephenvilim",
                "repos": [
                    {
                        "repoName": "my_repo",
                        "stargazers": [
                            {
                                "username": "tfurlon2",
                                "repos": [
                                    {
                                        "repoName": "Arduino-IRremote",
                                        "stargazers": []
                                    },
                                    {
                                        "repoName": "linux-sgx",
                                        "stargazers": []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
```

## Error Responses
**Code:** `401`

**Description:** Your request was not authorized. Please make sure an Authentication header is added to your request and your username and password are entered correctly.

**Content:**
```json
{
    message: "Unauthorized"
}
```

---

**Code:** `404`

**Descripttion:** The Github username given in the url parameter was not found.

**Content:**
```json
{
    message: "Not Found"
}
```