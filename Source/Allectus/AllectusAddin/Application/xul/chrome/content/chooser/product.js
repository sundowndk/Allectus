Components.utils.import("resource://allectus/js/app.js");

var main = 
{
	init : function ()
	{											
		main.controls.products.refresh ();
		
		// Hook events.			
//		app.events.onCustomerCreate.addHandler (main.eventHandlers.onCustomerCreate);		
//		app.events.onCustomerSave.addHandler (main.eventHandlers.onCustomerSave);
//		app.events.onCustomerDestroy.addHandler (main.eventHandlers.onCustomerDestroy);
	},
	
	eventHandlers : 
	{
//		onCustomerCreate : function (customer)
//		{
//			main.controls.customers.addRow (customer);
//		},
		
//		onCustomerSave : function (customer)
//		{
//			main.controls.customers.setRow (customer);
//		},
		
//		onCustomerDestroy : function (id)
//		{
//			main.controls.customers.removeRow (id);
//		}		
	},
	
	choose : function ()
	{
		if (window.arguments[0].onDone != null)
		{
			window.arguments[0].onDone (main.controls.products.getSelected ());
		}
		
		window.close ();
	},
	
	close : function ()
	{
		if (window.arguments[0].onDone != null)
		{
			window.arguments[0].onDone (null);
		}
		
		// Unhook events.
//		app.events.onCustomerCreate.removeHandler (main.eventHandlers.onCustomerCreate);		
//		app.events.onCustomerSave.removeHandler (main.eventHandlers.onCustomerSave);
//		app.events.onCustomerDestroy.removeHandler (main.eventHandlers.onCustomerDestroy);
	
		// Close window.
		window.close ();
	},
	
	controls : 
	{
		products :
		{
			addRow : function (product)
			{
				var treechildren = document.getElementById ('productsTreeChildren');		
	
				var treeitem = document.createElement ('treeitem');	
				treechildren.appendChild (treeitem)

				var treerow = document.createElement ('treerow');
				treeitem.appendChild (treerow);

				var columns = [product["id"], product["name"], product["price"]];
									
				for (index in columns)
				{
					var treecell = document.createElement ('treecell');
					treecell.setAttribute ('label', columns[index]);
					treerow.appendChild (treecell);
				}
			},
					
			clear : function ()
			{
				var treechildren = document.getElementById ('productsTreeChildren');
								
				while (treechildren.firstChild) 
				{
 						treechildren.removeChild (treechildren.firstChild);
				}
			},	
			
			refresh : function ()
			{					
				var onDone = 	function (products)
								{
									for (index in products)
									{									
										main.controls.products.addRow (products[index]);
									}
								
								// Enable controls
								document.getElementById ("products").disabled = false;																								
								main.controls.products.onChange ();
							};

				// Disable controls
				document.getElementById ("products").disabled = true;								
				document.getElementById ("close").disabled = true;
				document.getElementById ("choose").disabled = true;
			
				allectusLib.product.list ({async: true, onDone: onDone});					
			},
			
			setRow : function (product)
			{
				var tree = document.getElementById ('products');
				var index = -1;
				
				if (!customer)
				{
					index = tree.currentIndex;
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{	
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == product.id)
						{					
							index = i;							
							break;
						}
					}
				}

				if (index != -1)
				{
					tree.view.setCellText (index, tree.columns.getNamedColumn ('id'), product.id);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('name'), product.name);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('price'), product.price);					
				}
			},
			
			removeRow : function (id)
			{
				var tree = document.getElementById ('products');
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
			
			
			getSelected : function ()
			{
				var result = new Array ();
				var tree = document.getElementById ('products');
				
				result.id = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('id'));
				result.name = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('name'));
				result.price = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('proce'));
								
				return result;
			},
		
			onChange : function ()
			{
				var view = document.getElementById ("products").view;
				var selection = view.selection.currentIndex; //returns -1 if the tree is not focused
				
				if (selection != -1)
				{
					document.getElementById ("close").disabled = false;
					document.getElementById ("choose").disabled = false;
				}
				else
				{
					document.getElementById ("close").disabled = false;
					document.getElementById ("choose").disabled = true;
				}
			}
		}		
	}
}
