module.exports = function () {
	const opts    = this.opts;
	const plugins = opts.plugins;

	return this.gulp.src( `./${ opts.source }/css/*.css` )
		.pipe( plugins.concatCSS( 'css/app.css' ) )
		.pipe( plugins.cleanCSS() )
		.pipe( this.gulp.dest( `./${ opts.dest }/` ) )
		.pipe( plugins.connect.reload() );
};
