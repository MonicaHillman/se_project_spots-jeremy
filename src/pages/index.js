import {
  enableValidation,
  settings,
  disableButton,
} from "../scripts/validate.js";
import "./index.css";
import Api from "../utils/Api.js";
import headerSrc from "../images/logo.svg";
import avatarSrc from "../images/avatar.jpg";
import pencilSrc from "../images/pencil.svg";
import plusSrc from "../images/plus-sign.svg";
import { setButtonText } from "../utils/helpers.js";

//const initialCards = [
// {
//  name: "Val Thorens",
// link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//},
// {
// name: "Restaurant terrace",
//  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
// },
//{
//  name: "An outdoor cafe",
//link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//},
//{
//  name: "A very long bridge, over the forest and through the trees",
//   link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
// },
// {
// name: "Tunnel with morning light",
// link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//},
//{
// name: "Mountain house",
// link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//},
//];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ecd5a488-3949-4139-88e7-a6fa394203da",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards]) => {
    cards.forEach((item) => {
      renderCard(item);
    });
  })
  .catch(console.error);

const headerImg = document.getElementById("headerLogo");
headerImg.src = headerSrc;
const avaterImg = document.getElementById("profileAvatar");
avaterImg.src = avatarSrc;
const pencilImg = document.getElementById("profilePencil");
pencilImg.src = pencilSrc;
const plusImg = document.getElementById("profilePlusSign");
plusImg.src = plusSrc;

const avatarModal = document.querySelector("#avatar-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarForm = document.forms["avatar-form"];
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitButton = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const deleteModal = document.querySelector("#delete-modal");
const deleteCancelBtn = deleteModal.querySelector("#delete-cancel-btn");
const deleteSubmitForm = deleteModal.querySelector(".modal__form");
let selectCard;
let selectedCardId;

const closeBtns = document.querySelectorAll(".modal__close-btn");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardLikeBtn.addEventListener("click", () => {
    if (cardLikeBtn.classList.contains("card__like-btn_liked")) {
      api
        .toggleLike(data._id, true)
        .then(() => {
          cardLikeBtn.classList.toggle("card__like-btn_liked");
        })
        .catch(console.error);
    } else {
      api
        .toggleLike(data._id, false)
        .then(() => {
          cardLikeBtn.classList.toggle("card__like-btn_liked");
        })
        .catch(console.error);
    }
  });

  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteBtn(cardElement, data._id)
  );

  cardImageEl.addEventListener("click", (evt) => {
    evt.stopPropagation();
    openModal(previewModal);
    previewModalImageEl.alt = data.name;
    previewModalImageEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

function handleEditFormSubmit(evt) {
  const editFormSubmitBtn = evt.submitter;
  setButtonText(editFormSubmitBtn, true);

  evt.preventDefault();
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(editFormSubmitBtn, false);
    });
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

function handleAddCardSubmit(evt) {
  const addCardSubmitBtn = evt.submitter;
  setButtonText(addCardSubmitBtn, true);

  evt.preventDefault();
  api
    .addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((cardData) => {
      renderCard(cardData);
      evt.target.reset();
      disableButton(cardSubmitButton, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(addCardSubmitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  const avatarSubmitBtn = evt.submitter;
  setButtonText(avatarSubmitBtn, true);

  evt.preventDefault();
  api
    .editAvatarInfo(avatarInput.value)
    .then((avatarData) => {
      if (avatarData.avatar) {
        avaterImg.src = avatarData.avatar;
        avaterImg.alt = profileName.textContent;
      }

      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(avatarSubmitBtn, false);
    });
}

function handleDeleteBtn(cardElement, cardId) {
  selectCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  const deleteSubmitBtn = evt.submitter;
  setButtonText(deleteSubmitBtn, true);

  evt.preventDefault();
  api
    .removeCard(selectedCardId)
    .then(() => {
      selectCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteSubmitBtn, false, "Deleting...", "Delete");
    });
}

deleteSubmitForm.addEventListener("submit", handleDeleteSubmit);

function handleEscKey(evt) {
  if (evt.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    closeModal(modal);
  }
}

function handleOverlayClose(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscKey);
  modal.addEventListener("click", handleOverlayClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscKey);
  modal.removeEventListener("click", handleOverlayClose);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
});

cardModalBtn.addEventListener("click", (evt) => {
  evt.stopPropagation();
  openModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

closeBtns.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => {
    closeModal(popup);
  });
});

enableValidation(settings);
