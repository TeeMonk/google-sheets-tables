# Google Sheets Tables
CRUD operations for google sheets

## Overview
This repository contains a Google Apps Script helper function that makes manipulating Google Sheets data through script more convenient. It provides create, read and update methods for single sheet (delete method is coming soon). The script assumes that data in the sheet contains proper column descriptions. Sheet data is transformed into array of item objects. Each item object represents single row and  column descriptions are used to create item properties.

## How To Use
1. Copy code from [gsTable.js](https://github.com/TeeMonk/google-sheets-tables/blob/master/gsTable.js) to your Google Apps Script editor. 
2. Create new `gsTable` object, pass Google `sheet` object as an argument. If second, optional argument is ommited, first column becomes `primaryKey`  -  used as default key for selecting and updating table items.
```javascript
var sheet = SpreadsheetApp.getActive().getSheetByName('Sheet1');
var table = new gsTable(sheet); 
```

The data in Sheet1 need to have column descriptions:
![sample data](https://github.com/TeeMonk/google-sheets-tables/blob/master/gsheet.PNG "sample data")

## gsTable Methods
Once table object is created you can start using its methods to manipulate Sheet1 data.

### `getItem(value, keyField)`
Takes sheet cell value (`value`) for indicated column description (`keyField`) and returns matching table item. If second, optional argument is ommited `primaryKey` is used to indicate column for lookup.   
```javascript
  var item;
  
  item = table.getItem(1);
  Logger.log(item.Address); // Logs "Main Street 23"
  
  item = table.getItem("Black Horse", "Customer Name");
  Logger.log(item["Contact Name"]); // Logs "Jake Weary"
```
