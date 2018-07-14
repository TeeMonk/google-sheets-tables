/**
 * Creates table object based on Google sheet. Google sheet must have column descriptions in first row. 
 * Each table item represents a table row, item properties represent table columns. 
 * @param sheet        {object}                             Source Google Sheet.
 * @param defaultKey   {string} [defaultKey = first column] Optional column name, indicates default key field. 
 * @returns GSTable    {object}                             Object, containing table items.
 */
function gsTable(sheet, defaultKey){
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  var defaultKey = defaultKey || headers[0]; 
  if (headers.indexOf(defaultKey) === -1) defaultKey = headers[0];
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
  * @param keyField     {string}   [keyField = defaultKey] Optional name of column to match.  
  * @returns item       {object}                           Object representing table item.
  */
  this.getItem = function(value, keyField){
    keyField = keyField || defaultKey;
    var result = this.items.filter(function(item){
        return item[keyField] === value;
    });
    if (result) return result[0];
  }
  
  /**
  * Takes sheet cell value for indicated column description and returns all matching table items.
  * @param value        {string}                           Value of sheet cell to match.
  * @param keyField     {string}   [keyField = defaultKey] Optional name of column to match.  
  * @returns items      {object[]}                         Array of objects representing table items.
  */
  this.getItems = function(value, keyField){ 
    keyField = keyField || defaultKey;
    var result = this.items.filter(function(item){
        return item[keyField] === value;
    });
    return result;
  }
  
  /**
  * Takes table item and appends it to source sheet.
  * @param item         {object}                           Item object. Object properties must match with sheet columns.
  * @returns success    {bool}                             Indicates if operation was successful.
  */
  this.addItem = function(item){
    var success = false;
    var row = new Array(headers.length);
    //populate row
    for (var property in item) {
      if (item.hasOwnProperty(property)) {
        var index = headers.indexOf(property);
        if (index > -1){
          row[index] = item[property];
          success = true;
        }
      }
    }
    if (success){
      var range = sheet.getRange(this.items.length + 2, 1, 1, headers.length);
      range.setValues([row]);
      this.items.push(item);      
    } 
    return success;
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
    //set values
    for (var i = 0; i < this.items.length; i++){
      if (this.items[i][keyField] === keyValue){
        this.items[i][field] = value;
        var rIndex = i + 2;
        var cIndex = headers.indexOf(field) + 1;
        var range = sheet.getRange(rIndex, cIndex);
        range.setValue(value);
        return true;   
      }
    }
    return false;
  }
  
  /**
  * Matches sheet keyField column value with respective item property and updates all columns according to item properties.
  * @param item         {object}                           Item object. Object properties must match with sheet columns.
  * @param keyField     {string}   [keyField = defaultKey] Optional name of sheet column and item property name to match.  
  * @returns success    {bool}                             Indicates if update was successful.
  */
  this.updateItem = function(item, keyField){
    //validate arguments
    keyField = keyField || defaultKey;
    if (headers.indexOf(keyField) === -1) return false;
    
    //get row index
    var rIndex = 0;
    for (var i = 0; i < this.items.length; i++){
      if (this.items[i][keyField] === item[keyField]){
        this.items[i] = item;
        rIndex = i + 2;
        break;
      }
    }
    if (rIndex < 2) return false;
    
    //transform item to row
    var success = false;
    var row = new Array(headers.length);
    for (var property in item) {
      if (item.hasOwnProperty(property)) {
        var index = headers.indexOf(property);
        if (index !== -1){
          row[index] = item[property];
          success = true;
        }
      }
    }
    if (!success) return success;
    
    //set values
    var range = sheet.getRange(rIndex, 1, 1, row.length);
    var values = [row];
    range.setValues(values);
    return success;
  }
} 
