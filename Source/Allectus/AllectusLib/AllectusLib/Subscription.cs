//
// Subscription.cs
//  
// Author:
//       Rasmus Pedersen <rasmus@akvaservice.dk>
// 
// Copyright (c) 2011 QNAX ApS
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

using System;
using System.Xml;

using System.Collections;
using System.Collections.Generic;

using SNDK.DBI;

namespace AllectusLib
{
	public class Subscription
	{
		#region Public Static Fields
		public static string DatabaseTableName = Runtime.DBPrefix + "subscriptions";	
		#endregion
		
		#region Private Fields
		private Guid _id;

		private int _createtimestamp;
		private int _updatetimestamp;				

		private Enums.SubscriptionType _type;

		private Guid _customerid;		

		private string _title;	
		private int _nextbilling;

		private Enums.SubscriptionStatus _status;
		#endregion					
		
		#region Public Fields		
		public Guid Id
		{
			get
			{
				return this._id;
			}
		}
		
		public int CreateTimestamp 
		{
			get 
			{ 
				return this._createtimestamp; 
			}
		}
		
		public int UpdateTimestamp 
		{
			get 
			{ 
				return this._updatetimestamp; 
			}
		}			

		public Enums.SubscriptionType Type
		{
			get
			{
				return this._type;
			}
			
			set
			{
				this._type = value;
			}
		}
		
		public Customer Customer
		{
			get
			{
				return Customer.Load (this._customerid);
			}
			
			set
			{
				this._customerid = value.Id;
			}
		}
		
		public string Title
		{
			get
			{
				return this._title;
			}
			
			set
			{
				this._title = value;
			}
		}
		
		public DateTime NextBilling
		{
			get
			{
				return SNDK.Date.TimestampToDateTime (this._nextbilling);
			}
		}
		
//		public IList<SubscriptionItem> Items
//		{
//			get
//			{
//				return this._items.AsReadOnly ();
//			}
//		}

		public Enums.SubscriptionStatus Status
		{
			get
			{
				return this._status;
			}

			set
			{
				this._status = value;
			}
		}
		#endregion		
		
		#region Constructor		
		public Subscription (Customer customer)
		{
			this._id = Guid.NewGuid ();

			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();			

			this._type = Enums.SubscriptionType.Monthly;
			this._customerid = customer.Id;

			this._title = string.Empty;			
			this._nextbilling = SNDK.Date.DateTimeToTimestamp (DateTime.Today.AddDays (2));

			this._status = Enums.SubscriptionStatus.Active;
		}
		
		private Subscription ()
		{
			this._id = Guid.Empty;

			this._createtimestamp = 0;
			this._updatetimestamp = 0;

			this._type = AllectusLib.Enums.SubscriptionType.Monthly;
			this._customerid = Guid.Empty;

			this._title = string.Empty;
			this._nextbilling = 0;

			this._status = AllectusLib.Enums.SubscriptionStatus.Inactive;
		}
		#endregion
		
		#region Public Methods		
		public void Save ()
		{
			bool success = false;
			QueryBuilder qb = null;
			
			if (!SNDK.DBI.Helpers.GuidExists (Runtime.DBConnection, DatabaseTableName, this._id)) 
			{
				qb = new QueryBuilder (QueryBuilderType.Insert);
			} 
			else 
			{
				qb = new QueryBuilder (QueryBuilderType.Update);
				qb.AddWhere ("id", "=", this._id);
			}
			
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			
			qb.Table (DatabaseTableName);
			qb.Columns 
				(
					"id", 
					"createtimestamp", 
					"updatetimestamp",		
					"type",
					"customerid",
					"title",
					"nextbilling",
					"status"
					);
			
			qb.Values 
				(	
				 this._id, 
				 this._createtimestamp, 
				 this._updatetimestamp,			
				 this._type,
				 this._customerid,
				 this._title,
				 this._nextbilling,
				 this._status
				 );
			
			Query query = Runtime.DBConnection.Query (qb.QueryString);
			
			if (query.AffectedRows > 0) 
			{
				success = true;
			}
			
			query.Dispose ();
			query = null;
			qb = null;

			if (!success) 
			{
				throw new Exception (string.Format (Strings.Exception.SubscriptionSave, this._id));
			}		
		}
		
//		public void AddItem (Product Product)
//		{
//			SubscriptionItem item = new SubscriptionItem (this, Product);
//			this._items.Add (item);
//		}
//		
//		public void RemoveItem (Guid Id)
//		{
//			this._items.RemoveAll (delegate (SubscriptionItem si) { return si.Id == Id; });
//			
//			try
//			{
//				SubscriptionItem.Delete (Id);
//			}
//			catch
//			{				
//			}
//		}
		
		public void Invoice ()
		{			
//			List<Hashtable> result = new List<Hashtable> ();
//			
//			DateTime billingstart;
//			DateTime billingend;
//			
//			switch (this._type)
//			{
//				case Enums.SubscriptionType.Monthly:
//				{
//					billingstart = SNDK.Date.GetStartOfMonth (DateTime.Today.Year, DateTime.Today.Month);
//					billingend = SNDK.Date.GetEndOfMonth (DateTime.Today.Year, DateTime.Today.Month);
//					
//					break;
//				}
//					
//				case Enums.SubscriptionType.Quarterly:
//				{
//					SNDK.Enums.Quarter quarter = SNDK.Date.GetQuarter (SNDK.Enums.Month.February);
//					
//					billingstart = SNDK.Date.GetStartOfQuarter (DateTime.Today.Year, quarter);
//					billingend = SNDK.Date.GetEndOfQuarter (DateTime.Today.Year, quarter);
//					
//					break;
//				}
//					
//				case Enums.SubscriptionType.HalfYearly:
//				{
//					break;
//				}
//					
//				case Enums.SubscriptionType.Yearly:
//				{
//					break;
//				}
//			}
//			
//			int billingdaystotal = (billingend - billingstart).Days;
//			int billingdaysleft = (billingend - DateTime.Now).Days;
//			
//			Console.WriteLine (billingdaystotal);
//			Console.WriteLine (billingdaysleft);
//			
//			foreach (SubscriptionItem item in this._items)
//			{
//				Hashtable invoiceline = new Hashtable ();
//				invoiceline.Add ("productid", item.ProductId);
//				invoiceline.Add ("text", item.Text);
//				invoiceline.Add ("price", Math.Round ((decimal)(((decimal)billingdaysleft/(decimal)billingdaystotal) * item.Price), 2));
//				
//				result.Add (invoiceline);
//			}
//			
//			foreach (Hashtable test in result)
//			{
//				Console.WriteLine (test["text"] +"  "+ test["price"]);
//			}
		}

		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);	
			result.Add ("type", this._type);
			result.Add ("customerid", this._customerid);
			result.Add ("title", this._title);		

//			DateTime dt = new DateTime (2008, 3, 9, 0, 0, 0, 0);

			result.Add ("nextbilling", String.Format("{0:yyyy/MM/dd}", SNDK.Date.TimestampToDateTime (this._nextbilling)));
			result.Add ("status", this._status);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}		

		public void Bill ()
		{
			//			if (this.NextBilling == DateTime.Today)
			//			{
			int test = 0;
			DateTime begin;
			DateTime end;
			DateTime next;
			
			int multiplier = 0;
			
			switch (this._type)
			{					
				case Enums.SubscriptionType.Monthly:
				{
					begin = this.NextBilling;
					end = SNDK.Date.GetEndOfMonth (begin.Year, begin.Month);
					next = SNDK.Date.GetStartOfMonth (begin.Year, begin.Month).AddMonths (1);
					test = SNDK.Date.GetDaysInMonth (begin.Year, begin.Month);
					multiplier = 1;
					break;
				}
					
				case Enums.SubscriptionType.Quarterly:
				{
					begin = this.NextBilling;												
					end = SNDK.Date.GetEndOfQuarter (begin.Year, SNDK.Date.GetQuarter (begin.Month));
					next = SNDK.Date.GetStartOfQuarter (begin.Year, SNDK.Date.GetQuarter (begin.Month)).AddMonths (3);
					
					test = SNDK.Date.GetDaysInQuarter (begin.Year, SNDK.Date.GetQuarter (begin.Month));
					multiplier = 3;
					break;
				}
					
				case Enums.SubscriptionType.HalfYearly:
				{
					begin = this.NextBilling;						
					
					if (begin.Month < 7)
					{							                                       
						end = new DateTime (begin.Year, 6, 30, 23, 59, 59);
						next = new DateTime (begin.Year, 7, 1);
						test = ((new DateTime (begin.Year, 6,30, 23, 59, 59) - new DateTime (begin.Year, 1, 1)).Days) + 1;
					}
					else
					{
						end = new DateTime (begin.Year, 12, 31, 23, 59, 59);
						next = new DateTime (begin.Year + 1, 1, 1);
						
						test = ((new DateTime (begin.Year, 12,31, 23, 59, 59) - new DateTime (begin.Year, 7, 1)).Days) + 1;
					}						
					multiplier = 6;	
					
					break;
				}
					
				case Enums.SubscriptionType.Yearly:
				{
					begin = this.NextBilling;
					end = new DateTime (begin.Year, 12, 31, 23, 59, 59);	
					next = new DateTime (begin.Year + 1, 1, 1);
					
					test = SNDK.Date.GetDaysInYear (begin.Year);
					multiplier = 12;
					break;
				}
			}

			decimal months = SNDK.Date.GetMonthsBetweenDates (begin, end);
//			Console.WriteLine (blabla (DateTime.Parse ("01-08-2012 00:00:00"), DateTime.Parse ("30-09-2012 00:00:00")));

//			decimal months = (decimal)Math.Round (end.Subtract(begin).Days / (365.25 / 12), 2, MidpointRounding.ToEven);


			Console.WriteLine  (months);


//			int months = ((end - begin).Days) + 1;

			int days = ((end - begin).Days) + 1;
			
			decimal test2 = 100;
			
			if (days < test)
			{				
				test2 = Math.Round (((decimal)days / (decimal)test)*100, 2, MidpointRounding.ToEven);				
			}
			
			
			
			Console.WriteLine ("Period: "+ begin +" > "+ end +" = "+ days +" days, out of "+ test +" - Billing percent: "+ test2 +"% - Next billing: "+ next);



			foreach (SubscriptionItem item in SubscriptionItem.List (this))
			{


				if (item.RecurrenceType == AllectusLib.Enums.ItemRecurrenceType.Once)
				{
					Console.WriteLine (item.Text +" "+  Math.Round  ((item.Price), 2, MidpointRounding.ToEven));
				}
				else
				{
					Console.WriteLine (item.Text +" "+  Math.Round  ((item.Price * months), 2, MidpointRounding.ToEven));
				}
			}
			
			//			int price = (895 * multiplier);
			//			
			//			decimal bla = Math.Round ( (price * test2) / 100, 2, MidpointRounding.ToEven);
			//			
			//			Console.WriteLine (bla);
			
			
			//			}		
		}


//		public void Bill ()
//		{
//			//			if (this.NextBilling == DateTime.Today)
//			//			{
//			int test = 0;
//			DateTime begin;
//			DateTime end;
//			DateTime next;
//			
//			int multiplier = 0;
//						
//			switch (this._type)
//			{					
//				case Enums.SubscriptionType.Monthly:
//				{
//					begin = this.NextBilling;
//					end = SNDK.Date.GetEndOfMonth (begin.Year, begin.Month);
//					next = SNDK.Date.GetStartOfMonth (begin.Year, begin.Month).AddMonths (1);
//					test = SNDK.Date.GetDaysInMonth (begin.Year, begin.Month);
//					multiplier = 1;
//					break;
//				}
//					
//				case Enums.SubscriptionType.Quarterly:
//				{
//					begin = this.NextBilling;												
//					end = SNDK.Date.GetEndOfQuarter (begin.Year, SNDK.Date.GetQuarter (begin.Month));
//					next = SNDK.Date.GetStartOfQuarter (begin.Year, SNDK.Date.GetQuarter (begin.Month)).AddMonths (3);
//					
//					test = SNDK.Date.GetDaysInQuarter (begin.Year, SNDK.Date.GetQuarter (begin.Month));
//					multiplier = 3;
//					break;
//				}
//					
//				case Enums.SubscriptionType.HalfYearly:
//				{
//					begin = this.NextBilling;						
//					
//					if (begin.Month < 7)
//					{							                                       
//						end = new DateTime (begin.Year, 6, 30, 23, 59, 59);
//						next = new DateTime (begin.Year, 7, 1);
//						test = ((new DateTime (begin.Year, 6,30, 23, 59, 59) - new DateTime (begin.Year, 1, 1)).Days) + 1;
//					}
//					else
//					{
//						end = new DateTime (begin.Year, 12, 31, 23, 59, 59);
//						next = new DateTime (begin.Year + 1, 1, 1);
//						
//						test = ((new DateTime (begin.Year, 12,31, 23, 59, 59) - new DateTime (begin.Year, 7, 1)).Days) + 1;
//					}						
//					multiplier = 6;	
//					
//					break;
//				}
//					
//				case Enums.SubscriptionType.Yearly:
//				{
//					begin = this.NextBilling;
//					end = new DateTime (begin.Year, 12, 31, 23, 59, 59);	
//					next = new DateTime (begin.Year + 1, 1, 1);
//					
//					test = SNDK.Date.GetDaysInYear (begin.Year);
//					multiplier = 12;
//					break;
//				}
//			}
//			
//			int days = ((end - begin).Days) + 1;
//			
//			decimal test2 = 100;
//			
//			if (days < test)
//			{				
//				test2 = Math.Round (((decimal)days / (decimal)test)*100, 2, MidpointRounding.ToEven);				
//			}
//			
//			
//			
//			Console.WriteLine ("Period: "+ begin +" > "+ end +" = "+ days +" days, out of "+ test +" - Billing percent: "+ test2 +"% - Next billing: "+ next);
//		
//			foreach (SubscriptionItem item in SubscriptionItem.List (this))
//			{
//				Console.WriteLine (item.Text +" "+  Math.Round ( ((item.Price * multiplier) * test2) / 100, 2, MidpointRounding.ToEven));
//			}
//
////			int price = (895 * multiplier);
////			
////			decimal bla = Math.Round ( (price * test2) / 100, 2, MidpointRounding.ToEven);
////			
////			Console.WriteLine (bla);
//			
//			
//			//			}		
//		}
		#endregion
		
		#region Public Static Methods		
		public static Subscription Load (Guid Id)
		{
			bool success = false;
			Subscription result = new Subscription ();
			
			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Select);
			qb.Table (DatabaseTableName);
			qb.Columns 
				(
					"id",
					"createtimestamp",
					"updatetimestamp",		
					"type",
					"customerid",
					"title",
					"nextbilling",
					"status"
					);
			
			qb.AddWhere ("id", "=", Id);
			
			Query query = Runtime.DBConnection.Query (qb.QueryString);
			
			if (query.Success)
			{
				if (query.NextRow ())
				{
					result._id = query.GetGuid (qb.ColumnPos ("id"));
					result._createtimestamp = query.GetInt (qb.ColumnPos ("createtimestamp"));
					result._updatetimestamp = query.GetInt (qb.ColumnPos ("updatetimestamp"));		
					result._type = SNDK.Convert.IntToEnum<Enums.SubscriptionType> (query.GetInt (qb.ColumnPos ("type")));
					result._customerid = query.GetGuid (qb.ColumnPos ("customerid"));
					result._title = query.GetString (qb.ColumnPos ("title"));
					result._nextbilling = query.GetInt (qb.ColumnPos ("nextbilling"));
					result._status = SNDK.Convert.StringToEnum<Enums.SubscriptionStatus> (query.GetString (qb.ColumnPos ("status")));
					success = true;
				}
			}
			
			query.Dispose ();
			query = null;
			qb = null;		
			
			if (!success)
			{
				throw new Exception (string.Format (Strings.Exception.SubscriptionLoadGuid, Id));
			}
			
			return result;
		}

		public static void Delete (Subscription Subscription)
		{
			Delete (Subscription.Id);
		}

		public static void Delete (Guid Id)
		{
			bool success = false;

			foreach (SubscriptionItem item in SubscriptionItem.List (Id))
			{
				try
				{
					SubscriptionItem.Delete (item);
				}
				catch 
				{
				}
			}
			
			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Delete);
			qb.Table (DatabaseTableName);
			
			qb.AddWhere ("id", "=", Id);
			
			Query query = Runtime.DBConnection.Query (qb.QueryString);
			
			if (query.AffectedRows > 0) 
			{							
				success = true;
			}
			
			query.Dispose ();
			query = null;
			qb = null;
			
			if (!success) 
			{
				throw new Exception (string.Format (Strings.Exception.SubscriptionDeleteGuid, Id));
			}
		}	
		
		public static List<Subscription> List ()
		{
			return List (Guid.Empty);
		}		
		
		public static List<Subscription> List (Customer customer)
		{
			return List (customer.Id);
		}

		public static List<Subscription> List (Guid CustomerId)
		{
			List<Subscription> result = new List<Subscription> ();
			
			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Select);
			qb.Table (DatabaseTableName);
			qb.Columns ("id");
			
			if (CustomerId != Guid.Empty)
			{
				qb.AddWhere ("customerid" ,"=", CustomerId);
			}

			Query query = Runtime.DBConnection.Query (qb.QueryString);
			if (query.Success)
			{
				while (query.NextRow ())
				{					
					try
					{
						result.Add (Load (query.GetGuid (qb.ColumnPos ("id"))));
					}
					catch
					{}
				}
			}
			
			query.Dispose ();
			query = null;
			qb = null;
			
			return result;
		}
		
		public static Subscription FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			Subscription result = new Subscription ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//allectuslib.subscription)[1]")));
			}
			catch
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (xmlDocument);
			}
			
			if (item.ContainsKey ("id"))
			{
				result._id = new Guid ((string)item["id"]);
			}
			else
			{
				throw new Exception (string.Format (Strings.Exception.SubscriptionFromXmlDocument, "ID"));
			}
			
			if (item.ContainsKey ("createtimestamp"))
			{
				result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
			}
			
			if (item.ContainsKey ("updatetimestamp"))
			{
				result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
			}
			
			if (item.ContainsKey ("title"))
			{
				result._title = (string)item["title"];
			}
						
			if (item.ContainsKey ("type"))
			{
				result._type = SNDK.Convert.StringToEnum<Enums.SubscriptionType> ((string)item["type"]);
			}
			
			if (item.ContainsKey ("customerid"))
			{
				result._customerid = new Guid ((string)item["customerid"]);
			}
			else
			{
				throw new Exception (string.Format (Strings.Exception.SubscriptionFromXmlDocument, "CUSTOMERID"));
			}
			
			if (item.ContainsKey ("nextbilling"))
			{			
				result._nextbilling = SNDK.Date.DateTimeToTimestamp (DateTime.ParseExact ((string)item["nextbilling"], "yyyy/MM/dd", null));
			}
			
			if (item.ContainsKey ("status"))
			{
				result._status = SNDK.Convert.StringToEnum<Enums.SubscriptionStatus> ((string)item["status"]);
			}

			return result;
		}		
		#endregion
	}
}

