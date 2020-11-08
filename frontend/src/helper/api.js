const getJSON = (path, options) => fetch(path, options)
  .then((res) => {
    if (res.status === 200) {
      return res.json();
    }
    return res.json().then((msg) => Promise.reject(msg.error));
  });

export default class API {
  constructor(url) {
    this.url = url;
  }

  post(path, options) {
    return getJSON(`${this.url}/${path}`, {
      ...options,
      method: 'POST',
    });
  }

  put(path, options) {
    return getJSON(`${this.url}/${path}`, {
      ...options,
      method: 'PUT',
    });
  }

  get(path, options) {
    return getJSON(`${this.url}/${path}`, {
      ...options,
      method: 'GET',
    });
  }

  delete(path, options) {
    return getJSON(`${this.url}/${path}`, {
      ...options,
      method: 'DELETE',
    });
  }
}
