( function () {
	const classNames = {
		wrapper  : 'datepicker',
		active   : 'datepicker__active',
		input    : 'datepicker__input',
		calendar : 'datepicker__calendar',
	};

	const init = () => {
		const datePickers = getElementsByClass( `.${ classNames.wrapper }` );

		datePickers.forEach( datePicker => {
			// Build picker layout
			buildPickerLayout( datePicker );
			addEventHandler( datePicker );
		} );

		// Handle click out event
		document.addEventListener( 'click', blurHandler );
	}

	const getElementsByClass = ( className, sourceElement = document ) => {
		return sourceElement.querySelectorAll( className );
	}

	const buildPickerLayout = datePicker => {
		const calendar = document.createElement( 'div' );

		// Add calendar container below the input
		calendar.className = classNames.calendar;
		datePicker.appendChild( calendar );
	}

	const addEventHandler = datePicker => {
		const input = getElementsByClass( `.${ classNames.input }`, datePicker )[ 0 ];

		input.addEventListener( 'click', event => {
			closePickers();

			if ( ! datePicker.classList.contains( classNames.active ) )
				datePicker.classList.add( classNames.active );
		} );
	}

	const closePickers = () => {
		const activePickers = getElementsByClass( `.${ classNames.wrapper }.${ classNames.active }` );

		activePickers.forEach( datePicker => {
			datePicker.classList.remove( classNames.active );
		} );
	}

	const blurHandler = event => {
		const isInput    = event.target.classList.contains( classNames.input );
		const isCalendar = event.target.classList.contains( classNames.calendar );

		// Prevent close pickers if user clicked one of the pickers
		if ( isInput || isCalendar )
			return;

		closePickers();
	}

	init();
} )();
