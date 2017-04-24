const TimePicker = ( function () {
	let classNames = {
		wrapper        : 'timepicker',
		active         : 'timepicker__active',
		input          : 'timepicker__input',
		trigger        : 'timepicker__trigger',
		hoursContainer : 'timepicker__hours__container',
	};

	const init = config => {
		// Use default classNames if there is no custom classNames
		// given by user
		classNames = config && config.classNames ? config.classNames : classNames;

		const timePickers = getElementsByClass( { className : `.${ classNames.wrapper }` } );

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
		const input   = getElementsByClass( { className : `.${ classNames.input }`, sourceElement : timePicker } )[ 0 ];
		const trigger = getElementsByClass( { className : `.${ classNames.trigger }`, sourceElement : timePicker } )[ 0 ];

		// Render initial timePicker
		render( { timePicker : timePicker } );

		const onClickEvent = event => {
			const target = event.target;
			closePickers();

			if ( ! hasClass( { element: timePicker, className : classNames.active } ) )
				timePicker.classList.add( classNames.active );

			// Re-render time list
			render( {
				timePicker   : timePicker,
				selectedTime : input.value,
			} );
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
	const render = ( { timePicker, selectedTime = '' } ) => {
		const hoursContainer = getHoursContainer( timePicker );

		// Render hour list
		hoursContainer.appendChild( buildHourList( {
			selectedTime : selectedTime,
		} ) );
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
		let hoursContainer = createElement( { nodeName : 'div' } );
		let isNew          = true;

		// Set element class
		hoursContainer.classList.add( classNames.hoursContainer );

		// Delete previous time data if there is any
		timePicker.childNodes.forEach( node => {
			if ( ! ( isElement( node ) && hasClass( { element : node, className : classNames.hoursContainer } ) ) )
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
	 * @param  {String}     options.selectedTime
	 * @return {Node}
	 */
	const buildHourList = ( { selectedTime } ) => {
		const list = createElement( { nodeName : 'ul' } );

		Array.from( { length: 24 } ).forEach( ( value, hour ) => {
			Array.from( { length: 4 } ).forEach( ( value, minute ) => {
				const time   = createElement( { nodeName : 'li' } );
				const button = createElement( { nodeName : 'a' } );

				// Hour in 12 hours format
				const hour12Format = hour == 0 ? 12 : hour > 12 ? hour - 12 : hour;

				// Display time in 12 hours format
				button.innerText = `${ hour12Format }:${ minute == 0 ? '00' : minute * 15 } ${ hour >= 12 ? 'PM' : 'AM' }`;

				time.appendChild( button );

				list.appendChild( time );
			} );
		} );

		return list;
	}

	/**
	 * Function to close every active timePickers in DOM
	 */
	const closePickers = () => {
		const activePickers = getElementsByClass( { className : `.${ classNames.wrapper }.${ classNames.active }` } );

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
		const isInput   = hasClass( { element : target, className : classNames.input } );
		const isTrigger = hasClass( { element : target, className : classNames.trigger } );

		// Prevent close pickers if user clicked one of the pickers
		if ( isInput || isTrigger )
			return;

		closePickers();
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

// Initialize TimePicker
TimePicker.init();
