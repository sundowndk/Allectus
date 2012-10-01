Components.utils.import("resource://allectus/js/app.js");

var main =
{
	checksum : null,
	current : null,

	init : function ()
	{
		try
		{
			main.current = allectusLib.subscriptionItem.load (window.arguments[0].subscriptionItemId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
					
		// Set content.
		main.set ();
		
		app.events.onSubscriptionItemDestroy.addHandler (main.eventHandlers.onSubscriptionItemDestroy);		
	},
	
	eventHandlers :
	{
		onSubscriptionItemDestroy : function (id)
		{
			if (main.current.id == id)
			{
				main.close (force);
			}
		}
	},
	
	controls :
	{	
	},
	
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("id").value = main.current.id;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.current.createtimestamp);
	
		document.getElementById ("recurrencetype").value = main.current.recurrencetype;
	
		document.getElementById ("erpid").value = main.current.erpid;	
		document.getElementById ("text").value = main.current.text;	
		document.getElementById ("unit").value = main.current.unit;	
		document.getElementById ("price").value = main.current.price;	
		
		document.getElementById ("notes").value = main.current.notes;	
																		
		main.onChange ();
	},
	
	get : function ()
	{					
		main.current.recurrencetype = document.getElementById ("recurrencetype").value;
				
		main.current.erpid = document.getElementById ("erpid").value;
		main.current.text = document.getElementById ("text").value;
		main.current.unit = document.getElementById ("unit").value;
		main.current.price = document.getElementById ("price").value;				
		
		main.current.notes = document.getElementById ("notes").value;				
	},
	
	save : function ()
	{			
		main.get ();
		
		allectusLib.subscriptionItem.save (main.current);			
				
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		main.onChange ();
		
		if (window.arguments[0].onSave != null)
		{
			window.arguments[0].onSave (main.current);
		}
	},
	
	close : function (force)
	{			
		if (!force)
		{
			if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
			{
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			
				if (!prompts.confirm (null, "Ændringer ikke gemt", "Der er fortaget ændringer, der ikke er gemt, vil du forstætte ?"))
				{
					return;
				}			
			}
		}
		
		app.events.onSubscriptionItemDestroy.removeHandler (main.eventHandlers.onSubscriptionDestroy);
		
		window.close ();
	},
	
	onChange : function ()
	{
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum) && (main.current.text != ""))
		{
			document.title = main.current.text +" *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = main.current.text +"";
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}
	}	
}