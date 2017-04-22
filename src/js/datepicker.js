const DatePicker = ( function () {
	let classNames = {
		wrapper  : 'datepicker',
		active   : 'datepicker__active',
		input    : 'datepicker__input',
		calendar : 'datepicker__calendar',
	};

	const init = config => {
		// Use default classNames if there is no custom classNames
		// given by user
		classNames = config && config.classNames ? config.classNames : classNames;

		const datePickers = getElementsByClass( `.${ classNames.wrapper }` );

		datePickers.forEach( datePicker => {
			// Build picker layout
			buildPickerLayout( datePicker );
			addEventHandler( datePicker );
		} );
	}

	/**
	 * Function to render the calendar to be displayed when click the
	 * datePickerInput
	 *
	 * @param  {Node}   datePicker
	 */
	const buildPickerLayout = datePicker => {
		const calendar = document.createElement( 'div' );

		// Add calendar container below the input
		calendar.className = classNames.calendar;
		datePicker.appendChild( calendar );
	}

	/**
	 * Generic function to get elements from DOM by a className
	 *
	 * @param  {String}  className
	 * @param  {Node}    sourceElement
	 * @return {Node[]}
	 */
	const getElementsByClass = ( className, sourceElement = document ) => {
		return sourceElement.querySelectorAll( className );
	}

	/**
	 * Function to attach every handled datePicker related event
	 * in the DOM
	 *
	 * @param  {Node}   datePicker
	 */
	const addEventHandler = datePicker => {
		const input = getElementsByClass( `.${ classNames.input }`, datePicker )[ 0 ];

		input.addEventListener( 'click', event => {
			closePickers();

			if ( ! datePicker.classList.contains( classNames.active ) )
				datePicker.classList.add( classNames.active );
		} );

		// Handle on Blur event
		document.addEventListener( 'click', blurHandler );
	}

	/**
	 * Function to close every active datePickers in DOM
	 */
	const closePickers = () => {
		const activePickers = getElementsByClass( `.${ classNames.wrapper }.${ classNames.active }` );

		activePickers.forEach( datePicker => {
			datePicker.classList.remove( classNames.active );
		} );
	}

	/**
	 * Function to handle every click event in DOM,
	 * mainly used to handle the blur behaviour,
	 * which should close every activeDatePicker
	 *
	 * @param  {Event}  event
	 */
	const blurHandler = event => {
		const isInput    = event.target.classList.contains( classNames.input );
		const isCalendar = event.target.classList.contains( classNames.calendar );

		// Prevent close pickers if user clicked one of the pickers
		if ( isInput || isCalendar )
			return;

		closePickers();
	}

	return {
		init : init,
	};
} )();

// Initialize DatePicker
DatePicker.init();
