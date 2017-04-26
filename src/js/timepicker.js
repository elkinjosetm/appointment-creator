import utils from './utils';

const TimePicker = function () {
	const classNames = {
		wrapper        : 'timepicker',
		active         : 'timepicker__active',
		input          : 'timepicker__input',
		trigger        : 'timepicker__trigger',
		hoursContainer : 'timepicker__hours__container',
	};
	let _date;
	let _selector;

	const init = ( { selector, date } ) => {
		if ( ! selector )
			return;

		_date     = date;
		_selector = selector;

		const timePickers = utils.querySelectorAll( { selector : _selector } );

		// Attach onClick event to every timePicker input
		timePickers.forEach( addPickerEventHandler );

		// Handle on Blur event
		document.addEventListener( 'click', blurHandler );
	}

	/**
	 * Function to attach onClick event to the given timePicker
	 *
	 * @param  {Node}   timePicker
	 */
	const addPickerEventHandler = timePicker => {
		const input   = utils.querySelectorAll( { selector : `.${ classNames.input }`, sourceElement : timePicker } )[ 0 ];
		const trigger = utils.querySelectorAll( { selector : `.${ classNames.trigger }`, sourceElement : timePicker } )[ 0 ];

		// Render initial timePicker
		render( { timePicker : timePicker } );

		const onClickEvent = event => {
			const target = event.target;
			closePickers();

			if ( ! utils.hasClass( { element: timePicker, className : classNames.active } ) )
				timePicker.classList.add( classNames.active );

			// Re-render time list
			render( {
				timePicker   : timePicker,
				selectedTime : input.value,
			} );

			event.preventDefault();
		};

		input.addEventListener( 'click', onClickEvent );
		trigger.addEventListener( 'click', onClickEvent );
	}

	/**
	 * Function to render the hourList to be displayed when click the
	 * timePickerInput
	 *
	 * @param  {Node}   options.timePicker
	 * @param  {String} options.selectedTime
	 */
	const render = ( { timePicker, selectedTime } ) => {
		const currentDate    = new Date();
		const isToday        = _date ? _date.toDateString() === currentDate.toDateString() : false;
		const hoursContainer = getHoursContainer( timePicker );

		// Render hour list
		hoursContainer.appendChild( buildHourList( {
			selectedTime : selectedTime,
			onSelect     : onSelectHourHandler.bind( null, timePicker ),
		} ) );

		scrollToSelected( hoursContainer );

		// Only update the input value if the selected date is not today
		// To ensure default value
		if ( ! isToday )
		{
			const input = utils.querySelectorAll( { selector : `.${ classNames.input }`, sourceElement : timePicker } )[ 0 ];
			input.value = selectedTime || '12:00 PM';
		}
	}

	/**
	 * Function to get the new hours container,
	 * or, if there is a container already, clear it out
	 * and return it
	 *
	 * @param  {Node} timePicker
	 * @return {Node}
	 */
	const getHoursContainer = timePicker => {
		// byDefault create an empty container
		let hoursContainer = utils.createElement( { nodeName : 'div' } );
		let isNew          = true;

		// Set element class
		hoursContainer.classList.add( classNames.hoursContainer );

		// Delete previous time data if there is any
		timePicker.childNodes.forEach( node => {
			if ( ! ( utils.isElement( node ) && utils.hasClass( { element : node, className : classNames.hoursContainer } ) ) )
				return;

			// Clear hoursContainer
			while ( node.hasChildNodes() )
				node.removeChild( node.lastChild );

			isNew          = false;
			hoursContainer = node;
		} );

		// Add hours container below the input
		if ( isNew )
			timePicker.appendChild( hoursContainer );

		return hoursContainer;
	}

	/**
	 * Function to build the hour list
	 *
	 * @param  {String}   options.selectedTime
	 * @param  {Function} options.onSelect
	 * @return {Node}
	 */
	const buildHourList = ( { selectedTime, onSelect } ) => {
		const hoursData = buildHoursData( selectedTime );
		const list      = utils.createElement( { nodeName : 'ul' } );

		hoursData.forEach( data => {
			const time   = utils.createElement( { nodeName : 'li' } );
			const button = utils.createElement( { nodeName : 'a' } );

			button.innerText = data.time;

			if ( data.selected )
				time.classList.add( 'selected' );

			// Handle on click day
			button.addEventListener( 'click', onSelect.bind( null, data ) );

			time.appendChild( button );
			list.appendChild( time );
		} );

		return list;
	}

	/**
	 * Function to build the hour data
	 *
	 * @param  {String}    selectedTime
	 * @return {Object[]}
	 */
	const buildHoursData = selectedTime => {
		const data        = [];
		const currentDate = new Date();
		const isToday     = _date ? _date.toDateString() === currentDate.toDateString() : false;

		Array.from( { length: 24 } ).forEach( ( value, hour ) => {
			Array.from( { length: 4 } ).forEach( ( value, minute ) => {
				// Hour value in 12 hours format
				const hour12Format     = hour == 0 ? 12 : hour > 12 ? hour - 12 : hour;
				const minutesToDisplay = minute * 15;

				// Build time in 12 hours format
				const time = `${ hour12Format }:${ minutesToDisplay != 0 ? minutesToDisplay : '00' } ${ hour >= 12 ? 'PM' : 'AM' }`;

				if ( isToday && ( hour < currentDate.getHours() || ( hour == currentDate.getHours() && minutesToDisplay <= currentDate.getMinutes() ) ) )
					return;

				data.push( {
					time     : time,
					selected : selectedTime == time,
				} );
			} );
		} );

		return data;
	}

	/**
	 * Function to handle on select hour
	 *
	 * @param  {Node}   timePicker
	 * @param  {Object} data
	 * @param  {Event}  event
	 */
	const onSelectHourHandler = ( timePicker, data, event ) => {
		const input = utils.querySelectorAll( { selector : `.${ classNames.input }`, sourceElement : timePicker } )[ 0 ];

		// Update input value with selected hour
		input.value = data.time;

		event.preventDefault();
		closePickers();
	}

	/**
	 * Function to scroll the hoursContainer to the selected one
	 *
	 * @param  {Node}   hoursContainer
	 */
	const scrollToSelected = hoursContainer => {
		let selectedItem = utils.querySelectorAll( { selector : '.selected', sourceElement : hoursContainer } );

		// If there is no selected item, then prevent doing anything
		if ( selectedItem.length == 0 )
			return;

		// Select the first one
		selectedItem = selectedItem[ 0 ];

		// Scroll hoursContainer to the selected one
		hoursContainer.scrollTop = selectedItem.offsetTop;
	}

	/**
	 * Function to set the date
	 *
	 * @param  {Date} date
	 */
	const setDate = date => {
		_date = date;

		const currentDate = new Date();
		const isToday     = date.toDateString() === currentDate.toDateString()
		const timePickers = utils.querySelectorAll( { selector : _selector } );
		const hoursData   = buildHoursData();

		timePickers.forEach( timePicker => {
			const input = utils.querySelectorAll( { selector : `.${ classNames.input }`, sourceElement : timePicker } )[ 0 ];

			// If its today, and the hour list has less than 48 items,
			// means that 12:00 PM has passed, so select the first
			// available hour otherwise, select 12:00 PM by default.
			input.value = isToday && hoursData.length < 48 ? hoursData[ 0 ].time : '12:00 PM';
		} );
	}

	/**
	 * Function to close every active timePickers in DOM
	 */
	const closePickers = () => {
		const activePickers = utils.querySelectorAll( { selector : `.${ classNames.wrapper }.${ classNames.active }` } );

		activePickers.forEach( timePicker => {
			timePicker.classList.remove( classNames.active );
		} );
	}

	/**
	 * Function to handle every click event in DOM,
	 * mainly used to handle the blur behaviour,
	 * which should close every activeTimePicker
	 *
	 * @param  {Event}  event
	 */
	const blurHandler = event => {
		const target    = event.target;
		const isInput   = utils.hasClass( { element : target, className : classNames.input } );
		const isTrigger = utils.hasClass( { element : target, className : classNames.trigger } );

		// Prevent close pickers if user clicked one of the pickers
		if ( isInput || isTrigger )
			return;

		closePickers();
	}

	return {
		init    : init,
		setDate : setDate,
	};
};

export default TimePicker;
