import { POINT_TYPES } from '../const.js';
import { capitalizeFirstLetter, humanizeDate } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

function createFormEditTemplate({point, destinations, offers}) {
  const {basePrice, dateFrom, dateTo, type} = point;
  const typeOffers = offers.find((offer) => offer.type === point.type).offers;
  const pointOffers = typeOffers.filter((typeOffer) => point.offers.includes(typeOffer.id));
  const pointDestination = destinations.find((dest) => dest.id === point.destination);
  const {name, description, pictures} = pointDestination || {};
  const pointId = point.id || null;

  return (
    `<form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
    ${POINT_TYPES.map((pointType) => (
      `<div class="event__type-item">
                          <input id="event-type-${pointType}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === type ? 'checked' : ''}>
                          <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${pointId}">${capitalizeFirstLetter(pointType)}</label>
                        </div>`
    )).join('')}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-${pointId}">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${name || ''}" list="destination-list-${pointId}">
                    <datalist id="destination-list-${pointId}">
                      ${destinations.map((destination) => `<option value="${destination.name}"></option>`).join('')}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${humanizeDate(dateFrom,'YY/MM/DD HH:mm')}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-${pointId}" type="text" name="event-end-time" value="${humanizeDate(dateTo,'YY/MM/DD HH:mm')}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-${pointId}">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-${pointId}" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">${point.id ? 'Delete' : 'Cancel'}</button>
                  ${point.id ? (
      `<button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>`
    ) : ''}
                </header>
                <section class="event__details">
                ${typeOffers.length ?
      `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                    ${typeOffers.map((typeOffer) => (
      `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${typeOffer.title}-${pointId}" type="checkbox" name="event-offer-${typeOffer.title}" ${pointOffers.map((offer) => offer.id).includes(typeOffer.id) ? 'checked' : ''}>
                        <label class="event__offer-label" for="event-offer-${typeOffer.title}-${pointId}">
                          <span class="event__offer-title">${typeOffer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${typeOffer.price}</span>
                        </label>
                      </div>`
    )).join('')}
                    </div>
                  </section>`
      : ''}
    ${pointDestination ? (
      `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description}</p>
                    ${pictures.length ? (
        `<div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${pictures.map((pic) => `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`)}
                      </div>
                    </div>`
      ) : ''}
                  </section>`
    ) : ''}
                </section>
              </form>`
  );
}

export default class FormEditView extends AbstractView {
  #handleFormSubmit = null;
  #handleFormClose = null;

  constructor({point, destinations, offers, onFormSubmit, onFormClose}) {
    super();
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onFormClose;

    this.element.querySelector('.event--edit')?.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
  }

  get template() {
    return createFormEditTemplate({point: this.point, destinations: this.destinations, offers: this.offers});
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose();
  };
}
