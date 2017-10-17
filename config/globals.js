var fs = require('fs');

module.exports = {
    urls: function(){
        var googleMapApi = 'https://maps.googleapis.com/maps/api/';
        var obj = {
            googleMapApi : googleMapApi,
        }
        return obj;
    },
    validation: function(value) {
        if (value == '' || value == undefined){
            return true
        }
    },

    log: function(message) {

        var filename = './log/node-' + moment().format('YYYY-MM-DD') + '.log';
        var content =  moment().format('YYYY-MM-DD') + ' - ' + message +' \n\n'

        fs.stat(filename, function(err, stat) {

            if(err == null) {
                fs.appendFile(filename, content, (err) => {
                    //if (err) throw err;
                });
            } else if(err.code === 'ENOENT') {
                // file does not exist
                fs.writeFile(filename, content, (err) => {
                    // if (err) throw err;
                });
            } else {
                console.log('Some other error: ', err.code);
            }
        });
    },
}