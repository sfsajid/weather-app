const main = document.querySelector(".main");
const searchBox = document.querySelector(".search-input");
const search = document.getElementById("search");
const searchIcon = searchBox.querySelector(".icon");
const suggBox = searchBox.querySelector(".autocom-box");
const temp = document.querySelector(".temp");
const nCity = document.querySelector(".name");
const time = document.querySelector(".time");
const sDate = document.querySelector(".date");
const wIcon = document.querySelector(".weather-icon");
const condition = document.querySelector(".condition");
const cloud = document.querySelector(".cloud");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const ozone = document.querySelector(".ozone");
const co = document.querySelector(".co");
const no2 = document.querySelector(".no2");
const btnCancel = document.getElementById("btn-cancel");
const apiKey = "e87b1b77404f4ddca63131931223005";

// Event On Focus Out
search.addEventListener("focusout", (event) => {
    setTimeout(() => searchBox.classList.remove("active"), 300);
});

// Deleting text from search box
btnCancel.addEventListener("click", () => {
    search.value = "";
    suggBox.innerHTML = "";
    suggBox.classList.remove("active");
    btnCancel.classList.remove("active");
    btnCancel.classList.add("inactive");
    setTimeout(() => btnCancel.classList.remove("inactive"), 901);
});


//Event On Focus In

search.addEventListener("focusin", (e) => {
    let data = e.target.value;
    if (data) {
        searchCity(data);
        btnCancel.classList.add("active");
        btnCancel.classList.remove("inactive");
    } else {
        searchBox.classList.remove("active");
        if (btnCancel.classList.contains("active")) {
            btnCancel.classList.add("inactive");
            btnCancel.classList.remove("active");
            setTimeout(() => btnCancel.classList.remove("inactive"), 901);
        }
    }
});

//On Text Change
search.addEventListener("input", (e) => {
    let data = e.target.value;
    if (data) {
        searchCity(data);
        btnCancel.classList.add("active");
        btnCancel.classList.remove("inactive");
    } else {
        searchBox.classList.remove("active");
        if (btnCancel.classList.contains("active")) {
            btnCancel.classList.add("inactive");
            btnCancel.classList.remove("active");
            setTimeout(() => btnCancel.classList.remove("inactive"), 901);
        }
    }
});

const searchCity = async (city) => {
    const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${city}`);
    const data = await response.json();
    if (data.length == 0) {
        suggBox.innerHTML = `<li>${city}, is not a city</li>`;
        searchBox.classList.add("active");
    } else if (data.length > 0) {
        suggBox.innerHTML = `${data.map(gCity => `<li onclick="clickedList(this)" id="${gCity.name}">${gCity.name}, ${gCity.country}</li>`).join('')}`;
        searchBox.classList.add("active");
    }



}


// handling Clicked List

const clickedList = (e) => {
    let city = e.id;
    if (city.length > 0) {
        search.value = e.innerText;
        getWeather(city);
    }
    // main.style.opacity = "0";
}

// getting weather by city name
const getWeather = async (city) => {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`);
    const data = await response.json();
    setWeather(data);
}

//getting location 

const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, handleError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

// Handling Errors
const handleError = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("You denied the request for Geolocation. You can search by city name.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable. You can search by city name.");
            break;
        case error.TIMEOUT:
            alert("The request to get your location timed out. You can search by city name.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred. You can search by city name.");
            break;
    }


}

const getPosition = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeatherGeo(lat, lon);
}

// Setting Weather

const setWeather = (jWeather) => {
    temp.innerText = `${Math.round(jWeather.current.temp_c)}°`;
    nCity.innerText = `${jWeather.location.name}`;
    wIcon.src = `${jWeather.current.condition.icon}`;
    condition.innerText = `${jWeather.current.condition.text}`;
    cloud.innerText = `${jWeather.current.cloud}%`;
    humidity.innerText = `${jWeather.current.humidity}%`;
    wind.innerText = `${jWeather.current.wind_kph}km/h`;
    ozone.innerText = `${Math.floor(jWeather.current.air_quality.o3)}`;
    co.innerText = `${Math.floor(jWeather.current.air_quality.co)}`;
    no2.innerText = `${Math.floor(jWeather.current.air_quality.no2)}`;
    time.innerText = jWeather.location.localtime.split(" ")[ 1 ];
    const date = jWeather.location.localtime.split(" ")[ 0 ].split("-");
    const mm = date[ 1 ];
    const dd = date[ 2 ];
    sDate.innerText = `${dd} ${getMonthName(mm)}, ${dayOfTheWeek(date)}, `
    let fold = "day";
    if (jWeather.current.is_day == 1) {
        fold = "day";
    } else {
        fold = "night";
    }
    const wCode = jWeather.current.condition.code;

    if (wCode >= 1003 && wCode <= 1030) {
        main.style.backgroundImage = `url(../images/${fold}/cloudy.jpg)`;
    } else if (wCode == 1000) {
        main.style.backgroundImage = `url(../images/${fold}/clear.jpg)`;
    } else if (wCode >= 1063 && wCode <= 1072) {
        main.style.backgroundImage = `url(../images/${fold}/rainy_cloud.jpg)`;
    } else if (wCode == 1087) {
        main.style.backgroundImage = `url(../images/${fold}/thunder.jpg)`;
    } else if (wCode >= 1063 && wCode <= 1071) {
        main.style.backgroundImage = `url(../images/${fold}/snowfall.jpg)`;
    } else if (wCode >= 1180 && wCode <= 1189) {
        main.style.backgroundImage = `url(../images/${fold}/light_rain.jpg)`;
    } else if (wCode >= 1192 && wCode <= 1282) {
        main.style.backgroundImage = `url(../images/${fold}/heavy_rain.jpg)`;
    }


}

const dayOfTheWeek = (date) => {
    const weekday = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
    return weekday[ new Date(date).getDay() ];
}

const getMonthName = (month) => {
    const monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    return monthNames[ month - 1 ];
}

// Getting Weather by Geo Location

const getWeatherGeo = async (lat, lon) => {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=yes`);
    const data = await response.json();
    setWeather(data);
}


// Getting Weather by IP

const getWeatherIp = async () => {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=auto:ip&aqi=yes`);
    const data = await response.json();
    setWeather(data);
}

window.onload = async () => {
    await getWeatherIp();
    getLocation();
}