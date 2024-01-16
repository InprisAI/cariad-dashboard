var currentUrl = '';
const prodURL = 'https://chatwith.humains.com/dashboard-cariad';
const devURL = 'http://127.0.0.1:5000/dashboard-cariad';

const client_id = 'test:d4n4';

function getFormattedDate(inputDateString){
  
  var dateObj = new Date(inputDateString);


  dateObj.setUTCHours(dateObj.getUTCHours() + 2);

  var day = ('0' + dateObj.getUTCDate()).slice(-2);
  var month = ('0' + (dateObj.getUTCMonth() + 1)).slice(-2);
  var year = dateObj.getUTCFullYear().toString().slice(-2);
  var hours = ('0' + dateObj.getUTCHours()).slice(-2);
  var minutes = ('0' + dateObj.getUTCMinutes()).slice(-2);
  var seconds = ('0' + dateObj.getUTCSeconds()).slice(-2);

  var formattedDate = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;
  return formattedDate
}

function getSortedKeys(obj){
  var keys = Object.keys(obj);

  keys.sort(function(key1, key2) {

      var time1 
      var time2 
      try{ 
        time1 = obj[key1][0].time ? new Date(obj[key1][0].time) : new Date(0); 
      }
      catch { 
        time1 = new Date(0); 
      }
      try{ 
        time2 = obj[key2][0].time ? new Date(obj[key2][0].time) : new Date(0);
      }
      catch{
        time2 = new Date(0);
      }
      // Compare the time values in reverse order (latest to soonest)
      return time2 - time1;

  });

  return keys;

}

function makeTable(data) {
  $('#dashboard-table tbody').empty();
  var jsonData = {};
  try {
    jsonData = JSON.parse(data);
    // console.log(obj);
  } catch (error) {
      console.error("Error parsing JSON:", error);
  }

  for (var j = 0; j < jsonData.length; j++) {
    var newRow = $("<tr>");


    var currentRow = jsonData[j];
    if (currentRow["tag"] == "Driver") {
      newRow.append($("<td >").text(currentRow["content"]))
      newRow.append($("<td >").text("-"))
      newRow.append($("<td >").text("-"))
      newRow.append($("<td >").text("-"))
      newRow.append($("<td >").text("-"))
      newRow.append($("<td >").text("-"))
      newRow.append($("<td >").text("-"))
    }
    else {  
      metaData = currentRow["content"]["json_metadata"]
      newRow.append($("<td >").text(currentRow["content"]["convers_content"].replace(/<[^>]+>/g, '')))
      newRow.append($("<td >").text(metaData["analysis"])) 
      newRow.append($("<td >").text(metaData["driver_cooperation"])) 
      newRow.append($("<td >").text(metaData["Entertainment_genres"].join(', '))) 
      newRow.append($("<td >").text(metaData["Artists"].join(', '))) 
      newRow.append($("<td >").text(metaData["favorite_food"].join(', '))) 
      newRow.append($("<td >").text(metaData["is_additional_passenger"])) 
    }
  
    $("#dashboard-table tbody").append(newRow);
  }
}

function fetchData(url) {
  if (url.length > 10){
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // You can also use response.json() for JSON data
      })
      .then((fileContents) => {
        makeTable(fileContents);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

function refreshData() {

  fetchData(currentUrl);
}

$("#refresh-button").click(function () {
  // currentUrl = 'https://humains-core-dev.appspot.com/dashboard-conv?client_id=test:an3el2&conversation_id=htdsbgsdbg' htdsbgsdbg an3el2 
  refreshData()
});

// function redirectToConversation(key){
//   const url = `${currentUrl}?client_id=${client_id}&conversation_id=${key}`
//   fetchData(url)
// }

$("#search-button").click(function () {
  var serchString = $('#search-input')[0].value

  currentUrl = `${prodURL}?conversation_id=${serchString}`

  fetchData(currentUrl);
});

var intervalId = setInterval(refreshData, 5000);
