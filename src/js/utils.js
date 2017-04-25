export default ( function () {
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

	/**
	 * Function to determine if an element has an specific class
	 *
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

	/**
	 * Function to get certain information based on an specific locale
	 * from a given Date
	 *
	 * @param  {Date}   options.date
	 * @param  {Object} options.options
	 * @param  {String} options.locale
	 * @return {String}
	 */
	const getLocaleStringFromDate = ( { date, options, locale = "en-US" } ) => {
		return date.toLocaleString( locale, options );
	}

	return {
		createElement           : createElement,
		querySelectorAll        : querySelectorAll,
		getElementById          : getElementById,
		hasClass                : hasClass,
		isElement               : isElement,
		getLocaleStringFromDate : getLocaleStringFromDate,
	};
} )();
