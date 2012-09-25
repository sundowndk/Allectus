//
// Exception.cs
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

namespace AllectusLib.Strings
{
	public class Exception
	{
		#region CUSTOMER
		public static string CustomerSave = "00110|Could not save Customer with id: {0}";
		public static string CustomerLoadGuid = "00120|Could not load Customer with id: {0}";
		public static string CustomerDeleteGuid = "00130|Could not delete Customer with id: {0}";
		public static string CustomerFromXmlDocument = "00140|Can not create Customer from XmlDocument, missing {0}";
		#endregion
		
		#region SUBSCRIPTION
		public static string SubscriptionSave = "00210|Could not save Subscription with id: {0}";
		public static string SubscriptionLoadGuid = "00220|Could not load Subscription with id: {0}";
		public static string SubscriptionDeleteGuid = "00230|Could not delete Subscription with id: {0}";
		public static string SubscriptionFromXmlDocument = "00240|Can not create Subscription from XmlDocument, missing {0}";
		#endregion
		
		#region SUBSCRIPTIONITEM
		public static string SubscriptionItemLoad = "00310|SubscriptionItem with id: {0} was not found.";
		public static string SubscriptionItemSave = "00320|Could not save SubscriptionItem with id: {0}";
		public static string SubscriptionItemDelete = "00330|Could not delete SubscriptionItem with id: {0}";
		public static string SubscriptionItemFromXmlDocument = "00240|Can not create SubscriptionItem from XmlDocument, missing {0}";
		#endregion
		
		#region PRODUCT
		public static string ProductLoad = "SUBSCRIPTIONITEM with id: {0} was not found.";
		public static string ProductSave = "Could not save SUBSCRIPTIONITEM with id: {0}";
		public static string ProductDelete = "Could not delete SUBSCRIPTIONITEM with id: {0}";
#endregion
		
		#region SIPACCOUNT
		public static string SIPAccountLoad = "SIPACCOUNT with id: {0} was not found.";
		public static string SIPAccountSave = "Could not save SIPACCOUNT with id: {0}";
		public static string SIPAccountDelete = "Could not delete SIPACCOUNT with id: {0}";
		#endregion		
		
		#region RANGE
		public static string RangeLoad = "RANGE with id: {0} was not found.";
		public static string RangeSave = "Could not save RANGE with id: {0}";
		public static string RangeDelete = "Could not delete RANGE with id: {0}";		
#endregion
		
		#region RANGEGROUP
		public static string RangeGroupLoad = "RANGEGROUP with id: {0} was not found.";
		public static string RangeGroupSave = "Could not save RANGEGROUP with id: {0}";
		public static string RangeGroupDelete = "Could not delete RANGEGROUP with id: {0}";		
		#endregion		
		
		#region COUNTRYCODE
		public static string CountryCodeLoad = "COUNTRYCODE with id: {0} was not found.";
		public static string CountryCodeSave = "Could not save COUNTRYCODE with id: {0}";
		public static string CountryCodeDelete = "Could not delete COUNTRYCODE with id: {0}";		
		#endregion			
		
		#region RANGEPRICE
		public static string RangePriceLoad = "RANGEPRICE with id: {0} was not found.";
		public static string RangePriceSave = "Could not save RANGEPRICE with id: {0}";
		public static string RangePriceDelete = "Could not delete RANGEPRICE with id: {0}";		
		#endregion			
		
		#region RANGEPRICEGROUP
		public static string RangePriceGroupLoad = "RANGEPRICEGROUP with id: {0} was not found.";
		public static string RangePriceGroupSave = "Could not save RANGEPRICEGROUP with id: {0}";
		public static string RangePriceGroupDelete = "Could not delete RANGEPRICEGROUP with id: {0}";		
		#endregion			
		
		#region USAGE
		public static string UsageLoad = "USAGE with id: {0} was not found.";
		public static string UsageSave = "Could not save USAGE with id: {0}";
		public static string UsageDelete = "Could not delete USAGE with id: {0}";		
		#endregion			
		
		#region ASSET
		public static string AssetLoad = "ASSET with id: {0} was not found.";
		public static string AssetSave = "Could not save ASSET with id: {0}";
		public static string AssetDelete = "Could not delete ASSET with id: {0}";
		#endregion	
		
	}
}
