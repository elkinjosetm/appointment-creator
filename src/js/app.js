import DatePicker from './datepicker';
import TimePicker from './timepicker';

const AppointmentCreator = ( function () {
	const datePickerInstance = DatePicker();
	let form,
		summary,
		saveButton,
		cancelButton,
		filters;

	const init = () => {
		form         = getElementById( { id : 'form' } );
		summary      = getElementById( { id : 'summary' } );
		saveButton   = getElementById( { id : 'save-button' } );
		cancelButton = getElementById( { id : 'cancel-button' } );
		filters      = querySelectorAll( { selector : '#form input[name="filter"]' } );

		initializePickers();
		addEventListeners();

		filters.forEach( filter => filter.addEventListener( 'click', filterDatePickers ) );
	}

	/**
	 * Funciton to initialize app pickers
	 */
	const initializePickers = () => {
		// Initialize DatePicker
		if ( datePickerInstance )
			datePickerInstance.init( { selector : '.datepicker' } );

		// Initialize TimePickers
		if ( TimePicker )
			TimePicker.init();
	}

	/**
	 * Funciton to add eventListeners
	 */
	const addEventListeners = () => {
		if ( saveButton )
			saveButton.addEventListener( 'click', handleOnClickSave );

		if ( cancelButton )
			cancelButton.addEventListener( 'click', handleOnClickCancel );
	}

	/**
	 * Form Serializer
	 *
	 * @return {Object}
	 */
	const serializeForm = () => {
		if ( ! form )
		{
			alert( 'Unable to find the app form' );
			return;
		}

		const elements = form.elements;

		return {
			date : elements.date ? elements.date.value : undefined,
			time : elements.time ? elements.time.value : undefined,
		};
	}

	/**
	 * Form Cleaner
	 *
	 * @return {Boolean}
	 */
	const clearForm = () => {
		if ( ! form )
		{
			alert( 'Unable to find the app form' );
			return false;
		}

		const elements = form.elements;

		if ( elements.date )
			elements.date.value = '';

		if ( elements.time )
			elements.time.value = '12:00 PM';

		return true;
	}

	/**
	 * On Save handler
	 *
	 * @param  {Event} event
	 */
	const handleOnClickSave = event => {
		event.preventDefault();
		const data = serializeForm();

		if ( ! data )
			return;

		// Validate fields
		if ( ! data.date || ! data.time )
		{
			alert( 'Date and Time are required' );
			return;
		}

		summary.innerText = `Good! Your appointment is set for ${ data.date } at ${ data.time }. Thanks.`;
	}

	/**
	 * On Cancel handler
	 *
	 * @param  {Event} event
	 */
	const handleOnClickCancel = event => {
		event.preventDefault();
		const status = clearForm();

		if ( ! status )
			return;

		summary.innerText = '';
	}

	const filterDatePickers = event => {
		const target = event.target;
		const filter = target.value;

		datePickerInstance.setFilter( filter );
	}

	/**
	 * Generic function to get elements from DOM by a selector
	 *
	 * @param  {String}  selector
	 * @param  {Node}    sourceElement
	 * @return {Node[]}
	 */
	const querySelectorAll = ( { selector, sourceElement = document } ) => {
		return sourceElement.querySelectorAll( selector );
	}

	/**
	 * Function to get an element by Id
	 *
	 * @param  {String} options.id
	 * @param  {Node} options.sourceElement
	 * @return {Node}
	 */
	const getElementById = ( { id, sourceElement = document } ) => {
		return sourceElement.getElementById( id );
	}

	return {
		init : init,
	}
} )();

// Init AppointmentCreator app
AppointmentCreator.init();
