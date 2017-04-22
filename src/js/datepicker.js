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
		} );
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

	init();
} )();
