//
//  Main.cs
//
//  Author:
//       sundown <${AuthorEmail}>
//
//  Copyright (c) 2012 rvp
//
//  This program is free software; you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation; either version 2 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program; if not, write to the Free Software
//  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
//
using System;
using System.Collections.Generic;

using SNDK.DBI;
using C5;

using AllectusLib;

namespace Test
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			C5.Runtime.DBConnection = new Connection (SNDK.Enums.DatabaseConnector.Mssql, "172.20.0.54", "c5qnax", "c5qnax", "c5qnax", false);	

			//AllectusLib.Runtime.DBConnection = new SNDK.DBI.Connection (SNDK.Enums.DatabaseConnector.Mysql, "10.0.0.40", "allectus", "allectus", "qwerty", false);
			AllectusLib.Runtime.DBConnection = new SNDK.DBI.Connection (SNDK.Enums.DatabaseConnector.Mysql, "172.20.0.56", "allectus", "allectus", "allectus", false);

			if (!AllectusLib.Runtime.DBConnection.Connect ())
			{
				Console.WriteLine ("Could not connect Allectus to database!");
			}

			if (!C5.Runtime.DBConnection.Connect ())
			{
				Console.WriteLine ("Could not connect C5 to database!");
			}

			bool testlocation = false;

			bool testsubscription = true;

			bool testcustomer = false;

			if (testlocation)
			{
				AllectusLib.Management.Location l1 = new AllectusLib.Management.Location ();
				l1.Title = "Test";
				l1.Save ();

				AllectusLib.Management.Location l2 = AllectusLib.Management.Location.Load (l1.Id);
				Console.WriteLine (l2.Title);

				AllectusLib.Management.Location.Delete (l1.Id);
			}

			if (testsubscription)
			{

//				Customer.Load c1 = Customer.Load (new Guid ("1f032c03-eea5-47e4-b957-d5605a522431"));

				foreach (Customer c in Customer.List ())
				{
					foreach (Subscription s in Subscription.List (c.Id))
					{
						s.Bill ();

					}
				}

//				Subscription s1 = Subscription.Load (new Guid ("935b3282-25cc-48a9-a249-3596a684fd20"));

//				s1.Bill ();

//				Customer d1 = new Customer ();
//				d1.Name = "Test Customer";
//				d1.Save ();
//
//				Subscription t1 = new Subscription (d1);
//				t1.Type = AllectusLib.Enums.SubscriptionType.Yearly;
//				t1.Title = "Test Subscription #1";
//				t1.Save ();
//
//				SubscriptionItem t2 = new SubscriptionItem (t1);
//				t2.Text = "Test Item #1";
//				t2.Price = 100m;
//				t2.Save ();
//
//				SubscriptionItem t3 = new SubscriptionItem (t1);
//				t3.Text = "Test Item #2";
//				t3.Price = 200m;
//				t3.Save ();
//
//				t1.Bill ();

//				foreach (SubscriptionItem t in SubscriptionItem.List (t1))
//				{
//					Console.WriteLine (t.Text);
//				}

//				SubscriptionItem.Delete (t2);
//				SubscriptionItem.Delete (t3);
//
//				Subscription.Delete (t1);
//
//				Customer.Delete (d1);
			}


//			if (testsubscription)
//			{
//				Customer a1 = new Customer ();
//				a1.Name = "Test Customer";
//				a1.Save ();
//				
//				
//				Subscription t1 = new Subscription (a1);
//				t1.Title = "Test Subscription #1";
//				t1.Type = AllectusLib.Enums.SubscriptionType.Yearly;
//				t1.Save ();
//				
//				foreach (Subscription t in Subscription.List ())
//				{
//					//					if (t.NextBilling > DateTime.Today)
//					//					{
//					Console.WriteLine ("Billing subscription: "+ t.Title);
//					
//					t.Bill ();
//					
//					//					}
//				}
//				
//				foreach (Subscription t in Subscription.List ())
//				{
//					Subscription.Delete (t.Id);
//				}												
//
//			}

			if (testcustomer)
			{
				List<AllectusLib.Customer> customers = AllectusLib.Customer.List ();
				
				foreach (C5.Debitor debitor in C5.Debitor.List ()) 
				{
					if (customers.Find (delegate (Customer c) {return c.ErpId == debitor.Id; }) == null)
					{
						AllectusLib.Customer customer = new Customer (debitor);
//						customer.Save ();
						Console.WriteLine ("missing customer: "+ debitor.Name);
//						break;						
					}
				}


//				Customer c1 = new Customer ();
//				c1.Name = "Name";
//				c1.Address1 = "Address1";
//				c1.Address2 = "Address2";
//				c1.PostCode = "PostCode";
//				c1.City = "City";
//				c1.Country = "Country";
//				
//				c1.Save ();

//				Customer c2 = Customer.Load (c1.Id);
//				Console.WriteLine (c2.Name);
//				Console.WriteLine (c2.Address1);
//				Console.WriteLine (c2.Address2);
//				Console.WriteLine (c2.PostCode);
//				Console.WriteLine (c2.City);
//				Console.WriteLine (c2.Country);
//
//				c2.Name = "TEST TEST TEST";
//				c2.Save ();
//
//				Customer c3 = Customer.Load (c1.Id);
//				Console.WriteLine (c3.Name);
//
//				Customer.Delete (c1.Id);
			}

		}
	}
}
