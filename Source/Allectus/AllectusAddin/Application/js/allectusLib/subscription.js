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


