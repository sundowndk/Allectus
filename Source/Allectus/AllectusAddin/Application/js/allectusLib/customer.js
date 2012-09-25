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


