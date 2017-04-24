const AppointmentCreator = ( function () {
	let form, summary, saveButton, cancelButton;

	const init = () => {
		form         = getElementById( { id : 'form' } );
		summary      = getElementById( { id : 'summary' } );
		saveButton   = getElementById( { id : 'save-button' } );
		cancelButton = getElementById( { id : 'cancel-button' } );

		initializePickers();
		addEventListeners();
	}

	/**
	 * Funciton to initialize app pickers
	 */
	const initializePickers = () => {
		// Initialize DatePickers
		if ( DatePicker )
			DatePicker.init();

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

	const handleOnClickCancel = event => {
		event.preventDefault();
		const status = clearForm();

		if ( ! status )
			return;

		summary.innerText = '';
	}

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

	const getElementById = ( { id, sourceElement = document } ) => {
		return sourceElement.getElementById( id );
	}

	return {
		init : init,
	}
} )();

// Init AppointmentCreator app
AppointmentCreator.init();
