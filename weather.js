const key = "c9843010431e1d843c62029567125df3";

async function search() {
  const phrase = document.querySelector('input[type="text"]').value;
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`
  );
  const data = await response.json();
  const ul = document.querySelector("form ul");
  ul.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const { name, lat, lon, country } = data[i];
    ul.innerHTML += `<li 
        data-lat='${lat}' 
        data-lon='${lon}' 
        data-name='${name}'>
        ${name} <span>${country}</span></li>`;
  }
}

const debouncedSearch = _.debounce(() => {
  search();
}, 600);

async function showWeather(lat, lon, name) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
  );
  const data = await response.json();
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = Math.round(data.main.humidity);
  const wind = Math.round(data.wind.speed);
  const icon = data.weather[0].icon;
  document.getElementById("city").innerHTML = name;
  document.getElementById("degrees").innerHTML = temp + "&deg;C";
  document.getElementById("feelsLikeValue").innerHTML =
    feelsLike + "<span>&deg;C</span>";
  document.getElementById("windValue").innerHTML = wind + "<span>km/h</span>";
  document.getElementById("humidityValue").innerHTML =
    humidity + "<span>%</span>";
  document.getElementById(
    "icon"
  ).src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
  document.querySelector("form").style.display = "none";
  document.getElementById("weather").style.display = "block";
}

function changeScreen() {
  const ul = document.querySelector("form ul");
  ul.innerHTML = "";
  document.getElementById('cityName').value='';
  document.querySelector("form").style.display = "block";
  document.getElementById("weather").style.display = "none";
}

document
  .querySelector('input[type="text"]')
  .addEventListener("keyup", debouncedSearch);

document.body.addEventListener("click", (ev) => {
  const li = ev.target;
  const { lat, lon, name } = li.dataset;
  localStorage.setItem("lat", lat);
  localStorage.setItem("lon", lon);
  localStorage.setItem("name", name);
  console.log(localStorage.getItem("name"));
  if (!lat) {
    return;
  }
  showWeather(lat, lon, name);
});

document.getElementById("change").addEventListener("click", () => {
  changeScreen();
});

document.body.onload = () => {
    if(localStorage.getItem("name")=='undefined'){
        return;
    }
  else{
    const lat = localStorage.getItem("lat");
    const lon = localStorage.getItem("lon");
    const name = localStorage.getItem("name");
    showWeather(lat, lon, name);
  }
};
