using System;
using System.Xml;			

using System.Collections;
using System.Collections.Generic;

using SNDK.DBI;

namespace AllectusLib.Management
{
	public class Location
	{
		#region Public Static Fields
		public static string DatabaseTableName = Runtime.DBPrefix + "management_locations";
		#endregion
		
		#region Private Fields
		private Guid _id;
		private int _createtimestamp;
		private int _updatetimestamp;
		private Guid _parentid;
		private string _title;		
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
		#endregion
		
		#region Constructor
		public Location ()
		{
			this._id = Guid.NewGuid ();
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._parentid = Guid.Empty;
			this._title = string.Empty;
		}
		#endregion
		
		#region Public Methods
		public void Save ()
		{
			bool success = false;
			QueryBuilder qb = null;
			
			if (!Helpers.GuidExists (Runtime.DBConnection, DatabaseTableName, this._id)) 
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
					"parentid",
					"title"
					);
			
			qb.Values 
				(	
				 this._id, 
				 this._createtimestamp, 
				 this._updatetimestamp,
				 this._parentid,
				 this._title
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
				throw new Exception (string.Format (Strings.Exception.ManagementLocationSave, this._id));
			}
		}

		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);
			result.Add ("parentid", this._parentid);
			result.Add ("title", this._title);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion		
		
		#region Public Static Methods
		public static Location Load (Guid Id)
		{
			bool success = false;
			Location result = new Location ();
			
			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Select);
			qb.Table (DatabaseTableName);
			qb.Columns 
				(
					"id",
					"createtimestamp",
					"updatetimestamp",
					"parentid",
					"title"
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
					result._parentid = query.GetGuid (qb.ColumnPos ("parentid"));
					result._title = query.GetString (qb.ColumnPos ("title"));		
					
					success = true;
				}
			}
			
			query.Dispose ();
			query = null;
			qb = null;
			
			if (!success)
			{
				throw new Exception (string.Format (Strings.Exception.ManagementLocationLoadGuid, Id));
			}
			
			return result;			
		}
		
		public static void Delete (Guid id)
		{
			bool success = false;
			
			foreach (Location location in Location.List ())
			{
				if (location._parentid == id)
				{
					Location.Delete (location._id);
				}
			}
			
			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Delete);
			qb.Table (DatabaseTableName);
			
			qb.AddWhere ("id", "=", id);
			
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
				throw new Exception (string.Format (Strings.Exception.ManagementLocationDeleteGuid, id));
			}
		}	
		
		public static List<Location> List ()
		{
			List<Location> result = new List<Location> ();
			
			QueryBuilder qb = new QueryBuilder (QueryBuilderType.Select);
			qb.Table (DatabaseTableName);
			qb.Columns ("id");
			qb.OrderBy ("createtimestamp", QueryBuilderOrder.Accending);
			
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
		
		public static Location FromXmlDocument (XmlDocument xmlDocument)
		{	
			Hashtable item;
			Location result = new Location ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//allectuslib.management.location)[1]")));
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
				throw new Exception (string.Format (Strings.Exception.ManagementLocationFromXmlDocument, "ID"));
			}
			
			if (item.ContainsKey ("createtimestamp"))
			{
				result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
			}
			
			if (item.ContainsKey ("updatetimestamp"))
			{
				result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
			}
			
			if (item.ContainsKey ("parentid"))
			{
				result._parentid = new Guid ((string)item["parentid"]);
			}		

			if (item.ContainsKey ("title"))
			{
				result._title = (string)item["title"];
			}		
			
			return result;
		}		
		#endregion		
	}
}
