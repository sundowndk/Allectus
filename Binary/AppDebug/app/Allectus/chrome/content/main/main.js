Components.utils.import("resource://allectus/js/app.js");

var main = 
{
	init : function ()
	{		
		app.startup (window);
		
		main.customers.init ();
						
		app.events.onCustomerCreate.addHandler (main.eventHandlers.onCustomerCreate);
		app.events.onCustomerSave.addHandler (main.eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.addHandler (main.eventHandlers.onCustomerDestroy);
	},
	
	eventHandlers :
	{
		onCustomerCreate : function (customer)
		{
			main.controls.customers.addRow (customer);	
		},
		
		onCustomerSave : function (customer)
		{
			main.controls.customers.setRow (customer);
		},
		
		onCustomerDestroy : function (id)
		{		
			main.controls.customers.removeRow (id);
		}
	},
	
	controls : 
	{
		customers :
		{
			addRow : function (customer)
			{			
				var children = document.getElementById ('customersTreeChildren');		
	
				var item = document.createElement('treeitem');	
				children.appendChild (item)

				var row = document.createElement('treerow');
				item.appendChild (row);

				var columns = [customer["id"], customer["name"], customer["address1"], customer["postcode"], customer["city"], customer["email"]]
									
				for (index in columns)
				{
					var cell = document.createElement('treecell');
					cell.setAttribute ('label', columns[index]);
					row.appendChild(cell);																		
				}
			},
			
			removeRow : function (id)
			{
				var tree = document.getElementById ('customers');
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
			
			setRow : function (customer)
			{
				var tree = document.getElementById ('customers');
				var index = -1;
				
				if (!customer)
				{
					index = tree.currentIndex;
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{	
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == customer.id)
						{					
							index = i;							
							break;
						}
					}
				}

				if (index != -1)
				{
					tree.view.setCellText (index, tree.columns.getNamedColumn ('id'), customer.id);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('name'), customer.name);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('address1'), customer.address1);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('postcode'), customer.postcode);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('city'), customer.city);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('email'), customer.email);	
				}
			},
			
			getRow : function (id)
			{
				var result = new Array ();
				
				var tree = document.getElementById ('customers');
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
					result.name = tree.view.getCellText (index, tree.columns.getNamedColumn ('name'));
					result.address1 = tree.view.getCellText (index, tree.columns.getNamedColumn ('address1'));				
					result.postcode = tree.view.getCellText (index, tree.columns.getNamedColumn ('postcode'));
					result.city = tree.view.getCellText (index, tree.columns.getNamedColumn ('city'));
					result.email = tree.view.getCellText (index, tree.columns.getNamedColumn ('email'));
				}
				
				return result;
			},
			
			refresh : function ()
			{					
				var onDone = 	function (customers)
								{
									for (index in customers)
									{									
										main.controls.customers.addRow (customers[index]);
									}
								
								// Enable controls
								document.getElementById ("customers").disabled = false;								
								document.getElementById ("customerCreate").disabled = false;								
								
								main.controls.customers.onChange ();
							};

				// Disable controls
				document.getElementById ("customers").disabled = true;
				document.getElementById ("customerCreate").disabled = true;
				document.getElementById ("customerEdit").disabled = true;
				document.getElementById ("customerDestroy").disabled = true;
			
				allectusLib.customer.list ({async: true, onDone: onDone});					
			},
				
			clear : function ()
			{
				var treechildren = document.getElementById ('customersTreeChildren');
								
				while (treechildren.firstChild) 
				{
 						treechildren.removeChild (treechildren.firstChild);
				}
			},						

			onChange : function ()
			{
				var view = document.getElementById ("customers").view;
				var selection = view.selection.currentIndex; //returns -1 if the tree is not focused
				
				if (selection != -1)
				{
					document.getElementById ("customerEdit").disabled = false;
					document.getElementById ("customerDestroy").disabled = false;
				}
				else
				{
					document.getElementById ("customerEdit").disabled = true;
					document.getElementById ("customerDestroy").disabled = true;
				}
			}
		}
	},
	
	customers :
	{
		init : function ()
		{
			main.controls.customers.refresh ();		
		},
								
		create : function ()
		{		
			try
			{
				var current = allectusLib.customer.create ();			
				current.name = "Unavngiven kunde";
				allectusLib.customer.save (current);																								
				
				window.openDialog ("chrome://allectus/content/customeredit/customeredit.xul", "customeredit:"+ current.id, "chrome", {customerId: current.id});
			}
			catch (error)
			{
				app.error ({exception: error})
			}
		},
		
		edit : function ()
		{		
			var current = main.controls.customers.getRow ();								
							
			window.openDialog ("chrome://allectus/content/customeredit/customeredit.xul", "customeredit:"+ current.id, "chrome", {customerId: current.id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet kunde", "Er du sikker på du vil slette denne kunde ?");
			
			if (result)
			{
				try
				{
					allectusLib.customer.destroy (main.controls.customers.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	}		
}
