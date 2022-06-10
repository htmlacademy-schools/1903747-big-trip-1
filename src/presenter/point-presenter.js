import {SitePointView} from '../view/site-point-view.js';
import {SiteEditPointView} from '../view/site-edit-point-view.js';
import {render, RenderPosition, replace, remove} from '../render.js';
import {UserAction, UpdateType} from '../const.js';
import {isDatesEqual} from '../utilities/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export class PointPresenter {
    #tripListElement = null;

    #pointObject = null;
    #pointComponent = null;
    #pointEditComponent = null;
    #pointId = null;

    #changeData = null;
    #changeMode = null;

    #mode = Mode.DEFAULT;

    constructor (tripListElement, changeData, changeMode) {
      this.#tripListElement = tripListElement;
      this.#changeData = changeData;
      this.#changeMode = changeMode;
    }

    init = (pointObject) => {
      this.#pointObject = pointObject;
      this.#pointId = pointObject.id;

      const prevPointComponent = this.#pointComponent;
      const prevPointEditComponent = this.#pointEditComponent;

      this.#pointComponent = new SitePointView(this.#pointObject);
      this.#pointEditComponent = new SiteEditPointView(this.#pointObject);

      this.#setEditClick();
      this.#pointComponent.setFavoriteClickHandler(this.#setFavoriteClick);
      this.#pointEditComponent.setFormSubmitHandler(this.#setSubmitClick);
      this.#pointEditComponent.setDeleteClickHandler(this.#setDeleteClick);

      if (prevPointComponent === null || prevPointEditComponent === null) {
        render(this.#tripListElement, this.#pointComponent.element, RenderPosition.BEFOREEND);
        return;
      }

      if (this.#tripListElement.contains(prevPointComponent.element)) {
        replace(this.#pointComponent, prevPointComponent);
      }

      if (this.#tripListElement.contains(prevPointEditComponent.element)) {
        replace(this.#pointEditComponent, prevPointEditComponent);
      }

      remove(prevPointComponent);
      remove(prevPointEditComponent);
    }

    get pointId() {
      return this.#pointId;
    }

    destroy = () => {
      remove(this.#pointComponent);
      remove(this.#pointEditComponent);
    }

    #replacePointToForm = () => {
      replace(this.#pointEditComponent.element, this.#pointComponent.element);
      this.#changeMode();
      this.#mode = Mode.EDITING;
    };

    resetView = () => {
      if (this.#mode !== Mode.DEFAULT) {
        this.#replaceFormToPoint();
      }
    }

    #replaceFormToPoint = () => {
      replace(this.#pointComponent.element, this.#pointEditComponent.element);
      this.#mode = Mode.DEFAULT;
    };

    #onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        event.preventDefault();
        this.#replaceFormToPoint();
        document.removeEventListener('keydown', this.#onEscKeyDown);
      }
    };

    #setEditClick = () => {
      this.#pointComponent.setEditClickHandler(() => {
        this.#changeData(
          this.#pointObject
        );
        this.#replacePointToForm();
        document.addEventListener('keydown', this.#onEscKeyDown);
      });

      this.#pointEditComponent.setEditClickHandler(() => {
        this.#changeData(
          this.#pointObject
        );
        this.#replaceFormToPoint();
      });
    }

    #setSubmitClick = (update) => {
      const isMinorUpdate =
      !isDatesEqual(this.#pointObject.dateFrom, update.dateFrom) ||
      !isDatesEqual(this.#pointObject.dateTo, update.dateTo) ||
      (this.#pointObject.basePrice !== update.basePrice);

      this.#changeData(
        UserAction.UPDATE_POINT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update
      );
      this.#replaceFormToPoint();
      document.addEventListener('keydown', this.#onEscKeyDown);
    }

    #setFavoriteClick = () => {
      this.#pointObject.isFavorite = !this.#pointObject.isFavorite;
      this.#changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        {...this.#pointObject},
      );
    }

    #setDeleteClick = (point) => {
      this.#changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
      );
    }
}