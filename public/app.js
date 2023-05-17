function fetchDataAndUpdatePage() {
  fetch('http://localhost:3000/api/data')
      .then(response => response.json())
      .then(data => {
          // Update the temperature, humidity, CO level, and AC status
          document.getElementById('temperature').textContent = "Temperature: " + data.temperature;
          document.getElementById('humidity').textContent = "Humidity: " + data.humidity;
          document.getElementById('coLevel').textContent = "CO Level: " + data.coLevel;
          document.getElementById('acStatus').textContent = "AC Status: " + (data.acStatus ? "On" : "Off");
          
          // Update the blood inventory table
          const bloodInventory = document.getElementById('bloodInventory');
          
          // Remove all rows except for the header
          while (bloodInventory.rows.length > 1) {
              bloodInventory.deleteRow(1);
          }

          // Add a row for each blood type
          for (let i = 0; i < data.bloodInventory.length; i++) {
              const row = bloodInventory.insertRow();
              const cell1 = row.insertCell();
              const cell2 = row.insertCell();

              cell1.textContent = data.bloodInventory[i].type;
              cell2.textContent = data.bloodInventory[i].count;
          }
      })
      .catch(error => console.error('Error:', error));
}

// Fetch data and update the web page every 5 seconds
setInterval(fetchDataAndUpdatePage, 5000);
