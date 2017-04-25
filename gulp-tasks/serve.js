module.exports = function () {
	const opts    = this.opts;
	const plugins = opts.plugins;

	plugins.connect.server( {
		root       : opts.dest,
		port       : opts.port,
		livereload : true,
	} );
};
