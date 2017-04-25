module.exports = function () {
	this.gulp.watch( `./${ this.opts.source }/js/*.js`, [ 'scripts' ] );
	this.gulp.watch( `./${ this.opts.source }/css/*.css`, [ 'styles' ] );
};

module.exports.dependencies = [ 'scripts', 'styles' ];
