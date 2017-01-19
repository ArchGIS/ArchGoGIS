'use strict';

document.forms[0].addEventListener('submit', (e) => {
  e.preventDefault();

  let form = new FormData(document.forms[0]);
  fetch('/login', {
    method: 'POST',
    body: form
  }).then(
    res => res.json()
  ).then(res => {
    if (res.token) {
      window.Token = res.token;
      localStorage.setItem('token', res.token);
      location.pathname = '/index';
      return;
    }

    alert('Неправильный логин/пароль');
  });
});