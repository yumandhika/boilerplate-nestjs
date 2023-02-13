const responseList = [
    {
        "code": 200,
        "message": "OK"
    },
    {
        "code": 201,
        "message": "Created"
    },
    {
        "code": 204,
        "message": "No Content"
    },
    {
        "code": 400,
        "message": "Bad Request"
    },
    {
        "code": 401,
        "message": "Unauthorized"
    },
    {
        "code": 403,
        "message": "Forbidden"
    },
    {
        "code": 404,
        "message": "Not Found"
    },
    {
        "code": 409,
        "message": "Conflict"
    },
    {
        "code": 500,
        "message": "Internal Server Error"
    }
]

function searchResponse(key, data){
    for (let i=0; i < data.length; i++) {
        if (data[i].code === key) {
            return data[i];
        }
    }
}

export const payloadResponse = (code = 400, message = null) => {
    let payload = {
        meta : searchResponse(code, responseList),
        data : message
    }
    return payload;
}


export const responseError = (code, error) => {
    let result = {
        meta : {
            code: code,
            message: error.message || error
        }
    }
    return result;
}