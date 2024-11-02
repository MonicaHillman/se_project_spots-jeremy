class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error ${res.status}`);
  }

  async request(url, options) {
    const res = await fetch(url, options);
    return this.checkResponse(res);
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  getInitialCards() {
    return this.request(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }

  getUserInfo() {
    return this.request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
  }

  editUserInfo({ name, about }) {
    return this.request(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    });
  }

  editAvatarInfo(avatar) {
    return this.request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    });
  }

  removeCard(card) {
    return this.request(`${this._baseUrl}/cards/${card}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  addCard({ name, link }) {
    return this.request(`${this._baseUrl}/cards/`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    });
  }

  toggleLike(id, isLiked) {
    return this.request(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: this._headers,
    });
  }
}

export default Api;
