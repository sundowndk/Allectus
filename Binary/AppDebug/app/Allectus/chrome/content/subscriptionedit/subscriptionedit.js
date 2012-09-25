Components.utils.import("resource://allectus/js/app.js");

var main =
{
	checksum : null,
	current : null,

	init : function ()
	{
		try
		{
			main.current = allectusLib.subscription.load (window.arguments[0].subscriptionId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
					
		// Set content.
		main.set ();
		
		app.events.onSubscriptionDestroy.addHandler (main.eventHandlers.onSubscriptionDestroy);
		
		app.events.onSubscriptionItemCreate.addHandler (main.eventHandlers.onSubscriptionItemCreate);
		app.events.onSubscriptionItemSave.addHandler (main.eventHandlers.onSubscriptionItemSave);
		app.events.onSubscriptionItemDestroy.addHandler (main.eventHandlers.onSubscriptionItemDestroy);
	},
	
	eventHandlers :
	{
		onSubscriptionDestroy : function (id)
		{
			if (main.current.id == id)
			{
				main.close (force);
			}
		},	
	
		onSubscriptionItemCreate : function (subscriptionItem)
		{			
			if (main.current.id == subscriptionItem.subscriptionid)
			{
				main.controls.subscriptionItems.addRow (subscriptionItem);
			}
		},
		
		onSubscriptionItemSave : function (subscriptionItem)
		{						
			main.controls.subscriptionItems.setRow (subscriptionItem);			
		},
		
		onSubscriptionItemDestroy : function (id)
		{			
			main.controls.subscriptionItems.removeRow (id);
		}
	},
	
	controls :
	{
		subscriptionItems :
		{
			addRow : function (subscriptionItem)
			{
				var treechildren = document.getElementById ('subscriptionItemsTreeChildren');		
	
				var treeitem = document.createElement('treeitem');	
				treechildren.appendChild (treeitem)

				var treerow = document.createElement('treerow');
				treeitem.appendChild (treerow);

				var columns = [subscriptionItem["id"], subscriptionItem["text"], subscriptionItem["price"]];
									
				for (index in columns)
				{
					var treecell = document.createElement('treecell');
					treecell.setAttribute ('label', columns[index]);
					treerow.appendChild (treecell);
				}
			},
												
			removeRow : function (id)
			{
				var tree = document.getElementById ('subscriptionItems');
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
			
			setRow : function (subscriptionItem)
			{
				var tree = document.getElementById ('subscriptionItems');
				var index = -1;
				
				if (!subscriptionItem)
				{
					index = tree.currentIndex;
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{	
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == subscriptionItem.id)
						{					
							index = i;							
							break;
						}
					}
				}

				if (index != -1)
				{
					tree.view.setCellText (index, tree.columns.getNamedColumn ('id'), subscriptionItem.id);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('text'), subscriptionItem.text);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('price'), subscriptionItem.price);
				}
			},
			
			getRow : function (id)
			{
				var result = new Array ();
				
				var tree = document.getElementById ('subscriptionItems');
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
					result.text = tree.view.getCellText (index, tree.columns.getNamedColumn ('text'));
					result.price = tree.view.getCellText (index, tree.columns.getNamedColumn ('price'));
				}
				
				return result;
			},	
		
			refresh : function ()
			{
				var onDone = 	function (subscriptionItems)
								{
									for (index in subscriptionItems)
									{									
										main.controls.subscriptionItems.addRow (subscriptionItems[index]);
									}
								
								// Enable controls
								document.getElementById ("subscriptionItems").disabled = false;																
								main.controls.subscriptionItems.onChange ();
							};

				// Disable controls
				document.getElementById ("subscriptionItems").disabled = true;
				document.getElementById ("subscriptionItemCreate").disabled = true;
				document.getElementById ("subscriptionItemEdit").disabled = true;
				document.getElementById ("subscriptionItemDestroy").disabled = true;
						
				allectusLib.subscriptionItem.list ({subscription: main.current, async: true, onDone: onDone});				
			},
			
			onChange : function ()
			{
				var view = document.getElementById ("subscriptionItems").view;
				var selection = view.selection.currentIndex; 
				
				if (selection != -1)
				{
					document.getElementById ("subscriptionItemCreate").disabled = false;
					document.getElementById ("subscriptionItemEdit").disabled = false;
					document.getElementById ("subscriptionItemDestroy").disabled = false;
				}
				else
				{
					document.getElementById ("subscriptionItemCreate").disabled = false;
					document.getElementById ("subscriptionItemEdit").disabled = true;
					document.getElementById ("subscriptionItemDestroy").disabled = true;
				}
			}				
		}		
	},
	
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("id").value = main.current.id;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.current.createtimestamp);
						
		document.getElementById ("type").value = main.current.type;
	
		document.getElementById ("title").value = main.current.title;	
		document.getElementById ("nextbilling").dateValue = SNDK.tools.timestampToDate (main.current.nextbilling);
				
		document.getElementById ("status").value = main.current.status;	
								
		main.subscriptionItems.init ();								
								
		main.onChange ();
	},
	
	get : function ()
	{			
		main.current.title = document.getElementById ("title").value;
		
		main.current.type = document.getElementById ("type").value;
		
		var date = document.getElementById ("nextbilling").dateValue
		date.setHours (0);
		date.setMinutes (0);
		date.setSeconds (0);		
		main.current.nextbilling = SNDK.tools.dateToTimestamp (date);
						
		main.current.status = document.getElementById ("status").value;		
	},
	
	save : function ()
	{			
		main.get ();
		
		allectusLib.subscription.save (main.current);			
				
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
		
		app.events.onSubscriptionDestroy.removeHandler (main.eventHandlers.onSubscriptionDestroy);
		
		app.events.onSubscriptionItemCreate.removeHandler (main.eventHandlers.onSubscriptionItemCreate);
		app.events.onSubscriptionItemSave.removeHandler (main.eventHandlers.onSubscriptionItemSave);
		app.events.onSubscriptionItemDestroy.removeHandler (main.eventHandlers.onSubscriptionItemDestroy);
	
		window.close ();
	},
	
	onChange : function ()
	{
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum) && (main.current.title != ""))
		{
			document.title = main.current.title +" *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = main.current.title +"";
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}
	},
	
	subscriptionItems :
	{
		init : function ()
		{
			main.controls.subscriptionItems.refresh ();		
		},
						
		create : function ()
		{
			// Create new item.
			//var current = allectusLib.subscriptionItem.create (main.current);
			//allectusLib.subscriptionItem.save (current);
			
				var onDone =	function (result)
							{
								if (result)
								{
									//var product = didius.product.create (main.current, result);
									//didius.case.save (case_);																								
																									
									//window.openDialog ("chrome://didius/content/caseedit/caseedit.xul", case_.id, "chrome", {caseId: case_.id});
								}
							};
														
			app.choose.product ({onDone: onDone});
																										
			//window.openDialog ("chrome://allectus/content/subscriptionitemedit/subscriptionitemedit.xul", current.id, "chrome", {subscriptionItemId: current.id});
		},
															
		edit : function ()
		{		
			var current = main.controls.subscriptionItems.getRow ();
															
			window.openDialog ("chrome://allectus/content/subscriptionitemedit/subscriptionitemedit.xul", current.id, "chrome", {subscriptionItemId: current.id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet produkt", "Er du sikker på du vil slette dette produkt ?");
			
			if (result)
			{
				try
				{
					allectusLib.subscriptionItem.destroy (main.controls.subscriptionItems.getRow ().id);										
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	}		
}