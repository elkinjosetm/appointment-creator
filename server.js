const express     = require( 'express' );
const serveStatic = require( 'serve-static' );
const app         = express();
const port        = 3000;

// Entry point
app.use( serveStatic( 'src', { 'index': 'index.html' } ) );

app.listen( port, error => {
	if ( error )
		return console.log( 'Oops, something went wrong', error );

	console.log( `Appointment Creator is running on http://localhost:${ port }/` );
} );
