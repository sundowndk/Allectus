// ---------------------------------------------------------------------------------------------------------------
// PROJECT: allectuslib
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// CLASS: allectusLib
// ---------------------------------------------------------------------------------------------------------------
var allectusLib =
{
	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: customer
	// ---------------------------------------------------------------------------------------------------------------
	customer :
	{
		create : function ()
		{
			var request = new SNDK.ajax.request ("http://sorentotest.sundown.dk/", "cmd=Ajax;cmd.function=AllectusLib.Customer.Create", "data", "POST", false);	
			request.send ();
			
			return request.respons ()["allectuslib.customer"];
		},
			
		load : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request ("http://sorentotest.sundown.dk/", "cmd=Ajax;cmd.function=AllectusLib.Customer.Load", "data", "POST", false);		
			request.send (content);
		
			return request.respons ()["allectuslib.customer"];
		},
				
		save : function (Customer)
		{	
			var content = new Array ();
			content["allectuslib.customer"] = Customer;
										
			var request = new SNDK.ajax.request ("http://sorentotest.sundown.dk/", "cmd=Ajax;cmd.function=AllectusLib.Customer.Save", "data", "POST", false);	
			request.send (content);
		
			return true;
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			try
			{
				var request = new SNDK.ajax.request ("http://sorentotest.sundown.dk/", "cmd=Ajax;cmd.function=AllectusLib.Customer.Destroy", "data", "POST", false);	
				request.send (content);
			}
			catch (error)
			{						
				return [false, error];
			}
					
			return [true];
		},				
				
		list : function (attributes)
		{
			if (!attributes) attributes = new Array ();
			
			if (attributes.async)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["allectuslib.customers"]);
								};
				
			
				var request = new SNDK.ajax.request ("http://sorentotest.sundown.dk/", "cmd=Ajax;cmd.function=AllectusLib.Customer.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send ();						
			}
			else
			{
				var request = new SNDK.ajax.request ("http://sorentotest.sundown.dk/", "cmd=Ajax;cmd.function=AllectusLib.Customer.List", "data", "POST", false);		
				request.send ();
		
				return request.respons ()["allectuslib.customers"];		
			}
		}	
		
		
	}
}


var main = 
{
	init : function ()
	{
		main.startup ();
		
		main.customers.init ();			
	},

	startup  : function ()
	{
	
	},
	
	shutdown : function (forceQuit)
	{
		dump("App shutdown!");
  		var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].getService (Components.interfaces.nsIAppStartup);

  		var quitSeverity = forceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
                                  Components.interfaces.nsIAppStartup.eAttemptQuit;
  		appStartup.quit(quitSeverity);	
	},
	
	customers : 
	{
		init : function ()
		{
			main.customers.refresh ();
		},
	
		refresh : function ()
		{
			var onDone = 	function (customers)
					{
						var customers = new Array ();
						customers[0] = {id: 1, name: "Rasmus Pedersen", address1: "Agersøvej 303", postcode: "4200", city: "Slagelse", email: "rasmus@akvaservice.dk"};
					
						// Populate tree
						var tree = document.getElementById ("customers");
						var children = document.createElement('treechildren');		
						tree.appendChild (children);

						for (index in customers)
						{
							var customer = customers[index];

							var item = document.createElement('treeitem');	
							children.appendChild (item)
						
							var row = document.createElement('treerow');
							item.appendChild (row);

							{
								var cell = document.createElement('treecell');
								cell.setAttribute ('label', customer["id"]);
								row.appendChild(cell);			
							}

							{
								var cell = document.createElement('treecell');
								cell.setAttribute ('label', customer["name"]);
								row.appendChild(cell);			
							}
							
							{
								var cell = document.createElement('treecell');
								cell.setAttribute ('label', customer["address1"]);
								row.appendChild(cell);			
							}
							
							{
								var cell = document.createElement('treecell');
								cell.setAttribute ('label', customer["postcode"]);
								row.appendChild(cell);			
							}
							
							{
								var cell = document.createElement('treecell');
								cell.setAttribute ('label', customer["city"]);
								row.appendChild(cell);			
							}
							
							{
								var cell = document.createElement('treecell');
								cell.setAttribute ('label', customer["email"]);
								row.appendChild(cell);			
							}							
						}				
						
						// Enable controls
						tree.disabled = false;						
						document.getElementById ("customerCreate").disabled = false;
					};

		onDone ();

			//allectusLib.customer.list ({async: true, onDone: onDone});
		}
	}
	
	
}