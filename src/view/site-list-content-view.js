import dayjs from 'dayjs';
import {createElement} from '../render.js';

const createOffersTemplate = (offers) => {
  let offersElement = '';
  for (let i = 0; i < offers.length; i++) {
    offersElement +=
      `<li class="event__offer">
        <span class="event__offer-title">${offers[i].option}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offers[i].price}</span>
      </li>`;
  }
  return offersElement;
};

const createSiteListContentTemplate = (newPoint) => {
  const {destination, offers, point} = newPoint;
  return `<ul class="trip-events__list">
            <li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="2019-03-18">${dayjs(point.dateFrom).format('MMM, DD')}</time> 
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon"/>
                </div>
                <h3 class="event__title">${point.type} ${destination.townName}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="2019-03-18T12:25">${dayjs(point.dateFrom).format('HH')}:${dayjs(point.dateFrom).format('MM')}</time>
                    &mdash;
                    <time class="event__end-time" datetime="2019-03-18T13:35">${dayjs(point.dateTo).format('HH')}:${dayjs(point.dateTo).format('MM')}</time>
                  </p>
                  <p class="event__duration">${dayjs(point.tripDuration).format('H')}H ${dayjs(point.tripDuration).format('MM')}M</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${createOffersTemplate(offers)}
                </ul>
                <button class="event__favorite-btn event__favorite-btn--active" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>\
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>
          </ul>`;
};

export class SitePointView {
  #element = null;
  #newPoint = null;

  constructor (newPoint) {
    this.#newPoint = newPoint;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createSiteListContentTemplate(this.#newPoint);
  }

  removeElement() {
    this.#element = null;
  }
}
