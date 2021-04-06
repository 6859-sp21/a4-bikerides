var data = {}
  
var metadata = {}

function getStationValues(filtered_data) {
    filtered_data.forEach(v => {
      let startStation = v["start station name"]
      if (!data[startStation]) {
        data[startStation] = 0 
      }
      data[startStation] += 1
      
      metadata[startStation] = v
    })
    
    data = Object.entries(data)
    
    return data.map(v => {
      let value = {
        station: v[0],
        value: v[1],
      }
      
      return value
    })
}

function getStationData(filtered_data) { 
    let data = {}
 
    filtered_data.forEach(v => {
      let startStation = v["start station name"]
      data[startStation] = v
    })
     
    return data
}