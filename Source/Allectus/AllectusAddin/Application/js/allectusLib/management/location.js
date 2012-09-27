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


