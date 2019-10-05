# phone-api-assignment

An assignment comprising of 5 api for CRUD operations on a person object

REQUSTS:

Request Type: POST 
API: http://localhost:3000/api/person/number/{number}

    Request Body:
    {
        city:"string",
        username:"string"
    }

    Response Body:

    {
        "city": "string",
        "phonenumber": "string",
        "uniformIdentifier": "string"
    }

Request Type: PUT
API: http://localhost:3000/api/person/uuid/{uuid}

    Request Body:
    {
        city:"string",
        username:"string",
        phonenumber: number
    }

    Response Body:

    {
        "city": "string",
        "phonenumber": "string",
        "uniformIdentifier": "string"
    }

Request Type: GET
API: http://localhost:3000/api/person/uuid/{uuid}

    Response Body:

    {
        "city": "string",
        "phonenumber": "string",
        "uniformIdentifier": "string"
    }


Request Type: GET
API: http://localhost:3000/api/person/number/{number}

    Response Body:

    [{
        "city": "string",
        "phonenumber": "string",
        "uniformIdentifier": "string"
    },...]


Request Type: DELETE
API: http://localhost:3000/api/person/uuid/{uuid}

    Response Body:

    {
        "city": "string",
        "phonenumber": "string",
        "uniformIdentifier": "string"
    }
