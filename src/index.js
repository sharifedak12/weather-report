'use strict';
import 'regenerator-runtime/runtime';
import axios from 'axios';
const images = {
    foregroundSpring: require('../assets/foreground_spring.png'),
    foregroundFall: require('../assets/foreground_fall.png'),
    foregroundWinter: require('../assets/foreground_winter.png'),
    foregroundHot: require('../assets/foreground_hot.png'),
    backgroundSunny: require('../assets/bg_sunny.png'),
    backgroundCloudy: require('../assets/bg_cloudy.png'),
    backgroundRaining: require('../assets/bg_raining.png'),
    backgroundSnowing: require('../assets/bg_snowing.png'),
};

const state = {
    city: 'Baltimore',
    temp: 70,
    tempColour: 'black',
    foreground: images.foregroundSpring,
    backgroundImage: images.backgroundSunny,
    foregroundAccessible: 'There is a image in the forground showing many flowers, and a cat playing with a flower.',
    skyAccessible: 'Current sky is sunny',
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
    const foregroundAccessible = document.getElementById(
        'weatherGardenAccessibleForeground'
    );
    temp.textContent = `${state.temp}°F`;
    if (state.temp > 80) {
        state.tempColour = '#FF9AA2';
        state.foreground = images.foregroundHot;
        state.foregroundAccessible =
            'There is a image in the forground showing cacti, agave, a desert landscape, and two cats, one sleeping and one on its back.';
    } else if (state.temp > 60) {
        state.tempColour = '#FFDAC1';
        state.foreground = images.foregroundSpring;
        state.foregroundAccessible =
            'There is a image in the forground showing many flowers, and a cat playing with a flower.';
    } else if (state.temp > 50) {
        state.tempColour = '#E2F0CB';
        state.foreground = images.foregroundFall;
        state.foregroundAccessible =
            'There is a image in the forground showing an autumn landscape, and two cats, one with a leaf on its head, and the other chasing a leaf.';
    } else if (state.temp > 40) {
        state.tempColour = '#C7CEEA';
        state.foreground = images.foregroundWinter;
        state.foregroundAccessible =
            'There is a image in the forground showing a snowy landscape, with pine trees covered in snow, and two cats, one in a hat and a scarf, and the other sitting peacefully.';
    }
    temp.style.color = state.tempColour;
    foreground.src = state.foreground;
    foregroundAccessible.textContent = state.foregroundAccessible;
};

const changeSky = () => {
    const sky = document.getElementById('sky-select');
    const selection = sky.options[sky.selectedIndex].value;
    const skyBackground = document.getElementById('sky');
    const skyAccessible = document.getElementById('weatherGardenAccessibleSky');
    if (selection === 'sunny') {
        state.skyAccessible = 'Current sky is sunny';
        state.backgroundImage = images.backgroundSunny;
    } else if (selection === 'cloudy') {
        state.skyAccessible = 'Current sky is cloudy';
        state.backgroundImage = images.backgroundCloudy;
    } else if (selection === 'raining') {
        state.skyAccessible = 'Current sky is raining';
        state.backgroundImage = images.backgroundRaining;
    } else if (selection === 'snowing') {
        state.skyAccessible = 'Current sky is snowing';
        state.backgroundImage = images.backgroundSnowing;
    }
    skyAccessible.textContent = state.skyAccessible;
    skyBackground.style.backgroundImage = `url('${state.backgroundImage}')`;
};

const changeCity = () => {
    const city = document.getElementById('city');
    const cityName = document.getElementById('cityName');
    cityName.textContent = city.value;
};

const reset = () => {
    const city = document.getElementById('city');
    const cityName = document.getElementById('cityName');
    const temp = document.getElementById('temp');
    const foregroundAccessible = document.getElementById(
        'weatherGardenAccessibleForeground'
    );
    const skyAccessible = document.getElementById('weatherGardenAccessibleSky');
    const skyBackground = document.getElementById('sky');
    const foreground = document.getElementById('weatherGarden');
    state.city = 'Baltimore';
    state.temp = 70;
    state.tempColour = 'black';
    state.foregroundAccessible =
        'There is a image in the forground showing many flowers, and a cat playing with a flower.';
    state.skyAccessible = 'Current sky is sunny';
    state.backgroundImage = images.backgroundSunny;
    state.foreground = images.foregroundSpring;
    city.value = state.city;
    cityName.textContent = state.city;
    temp.textContent = `${state.temp}°F`;
    temp.style.color = state.tempColour;
    foregroundAccessible.textContent = state.foregroundAccessible;
    skyAccessible.textContent = state.skyAccessible;
    skyBackground.style.backgroundImage = `url('${state.backgroundImage}')`;
    foreground.src = state.foreground;
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
                state.backgroundImage = images.backgroundCloudy;
            } else if (weather.current.weather[0].main === 'Clear') {
                state.backgroundImage = images.backgroundSunny;
            } else if (weather.current.weather[0].main === 'Rain') {
                state.backgroundImage = images.backgroundRaining;
            } else if (weather.current.weather[0].main === 'Snow') {
                state.backgroundImage = images.backgroundSnowing;
            }
            skyBackground.style.backgroundImage = `url('${state.backgroundImage}')`;
        })
        .catch((error) => {
            console.log(error);
        });
};