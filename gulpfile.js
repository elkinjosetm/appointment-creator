const plugins    = {
	browserify : require( 'browserify' ),
	babelify   : require( 'babelify' ),
	source     : require( 'vinyl-source-stream' ),
	buffer     : require( 'vinyl-buffer' ),
	sourcemaps : require( 'gulp-sourcemaps' ),
	uglify     : require( 'gulp-uglify' ),
	connect    : require( 'gulp-connect' ),
	concatCSS  : require( 'gulp-concat-css' ),
	cleanCSS   : require( 'gulp-clean-css' ),
};

require( 'gulp-task-loader' )( {
	port    : 3000,
	dest    : 'dist',
	source  : 'src',
	plugins : plugins,
} );
