# Google Sheets Tables
CRUD operations for google sheets

# Overview
This repository contains a Google Apps Script helper function that makes manipulating Google Sheets data through script more convenient. It provides create, read and update methods for single sheet (delete method is coming soon). The script assumes that data in the sheet contains proper column descriptions. Sheet data is transformed into array of item objects. Each item object reperesenting single row. Column descriptions are used to create item properties.
