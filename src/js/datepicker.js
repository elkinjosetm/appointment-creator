import utils from './utils';

const DatePicker = function () {
	const classNames = {
		wrapper              : 'datepicker',
		active               : 'datepicker__active',
		input                : 'datepicker__input',
		trigger              : 'datepicker__trigger',
		calendarContainer    : 'datepicker__calendar__container',
		calendarHeader       : 'datepicker__calendar__header',
		calendarHeaderTitle  : 'datepicker__calendar__header__label',
		calendarHeaderButton : 'datepicker__calendar__header__button',
		calendarTable        : 'datepicker__calendar__table',
		calendarDay          : 'datepicker__calendar__table__day',
	};
	let _filter;
	let _onDateChange;

	const init = ( { selector, filter = 'any', onDateChange } ) => {
		if ( ! selector )
			return;

		_filter       = filter;
		_onDateChange = onDateChange;

		const datePickers = utils.querySelectorAll( { selector : selector } );

		// Attach onClick event to every datePicker input
		datePickers.forEach( addPickersEventHandler );

		// Handle on Blur event
		document.addEventListener( 'click', blurHandler );
	}

	/**
	 * Function to attach onClick event to the given datePicker
	 *
	 * @param  {Node} datePicker
	 */
	const addPickersEventHandler = datePicker => {
		const input   = utils.querySelectorAll( { selector : `.${ classNames.input }`, sourceElement : datePicker } )[ 0 ];
		const trigger = utils.querySelectorAll( { selector : `.${ classNames.trigger }`, sourceElement : datePicker } )[ 0 ];

		// Render initial calendar
		render( { datePicker: datePicker } );

		const onClickEvent = event => {
			const target           = event.target;
			const targetDatePicker = target.parentNode;

			closePicker( targetDatePicker );

			if ( ! utils.hasClass( { element: targetDatePicker, className : classNames.active } ) )
				targetDatePicker.classList.add( classNames.active );

			const selectedDate = input.value ? new Date( input.value ) : undefined;

			// Re-render calendar
			render( {
				datePicker   : targetDatePicker,
				date         : selectedDate,
				selectedDate : selectedDate,
			} );

			event.preventDefault();
		};

		input.addEventListener( 'click', onClickEvent );
		trigger.addEventListener( 'click', onClickEvent );
	}

	/**
	 * Function to render the calendar to be displayed when click the
	 * datePickerInput
	 *
	 * @param  {Node}   options.datePicker
	 * @param  {Date}   options.date
	 * @param  {Date}   options.selectedDate
	 */
	const render = ( { datePicker, date = new Date(), selectedDate = new Date() } ) => {
		const calendarContainer = getCalendarContainer( datePicker );

		calendarContainer.appendChild( buildCalendarHead( {
			date         : date,
			selectedDate : selectedDate,
			datePicker   : datePicker,
		} ) );

		// Render calendar table
		calendarContainer.appendChild( buildCalendarTable( {
			date         : date,
			selectedDate : selectedDate,
			onSelect     : onSelectDayHandler.bind( null, datePicker ),
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
		let calendarContainer = utils.createElement( { nodeName : 'div' } );
		let isNew             = true;

		// Set element class
		calendarContainer.classList.add( classNames.calendarContainer );

		// Delete previous calendar data if there is any
		datePicker.childNodes.forEach( node => {
			if ( ! ( utils.isElement( node ) && utils.hasClass( { element : node, className : classNames.calendarContainer } ) ) )
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
	 * Function to build the calendar head, which is
	 * basically the month selector
	 *
	 * @param  {Node} options.datePicker
	 * @param  {Date} options.date
	 * @param  {Date} options.selectedDate
	 * @return {Node}
	 */
	const buildCalendarHead = ( { datePicker, date, selectedDate } ) => {
		const monthName = utils.getLocaleStringFromDate( { date : date, options : { month : "long" } } );
		const selector  = utils.createElement( { nodeName : 'div' } );
		const title     = utils.createElement( { nodeName : 'span' } );
		const back      = utils.createElement( { nodeName : 'a' } );
		const next      = utils.createElement( { nodeName : 'a' } );

		// Add proper classNames
		selector.classList.add( classNames.calendarHeader );
		title.classList.add( classNames.calendarHeaderTitle );
		back.classList.add( classNames.calendarHeaderButton );
		next.classList.add( classNames.calendarHeaderButton );

		// Set Proper values
		title.innerText = `${ monthName } ${ date.getFullYear() }`;
		back.innerHTML  = '&#10094;'; // Left arrow
		next.innerHTML  = '&#10095;'; // Right arrow

		// Add buttons event handlers
		back.addEventListener( 'click', onChangeMonthHandler.bind( null, datePicker, date, selectedDate, false ) );
		next.addEventListener( 'click', onChangeMonthHandler.bind( null, datePicker, date, selectedDate, true ) );

		// Add items to selector container
		selector.appendChild( back );
		selector.appendChild( title );
		selector.appendChild( next );

		return selector;
	}

	/**
	 * Function to build the calendar table
	 *
	 * @param  {Date}     options.date
	 * @param  {Date}     options.selectedDate
	 * @param  {Function} options.onSelect
	 * @return {Node}
	 */
	const buildCalendarTable = ( { date, selectedDate, onSelect } ) => {
		const calendar = utils.createElement( { nodeName : 'table' } );

		calendar.classList.add( classNames.calendarTable );

		// Build calendar table
		calendar.appendChild( buildCalendarWeekDays( date ) );
		calendar.appendChild( buildCalendarContent( {
			date         : date,
			selectedDate : selectedDate,
			onSelect     : onSelect,
		} ) );

		return calendar;
	}

	/**
	 * Function to build the calendar table head with WeekDays
	 *
	 * @param  {Date}   date
	 * @return {Node}
	 */
	const buildCalendarWeekDays = date => {
		const thead = utils.createElement( { nodeName : 'thead' } );
		const tr    = utils.createElement( { nodeName : 'tr' } );

		// Get weekDays names
		const weekDays = getWeekDays( date );

		// Build calendarTable column names
		// with the weekDay name
		weekDays.forEach( day => {
			const th = utils.createElement( { nodeName : 'th' } );
			th.innerText = day;
			tr.appendChild( th );
		} );

		thead.appendChild( tr );

		return thead;
	}

	/**
	 * Function to build the calendar content for a given date
	 *
	 * @param  {Date}     options.date
	 * @param  {Date}     options.selectedDate
	 * @param  {Function} options.onSelect
	 * @return {Node}
	 */
	const buildCalendarContent = ( { date, selectedDate, onSelect } ) => {
		const tbody     = utils.createElement( { nodeName : 'tbody' } );
		const monthData = monthMatrix( {
			date         : date,
			selectedDate : selectedDate,
		} );

		monthData.forEach( week => tbody.appendChild( buildWeekRow( {
			data     : week,
			onSelect : onSelect
		} ) ) );

		return tbody;
	}

	/**
	 * Function to build a week row
	 *
	 * @param  {Date}     options.data
	 * @param  {Function} options.onSelect
	 * @return {Node}
	 */
	const buildWeekRow = ( { data, onSelect } ) => {
		const row = utils.createElement( { nodeName : 'tr' } );

		data.forEach( dayData => row.appendChild( buildDay( {
			data     : dayData,
			onSelect : onSelect
		} ) ) );

		return row;
	}

	/**
	 * Function to build a day in week
	 *
	 * @param  {Date}     options.data
	 * @param  {Function} options.onSelect
	 * @return {Node}
	 */
	const buildDay = ( { data, onSelect } ) => {
		const cell   = utils.createElement( { nodeName : 'td' } );
		const button = utils.createElement( { nodeName : 'a' } );

		if ( data.today )
		{
			cell.classList.add( 'today' );
			cell.setAttribute( 'title', 'Today' );
		}

		if ( data.selected )
			cell.classList.add( 'selected' );

		if ( ! data.selectable )
			cell.classList.add( 'disabled' );

		button.innerText = data.day;
		button.classList.add( classNames.calendarDay );

		// Handle on click day
		button.addEventListener( 'click', onSelect.bind( null, data ) );

		cell.appendChild( button );

		return cell;
	}

	/**
	 * Function to get the WeekDayNames array from a given date
	 *
	 * @param  {Date}   options.date
	 * @param  {String} options.format
	 * @param  {String} options.locale
	 * @return {String[]}
	 */
	const getWeekDays = date => {
		return Array.from( { length: 7 } ).map( ( value, index ) => {
			const newDate = new Date( date.getDate() - date.getDay() );
			newDate.setDate( index );

			return utils.getLocaleStringFromDate( { date : newDate, options : { weekday: "narrow" } } );
		} );
	}

	/**
	 * Function to build the currentMonth matrix
	 *
	 * @param  {Date}     options.date
	 * @param  {Date}     options.selectedDate
	 * @return {Object[]}
	 */
	const monthMatrix = ( { date, selectedDate } ) => {
		const currentDate             = new Date();
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
				// Create a new date to prevent reference objects
				const currentDayInWeekDate     = new Date( firstDayOfWeekDate );
				const currentDayInWeekDay      = firstDayOfWeekDate.getDate();
				const currentDayInWeekPosition = firstDayOfWeekDate.getDay();

				const isToday    = firstDayOfWeekDate.toDateString() === currentDate.toDateString();
				const isSelected = selectedDate ? selectedDate.toDateString() === firstDayOfWeekDate.toDateString() : false;
				const isPastDate = ! isToday && firstDayOfWeekDate.getTime() < currentDate.getTime();
				const isWeekend  = currentDayInWeekPosition == 0 || currentDayInWeekPosition == 6;

				// Only allow dates from today
				let isSelectable = ! isPastDate;

				switch ( _filter )
				{
					case 'weekends':
						isSelectable = isSelectable ? isWeekend : isSelectable;
						break;

					case 'weekdays':
						isSelectable = isSelectable ? ! isWeekend : isSelectable;
						break;
				}

				// Increase day date
				firstDayOfWeekDate.setDate( firstDayOfWeekDate.getDate() + 1 );

				 return {
					date       : currentDayInWeekDate,
					day        : currentDayInWeekDay,
					today      : isToday,
					selected   : isSelected,
					selectable : isSelectable,
				};
			} );
		} );
	}

	/**
	 * Function to set filter
	 *
	 * @param  {String} filter
	 */
	const setFilter = filter => {
		_filter = filter;
	}

	/**
	 * Function to handle on select day
	 *
	 * @param  {Node}   datePicker
	 * @param  {Object} dayData
	 * @param  {Event}  event
	 */
	const onSelectDayHandler = ( datePicker, dayData, event ) => {
		// Prevent select a none selectable day
		if ( ! dayData.selectable )
			return;

		const input = utils.querySelectorAll( { selector : `.${ classNames.input }`, sourceElement : datePicker } )[ 0 ];

		const year  = dayData.date.getFullYear();
		const month = dayData.date.getMonth() + 1;
		const day   = dayData.date.getDate();

		// Update input value with selected date
		input.value = `${ month }/${ day }/${ year }`;

		event.preventDefault();
		closePicker( datePicker );

		if ( _onDateChange )
			_onDateChange( dayData.date );
	}

	/**
	 * Function to handle on change month
	 *
	 * @param  {Node}   datePicker
	 * @param  {Date}   date
	 * @param  {Date}   selectedDate
	 * @param  {Boolean} next
	 * @param  {Event}   event
	 */
	const onChangeMonthHandler = ( datePicker, date, selectedDate, next, event ) => {
		// Create new date from the given, to prevent
		// reference object
		const newDate = new Date( date );

		if ( next )
			newDate.setMonth( newDate.getMonth() + 1 );
		else
			newDate.setMonth( newDate.getMonth() - 1 );

		render( {
			datePicker   : datePicker,
			date         : newDate,
			selectedDate : selectedDate,
		} );

		event.preventDefault();
	}

	/**
	 * Function to close every the given datePicker
	 */
	const closePicker = datePicker => {
		datePicker.classList.remove( classNames.active );
	}

	/**
	 * Function to close every active datePickers in DOM
	 */
	const closePickers = () => {
		const activePickers = utils.querySelectorAll( { selector : `.${ classNames.wrapper }.${ classNames.active }` } );

		activePickers.forEach( datePicker => {
			closePicker( datePicker );
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
		const target    = event.target;
		const isInput   = utils.hasClass( { element : target, className : classNames.input } );
		const isTrigger = utils.hasClass( { element : target, className : classNames.trigger } );
		let isCalendar  = utils.hasClass( { element : target, className : classNames.calendarContainer } );

		// Also check if the event coming from an element inside the calendar
		isCalendar = ! isCalendar ? utils.hasClass( { element : target, className : classNames.calendarHeader } ) : isCalendar;
		isCalendar = ! isCalendar ? utils.hasClass( { element : target, className : classNames.calendarHeaderTitle } ) : isCalendar;
		isCalendar = ! isCalendar ? utils.hasClass( { element : target, className : classNames.calendarHeaderButton } ) : isCalendar;
		isCalendar = ! isCalendar ? utils.hasClass( { element : target, className : classNames.calendarTable } ) : isCalendar;
		isCalendar = ! isCalendar ? utils.hasClass( { element : target, className : classNames.calendarDay } ) : isCalendar;

		// Prevent close pickers if user clicked one of the pickers
		if ( isInput || isTrigger || isCalendar )
			return;

		closePickers();
	}

	return {
		init      : init,
		setFilter : setFilter,
	};
};

export default DatePicker;
