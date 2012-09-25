//
// Customer.cs
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
using C5;

namespace AllectusLib
{
	public class Customer
	{
		#region Public Static Fields
		public static string DatabaseTableName = Runtime.DBPrefix + "customers";
		#endregion
		
		#region Private Fields
		private Guid _id;
		private int _createtimestamp;
		private int _updatetimestamp;
		private string _erpid;
		private C5.Debitor _c5debitor;
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
		
		public string ErpId 
		{
			get 
			{
				return this._erpid; 
			}
			
			set
			{
				this._erpid = value;	
			}
		}	

		public string Name
		{
			get
			{
				return this._c5debitor.Name;
			}

			set
			{
				this._c5debitor.Name = value;
			}
		}

		public string Address1
		{
			get
			{
				return this._c5debitor.Address1;
			}
			
			set
			{
				this._c5debitor.Address1 = value;
			}
		}

		public string Address2
		{
			get
			{
				return this._c5debitor.Address2;
			}
			
			set
			{
				this._c5debitor.Address2 = value;
			}
		}

		public string PostCode
		{
			get
			{
				return this._c5debitor.PostCode;
			}
			
			set
			{
				this._c5debitor.PostCode = value;
			}
		}

		public string City
		{
			get
			{
				return this._c5debitor.City;
			}
			
			set
			{
				this._c5debitor.City = value;
			}
		}

		public string Country
		{
			get
			{
				return this._c5debitor.Country;
			}
			
			set
			{
				this._c5debitor.Country = value;
			}
		}
		#endregion
		
		#region Constructor
		public Customer ()
		{
			this._id = Guid.NewGuid ();
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._erpid = string.Empty;

			this._c5debitor = new Debitor ();
		}
		#endregion
		
		#region Public Methods
		public void Save ()
		{
			bool success = false;

			this._c5debitor.Save ();
			this._erpid = this._c5debitor.Id;

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
					"erpid"
					);
			
			qb.Values 
				(	
				 this._id, 
				 this._createtimestamp, 
				 this._updatetimestamp, 					
				 this._erpid				
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
				throw new Exception (string.Format (Strings.Exception.CustomerSave, this._id));
			}		
		}
		
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);
			result.Add ("erpid", this._erpid);
			result.Add ("name", this._c5debitor.Name);
			result.Add ("address1", this._c5debitor.Address1);
			result.Add ("address2", this._c5debitor.Address2);
			result.Add ("postcode", this._c5debitor.PostCode);
			result.Add ("city", this._c5debitor.City);
			result.Add ("country", this._c5debitor.Country);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		public static Customer Load (Guid Id)
		{
			bool success = false;
			Customer result = new Customer ();
			
			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Select);
			qb.Table (DatabaseTableName);
			qb.Columns 
				(
					"id",
					"createtimestamp",
					"updatetimestamp",
					"erpid"				
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
					result._erpid = query.GetString (qb.ColumnPos ("erpid"));						
					
					success = true;
				}
			}
			
			query.Dispose ();
			query = null;
			qb = null;

			result._c5debitor = C5.Debitor.Load (result._erpid);
			
			if (!success)
			{
				throw new Exception (string.Format (Strings.Exception.CustomerLoadGuid, Id));
			}
			
			return result;
		}

		public static void Delete (Customer Customer)
		{
			Delete (Customer.Id);
		}

		public static void Delete (Guid Id)
		{
			bool success = false;

			Customer customer = Customer.Load (Id);
			C5.Debitor.Delete (customer.ErpId);

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
				throw new Exception (string.Format (Strings.Exception.CustomerDeleteGuid, Id));
			}
		}		
		
		public static List<Customer> List ()
		{
			List<Customer> result = new List<Customer> ();
			
			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Select);
			qb.Table (DatabaseTableName);
			qb.Columns ("id");
			
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
					{					
					}
				}
			}
			
			query.Dispose ();
			query = null;
			qb = null;
			
			return result;
		}		
		
		public static Customer FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (xmlDocument);
			
			Customer result;
			
			if (item.ContainsKey ("id"))
			{
				try
				{
					result = Customer.Load (new Guid ((string)item["id"]));
				}
				catch
				{
					result = new Customer ();
					result._id = new Guid ((string)item["id"]);
				}				
			}
			else
			{
				result = new Customer ();
			}
			
			if (item.ContainsKey ("erpid"))
			{
				result._erpid = (string)item["erpid"];
			}

			if (item.ContainsKey ("name"))
			{
				result._c5debitor.Name = (string)item["name"];
			}

			if (item.ContainsKey ("address1"))
			{
				result._c5debitor.Address1 = (string)item["address1"];
			}

			if (item.ContainsKey ("address2"))
			{
				result._c5debitor.Address2 = (string)item["address2"];
			}

			if (item.ContainsKey ("postcode"))
			{
				result._c5debitor.PostCode = (string)item["postcode"];
			}

			if (item.ContainsKey ("city"))
			{
				result._c5debitor.City = (string)item["city"];
			}


			if (item.ContainsKey ("country"))
			{
				result._c5debitor.Country = (string)item["country"];
			}

			
			return result;
		}
		#endregion
	}
}

