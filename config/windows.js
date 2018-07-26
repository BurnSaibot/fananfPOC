var config = {
    windows: {
        mode: 'windows',
        db: 'mongodb://KiwiLeOazo:Kiwi123.@ds117156.mlab.com:17156/fananfdb',
        filePath: "../../",
        port: 3000
    }
}

module.exports = config.windows

/*module.exports = function(mode) {
    return config[mode || process.argv[2] || 'windows'] || config.windows;
}*/