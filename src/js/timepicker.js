const TimePicker = ( function () {
	let classNames = {
		wrapper : 'timepicker',
		active  : 'timepicker__active',
		input   : 'timepicker__input',
		trigger : 'timepicker__trigger',
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

		const onClickEvent = event => {
			const target = event.target;
			closePickers();

			if ( ! hasClass( { element: timePicker, className : classNames.active } ) )
				timePicker.classList.add( classNames.active );
		};

		input.addEventListener( 'click', onClickEvent );
		trigger.addEventListener( 'click', onClickEvent );
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
