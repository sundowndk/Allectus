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
	public class SubscriptionItem
	{
		#region Public Static Fields
		public static string DatabaseTableName = Runtime.DBPrefix + "subscriptions_subscriptionitems";	
		#endregion
		
		#region Private Fields
		private Guid _id;
		private int _createtimestamp;
		private int _updatetimestamp;
		private Guid _subscriptionid;
		private string _erpid;
		private Enums.ItemRecurrenceType _recurrencetype;
		private int _recurrencecount;
		private string _text;
		private string _unit;
		private decimal _price;
		private string _notes;
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
		
		public Guid SubscriptionId
		{
			get
			{
				return this._subscriptionid;
			}
		}

		public string ErpId
		{
			get
			{
				return this._erpid;
			}
		}

		public Enums.ItemRecurrenceType RecurrenceType
		{
			get
			{
				return this._recurrencetype;
			}

			set
			{
				this._recurrencetype = value;
			}
		}

		public int RecurrenceCount
		{
			get
			{
				return this._recurrencecount;
			}

			set
			{
				this._recurrencecount = value;
			}
		}

		public string Unit
		{
			get
			{
				return this._unit;
			}

			set
			{
				this._unit = value;
			}
		}

		public string Text
		{
			get
			{
				return this._text;
			}
			
			set
			{
				this._text = value;
			}
		}
		
		public decimal Price
		{
			get
			{
				return this._price;
			}
			
			set
			{
				this._price = value;
			}
		}

		public string Notes
		{
			get
			{
				return this._notes;
			}

			set
			{
				this._notes = value;
			}
		}	
		#endregion		
		
		#region Constructor		
		public SubscriptionItem (Subscription Subscription)
		{
			this._id = Guid.NewGuid ();
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();			
			this._subscriptionid = Subscription.Id;
			this._erpid = string.Empty;
			this._recurrencetype = AllectusLib.Enums.ItemRecurrenceType.Monthly;
			this._recurrencecount = 0;
			this._text = string.Empty;
			this._unit = string.Empty;
			this._price = 0;
			this._notes = string.Empty;
		}
		
		private SubscriptionItem ()
		{			
			this._id = Guid.Empty;
			this._createtimestamp = 0;
			this._updatetimestamp = 0;
			this._subscriptionid = Guid.Empty;
			this._erpid = string.Empty;
			this._recurrencetype = AllectusLib.Enums.ItemRecurrenceType.Monthly;
			this._recurrencecount = 0;
			this._text = string.Empty;
			this._unit = string.Empty;
			this._price = 0;
			this._notes = string.Empty;
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
					"subscriptionid",
					"erpid",
					"recurrencetype",
					"recurrencecount",
					"text",
					"unit",
					"price",
					"notes"
				);

			qb.Values 
				(	
				 this._id, 
				 this._createtimestamp, 
				 this._updatetimestamp,	
				 this._subscriptionid,
				 this._erpid,
				 this._recurrencetype,
				 this._recurrencecount,
				 this._text,
				 this._unit,
				 this._price,
				 this._notes
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
				throw new Exception (string.Format (Strings.Exception.SubscriptionItemSave, this._id));
			}		
		}
		
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);	
			result.Add ("subscriptionid", this._subscriptionid);
			result.Add ("erpid", this._erpid);
			result.Add ("recurrencetype", this._recurrencetype);
			result.Add ("recurrencecount", this._recurrencecount);
			result.Add ("text", this._text);
			result.Add ("unit", this._unit);
			result.Add ("price", this._price);
			result.Add ("notes", this._notes);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}		
		#endregion

		#region Public Static Methods		
		public static SubscriptionItem Load (Guid Id)
		{
			bool success = false;
			SubscriptionItem result = new SubscriptionItem ();
			
			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Select);
			qb.Table (DatabaseTableName);
			qb.Columns 
				(
					"id",
					"createtimestamp",
					"updatetimestamp",		
					"subscriptionid",
					"erpid",
					"recurrencetype",
					"recurrencecount",
					"text",
					"unit",
					"price",
					"notes"
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
					result._subscriptionid = query.GetGuid (qb.ColumnPos ("subscriptionid"));
					result._erpid = query.GetString (qb.ColumnPos ("erpid"));
					result._recurrencetype = SNDK.Convert.IntToEnum<Enums.ItemRecurrenceType> (query.GetInt (qb.ColumnPos ("recurrencetype")));
					result._recurrencecount = query.GetInt (qb.ColumnPos ("recurrencecount"));
					result._text = query.GetString (qb.ColumnPos ("text"));
					result._unit = query.GetString (qb.ColumnPos ("unit"));
					result._price = query.GetDecimal (qb.ColumnPos ("price"));
					result._notes = query.GetString (qb.ColumnPos ("notes"));
					
					success = true;
				}
			}
			
			query.Dispose ();
			query = null;
			qb = null;
			
			if (!success)
			{
				throw new Exception (string.Format (Strings.Exception.SubscriptionItemLoad, Id));
			}
			
			return result;
		}

		public static void Delete (SubscriptionItem SubscriptionItem)
		{
			Delete (SubscriptionItem.Id);
		}
		
		public static void Delete (Guid Id)
		{
			bool success = false;
			
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
				throw new Exception (string.Format (Strings.Exception.SubscriptionItemDelete, Id));
			}
		}	
		
		public static List<SubscriptionItem> List ()
		{
			return List (Guid.Empty);
		}		
		
		public static List<SubscriptionItem> List (Subscription Subscription)
		{
			return List (Subscription.Id);
		}
		
		public static List<SubscriptionItem> List (Guid subscription)
		{
			List<SubscriptionItem> result = new List<SubscriptionItem> ();
			
			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Select);
			qb.Table (DatabaseTableName);
			qb.Columns ("id");
			
			if (subscription != Guid.Empty)
			{
				qb.AddWhere ("subscriptionid" ,"=", subscription);
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
		
		public static SubscriptionItem FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			SubscriptionItem result = new SubscriptionItem ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//allectuslib.subscriptionitem)[1]")));
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
				throw new Exception (string.Format (Strings.Exception.SubscriptionItemFromXmlDocument, "ID"));
			}
			
			if (item.ContainsKey ("createtimestamp"))
			{
				result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
			}
			
			if (item.ContainsKey ("updatetimestamp"))
			{
				result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
			}		

			if (item.ContainsKey ("subscriptionid"))
			{
				result._subscriptionid = new Guid ((string)item["subscriptionid"]);
			}
			else
			{
				throw new Exception (string.Format (Strings.Exception.SubscriptionItemFromXmlDocument, "SUBSCRIPTIONID"));
			}

			if (item.ContainsKey ("erpid"))
			{
				result._erpid = (string)item["erpid"];
			}

			if (item.ContainsKey ("recurrencetype"))
			{
				result._recurrencetype = SNDK.Convert.StringToEnum<Enums.ItemRecurrenceType> ((string)item["recurrencetype"]);
			}

			if (item.ContainsKey ("recurrencecount"))
			{
				result._recurrencecount = int.Parse ((string)item["recurrencecount"]);
			}
						
			if (item.ContainsKey ("text"))
			{
				result._text = (string)item["text"];
			}

			if (item.ContainsKey ("unit"))
			{
				result._unit = (string)item["unit"];
			}

			if (item.ContainsKey ("price"))
			{
				result._price = decimal.Parse ((string)item["price"]);
			}

			if (item.ContainsKey ("notes"))
			{
				result._notes = (string)item["notes"];
			}

			return result;
		}		
		#endregion
	}
}

