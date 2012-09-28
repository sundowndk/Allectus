Components.utils.import("resource://allectus/js/app.js");

var main =
{
	checksum : null,
	current : null,

	init : function ()
	{
		try
		{
			main.current = allectusLib.customer.load (window.arguments[0].customerId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
				
		// Hook events.
		app.events.onCustomerDestroy.addHandler (main.eventHandlers.onCustomerDestroy);
		
		app.events.onSubscriptionCreate.addHandler (main.eventHandlers.onSubscriptionCreate);
		app.events.onSubscriptionSave.addHandler (main.eventHandlers.onSubscriptionSave);
		app.events.onSubscriptionDestroy.addHandler (main.eventHandlers.onSubscriptionDestroy);
		
		// Set content.
		main.set ();
	},
	
	eventHandlers :
	{
		onCustomerDestroy : function (id)
		{
			if (main.current.id == id)
			{
				main.close (true);
			}
		},
	
		onSubscriptionCreate : function (subscription)
		{			
			if (main.current.id == subscription.customerid)
			{
				main.controls.subscriptions.addRow (subscription);
			}
		},
		
		onSubscriptionSave : function (subscription)
		{			
			if (main.current.id == subscription.customerid)
			{
				main.controls.subscriptions.setRow (subscription);
			}
		},
		
		onSubscriptionDestroy : function (id)
		{			
			main.controls.subscriptions.removeRow (id);
		}
	},
	
	controls :
	{
		subscriptions :
		{
			addRow : function (subscription)
			{
				var treechildren = document.getElementById ('subscriptionsTreeChildren');		
	
				var treeitem = document.createElement('treeitem');	
				treechildren.appendChild (treeitem)

				var treerow = document.createElement('treerow');
				treeitem.appendChild (treerow);

				var columns = [subscription["id"], subscription["title"]];
									
				for (index in columns)
				{
					var treecell = document.createElement('treecell');
					treecell.setAttribute ('label', columns[index]);
					treerow.appendChild (treecell);
				}
			},
					
			removeRow : function (id)
			{
				var tree = document.getElementById ('subscriptions');
				var index = -1;
				
				if (!id)
				{
					index = tree.currentIndex;									
  				}
  				else
  				{  									
					for (var i = 0; i < tree.view.rowCount; i++) 
					{
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == id)
						{					
							index = i;				
							break;
						}
					}
  				}
  				
  				if (index != -1)
  				{
  					tree.view.getItemAtIndex (index).parentNode.removeChild (tree.view.getItemAtIndex (index));
  				}
			},
			
			setRow : function (subscription)
			{
				var tree = document.getElementById ('subscriptions');
				var index = -1;
				
				if (!subscription)
				{
					index = tree.currentIndex;
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{	
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == subscription.id)
						{					
							index = i;							
							break;
						}
					}
				}

				if (index != -1)
				{
					tree.view.setCellText (index, tree.columns.getNamedColumn ('id'), subscription.id);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('title'), subscription.title);
				}
			},
			
			getRow : function (id)
			{
				var result = new Array ();
				
				var tree = document.getElementById ('subscriptions');
				var index = -1;				
				
				if (!id)
				{
					index = tree.currentIndex;				
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == id)
						{					
							index = i;
							break;
						}
					}	
				}
				
				if (index != -1)
				{									
					result.id = tree.view.getCellText (index, tree.columns.getNamedColumn ('id'));
					result.title = tree.view.getCellText (index, tree.columns.getNamedColumn ('title'));
				}
				
				return result;
			},				
			
			refresh : function ()
			{
				var onDone = 	function (subscriptions)
								{
									for (index in subscriptions)
									{									
										main.controls.subscriptions.addRow (subscriptions[index]);
									}
								
								// Enable controls
								document.getElementById ("subscriptions").disabled = false;																
								main.controls.subscriptions.onChange ();
							};

				// Disable controls
				document.getElementById ("subscriptions").disabled = true;
				document.getElementById ("subscriptionCreate").disabled = true;
				document.getElementById ("subscriptionEdit").disabled = true;
				document.getElementById ("subscriptionDestroy").disabled = true;
						
				allectusLib.subscription.list ({customer: main.current, async: true, onDone: onDone});				
			},
			
			onChange : function ()
			{
				var view = document.getElementById ("subscriptions").view;
				var selection = view.selection.currentIndex; 
				
				if (selection != -1)
				{
					document.getElementById ("subscriptionCreate").disabled = false;
					document.getElementById ("subscriptionEdit").disabled = false;
					document.getElementById ("subscriptionDestroy").disabled = false;
				}
				else
				{
					document.getElementById ("subscriptionCreate").disabled = false;
					document.getElementById ("subscriptionEdit").disabled = true;
					document.getElementById ("subscriptionDestroy").disabled = true;
				}
			}				
		}
	},
	
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
			
		document.getElementById ("erpid").value = main.current.erpid;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.current.createtimestamp);
	
		document.getElementById ("name").value = main.current.name;
		document.getElementById ("address1").value = main.current.address1;
		document.getElementById ("address2").value = main.current.address2;
		document.getElementById ("postcode").value = main.current.postcode;
		document.getElementById ("city").value = main.current.city;
		document.getElementById ("country").value = main.current.country;
		
		document.getElementById ("attention").value = main.current.attention;
		document.getElementById ("phone").value = main.current.phone;
		document.getElementById ("email").value = main.current.email;
		
		document.getElementById ("vatno").value = main.current.vatno;
		
		document.getElementById ("invoiceemail").value = main.current.invoiceemail;
								
		main.subscriptions.init ();								
								
		main.onChange ();
	},
	
	get : function ()
	{
		main.current.name = document.getElementById ("name").value;
		main.current.address1 = document.getElementById ("address1").value;
		main.current.address2 = document.getElementById ("address2").value;
		main.current.postcode = document.getElementById ("postcode").value;
		main.current.city = document.getElementById ("city").value;
		main.current.country = document.getElementById ("country").value;								
		
		main.current.attention = document.getElementById ("attention").value;								
		main.current.phone = document.getElementById ("phone").value;								
		main.current.email = document.getElementById ("email").value;								
		
		main.current.vatno = document.getElementById ("vatno").value;								
		
		main.current.invoiceemail = document.getElementById ("invoiceemail").value;								
	},
	
	save : function ()
	{			
		main.get ();
		
		allectusLib.customer.save (main.current);
				
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
				
		app.events.onCustomerDestroy.removeHandler (main.eventHandlers.onCustomerDestroy);
		
		app.events.onSubscriptionCreate.removeHandler (main.eventHandlers.onSubscriptionCreate);
		app.events.onSubscriptionSave.removeHandler (main.eventHandlers.onSubscriptionSave);
		app.events.onSubscriptionDestroy.removeHandler (main.eventHandlers.onSubscriptionDestroy);
	
		window.close ();
	},
	
	onChange : function ()
	{
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum) && (main.current.name != ""))
		{
			document.title = main.current.name +" ["+ main.current.erpid +"] *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = main.current.name +" ["+ main.current.erpid +"]";
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}
	},
	
	subscriptions :
	{
		init : function ()
		{
			main.controls.subscriptions.refresh ();		
		},
						
		create : function ()
		{
			try
			{			
				var current = allectusLib.subscription.create (main.current);
				current.title = "Unavngiven aftale";		
								
				dump ("SUBSCRIPTIONID:"+ current.id +"\n\n");
				allectusLib.subscription.save (current);
				
				window.openDialog ("chrome://allectus/content/subscriptionedit/subscriptionedit.xul", current.id, "chrome", {subscriptionId: current.id});
			}
			catch (error)
			{
				app.error ({exception: error})
				return;
			}
		},
															
		edit : function ()
		{		
			var current = main.controls.subscriptions.getRow ();
															
			window.openDialog ("chrome://allectus/content/subscriptionedit/subscriptionedit.xul", current.id, "chrome", {subscriptionId: current.id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet aftale", "Er du sikker på du vil slette denne aftale ?");
			
			if (result)
			{
				try
				{
					allectusLib.subscription.destroy (main.controls.subscriptions.getRow ().id);					
				}
				catch (error)
				{				
					app.error ({exception: error})
				}								
			}
		}
	}		
}