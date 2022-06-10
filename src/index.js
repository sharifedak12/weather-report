'use strict';
const state = {
    temp: 70,
    tempColour: 'black',
    foreground: 'assets/foreground_spring.png',
};

const increaseTemp = () => {
    state.temp += 1;
    updateTemp();
};

const decreaseTemp = () => {
    state.temp -= 1;
    updateTemp();
};

const updateTemp = () => {
    const temp = document.getElementById('temp');
    const foreground = document.getElementById('weatherGarden');
    temp.textContent = `${state.temp}°F`;
    if (state.temp > 80) {
        state.tempColour = '#FF9AA2';
        state.foreground = 'assets/foreground_hot.png';
    } else if (state.temp > 60) {
        state.tempColour = '#FFDAC1';
        state.foreground = 'assets/foreground_spring.png';
    } else if (state.temp > 50) {
        state.tempColour = '#E2F0CB';
        state.foreground = 'assets/foreground_fall.png';
    } else if (state.temp > 40) {
        state.tempColour = '#C7CEEA';
        state.foreground = 'assets/foreground_winter.png';
    }
    temp.style.color = state.tempColour;
    foreground.src = state.foreground;
};

const changeSky = () => {
    const sky = document.getElementById('sky-select');
    const selection = sky.options[sky.selectedIndex].value;
    const skyBackground = document.getElementById('sky');
    skyBackground.style.backgroundImage = `url('../assets/bg_${selection}.png')`;
};

const changeCity = () => {
    const city = document.getElementById('city');
    const cityName = document.getElementById('cityName');
    cityName.textContent = city.value;
};

const reset = () => {
    const city = document.getElementById('city');
    const cityName = document.getElementById('cityName');
    city.value = 'Baltimore';
    cityName.textContent = 'Baltimore';
    state.temp = 70;
    state.tempColour = 'black';
    temp.textContent = `${state.temp}°F`;
    temp.style.color = state.tempColour;
    const skyBackground = document.getElementById('sky');
    skyBackground.style.backgroundImage = `url('../assets/bg_sunny.png')`;
    const foreground = document.getElementById('weatherGarden');
    foreground.src = 'assets/foreground_spring.png';
};

const registerEventHandlers = () => {
    const up = document.getElementById('up');
    up.addEventListener('click', increaseTemp);
    const down = document.getElementById('down');
    down.addEventListener('click', decreaseTemp);
    const sky = document.getElementById('sky-select');
    sky.addEventListener('change', changeSky);
    const city = document.getElementById('city');
    city.addEventListener('change', changeCity);
    const getWeatherButton = document.getElementById('getWeatherButton');
    getWeatherButton.addEventListener('click', getLocation);
    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', reset);
};

document.addEventListener('DOMContentLoaded', registerEventHandlers);

const convertKelvinToFahrenheit = (kelvin) => {
    return Math.round((kelvin - 273.15) * 1.8 + 32);
};

const getLocation = () => {
    const city = document.getElementById('cityName');
    const cityName = city.textContent;
    axios
        .get('http://localhost:5000/location', {
            params: {
                q: cityName,
            },
        })
        .then((response) => {
            const latitude = response.data[0].lat;
            const longitude = response.data[0].lon;
            getWeather(latitude, longitude);
        })
        .catch((error) => {
            console.log(error);
        });
};
const getWeather = (latitude, longitude) => {
    axios
        .get('http://localhost:5000/weather', {
            params: {
                lat: latitude,
                lon: longitude,
            },
        })
        .then((response) => {
            const weather = response.data;
            state.temp = convertKelvinToFahrenheit(weather.current.temp);
            updateTemp();
            const skyBackground = document.getElementById('sky');
            if (weather.current.weather[0].main === 'Clouds') {
                skyBackground.style.backgroundImage = `url('../assets/bg_cloudy.png')`;
            } else if (weather.current.weather[0].main === 'Clear') {
                skyBackground.style.backgroundImage = `url('../assets/bg_sunny.png')`;
            } else if (weather.current.weather[0].main === 'Rain') {
                skyBackground.style.backgroundImage = `url('../assets/bg_raining.png')`;
            } else if (weather.current.weather[0].main === 'Snow') {
                skyBackground.style.backgroundImage = `url('../assets/bg_snowing.png')`;
            }
        })
        .catch((error) => {
            console.log(error);
        });
};