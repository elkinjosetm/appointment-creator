const DatePicker = ( function () {
	const currentDate = new Date();
	let classNames   = {
		wrapper           : 'datepicker',
		active            : 'datepicker__active',
		input             : 'datepicker__input',
		calendarContainer : 'datepicker__calendar-container',
		calendarTable     : 'datepicker__calendar-table',
		calendarDay       : 'datepicker__calendar-table__day',
	};

	const init = config => {
		// Use default classNames if there is no custom classNames
		// given by user
		classNames = config && config.classNames ? config.classNames : classNames;

		const datePickers = getElementsByClass( { className : `.${ classNames.wrapper }` } );

		// Attach onClick event to every datePicker input
		datePickers.forEach( addPickerEventHandler );

		// Handle on Blur event
		document.addEventListener( 'click', blurHandler );
	}

	/**
	 * Function to attach onClick event to the given datePicker
	 *
	 * @param  {Node}   datePicker
	 */
	const addPickerEventHandler = datePicker => {
		const input = getElementsByClass( { className : `.${ classNames.input }`, sourceElement : datePicker } )[ 0 ];

		// Render initial calendar
		render( { datePicker : datePicker } );

		input.addEventListener( 'click', event => {
			closePickers();

			if ( ! hasClass( { element: datePicker, className : classNames.active } ) )
				datePicker.classList.add( classNames.active );

			// Re-render calendar
			render( { datePicker : datePicker } );
		} );
	}

	/**
	 * Function to render the calendar to be displayed when click the
	 * datePickerInput
	 *
	 * @param  {Node}   datePicker
	 */
	const render = ( { datePicker, date = currentDate } ) => {
		const calendarContainer = getCalendarContainer( datePicker );

		// Render calendar table
		calendarContainer.appendChild( buildCalendarTable( {
			date     : date,
			onSelect : onSelectDayHandler.bind( null, datePicker ),
		} ) );
	}

	/**
	 * Function to get the new calendar container,
	 * or, if there is a container already, clear it out
	 * and return it
	 *
	 * @param  {Node}   datePicker
	 * @return {Node}
	 */
	const getCalendarContainer = datePicker => {
		// byDefault create an empty container
		let calendarContainer = createElement( { nodeName : 'div' } );
		let isNew             = true;

		// Set element class
		calendarContainer.classList.add( classNames.calendarContainer );

		// Delete previous calendar data if there is any
		datePicker.childNodes.forEach( node => {
			if ( ! ( isElement( node ) && hasClass( { element : node, className : classNames.calendarContainer } ) ) )
				return;

			// Clear calendarContainer
			while ( node.hasChildNodes() )
				node.removeChild( node.lastChild );

			isNew             = false;
			calendarContainer = node;
		} );

		// Add calendar container below the input
		if ( isNew )
			datePicker.appendChild( calendarContainer );

		return calendarContainer;
	}

	/**
	 * Function to build the calendar table
	 *
	 * @param  {Date}   date
	 * @return {Node}
	 */
	const buildCalendarTable = ( { date, onSelect } ) => {
		const calendar = createElement( { nodeName : 'table' } );

		calendar.classList.add( classNames.calendarTable );

		// Build calendar table
		calendar.appendChild( buildTableHead( date ) );
		calendar.appendChild( buildTableBody( { date: date, onSelect : onSelect } ) );

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
			const th = createElement( { nodeName : 'th' } );
			th.innerText = day;
			tr.appendChild( th );
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
	const buildTableBody = ( { date, onSelect } ) => {
		const tbody     = createElement( { nodeName : 'tbody' } );
		const monthData = buildMonthData( date );

		monthData.forEach( week => tbody.appendChild( buildBodyRow( { data : week, onSelect : onSelect } ) ) );

		return tbody;
	}

	/**
	 * Function to build a body row
	 *
	 * @param  {Object} data
	 * @return {Node}
	 */
	const buildBodyRow = ( { data, onSelect } ) => {
		const row = createElement( { nodeName : 'tr' } );

		data.forEach( dayData => {
			const cell   = createElement( { nodeName : 'td' } );
			const button = createElement( { nodeName : 'a' } );

			if ( dayData.today )
				cell.classList.add( 'today' );

			button.innerText = dayData.day;
			button.classList.add( classNames.calendarDay );

			// Handle on click day
			button.addEventListener( 'click', onSelect.bind( null, dayData ) );

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
	 * Function to handle on select day
	 *
	 * @param  {Node}   datePicker
	 * @param  {Object} dayData
	 * @param  {Event}  event
	 */
	const onSelectDayHandler = ( datePicker, dayData, event ) => {
		const input = getElementsByClass( { className : `.${ classNames.input }`, sourceElement : datePicker } )[ 0 ];

		const year  = dayData.date.getFullYear();
		const month = dayData.date.getMonth();
		const day   = dayData.date.getDate();

		// Update input value with selected date
		input.value = `${ month }/${ day }/${ year }`;

		event.preventDefault();
		closePickers();
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
		const target   = event.target;
		const isInput  = hasClass( { element : target, className : classNames.input } );
		let isCalendar = hasClass( { element : target, className : classNames.calendarContainer } );

		// Also check if the event coming from an element inside the calendar
		isCalendar = ! isCalendar ? hasClass( { element : target, className : classNames.calendarTable } ) : isCalendar;
		isCalendar = ! isCalendar ? hasClass( { element : target, className : classNames.calendarDay } ) : isCalendar;

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

	/**
	 * Returns true if it is a DOM element
	 *
	 * @param  {Any}      node
	 * @return {Boolean}
	 */
	const isElement = node => {
		return (
			typeof HTMLElement === "object" ?
			node instanceof HTMLElement :
			node && typeof node === "object" && node !== null && node.nodeType === 1 && typeof node.nodeName==="string"
		);
	}

	return {
		init : init,
	};
} )();

// Initialize DatePicker
DatePicker.init();
