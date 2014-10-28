(function() {
	module.exports = function(mongoose, Schema) {
		var Screenshot = new Schema({
			created	: { type : Date, default : Date.now }
			, hash : String
			, image	: { type : Buffer }
		});

		mongoose.model('Screenshot', Screenshot);
	}
})();
