import utils from './utils';
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
		form         = utils.getElementById( { id : 'form' } );
		summary      = utils.getElementById( { id : 'summary' } );
		saveButton   = utils.getElementById( { id : 'save-button' } );
		cancelButton = utils.getElementById( { id : 'cancel-button' } );
		filters      = utils.querySelectorAll( { selector : '#form input[name="filter"]' } );

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

	return {
		init : init,
	}
} )();

// Init AppointmentCreator app
AppointmentCreator.init();
