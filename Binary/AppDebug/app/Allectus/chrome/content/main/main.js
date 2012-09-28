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
	},
	
	test : function (attributes)
	{	
		_attributes = attributes;				
		_elements = Array ();
		
		this.addRow = addRow;
		
		init (attributes);
	
		function init (attributes)
		{
			if (!attributes)
				attributes = new Array ();
				
			if (!attributes.element)
				throw "Need an treeview element to attatch to.";
		
			_elements.tree = attributes.element;
			_elements.treeChildren = document.createElement ("treechildren");
			_elements.tree.appendChild (_elements.treeChildren);
		};
		
		function addRow (attributes)
		{
			if (!attributes)
				attributes = new Array ();
				
			if (!attributes.id)
				attributes.id = SNDK.tools.newGuid ();
				
			if (!attributes.columns)
				attributes.columns = new Array ();
				
			if (!attributes.isContainer)
				attributes.isContainer = false;						
				
			if (!attributes.isOpen)
				attributes.isOpen = false;
		
			var treeItem = document.createElement ('treeitem');				
			treeItem.setAttribute ("container", attributes.isContainer);
			treeItem.setAttribute ("open", attributes.isOpen);
			
			if (attributes.isContainer)
			{
				_elements[attributes.id +"-treeChildren"] = document.createElement ("treechildren");
				treeItem.appendChild (_elements[attributes.id +"-treeChildren"]);				
			}
					
			if (attributes.childOfId)
			{
				for (i in _elements)
				{
					dump (i +"\n")
				}
			
				_elements[attributes.childOfId +"-treeChildren"].appendChild (treeItem);
			}
			else
			{
				_elements.treeChildren.appendChild (treeItem)
			}			

			var treeRow = document.createElement ('treerow');
			treeItem.appendChild (treeRow);
															
			for (index in attributes.columns)
			{
				var treeCell = document.createElement ('treecell');
				treeCell.setAttribute ('label', attributes.columns[index]);
				treeRow.appendChild (treeCell);
			}
			
			return attributes.id;
		}	
	},
		
	locations :
	{
		init : function ()
		{
			main.controls.locations.refresh ();		
			
			var treeview = new main.test ({element: document.getElementById ("test")});
			
			//main.test.init ();
			
			treeview.addRow ({columns: ["1", "Network"], id: "100", isContainer: true, isOpen: true});			
			treeview.addRow ({columns: ["2", "Router #1"], childOfId: "100"});
			treeview.addRow ({columns: ["3", "Router #2"], childOfId: "100"});
			
			treeview.addRow ({columns: ["4", "Servers"], id: "200", isContainer: true, isOpen: true});			
			treeview.addRow ({columns: ["5", "Server #1"], childOfId: "200"});
			treeview.addRow ({columns: ["6", "Server #2"], childOfId: "200"});
									
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
