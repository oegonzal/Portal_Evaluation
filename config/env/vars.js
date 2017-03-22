//32 bytes
require('crypto').randomBytes(32, function(err, buffer) {
    //process.env.SOME_32BYTE_BASE64_STRING = buffer.toString('base64');
    //console.log("1----32 byte string: " + process.env.SOME_32BYTE_BASE64_STRING);
});

//64 bytes
require('crypto').randomBytes(64, function(err, buffer) {
    //process.env.SOME_64BYTE_BASE64_STRING = buffer.toString('base64');
    //console.log("1----64 byte string: " + process.env.SOME_64BYTE_BASE64_STRING);
});

process.env.SOME_32BYTE_BASE64_STRING = 'oAjmPSPYm50lfQhiOFc61VQ9ZzUUcF31D9VCyoI+dzo=';
process.env.SOME_64BYTE_BASE64_STRING = '/E/7+Zytuh98pBfjw+1tKbf+6hR1FbMLdgFwZ+KsEZpX8K1n+RfHJUmn3xF55OhAZGd1us0o25hwatZBfGtIVQ==';