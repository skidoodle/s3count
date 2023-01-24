# S3Count

This script is a simple Express.js server that listens on the port specified by the PORT environment variable. When a GET request is made to the root ("/") route, it uses the AWS SDK for JavaScript in Node.js (aws-sdk) to connect to an S3 bucket specified by the BUCKET, ACCESSKEY, SECRETKEY, ENDPOINT, and REGION environment variables. It then uses the listObjectsV2 method to retrieve a list of all objects in the bucket, iterates through the objects, and keeps a count of the number of objects and their total size in GB. The final result is returned in a JSON response with the object count and total size. If any other route is accessed, a 404 status code and JSON response are returned. The server will log that it is running and listening on the specified port.

## Installation

Clone the repository

```
git clone https://github.com/skidoodle/s3count.git
```

## Usage

Install the dependencies with [yarn](https://yarnpkg.com/)

```
yarn
```

Run the app

```
yarn start
```

You might want to use a process manager like [pm2](https://github.com/Unitech/pm2) and a reverse proxy such as [nginx](https://nginx.org/) to run the app in a production environment.

## License

[MIT](https://choosealicense.com/licenses/mit/)
