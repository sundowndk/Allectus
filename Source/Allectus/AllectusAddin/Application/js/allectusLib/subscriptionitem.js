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


