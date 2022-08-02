const express = require('express')
const aws = require('aws-sdk')
const app = express()
const config = require('./config.json')

const port = config.port

app.get('/', (req, res) => {
    (async function() {
        aws.config.s3 = ({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region,
            endpoint: config.endpoint,
            signatureVersion: 'v4'
        })
        let isTruncated = true
        let startAfter

        let objects = 0
        let size = 0

        const s3 = new aws.S3()

        while(isTruncated) {
            let params = { Bucket: config.bucket }
            
            if(startAfter) {
                params.StartAfter = startAfter
            }
        const data = await s3.listObjectsV2(params).promise()

        data.Contents?.forEach((object) => {
            objects++
            size += object.Size / 1024 / 1024 / 1024
        })

        isTruncated = data.IsTruncated
        if (isTruncated) {
            startAfter = data.Contents.slice(-1)[0].Key;
        }
    }
    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
    res.json({ object: objects, size: Number(size.toFixed(2)) })
    }
)()}
)

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
