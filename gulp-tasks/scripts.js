module.exports = function () {
	const opts    = this.opts;
	const plugins = opts.plugins;

	// app.js is your main JS file with all your module inclusions
	return plugins.browserify( { entries: `./${ opts.source }/js/app.js`, debug: true } )
		.transform( "babelify", { presets: [ "es2015" ] } )
		.bundle()
		.pipe( plugins.source( 'app.js' ) )
		.pipe( plugins.buffer() )
		.pipe( plugins.sourcemaps.init( { loadMaps : true } ) )
		.pipe( plugins.uglify())
		.pipe( plugins.sourcemaps.write() )
		.pipe( this.gulp.dest( `./${ opts.dest }/js` ) )
		.pipe( plugins.connect.reload() );
};
