document.addEventListener("DOMContentLoaded", function () {
  // Gerekli DOM öğelerini seçme alanı
  const cityInput = document.querySelector(".city-text");
  const button = document.querySelector(".button");
  const weekList = document.querySelector(".week-list");
  const weatherSide = document.querySelector(".weather-side");

  // Arama butonuna tıklandığında verileri al
  button.addEventListener("click", () => {
    const cityName = cityInput.value;
    getData(cityName)
      .then((data) => displayWeatherForecast(data))
      .catch((error) => console.error("Hata:", error));
  });

  // Arama butonuna tıklandığında verileri al
  button.addEventListener("click", () => {
    getData(cityInput.value);
    cityInput.value = null;
    cityInput.focus();
  });

  /* Verileri async await ile alma için asenkron fonksiyon
  async function getData(cityName) {
    const API_KEY = "9c21730a55042218a6d94ba46df94f93";
    const baseURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}&cnt=40`;

    try {
      const response = await fetch(baseURL);
      const data = await response.json();
      console.log("Alınan veri:", data);
      displayWeatherForecast(data);
    } catch (error) {
      console.error("Hata:", error);
    }
  } */

  // Verileri almak için asenkron fonksiyon
  function getData(cityName) {
    const API_KEY = "9c21730a55042218a6d94ba46df94f93";
    const baseURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}&cnt=40`;

    return fetch(baseURL)
      .then((response) => {
        if (!response.ok) {
          return new Error("Error");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  }

  // Hava durumu tahminlerini gösterme fonksiyonu
  function displayWeatherForecast(data) {
    const forecasts = data.list.filter((item, index) => index % 8 === 0); //data.list içindeki her sekizinci öğeyi alır
    const currentDate = new Date();
    const currentDayName = getDayName(currentDate.getDay());
    document.querySelector(".date-dayname").innerText = currentDayName;
    document.querySelector(".date-day").innerText =
      currentDate.toLocaleDateString("tr-TR");
    document.querySelector(".location").innerText = data.city.name;

    const currentWeather = forecasts[0].weather[0];
    const weatherIcon = getWeatherIcon(currentWeather.main);
    document
      .querySelector(".weather-icon")
      .setAttribute("data-feather", weatherIcon);
    feather.replace();

    const currentTemp = Math.round(forecasts[0].main.temp); //güncel sıcaklık değerini alır
    const currentDesc = currentWeather.description; //hava durumu açıklaması
    const precipitation = data.list[0].rain //yağış miktarı
      ? `${data.list[0].rain["3h"]} mm`
      : "0 mm";
    const humidity = `${forecasts[0].main.humidity} %`; //güncel nem
    const windSpeed = `${forecasts[0].wind.speed} m/s`; //güncel rüzgar

    document.querySelector(".weather-temp").innerText = `${currentTemp}°C`;
    document.querySelector(".weather-desc").innerText = currentDesc;
    document.querySelector(".precipitation .title").innerText = "Rain";
    document.querySelector(".precipitation .value").innerText = precipitation;
    document.querySelector(".humidity .title").innerText = "Humidity";
    document.querySelector(".humidity .value").innerText = humidity;
    document.querySelector(".wind .title").innerText = "Wind";
    document.querySelector(".wind .value").innerText = windSpeed;

    // Haftalık hava durumu tahminlerini gösterme
    weekList.innerHTML = ""; //içeride kendim olauşturacağım her seferinde boş gelsin.
    forecasts.slice(1, 6).forEach((forecast, index) => {
      //feather kütüphanesi kullanılması için
      const dayName = getDayName(new Date(forecast.dt * 1000).getDay()); //mevcyt günün değeri
      const temp = Math.round(forecast.main.temp);
      const icon = getWeatherIcon(forecast.weather[0].main);
      const date = new Date(forecast.dt * 1000);
      const dateString = `${date.getDate()}.${
        date.getMonth() + 1 //aya har zaman +1
      }.${date.getFullYear()}`;
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <i class="day-icon" data-feather="${icon}"></i>
        <span class="day-name">${dayName}</span>
        <span class="day-temp">${temp}°C</span>
        <span class="day-date">${dateString}</span>
      `;
      weekList.appendChild(listItem);
    });
    feather.replace();

    // İlk günün hava durumuna göre arka planı değiştirme
    const firstWeather = forecasts[0].weather[0].main.toLowerCase();
    let bgImage = "";

    switch (firstWeather) {
      case "thunderstorm":
        bgImage = "./images/thunderstorm.png";
        break;
      case "drizzle":
        bgImage = "./images/drizzle.png";
        break;
      case "rain":
        bgImage = "./images/rain.png";
        break;
      case "snow":
        bgImage = "./images/snow.png";
        break;
      case "clear":
        bgImage = "./images/clear.png";
        break;
      case "clouds":
        bgImage = "./images/clouds.png";
        break;
      default:
        bgImage = "./images/default.png";
    }

    weatherSide.style.backgroundImage = `url(${bgImage})`; //değişlen arkaplan
  }

  // Haftanın günlerini isimlendirme fonksiyonu
  function getDayName(dayIndex) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wedsday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayIndex];
  }

  // Hava durumu ikonlarını belirleme fonksiyonu
  function getWeatherIcon(weatherMain) {
    switch (weatherMain.toLowerCase()) {
      case "thunderstorm":
        return "wind";
      case "drizzle":
        return "cloud-drizzle";
      case "rain":
        return "cloud-rain";
      case "snow":
        return "cloud-snow";
      case "clear":
        return "sun";
      case "clouds":
        return "cloud";
      default:
        return "help-circle";
    }
  }
});
