$.getJSON("/article", function(data) {
    for (let i = 0; i < data.length; i++) {
      $("#article").append("<p data-id='" + data[i]._id + "'>" + "<h4>" + data[i].heading + "</h4>" + "<br>" + data[i].url +"<br>" + data[i].summary + "</p><br>");
    }                              
  });
  
  
