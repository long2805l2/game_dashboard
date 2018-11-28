const formater = new Intl.DateTimeFormat([], {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	hour12: false
});

function date (inputDate = null)
{
	var private = {};
	private.date = inputDate ? inputDate : new Date ();
	private.clone = () => new Date (private.date);

	var public = {};
	
	public.tomorrow = function ()
	{
		let clone = private.clone ();
		clone.setDate (private.date.getDate() + 1);
		clone.setHours (0, 0, 0, 0);
		return date (clone);
	}

	public.yesterday = function ()
	{
		let clone = private.clone ();
		clone.setDate (private.date.getDate() - 1);
		clone.setHours (0, 0, 0, 0);
		return date (clone);
	}

	public.sunday = function ()
	{
		let day = private.date.getDay();
		let clone = private.clone ();
		clone.setDate (private.date.getDate() - day);
		clone.setHours (0, 0, 0, 0);
		return date (clone);
	}

	public.saturday = function ()
	{
		let day = private.date.getDay();
		let clone = private.clone ();
		clone.setDate (private.date.getDate() - day + 6);
		clone.setHours (0, 0, 0, 0);
		return date (clone);
	}

	public.startMonth = function ()
	{
		let month = new Date (private.date.getFullYear(), private.date.getMonth(), 1);
		month.setHours (0, 0, 0, 0);
		return date (month);
	}

	public.endMonth = function ()
	{
		let month = new Date (private.date.getFullYear(), private.date.getMonth() + 1, 0);
		month.setHours (0, 0, 0, 0);
		return date (month);
	}

	public.startDay = function ()
	{
		let clone = private.clone ();
		clone.setHours (0, 0, 0, 0);
		return date (clone);
	};

	public.endDay = function ()
	{
		let clone = private.clone ();
		clone.setHours (23, 59, 59, 0);
		return date (clone);
	};

	public.shift = function (day)
	{
		let clone = private.clone ();
		clone.setDate (private.date.getDate() + day);
		return date (clone);
	}

	public.toString = function ()
	{
		return formater.format (private.date);
	}

	public.date = function ()
	{
		return private.clone ();
	}

	return public;
}

module.exports = date;