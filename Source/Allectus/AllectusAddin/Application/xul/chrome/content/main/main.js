Components.utils.import("resource://allectus/js/app.js");

 
var sXUL = 
{
	helpers :
	{
		tree : function (attributes)
		{
			_attributes = attributes;				
			_elements = Array ();
			_rows = Array ();
			
			_temp = {};			
			
			this.addRow = addRow;
			this.removeRow = removeRow;
			
			this.setRow = setRow;
			this.getRow = getRow;
									
			this.sort = sort;									
			
			this.clear = clear;
			
			this.getCurrentIndex = getCurrentIndex;
			
			init (attributes);
		
			function init (attributes)
			{
				if (!attributes)
					attributes = new Array ();
					
				if (!attributes.element)
					throw "Need an treeview element to attatch to.";
			
				_elements.tree = attributes.element;				
				_elements.treeChildren = document.createElement ("treechildren");
				_elements.tree.appendChild (_elements.treeChildren);
												
				// Check if Id TreeColumn exists
				var treeColumns = _elements.tree.columns;
				if (!treeColumns.getNamedColumn ("id"))
				{
					throw "No Id column found.";
				}				
				
				if (attributes.sort)
				{
					_temp.sortColumn = attributes.sort;
					_temp.sortDirection = attributes.sortDirection;
					
					// Set sortdirection on newly sorted column.	
					document.getElementById (_temp.sortColumn).setAttribute ("sortDirection", _temp.sortDirection);									
				}
														
				//_temp.filterColumn = attributes.filter.split (",");
				if (attributes.filter)
				{
					_temp.filterColumn = attributes.filter;
					_temp.filterValue = attributes.filterValue;
					_temp.filterDirection = attributes.filterDirection;
				}
																																															
				//_temp.sortedColumn = "title";
				//_temp.sortedDirection = "ascending";
														
				//document.getElementById (_temp.sortedColumn).setAttribute("sortDirection", "ascending");								
				
			};
			
			function getCurrentIndex ()
			{
				return _elements.tree.view.selection.currentIndex; //returns -1 if the tree is not focused
			}
			
			function refresh ()
			{									
				// Clear all rows.
				clear ();
				
				var compareFunc;
  				if (_temp.sortDirection == "ascending") 
  				{
    				compareFunc = 	function (second, first) 
    								{    									    							
      									if (first.data[_temp.sortColumn].toLowerCase () < second.data[_temp.sortColumn].toLowerCase ())
    									{
    										return -1;	
    									}
    									
    									if (first.data[_temp.sortColumn].toLowerCase () > second.data[_temp.sortColumn].toLowerCase ())
    									{
    										return 1;	
    									}
    								}
  				} 
  				else 
  				{  				
    				compareFunc = 	function (first, second) 
    								{       									
    									if (first.data[_temp.sortColumn].toLowerCase () < second.data[_temp.sortColumn].toLowerCase ())
    									{
    										return -1;	
    									}
    									
    									if (first.data[_temp.sortColumn].toLowerCase () > second.data[_temp.sortColumn].toLowerCase ())
    									{
    										return 1;	
    									}
    									return 0;      								
    								}
  				}
				
				// Sort rows.
				_rows.sort (compareFunc);
				
			
				for (var idx = 0; idx < 11; idx++) 
				{
					for (index in _rows)
					{	
						if (_temp.filterColumn != null)
						{
						
							if (_temp.filterDirection == "in")
							{							
								if (_rows[index].data[_temp.filterColumn].indexOf(_temp.filterValue) == -1)
								{
									//dump (_temp.filterColumn +" "+ _temp.filterValue +"\n")
									continue;
								}
							}
							else if (_temp.filterDirection == "out")
							{							
								if (_rows[index].data[_temp.filterColumn].indexOf(_temp.filterValue) != -1)
								{
									//dump (_temp.filterColumn +" "+ _temp.filterValue +"\n")
									continue;
								}
							}
						}
													
						if (_rows[index].level == idx)
						{
							try
							{
								drawRow (_rows[index]);
							}
							catch (Exception)
							{							
							}							
						}
					}
				}				
			}
			
			function sort (attributes)
			{
				if (!attributes)
					attributes = new Array ();
					
				if (!attributes.direction)
					attributes.direction = null;
										
				// Remove sortdirection on currently sorted column.
				if (_temp.sortColumn != null)
				{
					document.getElementById (_temp.sortColumn).removeAttribute ("sortDirection");
				}
																				 
				// Figure out sortdirection.
				// If its the same column we are sorting, just reverse sort direction.
				// If its not the same, we start with ascending.  							
				if (attributes.direction == null)
				{
					if (_temp.sortColumn == attributes.column)
					{
	  					if (_temp.sortDirection == "ascending")
  						{
  							attributes.direction = "descending";
  						}
	  					else
  						{
	  						attributes.direction = "ascending";
  						}
  					}
  					else
  					{
  						attributes.direction = "ascending";
  					}
  				}  				
  				
  				_temp.sortColumn = attributes.column;
  				_temp.sortDirection = attributes.direction; 
  				  				  																		
				// Refresh rows.
				refresh ();
															
				// Set sortdirection on newly sorted column.	
				document.getElementById (attributes.column).setAttribute ("sortDirection", _temp.sortDirection);				 												
			}
			
			
			
			function CompareLowerCase(first, second) {
  var firstLower, secondLower;

  // Are we sorting nsILoginInfo entries or just strings?
  if (first.hostname) {
    firstLower  = first.hostname.toLowerCase();
    secondLower = second.hostname.toLowerCase();
  } else {
    firstLower  = first.toLowerCase();
    secondLower = second.toLowerCase();
  }

  if (firstLower < secondLower) {
    return -1;
  }

  if (firstLower > secondLower) {
    return 1;
  }

  return 0;
}
			function getLevel (element)
			{				
				var parser =	function (element, count)
								{
									//dump (element.parentNode.nodeName +" : "+ count +"\n");
									if (element.parentNode.nodeName != "tree")
									{
										if (element.parentNode.nodeName != "treechildren")
										{
											count++;
										}
										
										return parser (element.parentNode, count++)
									}
									return count;				
								};
			
				return parser (element, 0);				
			}
			
			function getLevel2 (id)
			{
				var parser =	function (id, count)
								{
									count++;
									for (index in _rows)
									{
										//dump (id +" "+ _rows[index].data.id +" "+ _rows[index].data.parentid +"\n")
										
										if ((_rows[index].data.id == id) && (_rows[index].data.parentid != SNDK.tools.emptyGuid))
										{																					
											return parser (_rows[index].data.parentid, count)
										}
									}
									return count;
								};
								
				return parser (id, 0)
			}
			
			function addRow (attributes)
			{
				// Set attributes.
				if (!attributes)
					attributes = new Array ();
					
				if (!attributes.id)
					attributes.id = SNDK.tools.newGuid ();
					
				if (!attributes.data)
					attributes.data = new Array ();
					
				if (!attributes.data.id)
					throw "Data does not container Id key.";
										
				if (!attributes.isOpen)
					attributes.isOpen = false;
					
				if (attributes.isChildOfId)
				{
					attributes.level = getLevel2 (attributes.isChildOfId);
					
					dump (attributes.level +"\n");
				}
				else
				{
					attributes.level = 0;
				}
				
				var checkforrow =	function (id)
									{
									    for (var idx = 0; idx < _rows.length; idx++) 
									    {
        									if (_rows[idx].id == id) 
        									{
            									return true;
        									}
    									}    									
    									return false;
									};
				
				if (!checkforrow (attributes.id))
				{
			 		_rows[_rows.length] = attributes;
			 	}
			 				 	
			 	refresh ();
			}
												
			function drawRow (attributes)
			{							
				// Create new TreeItem.
				var treeItem = document.createElement ('treeitem');				
				treeItem.setAttribute ("id", attributes.data.id +"-treeitem");
											
				// If isChildOfId is set, append TreeItem to correct TreeChildren.
				if (attributes.isChildOfId)
				{														
					if (!_elements[attributes.isChildOfId] +"-treeChildren")
					{						
						var treeChildren = document.createElement ("treechildren");
						treeChildren.setAttribute ("id", attributes.isChildOfId +"-treechildren");	
						
						document.getElementById (attributes.isChildOfId +"-treeitem").appendChild (treeChildren);
						document.getElementById (attributes.isChildOfId +"-treeitem").setAttribute ("container", true);						
					}
					
					document.getElementById (attributes.isChildOfId +"-treechildren").appendChild (treeItem);
				}
				else
				{
					_elements.treeChildren.appendChild (treeItem)
				}		
				
				// Get treelevel.
				attributes.level = getLevel (treeItem);
												
				// Create TreeRow.
				var treeRow = document.createElement ('treerow');
				treeItem.appendChild (treeRow);
																		
				// Find TreeColumns and fill them with data.
				var treeColumns = _elements.tree.columns;											
				for (var idx = 0; idx < treeColumns.length; idx++)
				{
					var treeColumn = treeColumns.getColumnAt (idx);					
					
					if (attributes.data[treeColumn.id] != null)
					{
						var treeCell = document.createElement ('treecell');
						treeCell.setAttribute ('label', attributes.data[treeColumn.id]);
						treeRow.appendChild (treeCell);
					}
				}
				
				var checkforrow =	function (id)
									{
									    for (var idx = 0; idx < _rows.length; idx++) 
									    {
        									if (_rows[idx].id == id) 
        									{
            									return true;
        									}
    									}    									
    									return false;
									};
			
				//if (_rows[attributes.id] == null)
//				if (!checkforrow (attributes.id))
//				{
//			 		_rows[_rows.length] = attributes;
//			 	}
												
				return attributes.id;
			}	
			
			function removeRow (attributes)
			{
				var row = -1;
			
				if (!attributes)
					attributes = new Array ();
									
				if (!attributes.data)
					attributes.data = new Array ();
												
				if (!attributes.data.id)
				{
					row = _elements.tree.currentIndex;
				}
				else
				{						
					for (var idx = 0; idx < _elements.tree.view.rowCount; idx++) 
					{
						if (_elements.tree.view.getCellText (idx, _elements.tree.columns.getNamedColumn ('id')) == attributes.id)
						{					
							row = idx;				
							break;
						}
					}
  				}
  				
  				if (row != -1)
  				{
  					_elements.tree.view.getItemAtIndex (row).parentNode.removeChild (_elements.tree.view.getItemAtIndex (row));
  				}
			}
			
			function setRow (attributes)
			{
				var row = -1;
			
				if (!attributes)
					attributes = new Array ();
						
				if (!attributes.data)
					attributes.data = new Array ();
										
				if (!attributes.data.id)
				{
				
				}
				else
				{
					for (idx in _rows)
					{
						if (_rows[idx].data.id == attributes.data.id)
						{
							// Find TreeColumns and change data.
							var treeColumns = _elements.tree.columns;											
							for (var idx2 = 0; idx2 < treeColumns.length; idx2++)
							{
								var treeColumn = treeColumns.getColumnAt (idx2);
								if (attributes.data[treeColumn.id] != null)
								{
									_rows[idx].data[treeColumn.id] = attributes.data[treeColumn.id];									
								}
							}		
							break;										
						}
					}
				}
				
				refresh ();
				
//				if (!attributes.data.id)
//				{
//					row = _elements.tree.currentIndex;
//				}
//				else
//				{
//					for (var idx = 0; idx < _elements.tree.view.rowCount; idx++) 
//					{	
//						if (_elements.tree.view.getCellText (idx, _elements.tree.columns.getNamedColumn ('id')) == attributes.data.id)
//						{					
//							row = idx;
//							break;
//						}
//					}
//				}
					
//				if (row != -1)
//				{
//					// Find TreeColumns and change data.
//					var treeColumns = _elements.tree.columns;											
//					for (var idx = 0; idx < treeColumns.length; idx++)
//					{
//						var treeColumn = treeColumns.getColumnAt (idx);											
//						if (attributes.data[treeColumn.id] != null)
//						{
//							_elements.tree.view.setCellText (row, treeColumn, attributes.data[treeColumn.id]);
//						}
//					}												
//				}
			}
			
			function getRow (attributes)
			{
				var result = new Array ();
				var row = -1;
				
				if (!attributes)
					attributes = new Array ();
					
				if (!attributes.id)
				{
					row = _elements.tree.currentIndex;
				}
				else
				{
					for (var idx = 0; idx < _elements.tree.view.rowCount; idx++) 
					{
						if (_elements.tree.view.getCellText (idx, _elements.tree.columns.getNamedColumn ('id')) == attributes.id)
						{					
							row = idx;
							break;
						}
					}	
				}
									
				if (row != -1)
				{	
					// Find TreeColumns and fill result with data.
					var treeColumns = _elements.tree.columns;											
					for (idx = 0; idx < treeColumns.length; idx++)
					{
						var treeColumn = treeColumns.getColumnAt (idx);																	
						result[treeColumn.id] = _elements.tree.view.getCellText (row, treeColumn);													
					}				
				}
				
				return result;
			}
			
			function clear ()
			{				
				while (_elements.treeChildren.firstChild) 
				{
 					_elements.treeChildren.removeChild (_elements.treeChildren.firstChild);
				}
			}
		}	
	}
}

var lastSignonSortColumn = "name";
var lastSignonSortAscending = true;
var signonsTree = document.getElementById ("customers");

function getColumnByName(column) {
  switch (column) {
    case "name":
      return document.getElementById("name");    
  }
}

function GetTreeSelections(tree) {
  var selections = [];
  var select = tree.view.selection;
  if (select) {
    var count = select.getRangeCount();
    var min = new Object();
    var max = new Object();
    for (var i=0; i<count; i++) {
      select.getRangeAt(i, min, max);
      for (var k=min.value; k<=max.value; k++) {
        if (k != -1) {
          selections[selections.length] = k;
        }
      }
    }
  }
  return selections;
}

//function SortTree(tree, view, table, column, lastSortColumn, lastSortAscending, updateSelection) {
function SortTree(tree, column, sortdirection) {

  // remember which item was selected so we can restore it after the sort
//  var selections = GetTreeSelections(tree);
//  var selectedNumber = selections.length ? table[selections[0]].number : -1;

  // determine if sort is to be ascending or descending
//  var ascending = (column == lastSortColumn) ? !lastSortAscending : true;
	var ascending = true;

  // do the sort
  var compareFunc;
  if (ascending) {
    compareFunc = function compare(first, second) {
      return CompareLowerCase(first[column], second[column]);
    }
  } else {
    compareFunc = function compare(first, second) {
      return CompareLowerCase(second[column], first[column]);
    }
  }
//  table.sort (compareFunc);

  // restore the selection
//  var selectedRow = -1;
//  if (selectedNumber>=0 && updateSelection) {
//    for (var s=0; s<table.length; s++) {
//      if (table[s].number == selectedNumber) {
//        // update selection
//        // note: we need to deselect before reselecting in order to trigger ...Selected()
//        tree.view.selection.select(-1);
//        tree.view.selection.select(s);
 //       selectedRow = s;
//        break;
//      }
//    }
//  }

  // display the results
  //tree.treeBoxObject.invalidate();
//  if (selectedRow >= 0) {
//    tree.treeBoxObject.ensureRowIsVisible(selectedRow)
//  }

  return ascending;
}

/**
 * Case insensitive string comparator.
 */
function CompareLowerCase(first, second) {
  var firstLower, secondLower;

  // Are we sorting nsILoginInfo entries or just strings?
  if (first.hostname) {
    firstLower  = first.hostname.toLowerCase();
    secondLower = second.hostname.toLowerCase();
  } else {
    firstLower  = first.toLowerCase();
    secondLower = second.toLowerCase();
  }

  if (firstLower < secondLower) {
    return -1;
  }

  if (firstLower > secondLower) {
    return 1;
  }

  return 0;
}

function SignonColumnSort(column) {
  // clear out the sortDirection attribute on the old column
  var lastSortedCol = getColumnByName(lastSignonSortColumn);
  lastSortedCol.removeAttribute("sortDirection");




SortTree (document.getElementById ("customers"), column, "ascending");

  // sort
//  lastSignonSortAscending =
//    SortTree(signonsTree, signonsTreeView,
//                 signonsTreeView._filterSet.length ? signonsTreeView._filterSet : signons,
 //                column, lastSignonSortColumn, lastSignonSortAscending);
 // lastSignonSortColumn = column;

  // set the sortDirection attribute to get the styling going
  // first we need to get the right element
  
  var sortedCol = getColumnByName(column);
  sortedCol.setAttribute("sortDirection", "ascending");
}

sorttest = function (column)
{


}

var main = 
{
	init : function ()
	{		
		app.startup (window);
		
		main.customers.init ();
		main.locations.init ();
		
		
						
		app.events.onCustomerCreate.addHandler (main.eventHandlers.onCustomerCreate);
		app.events.onCustomerSave.addHandler (main.eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.addHandler (main.eventHandlers.onCustomerDestroy);
	},
	
	eventHandlers :
	{
		onCustomerCreate : function (customer)
		{
			main.controls.customers.addRow (customer);	
		},
		
		onCustomerSave : function (customer)
		{
			main.controls.customers.setRow (customer);
		},
		
		onCustomerDestroy : function (id)
		{		
			main.controls.customers.removeRow (id);
		}
	},
	
	controls : 
	{
		customers :
		{
			addRow : function (customer)
			{			
				var children = document.getElementById ('customersTreeChildren');		
	
				var item = document.createElement('treeitem');	
				children.appendChild (item)

				var row = document.createElement('treerow');
				item.appendChild (row);

				var columns = [customer["id"], customer["name"], customer["address1"], customer["postcode"], customer["city"], customer["email"]]
												
				for (index in columns)
				{				
					var cell = document.createElement('treecell');							
					cell.setAttribute ('label', columns[index]);
					row.appendChild(cell);																		
				}
			},
			
			removeRow : function (id)
			{
				var tree = document.getElementById ('customers');
				var index = -1;
				
				if (!id)
				{
					index = tree.currentIndex;									
  				}
  				else
  				{  									
					for (var i = 0; i < tree.view.rowCount; i++) 
					{
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == id)
						{					
							index = i;				
							break;
						}
					}
  				}
  				
  				if (index != -1)
  				{
  					tree.view.getItemAtIndex (index).parentNode.removeChild (tree.view.getItemAtIndex (index));
  				}
			},
			
			setRow : function (customer)
			{
				var tree = document.getElementById ('customers');
				var index = -1;
				
				if (!customer)
				{
					index = tree.currentIndex;
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{	
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == customer.id)
						{					
							index = i;							
							break;
						}
					}
				}

				if (index != -1)
				{
					tree.view.setCellText (index, tree.columns.getNamedColumn ('id'), customer.id);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('name'), customer.name);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('address1'), customer.address1);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('postcode'), customer.postcode);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('city'), customer.city);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('email'), customer.email);	
				}
			},
			
			getRow : function (id)
			{
				var result = new Array ();
				
				var tree = document.getElementById ('customers');
				var index = -1;				
				
				if (!id)
				{
					index = tree.currentIndex;				
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == id)
						{					
							index = i;
							break;
						}
					}	
				}
				
				if (index != -1)
				{									
					result.id = tree.view.getCellText (index, tree.columns.getNamedColumn ('id'));
					result.name = tree.view.getCellText (index, tree.columns.getNamedColumn ('name'));
					result.address1 = tree.view.getCellText (index, tree.columns.getNamedColumn ('address1'));				
					result.postcode = tree.view.getCellText (index, tree.columns.getNamedColumn ('postcode'));
					result.city = tree.view.getCellText (index, tree.columns.getNamedColumn ('city'));
					result.email = tree.view.getCellText (index, tree.columns.getNamedColumn ('email'));
				}
				
				return result;
			},
			
			refresh : function ()
			{					
				var onDone = 	function (customers)
								{
									for (index in customers)
									{									
										main.controls.customers.addRow (customers[index]);
									}
								
								// Enable controls
								document.getElementById ("customers").disabled = false;								
								document.getElementById ("customerCreate").disabled = false;								
								
								main.controls.customers.onChange ();
							};

				// Disable controls
				document.getElementById ("customers").disabled = true;
				document.getElementById ("customerCreate").disabled = true;
				document.getElementById ("customerEdit").disabled = true;
				document.getElementById ("customerDestroy").disabled = true;
			
				allectusLib.customer.list ({async: true, onDone: onDone});					
			},
				
			clear : function ()
			{
				var treechildren = document.getElementById ('customersTreeChildren');
								
				while (treechildren.firstChild) 
				{
 						treechildren.removeChild (treechildren.firstChild);
				}
			},						

			onChange : function ()
			{
				var view = document.getElementById ("customers").view;
				var selection = view.selection.currentIndex; //returns -1 if the tree is not focused
				
				if (selection != -1)
				{
					document.getElementById ("customerEdit").disabled = false;
					document.getElementById ("customerDestroy").disabled = false;
				}
				else
				{
					document.getElementById ("customerEdit").disabled = true;
					document.getElementById ("customerDestroy").disabled = true;
				}
			}
		},
		
		locations :
		{
			addRow : function (data)
			{			
				var children = document.getElementById ('locationsTreeChildren');		
	
				var item = document.createElement('treeitem');	
				children.appendChild (item)

				var row = document.createElement('treerow');
				item.appendChild (row);

				var columns = [data["id"], data["title"]];
									
				for (index in columns)
				{
					var cell = document.createElement('treecell');
					cell.setAttribute ('label', columns[index]);
					row.appendChild(cell);																		
				}
			},
			
			removeRow : function (id)
			{
				var tree = document.getElementById ('locations');
				var index = -1;
				
				if (!id)
				{
					index = tree.currentIndex;									
  				}
  				else
  				{  									
					for (var i = 0; i < tree.view.rowCount; i++) 
					{
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == id)
						{					
							index = i;				
							break;
						}
					}
  				}
  				
  				if (index != -1)
  				{
  					tree.view.getItemAtIndex (index).parentNode.removeChild (tree.view.getItemAtIndex (index));
  				}
			},
			
			setRow : function (item)
			{
				var tree = document.getElementById ('locations');
				var index = -1;
				
				if (!item)
				{
					index = tree.currentIndex;
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{	
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == item.id)
						{					
							index = i;							
							break;
						}
					}
				}
				
				if (index != -1)
				{									
					tree.view.setCellText (index, tree.columns.getNamedColumn ('id'), item.id);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('title'), item.title);					
				}
			},
			
			getRow : function (id)
			{
				var result = new Array ();
				
				var tree = document.getElementById ('locations');
				var index = -1;				
				
				if (!id)
				{
					index = tree.currentIndex;				
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == id)
						{					
							index = i;
							break;
						}
					}	
				}
				
				if (index != -1)
				{									
					result.id = tree.view.getCellText (index, tree.columns.getNamedColumn ('id'));
					result.title = tree.view.getCellText (index, tree.columns.getNamedColumn ('title'));					
				}
				
				return result;
			},
			
			refresh : function ()
			{									
				var onDone = 	function (items)
								{
									for (index in items)
									{									
										main.controls.locations.addRow (items[index]);
									}
								
								// Enable controls
								document.getElementById ("locations").disabled = false;								
								document.getElementById ("locationCreate").disabled = false;								
								
								main.controls.locations.onChange ();
							};

				// Disable controls
				document.getElementById ("locations").disabled = true;
				document.getElementById ("locationCreate").disabled = true;
				document.getElementById ("locationEdit").disabled = true;
				document.getElementById ("locationDestroy").disabled = true;
			
				allectusLib.management.location.list ({async: true, onDone: onDone});					
			},
				
			clear : function ()
			{
				var treechildren = document.getElementById ('locatonsTreeChildren');
								
				while (treechildren.firstChild) 
				{
 						treechildren.removeChild (treechildren.firstChild);
				}
			},						

			onChange : function ()
			{
				var view = document.getElementById ("locations").view;
				var selection = view.selection.currentIndex; //returns -1 if the tree is not focused
				
				if (selection != -1)
				{
					document.getElementById ("locationEdit").disabled = false;
					document.getElementById ("locationDestroy").disabled = false;
				}
				else
				{
					document.getElementById ("locationEdit").disabled = true;
					document.getElementById ("locationDestroy").disabled = true;
				}
			}
		}		
	},
	
	customers :
	{
		init : function ()
		{
			main.controls.customers.refresh ();		
		},
								
		create : function ()
		{		
			try
			{
				var current = allectusLib.customer.create ();			
				current.name = "Unavngiven kunde";
				allectusLib.customer.save (current);																								
				
				window.openDialog ("chrome://allectus/content/customeredit/customeredit.xul", "customeredit:"+ current.id, "chrome", {customerId: current.id});
			}
			catch (error)
			{
				app.error ({exception: error})
			}
		},
		
		edit : function ()
		{		
			var current = main.controls.customers.getRow ();								
							
			window.openDialog ("chrome://allectus/content/customeredit/customeredit.xul", "customeredit:"+ current.id, "chrome", {customerId: current.id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet kunde", "Er du sikker på du vil slette denne kunde ?");
			
			if (result)
			{
				try
				{
					allectusLib.customer.destroy (main.controls.customers.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	},
				
	locations :
	{
		locationsTreeHelper : null,
	
		init : function ()
		{					
			main.locations.locationsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("locations"), sort: "title", sortDirection: "ascending", filter: "title", filterValue: "Slagelse", filterDirection: "in"});
			//main.locations.locationsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("locations"), sort: "title", sortDirection: "descending"});
			
			var data1 = new Array ();
			data1.id = "1";
			data1.title = "Network";
			
			var data2 = new Array ();
			data2.id = "2";
			data2.title = "Router #1";
			data2.test = "bla"			
			
			var data3 = new Array ();
			data3.id = "3";
			data3.title = "Router #2";
			
			var data4 = new Array ();
			data4.id = "3";
			data4.title = "Slagelse";
			
			var data5 = new Array ();
			data5.id = "3";
			data5.title = "Slagelse Nummer 2";
					
			main.locations.locationsTreeHelper.addRow ({data: data1});	
			main.locations.locationsTreeHelper.addRow ({data: data2});
			main.locations.locationsTreeHelper.addRow ({data: data3});
			main.locations.locationsTreeHelper.addRow ({data: data4});
			
			main.locations.locationsTreeHelper.setRow ({data: data5});
			
			//this.set ();
								
		//	main.controls.locations.refresh ();		
			
//			var treehelper = new sXUL.helpers.tree ({element: document.getElementById ("test")});
				
//			var data1 = new Array ();
//			data1.id = "1";
//			data1.title = "Network";
			
//			var data2 = new Array ();
//			data2.id = "2";
//			data2.title = "Router #1";
//			data2.test = "bla"			
			
//			var data3 = new Array ();
//			data3.id = "3";
//			data3.title = "Router #2";
			
//			var data4 = new Array ();
//			data4.id = "3";
//			data4.title = "Bla bla bla";
												
//			treehelper.addRow ({data: data1, isContainer: true, isOpen: true});
//			treehelper.addRow ({data: data2, isChildOfId: "1"});
//			treehelper.addRow ({data: data3, isChildOfId: "1"});
			
//			treehelper.setRow ({data: data4});
			
//			var data5 = treehelper.getRow ({id: "3"});
			
//			dump ("ID: "+ data5.id +"\n");
//			dump ("TITLE: "+ data5.title +"\n");
			
			//treehelper.removeRow ({id: "3"});
			
//			treehelper.addRow ({columns: ["4", "Servers"], id: "200", isContainer: true, isOpen: true});			
//			treehelper.addRow ({columns: ["5", "Server #1"], childOfId: "200"});
//			treehelper.addRow ({columns: ["6", "Server #2"], childOfId: "200"});
			
			
									
//			var children = document.getElementById ('testTreeChildren');		
	
//			var item1;
//			{
//				item1 = document.createElement('treeitem');	
//				item1.setAttribute ("container", true);
//				children.appendChild (item1)
//
//				var row = document.createElement('treerow');
//				item1.appendChild (row);
//				
//				var columns = ["ID", "TITLE"];
//									
//				for (index in columns)
//				{
//					var cell = document.createElement('treecell');
//					cell.setAttribute ('label', columns[index]);
//					row.appendChild(cell);
//				}
//			}
//			
//			var item2;
//			{
//				var children2 = document.createElement ("treechildren");
//				item1.appendChild (children2)
//			
//				item2 = document.createElement('treeitem');	
//				children2.appendChild (item2)
//
//				var row = document.createElement('treerow');
//				item2.appendChild (row);
//				
//				var columns = ["ID", "TITLE"];
//									
//				for (index in columns)
//				{
//					var cell = document.createElement('treecell');
//					cell.setAttribute ('label', columns[index]);
//					row.appendChild(cell);
//				}
//			}									
		},
		
		sort : function (column)
		{
			main.locations.locationsTreeHelper.sort (column);	
		},
		
		set : function ()
		{					
			var onDone = 	function (items)
							{
								for (idx in items)
								{		
									var item = items[idx];
								
									if (item.parentid == SNDK.tools.emptyGuid)
									{
										main.locations.locationsTreeHelper.addRow ({data: item, isOpen: true});
									}
									else
									{
										main.locations.locationsTreeHelper.addRow ({data: item, isChildOfId: item.parentid});
									}																		
								}
								
								// Enable controls
								document.getElementById ("locations").disabled = false;								
								document.getElementById ("locationCreate").disabled = false;								
								
//								main.controls.locations.onChange ();
							};

			// Disable controls
			document.getElementById ("locations").disabled = true;
			document.getElementById ("locationCreate").disabled = true;
			document.getElementById ("locationEdit").disabled = true;
			document.getElementById ("locationDestroy").disabled = true;
			
			allectusLib.management.location.list ({async: true, onDone: onDone});		
		},
								
		create : function ()
		{		
			try
			{
				var current = allectusLib.management.location.create ();			
				current.title = "Unavngiven lokation";
				allectusLib.management.location.save (current);																								
				
				window.openDialog ("chrome://allectus/content/management/location/edit.xul", current.id, "chrome", {locationId: current.id});
			}
			catch (error)
			{
				app.error ({exception: error})
			}
		},
		
		edit : function ()
		{		
			var current = main.controls.locations.getRow ();
							
			window.openDialog ("chrome://allectus/content/managment/location/edit.xul", current.id, "chrome", {locationId: current.id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet lokation", "Er du sikker på du vil slette denne lokation ?");
			
			if (result)
			{
				try
				{
					allectusLib.management.location.destroy (main.controls.locations.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	}	
}
