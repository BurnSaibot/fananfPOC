const Subtitle = require('./Subtitle');
const _ = require('./Utils');
const fs = require('fs');

exports.stream = function(req,res,next){
    // from https://medium.com/@daspinola/video-stream-with-node-js-and-html5-320b3191a6b6
    const sub_id = req.params.id
    console.log(req.params.id)
    console.log(Subtitle.getVideoURL(sub_id))
    
        const path = Subtitle.getVideoURL(sub_id)
        const stat = fs.statSync(path)
        const fileSize = stat.size
        const range = req.headers.range

        if (range) {
            const parts = range.replace(/bytes=/,"").split("-");
            const start = parseInt(parts[0],10)
            const end = parts[1] ? parseInt(parts[0],10) : fileSize-1
            const chunkSize = (end-start)+1
            console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunkSize);


            const file = fs.createReadStream(path,{start: start,end: end});
            const head = {
                'Content-Range': "bytes " + start + "-" + end + "/" + fileSize,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(206,head);
            file.on("open",function() {
                file.pipe(res);
            }).on("error",function(){
                _.response.sendError(res,err,500);
            })
        } else {
            console.log('ALL: ' + fileSize);
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4'
            }
            res.writeHead(200,head)
            fs.createReadStream(path).pipe(res)
        }
}