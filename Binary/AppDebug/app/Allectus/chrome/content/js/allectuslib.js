// ---------------------------------------------------------------------------------------------------------------
// PROJECT: allectuslib
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// CLASS: allectusLib
// ---------------------------------------------------------------------------------------------------------------
var allectusLib =
{
	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: runtime
	// ---------------------------------------------------------------------------------------------------------------
	runtime :
	{
		ajaxUrl : "http://sorentotest.sundown.dk/",
		ajaxUrlProduction : "http://172.20.0.56/",
		
		initialize : function ()
		{
		}
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: customer
	// ---------------------------------------------------------------------------------------------------------------
	customer :
	{
		create : function ()
		{
			var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Customer.Create", "data", "POST", false);	
			request.send ();
			
			var result = request.respons ()["allectuslib.customer"];
			
			app.events.onCustomerCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Customer.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["allectuslib.customer"];
			app.events.onCustomerLoad.execute (result);
		
			return result;
		},
				
		save : function (customer)
		{	
			var content = new Array ();
			content["allectuslib.customer"] = customer;
										
			var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Customer.Save", "data", "POST", false);				
			request.send (content);
			
			var result = customer;	
			app.events.onCustomerSave.execute (result);
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Customer.Destroy", "data", "POST", false);	
			request.send (content);
			
			app.events.onCustomerDestroy.execute (id);				
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
				
			
				var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Customer.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send ();						
			}
			else
			{
				var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Customer.List", "data", "POST", false);		
				request.send ();
		
				return request.respons ()["allectuslib.customers"];		
			}
		}	
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: subscription
	// ---------------------------------------------------------------------------------------------------------------
	subscription :
	{
		create : function (customer)
		{
			var content = new Array ();	
			content["customerid"] = customer.id;
		
			var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Subscription.Create", "data", "POST", false);	
			request.send (content);
			
			var result = request.respons ()["allectuslib.subscription"];	
			app.events.onSubscriptionCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Subscription.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["allectuslib.subscription"];
			app.events.onSubscriptionLoad.execute (result);
			
			return result;
		},
				
		save : function (subscription)
		{	
			var content = new Array ();
			content["allectuslib.subscription"] = subscription;
										
			var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Subscription.Save", "data", "POST", false);			
			request.send (content);
			
			app.events.onSubscriptionSave.execute (subscription);
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Subscription.Destroy", "data", "POST", false);	
			request.send (content);
			
			app.events.onSubscriptionDestroy.execute (id);
		},				
				
		list : function (attributes)
		{
			if (!attributes) 
				attributes = new Array ();
			
			var content = new Array ();
			
			if (attributes.customerid)
			{
				content["customerid"] = attributes.customerid;
			}
			
			if (attributes.customer)
			{
				content["customerid"] = attributes.customer.id;
			}
			
			if (attributes.async)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["allectuslib.subscriptions"]);
								};
				
			
				var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Subscription.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send (content);						
			}
			else
			{
				var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Subscription.List", "data", "POST", false);		
				request.send (content);
		
				return request.respons ()["allectuslib.subscriptions"];		
			}
		}	
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: subscriptionItem
	// ---------------------------------------------------------------------------------------------------------------
	subscriptionItem :
	{
		create : function (subscription)
		{
			var content = new Array ();	
			content["subscriptionid"] = subscription.id;
		
			var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.SubscriptionItem.Create", "data", "POST", false);	
			request.send (content);
			
			var result = request.respons ()["allectuslib.subscriptionitem"];	
			app.events.onSubscriptionItemCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.SubscriptionItem.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["allectuslib.subscriptionitem"];
			app.events.onSubscriptionItemLoad.execute (result);
			
			return result;
		},
				
		save : function (subscriptionitem)
		{	
			var content = new Array ();
			content["allectuslib.subscriptionitem"] = subscriptionitem;
										
			var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.SubscriptionItem.Save", "data", "POST", false);			
			request.send (content);
			
			app.events.onSubscriptionItemSave.execute (subscriptionitem);
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.SubscriptionItem.Destroy", "data", "POST", false);	
			request.send (content);
			
			app.events.onSubscriptionItemDestroy.execute (id);
		},				
				
		list : function (attributes)
		{
			if (!attributes) 
				attributes = new Array ();
			
			var content = new Array ();
			
			if (attributes.subscriptionId)
			{
				content["subscriptionid"] = attributes.subscriptionId;
			}
			
			if (attributes.subscription)
			{
				content["subscriptionid"] = attributes.subscription.id;
			}
			
			if (attributes.async)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["allectuslib.subscriptionitems"]);
								};
				
			
				var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.SubscriptionItem.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send (content);						
			}
			else
			{
				var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.SubscriptionItem.List", "data", "POST", false);		
				request.send (content);
		
				return request.respons ()["allectuslib.subscriptionitems"];		
			}
		}	
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: product
	// ---------------------------------------------------------------------------------------------------------------
	product :
	{
		load : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Product.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["c5.product"];	
		
			return result;
		},
						
		list : function (attributes)
		{
			if (!attributes) attributes = new Array ();
			
			if (attributes.async)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["c5.products"]);
								};
				
			
				var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Product.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send ();						
			}
			else
			{
				var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Product.List", "data", "POST", false);		
				request.send ();
		
				return request.respons ()["c5.products"];		
			}
		}	
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: management
	// ---------------------------------------------------------------------------------------------------------------
	management :
	{
		// ---------------------------------------------------------------------------------------------------------------
		// CLASS: location
		// ---------------------------------------------------------------------------------------------------------------
		location :
		{
			create : function ()
			{
				var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Management.Location.Create", "data", "POST", false);	
				request.send ();
				
				var result = request.respons ()["allectuslib.management.location"];
				
				app.events.onManagementLocationCreate.execute (result);
				
				return result;
			},
				
			load : function (id)
			{
				var content = new Array ();
				content["id"] = id;
			
				var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Management.Location.Load", "data", "POST", false);		
				request.send (content);
			
				var result = request.respons ()["allectuslib.management.location"];
				app.events.onManagementLocationLoad.execute (result);
			
				return result;
			},
					
			save : function (location)
			{	
				var content = new Array ();
				content["allectuslib.management.location"] = location;
											
				var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Management.Location.Save", "data", "POST", false);				
				request.send (content);
				
				var result = location;	
				app.events.onManagementLocationSave.execute (result);
			},		
			
			destroy : function (id)
			{
				var content = new Array ();
				content["id"] = id;
			
				var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Management.Location.Destroy", "data", "POST", false);	
				request.send (content);
				
				app.events.onManagementLocationDestroy.execute (id);				
			},				
					
			list : function (attributes)
			{
				if (!attributes) attributes = new Array ();
				
				if (attributes.async)
				{
					var onDone = 	function (respons)
									{
										attributes.onDone (respons["allectuslib.management.locations"]);
									};
					
				
					var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Management.Location.List", "data", "POST", true);
					request.onLoaded (onDone);
					request.send ();						
				}
				else
				{
					var request = new SNDK.ajax.request (allectusLib.runtime.ajaxUrl, "cmd=Ajax;cmd.function=AllectusLib.Management.Location.List", "data", "POST", false);		
					request.send ();
			
					return request.respons ()["allectuslib.management.locations"];		
				}
			}	
			
			
		}
	}
}

