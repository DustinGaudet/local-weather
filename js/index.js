var wCache = {
  'isSetToCelc': true,
  'tempCelc': 0,
  'tempFahr': function tempFahr() {
    return Math.round(this.tempCelc * 9 / 5 + 32);
  },
  'detail': '',
  'city': '',
  'country': '',
  'coords': {
    lat: 0,
    lon: 0
  }
};

function renderWeather(temp, detail, city, country) {

  var weatherIcons = {
    'Clear': 'fa-sun-o',
    'Clouds': 'fa-cloud',
    'Thunderstorm': 'fa-bolt',
    'Rain': 'fa-tint'
  };
  var weatherDetailsEl = $('.weather-details > span');

  $('.temp-box > p').html(temp);
  $('.weather-location').html('<p>' + city + '<br>' + country + '</p>');
  weatherDetailsEl.contents().last().replaceWith(detail);
  weatherDetailsEl.find('i').addClass(weatherIcons[detail]);
}

function getWeather(lat, lon) {
  var apiEndpoint = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather' + '?lat=' + lat + '&lon=' + lon + '&units=metric' + '&APPID=3dc78cfb845829632ebbe606a7d40d12';

  fetch(apiEndpoint).then(function (response) {
    if (response.ok) {
      response.json().then(function (weatherJSON) {
        wCache.tempCelc = Math.round(weatherJSON.main.temp);
        wCache.detail = weatherJSON.weather[0].main;
        wCache.city = weatherJSON.name;
        wCache.country = weatherJSON.sys.country;

        renderWeather(wCache.tempCelc + '&deg;c', wCache.detail, wCache.city, wCache.country);
        return;
      });
      return;
    }
    console.error('error');
  });
}

function appLoad() {
  console.log('app is loading');
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var coord = position.coords;
      getWeather(coord.latitude, coord.longitude);
    });
  } else {
    alert('Your browser needs geolocation support to run this app.');
  }
}

$(document).ready(function () {
  if (location.protocol !== 'https:') alert("This app requires a secure https connection. Please visit https://codepen.io/JedTheRobo/pen/OpBMpq to enable geolocation data.");
  appLoad();
  $('.temp-box > p').on('click', function () {
    console.log('click worked!');
    var temp = wCache.isSetToCelc ? wCache.tempFahr().toString() + '&deg;F' : wCache.tempCelc + '&deg;c';
    renderWeather(temp, wCache.detail, wCache.city, wCache.country);
    wCache.isSetToCelc = !wCache.isSetToCelc;
  });
});