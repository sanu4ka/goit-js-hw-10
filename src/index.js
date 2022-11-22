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
  if (inputData === '') {
    return;
  }
  fetchCountries(inputData).then(useCountriesMassive).catch(onError);
}

function useCountriesMassive(massive) {
  if (massive.message === 'Page Not Found' || massive.message === 'Not Found') {
    onError();
  } else if (massive.length === 1) {
    const countriesCards = makeCard(massive);
    countryListRef.innerHTML = '';
    countryInfoRef.innerHTML = countriesCards;
  } else if (massive.length > 1 && massive.length <= 10) {
    const countriesList = makeList(massive);
    countryInfoRef.innerHTML = '';
    countryListRef.innerHTML = countriesList;
  } else if (massive.length > 10) {
    Notiflix.Notify.failure(
      'Too many matches found. Please enter a more specific name.'
    );
    countryInfoRef.innerHTML = '';
    countryListRef.innerHTML = '';
  }
}

function makeCard(massive) {
  return massive
    .map(({ name, capital, population, flags, languages }) => {
      return `
          <div class="country-info__inner">
            <img class="country-info__img" src="${flags.svg}" alt="${
        name.official
      }" width="60" height="30">
            <p class="country-info__title">${name.official}</p>
          </div>
          <p class="country-info__desc">Capital: <span>${capital}</span></p>
          <p class="country-info__desc">Population: <span>${population}</span></p>
          <p class="country-info__desc">Languages: <span>${Object.values(
            languages
          ).join(', ')}</span></p>
      `;
    })
    .join('');
}

function makeList(massive) {
  return massive
    .map(({ name, flags }) => {
      return `
        <li class="country-item">
          <img class="country-info__img" src="${flags.svg}" alt="${name.official}" width="40" height="20">
          <p class="country-info__title">${name.official}</p>
        </li>
      `;
    })
    .join('');
}

function onError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  console.error('Oops, there is no country with that name');
  countryInfoRef.innerHTML = '';
  countryListRef.innerHTML = '';
}
