(function(){
	module.exports = function(){
		var mongoose = require('mongoose')
		  , Schema = mongoose.Schema
		  , files = ['screenshot.js']
		  , fn = 0;

		for(fn in files) {
			var path_fn = __dirname + '/models/' + files[fn]
			  , exported_model = require(path_fn);
			exported_model(mongoose, Schema);
		}
	};
})();
