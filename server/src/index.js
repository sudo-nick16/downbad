const ytdl = require('ytdl-core')
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const COOKIE = process.env.COOKIE
const PORT = process.env.PORT || 4001
const EXTENSION_URL = process.env.EXTENSION_URL

const getVideoUrls = async(vidId) => {
    const vidInfo = await ytdl.getInfo(vidId, {
        requestOptions: {
            Headers: {
                cookie: COOKIE
            }
        }
    })
    const vidUrls = {
        title: vidInfo.videoDetails?.title,
        audios: [],
        videos: [],
    }
    for(let i in vidInfo['formats']){
        const currFormat = vidInfo['formats'][i]
        if(currFormat.hasAudio === true && currFormat.isLive === false){
            if(currFormat.audioBitrate >= 128 && currFormat.hasVideo === false){
                vidUrls.audios.push({
                    url: currFormat.url,
                    quality: currFormat.audioBitrate + "kbps",
                })
            }
            if(currFormat.hasVideo === true){
                vidUrls.videos.push(
                    {
                        url: currFormat.url,
                        quality: currFormat.qualityLabel,
                    }
                )
            }
        }
    }
    return vidUrls
}

app.get("/api/:vidId", async(req, res) => {
    try{
        const vidId = ytdl.getVideoID(req.params.vidId)
        const videoUrls = await getVideoUrls(vidId)
        res.status(200).json(videoUrls)
    }catch(err){
        res.status(400).json(err.message)
    }
})

app.get("/", (_, res) => {
    res.redirect(EXTENSION_URL)
})

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

module.exports = server 
