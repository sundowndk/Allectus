Components.utils.import("resource://allectus/js/app.js");

var main = 
{
	productsTreeHelper : null,

	init : function ()
	{											
		main.productsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("products"), sort: "id", sortDirection: "descending", onDoubleClick: main.choose});
		
		main.set ();
	},
	
	set : function ()
	{
		var onDone = 	function (products)
						{
							for (idx in products)
							{	
								main.productsTreeHelper.addRow ({data: products[idx]});
							}
								
							// Enable controls
							document.getElementById ("products").disabled = false;																					
							main.onChange ();
							document.getElementById ("productSearch").focus ();
						};

				// Disable controls
				document.getElementById ("products").disabled = true;	
				document.getElementById ("productSearch").disabled = true;	
				document.getElementById ("close").disabled = true;			
				document.getElementById ("choose").disabled = true;				
						
				allectusLib.product.list ({async: true, onDone: onDone});
	},
	
	sort : function (attributes)
	{
		main.productsTreeHelper.sort (attributes);
	},
		
	filter : function ()
	{
		var value = document.getElementById ("productSearch").value;
		main.productsTreeHelper.filter ({column: "id", value: value, direction: "in"});
	},
	
	onChange : function ()
	{						
		if (main.productsTreeHelper.getCurrentIndex () != -1)
		{
			document.getElementById ("productSearch").disabled = false;
			document.getElementById ("close").disabled = false;
			document.getElementById ("choose").disabled = false;
		}
		else
		{
			document.getElementById ("productSearch").disabled = false;
			document.getElementById ("close").disabled = false;
			document.getElementById ("choose").disabled = true;
		}
	},
			
	choose : function ()
	{
		if (window.arguments[0].onDone != null)
		{
			var result = allectusLib.product.load (main.productsTreeHelper.getRow ().id);
		
			window.arguments[0].onDone (result);
		}
		
		window.close ();
	},
	
	close : function ()
	{
		if (window.arguments[0].onDone != null)
		{
			window.arguments[0].onDone (null);
		}
			
		// Close window.
		window.close ();
	}	
}
