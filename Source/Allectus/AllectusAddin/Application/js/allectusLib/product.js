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


