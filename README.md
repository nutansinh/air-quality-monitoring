
#Setting up project run 🛠

cd air-quality-monitoring  
npm install
npm start 
App should now be running on http://localhost:3000/ in your browser


#App Features
* Continuously monitoring the AQI [Air Quality Index getting from ws]
* AQI Module: 
    * AQI Table : Updating the City based table with live AQI and its color as per the CPCB Guidelines
    * AQI Graph: Showing line chart [x: timestamp, y: aqi] for all cities on comparision mode. Use can click the individual city from the table to see the respective graph or else from the default chart by enable/disable from the graph iteself. 


