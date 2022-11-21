import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const inputRef = document.querySelector('#search-box');
const countryInfoRef = document.querySelector('.country-info');
const countryListRef = document.querySelector('.country-list');
const DEBOUNCE_DELAY = 300;

inputRef.addEventListener('input', debounce(onInputDataChange, DEBOUNCE_DELAY));

function onInputDataChange(event) {
  const inputData = event.target.value.trim();
  fetchCountries(inputData)
    .then(useCountriesMassive)
    .catch(error => console.log(error));
}

function useCountriesMassive(massive) {
  const countryMarkup = makeCard(massive);

  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = countryMarkup;
}

function makeCard(massive) {
  return massive
    .map(({ name, capital, population, flags, languages }) => {
      `
          <div class="country-info__inner">
            <img class="country-info__img" src="${flags.svg}" alt="${name.official}" width="60" height="30">
            <p class="country-info__title">${name.official}</p>
          </div>
          <p class="country-info__desc">Capital:<span>${capital}</span></p>
          <p class="country-info__desc">Population:<span>${population}</span></p>
          <p class="country-info__desc">Languages:<span>${languages}</span></p>
      `;
    })
    .join('');
}

function makeList(massive) {
  return massive
    .map(({ name, flags }) => {
      return `
        <li class="country-item">
          <img class="country-info__img" src="${flags.svg}" alt="${name.official}" width="60" height="30">
          <p class="country-info__title">${name.official}</p>
        </li>
      `;
    })
    .join('');
}
