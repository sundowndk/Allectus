Components.utils.import("resource://allectus/js/app.js");

var main = 
{
	init : function ()
	{		
		app.startup (window);
		
		main.customers.init ();
		main.locations.init ();
								
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
		},
		
		locations :
		{
			addRow : function (data)
			{			
				var children = document.getElementById ('locationsTreeChildren');		
	
				var item = document.createElement('treeitem');	
				children.appendChild (item)

				var row = document.createElement('treerow');
				item.appendChild (row);

				var columns = [data["id"], data["title"]];
									
				for (index in columns)
				{
					var cell = document.createElement('treecell');
					cell.setAttribute ('label', columns[index]);
					row.appendChild(cell);																		
				}
			},
			
			removeRow : function (id)
			{
				var tree = document.getElementById ('locations');
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
			
			setRow : function (item)
			{
				var tree = document.getElementById ('locations');
				var index = -1;
				
				if (!item)
				{
					index = tree.currentIndex;
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{	
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == item.id)
						{					
							index = i;							
							break;
						}
					}
				}
				
				if (index != -1)
				{									
					tree.view.setCellText (index, tree.columns.getNamedColumn ('id'), item.id);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('title'), item.title);					
				}
			},
			
			getRow : function (id)
			{
				var result = new Array ();
				
				var tree = document.getElementById ('locations');
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
				var onDone = 	function (items)
								{
									for (index in items)
									{									
										main.controls.locations.addRow (items[index]);
									}
								
								// Enable controls
								document.getElementById ("locations").disabled = false;								
								document.getElementById ("locationCreate").disabled = false;								
								
								main.controls.locations.onChange ();
							};

				// Disable controls
				document.getElementById ("locations").disabled = true;
				document.getElementById ("locationCreate").disabled = true;
				document.getElementById ("locationEdit").disabled = true;
				document.getElementById ("locationDestroy").disabled = true;
			
				allectusLib.management.location.list ({async: true, onDone: onDone});					
			},
				
			clear : function ()
			{
				var treechildren = document.getElementById ('locatonsTreeChildren');
								
				while (treechildren.firstChild) 
				{
 						treechildren.removeChild (treechildren.firstChild);
				}
			},						

			onChange : function ()
			{
				var view = document.getElementById ("locations").view;
				var selection = view.selection.currentIndex; //returns -1 if the tree is not focused
				
				if (selection != -1)
				{
					document.getElementById ("locationEdit").disabled = false;
					document.getElementById ("locationDestroy").disabled = false;
				}
				else
				{
					document.getElementById ("locationEdit").disabled = true;
					document.getElementById ("locationDestroy").disabled = true;
				}
			}
		}		
	},
	
	customers :
	{
		customersTreeHelper : null,
	
		init : function ()
		{
			main.customers.customersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("customers"), sort: "name", sortDirection: "descending", onDoubleClick: main.customers.edit});
		
			main.customers.set ();			
		},
		
		set : function ()
		{
				var onDone = 	function (customers)
								{
									for (idx in customers)
									{	
										main.customers.customersTreeHelper.addRow ({data: customers[idx]});
									}
								
								// Enable controls
								document.getElementById ("customers").disabled = false;														
								main.customers.onChange ();
							};

				// Disable controls
				document.getElementById ("customers").disabled = true;					
				document.getElementById ("customerCreate").disabled = true;			
				document.getElementById ("customerEdit").disabled = true;
				document.getElementById ("customerDestroy").disabled = true;
				
				document.getElementById ("customerSearch").focus ();
						
				allectusLib.customer.list ({async: true, onDone: onDone});
		},										
		
		onChange : function ()
		{										
				if (main.customers.customersTreeHelper.getCurrentIndex () != -1)
				{					
					document.getElementById ("customerCreate").disabled = false;
					document.getElementById ("customerEdit").disabled = false;
					document.getElementById ("customerDestroy").disabled = false;
				}
				else
				{					
					document.getElementById ("customerCreate").disabled = false;
					document.getElementById ("customerEdit").disabled = true;
					document.getElementById ("customerDestroy").disabled = true;
				}
		},
		
		sort : function (attributes)
		{
			main.customers.customersTreeHelper.sort (attributes);
		},
		
		filter : function ()
		{
			var value = document.getElementById ("customerSearch").value;
			main.customers.customersTreeHelper.filter ({column: "name", value: value, direction: "in"});
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
			var current = main.customers.customersTreeHelper.getRow ();
							
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
					allectusLib.customer.destroy (main.customers.customersTreeHelper.getRow ().id);										
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	},
				
	locations :
	{
		locationsTreeHelper : null,
	
		init : function ()
		{					
			main.locations.locationsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("locations"), sort: "title", sortDirection: "ascending", filter: "title", filterValue: "Slagelse", filterDirection: "in"});
			//main.locations.locationsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("locations"), sort: "title", sortDirection: "descending"});
			
			var data1 = new Array ();
			data1.id = "1";
			data1.title = "Network";
			
			var data2 = new Array ();
			data2.id = "2";
			data2.title = "Router #1";
			data2.test = "bla"			
			
			var data3 = new Array ();
			data3.id = "3";
			data3.title = "Router #2";
			
			var data4 = new Array ();
			data4.id = "3";
			data4.title = "Slagelse";
			
			var data5 = new Array ();
			data5.id = "3";
			data5.title = "Slagelse Nummer 2";
					
			main.locations.locationsTreeHelper.addRow ({data: data1});	
			main.locations.locationsTreeHelper.addRow ({data: data2});
			main.locations.locationsTreeHelper.addRow ({data: data3});
			main.locations.locationsTreeHelper.addRow ({data: data4});
			
			main.locations.locationsTreeHelper.setRow ({data: data5});
			
			//this.set ();
								
		//	main.controls.locations.refresh ();		
			
//			var treehelper = new sXUL.helpers.tree ({element: document.getElementById ("test")});
				
//			var data1 = new Array ();
//			data1.id = "1";
//			data1.title = "Network";
			
//			var data2 = new Array ();
//			data2.id = "2";
//			data2.title = "Router #1";
//			data2.test = "bla"			
			
//			var data3 = new Array ();
//			data3.id = "3";
//			data3.title = "Router #2";
			
//			var data4 = new Array ();
//			data4.id = "3";
//			data4.title = "Bla bla bla";
												
//			treehelper.addRow ({data: data1, isContainer: true, isOpen: true});
//			treehelper.addRow ({data: data2, isChildOfId: "1"});
//			treehelper.addRow ({data: data3, isChildOfId: "1"});
			
//			treehelper.setRow ({data: data4});
			
//			var data5 = treehelper.getRow ({id: "3"});
			
//			dump ("ID: "+ data5.id +"\n");
//			dump ("TITLE: "+ data5.title +"\n");
			
			//treehelper.removeRow ({id: "3"});
			
//			treehelper.addRow ({columns: ["4", "Servers"], id: "200", isContainer: true, isOpen: true});			
//			treehelper.addRow ({columns: ["5", "Server #1"], childOfId: "200"});
//			treehelper.addRow ({columns: ["6", "Server #2"], childOfId: "200"});
			
			
									
//			var children = document.getElementById ('testTreeChildren');		
	
//			var item1;
//			{
//				item1 = document.createElement('treeitem');	
//				item1.setAttribute ("container", true);
//				children.appendChild (item1)
//
//				var row = document.createElement('treerow');
//				item1.appendChild (row);
//				
//				var columns = ["ID", "TITLE"];
//									
//				for (index in columns)
//				{
//					var cell = document.createElement('treecell');
//					cell.setAttribute ('label', columns[index]);
//					row.appendChild(cell);
//				}
//			}
//			
//			var item2;
//			{
//				var children2 = document.createElement ("treechildren");
//				item1.appendChild (children2)
//			
//				item2 = document.createElement('treeitem');	
//				children2.appendChild (item2)
//
//				var row = document.createElement('treerow');
//				item2.appendChild (row);
//				
//				var columns = ["ID", "TITLE"];
//									
//				for (index in columns)
//				{
//					var cell = document.createElement('treecell');
//					cell.setAttribute ('label', columns[index]);
//					row.appendChild(cell);
//				}
//			}									
		},
		
		sort : function (column)
		{
			main.locations.locationsTreeHelper.sort (column);	
		},
		
		set : function ()
		{					
			var onDone = 	function (items)
							{
								for (idx in items)
								{		
									var item = items[idx];
								
									if (item.parentid == SNDK.tools.emptyGuid)
									{
										main.locations.locationsTreeHelper.addRow ({data: item, isOpen: true});
									}
									else
									{
										main.locations.locationsTreeHelper.addRow ({data: item, isChildOfId: item.parentid});
									}																		
								}
								
								// Enable controls
								document.getElementById ("locations").disabled = false;								
								document.getElementById ("locationCreate").disabled = false;								
								
//								main.controls.locations.onChange ();
							};

			// Disable controls
			document.getElementById ("locations").disabled = true;
			document.getElementById ("locationCreate").disabled = true;
			document.getElementById ("locationEdit").disabled = true;
			document.getElementById ("locationDestroy").disabled = true;
			
			allectusLib.management.location.list ({async: true, onDone: onDone});		
		},
								
		create : function ()
		{		
			try
			{
				var current = allectusLib.management.location.create ();			
				current.title = "Unavngiven lokation";
				allectusLib.management.location.save (current);																								
				
				window.openDialog ("chrome://allectus/content/management/location/edit.xul", current.id, "chrome", {locationId: current.id});
			}
			catch (error)
			{
				app.error ({exception: error})
			}
		},
		
		edit : function ()
		{		
			var current = main.controls.locations.getRow ();
							
			window.openDialog ("chrome://allectus/content/managment/location/edit.xul", current.id, "chrome", {locationId: current.id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet lokation", "Er du sikker på du vil slette denne lokation ?");
			
			if (result)
			{
				try
				{
					allectusLib.management.location.destroy (main.controls.locations.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	}	
}
