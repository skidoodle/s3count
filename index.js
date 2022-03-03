const express = require('express')
const aws = require('aws-sdk')
const app = express()
const config = require('./config.json')
const port = config.port

app.get('/', (req, res) => {
    (async function() {
        try {
            aws.config.setPromisesDependency()
            aws.config.update({
            signatureVersion: 'v4',
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            endpoint: config.endpoint,
            region: config.region
        })
        const s3 = new aws.S3()
        const params = {
            Bucket: config.bucket
        }
        const data = await s3.listObjectsV2(params).promise()
        let totalsize = data.Contents.reduce((acc, curr) => {
            return acc + curr.Size / 1024 / 1024 / 1024
        }, 0)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
            'objectCount': data.KeyCount,
            'totalSize': (Math.round(totalsize * 100) / 100)}, null, 2))
  } catch (err) {
        console.log(err)
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
            'error': err}, null, 2))
    }
}())
})

app.get('*', (req, res) => {
    (async function() {
        try {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
            'code': 'not_found',
            'status': '404',
            'path': req.originalUrl}, null, 1))
        } catch (err) {
            console.log(err)
        }
    }())
})
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})