create : function ()
{
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=AllectusLib.Customer.Create", "data", "POST", false);	
	request.send ();
	
	return request.respons ()["allectuslib.customer"];
},
	
load : function (id)
{
	var content = new Array ();
	content["id"] = id;

	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=AllectusLib.Customer.Load", "data", "POST", false);		
	request.send (content);

	return request.respons ()["allectuslib.customer"];
},
		
save : function (Customer)
{	
	var content = new Array ();
	content["allectuslib.customer"] = Customer;
								
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=AllectusLib.Customer.Save", "data", "POST", false);	
	request.send (content);

	return true;
},		

destroy : function (id)
{
	var content = new Array ();
	content["id"] = id;

	try
	{
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=AllectusLib.Customer.Destroy", "data", "POST", false);	
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
		
	
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=AllectusLib.Customer.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send ();						
	}
	else
	{
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=AllectusLib.Customer.List", "data", "POST", false);		
		request.send ();

		return request.respons ()["allectuslib.customers"];		
	}
}	


