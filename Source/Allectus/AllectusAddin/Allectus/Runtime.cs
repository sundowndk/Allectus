// 
//  Runtime.cs
//  
//  Author:
//      Rasmus Pedersen (rvp@qnax.net)
// 
//  Copyright (c) 2012 QNAX ApS
// 

using System;
using System.Collections.Generic;

using C5;

using SNDK.DBI;
using AllectusLib;

namespace Allectus
{
	public static class Runtime
	{	
		#region Public Static Methods
		public static void Initialize ()
		{				
			C5.Runtime.DBConnection = new Connection (SNDK.Enums.DatabaseConnector.Mssql, "172.20.0.54", "c5qnax", "c5qnax", "c5qnax", false);			
			AllectusLib.Runtime.DBConnection = new SNDK.DBI.Connection (SNDK.Enums.DatabaseConnector.Mysql, "172.20.0.56", "allectus", "allectus", "allectus", false);

			// Remove current symlinks
			SNDK.IO.RemoveSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_content) + "/allectus");
			SNDK.IO.RemoveSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_html) + "/allectus");
			
			// Create symlinks
			SNDK.IO.CreateSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "Allectus/resources/content", SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_content) + "/allectus");
			SNDK.IO.CreateSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "Allectus/resources/htdocs", SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_html) + "/allectus");
			//			SNDK.IO.CreateSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "sCMS/resources/xml", SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "sConsole/resources/xml/scms");
			

//			List<AllectusLib.Customer> customers = AllectusLib.Customer.List ();
//
//			foreach (C5.Debitor debitor in C5.Debitor.List ()) 
//			{
//				if (customers.Find (delegate (Customer c) {return c.ErpId == debitor.Id; }) == null)
//				{
//					AllectusLib.Customer customer = new Customer (debitor);
//					customer.Save ();
//
//					Console.WriteLine ("missing customer: "+ debitor.Name);
//				}
//			}

		}	
		#endregion
	}
}

