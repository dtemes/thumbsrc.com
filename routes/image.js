var routes = function(app, mongoose, basedir){
	var crypto = crypto = require('crypto')
	  , wkhtmltoimage = require('wkhtmltoimage').setCommand(basedir + '/bin/wkhtmltoimage-0.12.0')
	  , im = require('imagemagick')
	  , fs = require('fs')
	  , imageDir = '/tmp/';

	app.get('*', function(req, res) {
		var re = /^\/(\d+)\/(.*)/g
		  , params = re.exec(req.url)
		  , url = req.url.slice(1)
		  , size = 480
		  , sizes = [80, 160, 320, 480, 640, 800];

		var imageHash = function(url, size) {
			var size = size || null;
			if (size != null) {
				return crypto.createHash('sha1').update(url + size).digest('hex');
			} else {
				return crypto.createHash('sha1').update(url).digest('hex');
			}
		}

		var createThumb = function(buffer, callback) {
			var fileData = buffer.toString()
			  , thumbHash = imageHash(url, size);
			Screenshots.findOne({ hash: thumbHash }, function(err, screenshot){
				if (screenshot != null) {
					callback(screenshot.image);
				} else {
					if (fileData.length == 0) {
						res.send('Unable to resize');
						return;
					}

					thumbPath = imageDir + thumbHash;

					im.resize({
						srcData: fileData,
						dstPath: thumbPath,
						width: size
					}, function(err, stdout, stderr) {
						if (err) {
							res.send('Unable to resize: ' + url + ' ' + err);
							return;
						}
						var fileData = fs.readFileSync(thumbPath, 'binary')
						  , screenshot = new Screenshots({ hash: thumbHash });
						screenshot.image = fileData;
						screenshot.save(function(err){
							if (err) {
								console.log('Error saving resize', err.stack);
							}
							callback(screenshot.image);
						});
					});
				}
			});
		}

		var sendThumb = function(buffer) {
			res.writeHeader(200, {'Content-Type': 'image/jpg'});
			res.write(buffer.toString(), 'binary');
			res.end();
		}

		var getSite = function(callback) {
			Screenshots.findOne({ hash: baseHash }, function(err, screenshot){
				if (screenshot) {
					callback(screenshot);
				} else {
					var screenshot = new Screenshots({ hash: baseHash });
					wkhtmltoimage.generate(url, {width: 1280, height: 960}, function (code, signal) {
						var fileData = fs.readFileSync(imageDir + baseHash, 'binary');
						screenshot.image = fileData;
						screenshot.save(function(err){
							if (err) {
								res.send('Invalid URL ', url);
							}
							callback(screenshot);
						});
					}).pipe(fs.createWriteStream(imageDir + baseHash));
				}
			});
		}

		if (params != null) {
			size = parseInt(params[1], 10);
			url = params[2];
		}

		if (sizes.indexOf(size) == -1) {
			size = sizes[3];
		}

		if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0) {
			url = 'http://' + url;
		}

		// Escape query parameter separators
		url = url.replace(/(\&|\\\&)/g, '\\&');
		var Screenshots = mongoose.model('Screenshot')
		  , baseHash = imageHash(url)
		  , requestHash = imageHash(url, size);

		getSite(function(screenshot) {
			createThumb(screenshot.image, sendThumb);
		});
	});
}

module.exports = routes;
