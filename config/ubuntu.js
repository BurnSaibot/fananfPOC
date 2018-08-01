var config = {
    ubuntu: {
        mode: 'ubuntu',
        db: 'mongodb://localhost:27017/fananfdb',
        filePath: "../../../",  
        port: 3000
    }
}
module.exports = config.ubuntu

/*module.exports = function(mode) {
    return config[mode || process.argv[2] || 'windows'] || config.windows;
}*/