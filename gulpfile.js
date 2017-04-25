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
	notify     : require( 'gulp-notify' ),
};

/**
 * Keep gulp from hanging on errors
 */
function handleErrors () {
	const args = Array.prototype.slice.call( arguments );
	plugins.notify.onError( {
		title   : 'Compile Error',
		message : '<%= error.message %>'
	} ).apply( this, args );
	this.emit( 'end' );
}

require( 'gulp-task-loader' )( {
	port         : 3000,
	dest         : 'dist',
	source       : 'src',
	plugins      : plugins,
	handleErrors : handleErrors,
} );
