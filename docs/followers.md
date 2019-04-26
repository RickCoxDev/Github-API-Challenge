# Followers
Gets a list of the Github user's followers for those repos and repeats this process for the stargazers' repos up to three levels deep.

**URL:** `/users/:user/followers`

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
        "username": "jenkoian",
        "followers": [
            {
                "username": "bluefuton",
                "followers": [
                    {
                        "username": "floodedcodeboy",
                        "followers": [
                            {
                                "username": "gregsaunderson"
                            },
                            {
                                "username": "machukirk"
                            },
                            {
                                "username": "mcsaatchiLondon"
                            },
                            {
                                "username": "jayargarcia7"
                            },
                            {
                                "username": "DevOpsVal"
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