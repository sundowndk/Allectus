//
// Init.cs
//  

using System;
using System.Collections.Generic;

using SorentoLib;

namespace Allectus.Addin
{
	public class Init : SorentoLib.Addins.IInit
	{
		public Init ()
		{
			Runtime.Initialize ();
		}
	}
}
