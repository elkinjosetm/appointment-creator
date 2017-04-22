const DatePicker = ( function () {
	const currentDate = new Date();
	let classNames   = {
		wrapper           : 'datepicker',
		active            : 'datepicker__active',
		input             : 'datepicker__input',
		calendarContainer : 'datepicker__calendar-container',
		calendarTable     : 'datepicker__calendar-table',
	};

	const init = config => {
		// Use default classNames if there is no custom classNames
		// given by user
		classNames = config && config.classNames ? config.classNames : classNames;

		const datePickers = getElementsByClass( { className : `.${ classNames.wrapper }` } );

		datePickers.forEach( datePicker => {
			// Build picker layout
			renderPickerLayout( datePicker );
			addEventHandler( datePicker );
		} );
	}

	/**
	 * Function to render the calendar to be displayed when click the
	 * datePickerInput
	 *
	 * @param  {Node}   datePicker
	 */
	const renderPickerLayout = datePicker => {
		const calendarContainer = createElement( { nodeName : 'div' } );

		// Render calendar table
		calendarContainer.appendChild( buildCalendarTable() );

		// Add calendar container below the input
		calendarContainer.className = classNames.calendarContainer;
		datePicker.appendChild( calendarContainer );
	}

	/**
	 * Function to build the calendar table
	 *
	 * @param  {Date}   date
	 * @return {Node}
	 */
	const buildCalendarTable = ( date = currentDate ) => {
		const calendar = createElement( { nodeName : 'table' } );

		calendar.classList.add( classNames.calendarTable );

		// Build calendar table
		calendar.appendChild( buildTableHead( date ) );
		calendar.appendChild( buildTableBody( date ) );

		return calendar;
	}

	/**
	 * Function to build the calendar table head with WeekDays
	 *
	 * @param  {Date}   date
	 * @return {Node}
	 */
	const buildTableHead = date => {
		const thead = createElement( { nodeName : 'thead' } );
		const tr    = createElement( { nodeName : 'tr' } );

		// Get weekDays names
		const weekDays = getWeekDays( { date : date } );

		// Build calendarTable column names
		// with the weekDay name
		weekDays.forEach( day => {
			const td = createElement( { nodeName : 'td' } );
			td.innerText = day;
			tr.appendChild( td );
		} );

		thead.appendChild( tr );

		return thead;
	}

	/**
	 * Function to build the table body for a given date
	 *
	 * @param  {Date} date
	 * @return {Node}
	 */
	const buildTableBody = date => {
		const tbody     = createElement( { nodeName : 'tbody' } );
		const monthData = buildMonthData( date );

		monthData.forEach( week => tbody.appendChild( buildBodyRow( week ) ) );

		return tbody;
	}

	/**
	 * Function to build a body row
	 *
	 * @param  {Object} data
	 * @return {Node}
	 */
	const buildBodyRow = data => {
		const row = createElement( { nodeName : 'tr' } );

		data.forEach( dayData => {
			const cell   = createElement( { nodeName : 'td' } );
			const button = createElement( { nodeName : 'a' } );

			if ( dayData.today )
				cell.classList.add( 'selected' );

			button.innerText = dayData.day;

			cell.appendChild( button );

			row.appendChild( cell );
		} );

		return row;
	}

	/**
	 * Function to get the WeekDayNames array from a given date
	 *
	 * @param  {Date}   options.date
	 * @param  {String} options.format
	 * @param  {String} options.locale
	 * @return {String[]}
	 */
	const getWeekDays = ( { date, format = "narrow", locale = "en-US" } ) => {
		return Array.from( { length: 7 } ).map( ( value, index ) => {
			const newDate = new Date( date.getDate() - date.getDay() );
			newDate.setDate( index );

			// getDayName into localeString
			return newDate.toLocaleString( locale, { weekday: format } );
		} );
	}

	/**
	 * Function to uild the currentMonthData
	 *
	 * @param  {Date}        date
	 * @return {Object[]}
	 */
	const buildMonthData = date => {
		const firstDayOfMonthDate     = new Date( date.getFullYear(), date.getMonth(), 1 );
		const firstDayOfMonthPosition = firstDayOfMonthDate.getDay();

		/**
		 * Determine the firstDayOfTheWeek given the first
		 * day of the current month position in the table
		 * this value could be a day from previous month
		 */
		const firstDayOfWeekDate = new Date( firstDayOfMonthDate.setDate( firstDayOfMonthDate.getDate() - firstDayOfMonthPosition ) );

		/**
		 * Since every month, could have, up to 6 weeks,
		 * we loop an array of 6 items, and inside it
		 * we loop another array of 7 items, because every
		 * week have 7 days
		 */
		return Array.from( { length: 6 } ).map( () => {
			return Array.from( { length: 7 } ).map( () => {
				const currentDayInWeekDate = new Date( firstDayOfWeekDate );
				const currentDayInWeekDay  = firstDayOfWeekDate.getDate();

				const isToday = firstDayOfWeekDate.toDateString() === currentDate.toDateString();

				// Increase day date
				firstDayOfWeekDate.setDate( firstDayOfWeekDate.getDate() + 1 );

				 return {
					date  : currentDayInWeekDate,
					day   : currentDayInWeekDay,
					today : isToday,
				};
			} );
		} );
	}

	/**
	 * Function the create a simple DOM element
	 *
	 * @param  {String} nodeName
	 * @param  {Node}   targetElement [Element in which the node will be created (Optional)]
	 * @return {Node}
	 */
	const createElement = ( { nodeName, targetElement = document } ) => {
		return targetElement.createElement( nodeName );
	}

	/**
	 * Generic function to get elements from DOM by a className
	 *
	 * @param  {String}  className
	 * @param  {Node}    sourceElement
	 * @return {Node[]}
	 */
	const getElementsByClass = ( { className, sourceElement = document } ) => {
		return sourceElement.querySelectorAll( className );
	}

	/**
	 * Function to attach every handled datePicker related event
	 * in the DOM
	 *
	 * @param  {Node}   datePicker
	 */
	const addEventHandler = datePicker => {
		const input = getElementsByClass( { className : `.${ classNames.input }`, sourceElement : datePicker } )[ 0 ];

		input.addEventListener( 'click', event => {
			closePickers();

			if ( ! hasClass( { element: datePicker, className : classNames.active } ) )
				datePicker.classList.add( classNames.active );
		} );

		// Handle on Blur event
		document.addEventListener( 'click', blurHandler );
	}

	/**
	 * Function to close every active datePickers in DOM
	 */
	const closePickers = () => {
		const activePickers = getElementsByClass( { className : `.${ classNames.wrapper }.${ classNames.active }` } );

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
		const target     = event.target;
		const isInput    = hasClass( { element: target, className : classNames.input } );
		const isCalendar = hasClass( { element: target, className : classNames.calendarContainer } );

		// Prevent close pickers if user clicked one of the pickers
		if ( isInput || isCalendar )
			return;

		closePickers();
	}

	/**
	 * Function to determine if an element has an specific class
	 * @param  {Node}   options.element
	 * @param  {String} options.className
	 * @return {Bool}
	 */
	const hasClass = ( { element, className } ) => {
		return element.classList.contains( className );
	}

	return {
		init : init,
	};
} )();

// Initialize DatePicker
DatePicker.init();
