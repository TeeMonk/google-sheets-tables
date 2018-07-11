/**
 * Creates table object based on Google sheet. Google sheet must have column descriptions in first row. 
 * Each table item represents a table row, item properties represent table columns. 
 * @param sheet        {object}                             Source Google Sheet.
 * @param primaryKey   {string} [primaryKey = first column] Optional column name, indicates default key field. 
 * @returns GSTable    {object}                             Object, containing table items.
 */
function gsTable(sheet, primaryKey){
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  var primaryKey = primaryKey || headers[0]; 
  if (headers.indexOf(primaryKey) === -1) primaryKey = headers[0];
  /**
  * @property items Array of table items. Items properties represent sheet columns.  
  */
  this.items = data.map(function(row){
    var item = {};
    headers.map(function(header){
      item[header] = row[headers.indexOf(header)];
    });
    return item;
  });
  
  /**
  * Takes sheet cell value for indicated column description and returns matching table item.
  * @param value        {string}                           Value of sheet cell to match.
  * @param keyField     {string}   [keyField = primaryKey] Optional name of column to match.  
  * @returns item       {object}                           Object representing table item.
  */
  this.getItem = function(value, keyField){
    keyField = keyField || primaryKey;
    var result = this.items.filter(function(item){
        return item[keyField] === value;
    });
    if (result) return result[0];
  }
  
  /**
  * Takes sheet cell value for indicated column description and returns all matching table items.
  * @param value        {string}                           Value of sheet cell to match.
  * @param keyField     {string}   [keyField = primaryKey] Optional name of column to match.  
  * @returns items      {object[]}                         Array of objects representing table items.
  */
  this.getItems = function(value, keyField){ 
    keyField = keyField || primaryKey;
    var result = this.items.filter(function(item){
        return item[keyField] === value;
    });
    return result;
  }
  
  /**
  * Takes table item and appends it to source sheet.
  * @param item         {object}                           Item object. Object properties must match with sheet columns.
  */
  this.addItem = function(item){
  //TODO: add success return value
    var success = true;
    var row = new Array(headers.length);
    //validate, populate row
    try {
      for (var property in item) {
        if (item.hasOwnProperty(property)) {
          var index = headers.indexOf(property);
          if (index === -1) {
            success = false;
          }
          else {
            row[index] = item[property];
          }
        }
      }
    }
    catch(err) {
      success = false;
    }
    
    if (success){
      //set values
      var values = [row];
      var range = sheet.getRange(data.length + 2, 1, 1, headers.length);
      range.setValues(values);
      //update table
      data.push(row);
      this.items.push(item);      
    }
  }
  
  /**
  * Searches for keyValue in indicated column and updates value in target column.
  * @param keyField     {string}                           Name of column to search keyValue in.  
  * @param keyValue     {string}                           Value to search for.
  * @param field        {string}                           Name of the column that will be updated.
  * @param value        {string}                           New cell value in specified column.
  * @returns success    {bool}                             Indicates if update was successful.
  */
  this.updateItemValue = function(keyField, keyValue, field, value){
    //validate arguments
    if (headers.indexOf(field) === -1) return false;
    if (headers.indexOf(keyField) === -1) return false;
    //get row index
    var rIndex = 0;
    for (var i = 0; i < data.length; i++){
      if (data[i][headers.indexOf(keyField)] === keyValue){
        data[i][headers.indexOf(field)] = value;
        this.items[i][field] = value;
        rIndex = i + 2;
        break;
      }
    }
    //set value
    if (rIndex > 1){  
      var cIndex = headers.indexOf(field) + 1;
      var range = sheet.getRange(rIndex, cIndex);
      range.setValue(value);
      return true; 
    } 
    else {
      return false;
    }
  }
  
  /**
  * Matches sheet keyField column value with respective item's property and updates all columns according to item properties.
  * @param item         {object}                           Item object. Object properties must match with sheet columns.
  * @param keyField     {string}   [keyField = primaryKey] Optional name of sheet column and item property name to match.  
  * @returns success    {bool}                             Indicates if update was successful.
  */
  this.updateItem = function(item, keyField){
    //validate arguments
    keyField = keyField || primaryKey;
    if (headers.indexOf(keyField) === -1) return false;
    
    //transform item to row
    var success = true;
    var row = new Array(headers.length);
    try {
      for (var property in item) {
        if (item.hasOwnProperty(property)) {
          var index = headers.indexOf(property);
          if (index === -1) {
            success = false;
          }
          else {
            row[index] = item[property];
          }
        }
      }
    }
    catch(err) {
      success = false;
    }
    if (success === false) return false;
    
    //get row index
    var rIndex = 0;
    for (var i = 0; i < data.length; i++){
      if (data[i][headers.indexOf(keyField)] === item[keyField]){
        rIndex = i + 2;
        break;
      }
    }
    //set values
    if (rIndex > 1){  
      var range = sheet.getRange(rIndex, 1, 1, row.length);
      var values = [row];
      range.setValues(values);
      return true; 
    } 
    else {
      return false;
    }
  }
} 
