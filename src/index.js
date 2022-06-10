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

const registerEventHandlers = () => {
    const up = document.getElementById('up');
    up.addEventListener('click', increaseTemp);
    const down = document.getElementById('down');
    down.addEventListener('click', decreaseTemp);
    const sky = document.getElementById('sky-select');
    sky.addEventListener('change', changeSky);
    const city = document.getElementById('city');
    city.addEventListener('change', changeCity);
};

document.addEventListener('DOMContentLoaded', registerEventHandlers);