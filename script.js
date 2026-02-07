document.querySelector("button").addEventListener("click", getForecast);
const apiKey="fd6b59507a0a95901ce5d811aae9108c";
async function getForecast(){
  const city=document.getElementById("cityInput").value;
  const forecastDiv=document.getElementById("forecast");
  if(city===""){
    forecastDiv.innerHTML=`<p style="color:purple;">Please Enter City Name</p>`;
    return;
  }
  try{
    const url=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response=await fetch(url);
    const data=await response.json();
    const currentUrl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const currentResponse=await fetch(currentUrl);
    const currentData=await currentResponse.json();
    const formattedNow=new Date().toLocaleString("en-GB",{
      day:"numeric",
      month:"short",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit"
    });
    forecastDiv.innerHTML=`
      <div class="current">
      <h3>Weather in ${currentData.name}</h3>
        <p><strong>${formattedNow}</strong></p>
        <img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" alt="icon">
        <p>Temperature: ${currentData.main.temp}°C</p>
        <p>Weather: ${currentData.weather[0].description}</p>
        <p>Humidity: ${currentData.main.humidity}%</p>
        <p>Wind Speed: ${currentData.wind.speed} m/s</p>
      </div>
    `;
    const daily={};
    data.list.forEach(item =>{
      const date = item.dt_txt.split(" ")[0];
      if (!daily[date]){
        daily[date]=item;
      }
    });
    Object.keys(daily).slice(1,6).forEach(date =>{
      const day=daily[date];
      const iconCode=day.weather[0].icon;
      const iconUrl=`https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      const formattedDate = new Date(date).toLocaleDateString("en-GB", {
        day:"numeric",
        month:"short",
        year:"numeric"
      });
      forecastDiv.innerHTML+= `
      <div class="forecast-day">
        <h3>${formattedDate}</h3>
        <img src="${iconUrl}" alt="${day.weather[0].description}">
        <p>Temperature: ${day.main.temp} °C</p>
        <p>Weather: ${day.weather[0].description}</p>
        <p>Humidity: ${day.main.humidity} %</p>
        <p>Wind Speed: ${day.wind.speed} m/s</p>
      </div>
    `;
    });
  }catch(error){
  forecastDiv.innerHTML=`<p style="color:red;"><strong>City not Found.Please try again</strong></p>`;
}
}