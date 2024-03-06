import { parseXML } from './parseXML';

document.addEventListener('DOMContentLoaded', () => {
  loadAndDisplayVacancies(1);
});

// Функция для загрузки данных о вакансиях и отображения их
function loadAndDisplayVacancies(pageNumber) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
              const vacancies = parseXML(xhr.responseText);
              displayVacancies(vacancies, pageNumber);
              displayPagination(Math.ceil(vacancies.length / 5), pageNumber);
          } else {
              console.error("Failed to load vacancies:", xhr.statusText);
          }
      }
  };
  xhr.open("GET", "vacancies.xml");
  xhr.send();
}

// Функция для отображения списка вакансий
function displayVacancies(vacancies, pageNumber) {
  const perPage = 5;
  const startIndex = (pageNumber - 1) * perPage;
  const endIndex = startIndex + perPage;
  const vacancyList = document.getElementById('vacancy-list');
  vacancyList.innerHTML = '';

  for (let i = startIndex; i < endIndex && i < vacancies.length; i++) {
    const vacancy = vacancies[i];
    const listItem = document.createElement('a');
    listItem.href = '#';
    listItem.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'justify-content-between', 'align-items-center');
    listItem.innerHTML = `<div>
                                <h5 class="mb-1">${vacancy.jobName}</h5>
                                <p class="mb-1">Зарплата: ${vacancy.salary} ${vacancy.currency}</p>
                            </div>
                            <button type="button" class="btn btn-primary btn-sm vacancy-details-btn" data-bs-toggle="modal" data-bs-target="#vacancyModal" data-vacancy-index="${i}">
                              Подробнее
                            </button>`;
    // Добавляем данные о вакансиях как атрибут к кнопке "Подробнее"
    listItem.querySelector('.vacancy-details-btn').dataset.vacancies = JSON.stringify(vacancies);
    vacancyList.appendChild(listItem);
  }
}
// Функция для отображения подробной информации о вакансии в модальном окне
function displayVacancyDetails(vacancyIndex, vacanciesData) {
  let vacancy = vacanciesData[vacancyIndex];

  const vacancyDetails = document.getElementById('vacancy-details');
  vacancyDetails.innerHTML = `<h5>${vacancy.jobName}</h5>
                                 <p>Зарплата: ${vacancy.salary} ${vacancy.currency}</p>
                                 <p>${vacancy.description}</p>`;

  $('#vacancyModal').modal('show');

  document.getElementById('applyBtn').addEventListener('click', () => {
      $('#responseModal').modal('show');
  });

  const responseForm = document.getElementById('responseForm');
  const submitResponseBtn = document.getElementById('submitResponse');

  responseForm.addEventListener('input', () => {
      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const isValidFullName = fullName !== '';
      const isValidEmail = email !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      submitResponseBtn.disabled = !(isValidFullName && isValidEmail);
  });
}
// Добавляем обработчик события для отображения подробной информации о вакансии при клике на кнопку "Подробнее"
document.getElementById('vacancy-list').addEventListener('click', (event) => {
  const target = event.target;

  if (target.classList.contains('vacancy-details-btn')) {
    const vacancyIndex = parseInt(target.dataset.vacancyIndex);
    const vacancies = JSON.parse(target.dataset.vacancies);
    displayVacancyDetails(vacancyIndex, vacancies);
  }
});
// Добавляем обработчик события для отображения формы отклика при нажатии на кнопку "Откликнуться"
document.getElementById('applyBtn').addEventListener('click', () => {
  $('#vacancyModal').modal('hide');
  $('#applyModal').modal('show');
});

// Функция для отправки отклика на вакансию
function submitResponse(event) {
  event.preventDefault();
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  console.log('Отправка отклика:', fullName, email, phone);

  $('#responseModal').modal('hide');
}

// Добавляем обработчик события для отправки формы отклика
document.getElementById('responseForm').addEventListener('submit', submitResponse);

// Функция для отображения пагинации
function displayPagination(totalPages, currentPage) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement('li');
      pageItem.classList.add('page-item');
      const pageLink = document.createElement('a');
      pageLink.classList.add('page-link');
      pageLink.href = '#';
      pageLink.textContent = i;
      pageLink.addEventListener('click', () => {
          loadAndDisplayVacancies(i);
      });
      if (i === currentPage) {
          pageItem.classList.add('active');
      }
      pageItem.appendChild(pageLink);
      pagination.appendChild(pageItem);
  }
}

// Показываем первую страницу вакансий при загрузке страницы
displayVacancies(1);
