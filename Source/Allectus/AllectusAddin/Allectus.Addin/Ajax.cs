//
// Ajax.cs
//

using System;
using System.Collections.Generic;
using System.Collections;

using SorentoLib;

using AllectusLib;

namespace Allectus.Addin
{
	public class Ajax : SorentoLib.Addins.IAjaxBaseClass, SorentoLib.Addins.IAjax		
	{
		#region Constructor
		public Ajax ()
		{
			base.NameSpaces.Add ("allectuslib");
			base.NameSpaces.Add ("allectuslib.management");
		}
		#endregion
		
		#region Public Methods
		new public SorentoLib.Ajax.Respons Process (SorentoLib.Session Session, string Fullname, string Method)
		{
			SorentoLib.Ajax.Respons result = new SorentoLib.Ajax.Respons ();
			SorentoLib.Ajax.Request request = new SorentoLib.Ajax.Request (Session.Request.QueryJar.Get ("data").Value);
			
			switch (Fullname.ToLower ())
			{
				#region Allectus.Customer
				case "allectuslib.customer":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (new AllectusLib.Customer ());
							break;
						}		
							
						case "load":
						{
							result.Add (AllectusLib.Customer.Load (request.getValue<Guid>("id")));
							break;
						}
							
						case "save":
						{
							request.getValue<AllectusLib.Customer> ("allectuslib.customer").Save ();
							break;
						}
							
						case "destroy":
						{
							AllectusLib.Customer.Delete (request.getValue<Guid> ("id"));
							break;
						}
							
						case "list":
						{
							result.Add (AllectusLib.Customer.List ());
							break;
						}
					}
					break;
				}
				#endregion			

				#region Allectus.Subscription
				case "allectuslib.subscription":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (new AllectusLib.Subscription (Customer.Load (request.getValue<Guid>("customerid"))));
							break;
						}		
							
						case "load":
						{
							result.Add (AllectusLib.Subscription.Load (request.getValue<Guid>("id")));
							break;
						}
							
						case "save":
						{
							request.getValue<AllectusLib.Subscription> ("allectuslib.subscription").Save ();
							break;
						}
							
						case "destroy":
						{
							AllectusLib.Subscription.Delete (request.getValue<Guid> ("id"));
							break;
						}
							
						case "list":
						{
							if (request.ContainsXPath ("customerid"))
							{
								result.Add (Subscription.List (request.getValue<Guid> ("customerid")));
							}
							else
							{
								result.Add (Subscription.List ());
							}													
							break;
						}
					}
					break;
				}
				#endregion							

				#region Allectus.SubscriptionItem
				case "allectuslib.subscriptionitem":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (new AllectusLib.SubscriptionItem (Subscription.Load (request.getValue<Guid>("subscriptionid"))));
							break;
						}		
							
						case "load":
						{
							result.Add (AllectusLib.SubscriptionItem.Load (request.getValue<Guid>("id")));
							break;
						}
							
						case "save":
						{						
							request.getValue<AllectusLib.SubscriptionItem> ("allectuslib.subscriptionitem").Save ();
							break;
						}
							
						case "destroy":
						{
							AllectusLib.SubscriptionItem.Delete (request.getValue<Guid> ("id"));
							break;
						}
							
						case "list":
						{
							if (request.ContainsXPath ("subscriptionid"))
							{
								result.Add (SubscriptionItem.List (request.getValue<Guid> ("subscriptionid")));
							}
							else
							{
								result.Add (SubscriptionItem.List ());
							}													
							break;
						}
					}
					break;
				}
				#endregion			

				#region Allectus.Management.Location
				case "allectuslib.management.location":
				{	switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (new AllectusLib.Management.Location ());
							break;
						}		
							
						case "load":
						{
							result.Add (AllectusLib.Management.Location.Load (request.getValue<Guid>("id")));
							break;
						}
							
						case "save":
						{
							request.getValue<AllectusLib.Management.Location> ("allectuslib.management.location").Save ();
							break;
						}
							
						case "destroy":
						{
							AllectusLib.Management.Location.Delete (request.getValue<Guid> ("id"));
							break;
						}
							
						case "list":
						{
							result.Add (AllectusLib.Management.Location.List ());
							break;
						}
					}
					break;
				}
				#endregion	

				#region Allectus.Product
				case "allectuslib.product":
				{	
					switch (Method.ToLower ())
					{													
						case "load":
						{
							result.Add (C5.Product.Load (request.getValue<string>("id")));
							break;
						}
																				
						case "list":
						{
							result.Add (C5.Product.List ());																			
							break;
						}
					}
					break;
				}
				#endregion	
			}
			
			return result;
		}
		#endregion
	}
}
