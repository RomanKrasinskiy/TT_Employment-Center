import { parseXML } from "./parseXML";

// Обработчик события для формы фильтрации вакансий
document
  .getElementById("filtersForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Получаем значения из элементов формы
    const jobName = document.getElementById("jobNameInput").value.trim();
    const salary = parseFloat(document.getElementById("salaryInput").value.trim()) || 0; // Преобразуем в число, если введенное значение не является числом, используем 0
    const showOnlyWithSalary = document.getElementById("showOnlyWithSalaryCheckbox").checked;

    // Формируем объект фильтров
    const filters = {
      jobName,
      salary,
      showOnlyWithSalary,
    };

    // Загружаем и отображаем вакансии с учетом примененных фильтров
    loadAndDisplayVacancies(1, filters);
  });

document.addEventListener("DOMContentLoaded", () => {
  loadAndDisplayVacancies(1);
});

// Функция для загрузки данных о вакансиях и отображения их с учетом фильтров
function loadAndDisplayVacancies(pageNumber, filters = {}) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const vacancies = parseXML(xhr.responseText);
        applyFiltersAndDisplay(vacancies, pageNumber, filters);
      } else {
        console.error("Failed to load vacancies:", xhr.statusText);
      }
    }
  };
  xhr.open("GET", "vacancies.xml");
  xhr.send();
}
// Функция для применения фильтров и отображения отфильтрованных вакансий
function applyFiltersAndDisplay(vacancies, pageNumber, filters) {
  let filteredVacancies = vacancies;

  // Проверяем, были ли введены данные для фильтрации
  if (filters.jobName || filters.salary || filters.showOnlyWithSalary) {
    filteredVacancies = vacancies.filter((vacancy) => {
      console.log(vacancy)
      // Применяем фильтр по названию вакансии
      const jobNameFilter = filters.jobName
        ? vacancy.jobName.toLowerCase().includes(filters.jobName.toLowerCase())
        : true;
      // Применяем фильтр по размеру зарплаты
      const salaryFilter = filters.salary
        ? vacancy.salary >= filters.salary
        : true;
      // Применяем фильтр для показа только вакансий с зарплатой
      const showOnlyWithSalaryFilter = filters.showOnlyWithSalary
        ? vacancy.salary > 0
        : true;

      return jobNameFilter && salaryFilter && showOnlyWithSalaryFilter;
    });
  }

  displayVacancies(filteredVacancies, pageNumber);
  displayPagination(Math.ceil(filteredVacancies.length / 5), pageNumber);
}
// Функция для отображения списка вакансий
function displayVacancies(vacancies, pageNumber) {
  const perPage = 5;
  const startIndex = (pageNumber - 1) * perPage;
  const endIndex = startIndex + perPage;
  const vacancyList = document.getElementById("vacancy-list");
  vacancyList.innerHTML = "";

  for (let i = startIndex; i < endIndex && i < vacancies.length; i++) {
    const vacancy = vacancies[i];
    const listItem = document.createElement("a");
    listItem.href = "#";
    listItem.classList.add(
      "list-group-item",
      "list-group-item-action",
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "vacancy-details"
    );
    listItem.innerHTML = `<div>
                                <h5 class="mb-1">${vacancy.jobName}</h5>
                                <p class="mb-1">Зарплата: ${vacancy.salary} ${vacancy.currency}</p>
                            </div>
                            <button type="button" class="btn btn-primary btn-sm vacancy-details-btn" data-bs-toggle="modal" data-bs-target="#vacancyModal" data-vacancy-index="${i}">
                              Подробнее
                            </button>`;
    // Добавляем данные о вакансиях как атрибут к кнопке "Подробнее"
    listItem.querySelector(".vacancy-details-btn").dataset.vacancies =
      JSON.stringify(vacancies);

    vacancyList.appendChild(listItem);

    // Добавляем данные о вакансиях как атрибут всей карточке
    listItem.addEventListener("click", () => {
      displayVacancyDetails(i, vacancies);
  });
  }
}
// Функция для отображения подробной информации о вакансии в модальном окне
function displayVacancyDetails(vacancyIndex, vacanciesData) {
  let vacancy = vacanciesData[vacancyIndex];

  const vacancyDetails = document.getElementById("vacancy-details");
  vacancyDetails.innerHTML = `<h5>${vacancy.jobName}</h5>
                                 <p>Зарплата: ${vacancy.salary} ${vacancy.currency}</p>
                                 <p>${vacancy.description}</p>`;

  $("#vacancyModal").modal("show");

  document.getElementById("applyBtn").addEventListener("click", () => {
    $("#responseModal").modal("show");
  });

  const responseForm = document.getElementById("responseForm");
  const submitResponseBtn = document.getElementById("submitResponse");

  responseForm.addEventListener("input", () => {
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const isValidFullName = fullName !== "";
    const isValidEmail =
      email !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    submitResponseBtn.disabled = !(isValidFullName && isValidEmail);
  });
}
// Добавляем обработчик события для отображения подробной информации о вакансии при клике на кнопку "Подробнее"
document.getElementById("vacancy-list").addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("vacancy-details-btn")) {
    const vacancyIndex = parseInt(target.dataset.vacancyIndex);
    const vacancies = JSON.parse(target.dataset.vacancies);
    displayVacancyDetails(vacancyIndex, vacancies);
  }
});
// Добавляем обработчик события для отображения формы отклика при нажатии на кнопку "Откликнуться"
document.getElementById("applyBtn").addEventListener("click", () => {
  $("#vacancyModal").modal("hide");
  $("#applyModal").modal("show");
});

// Функция для отправки отклика на вакансию
function submitResponse(event) {
  event.preventDefault();
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  Email.send({
    SecureToken: "51e37203-9a1e-4348-a76b-9f7305e9bb39",

    To: "nasybulindk@social.mos.ru, PimenovVY@social.mos.ru",
    From: "vitya.testovyy@mail.ru",
    Subject: "Отклик на вакансию",
    Body: "ФИО: " + fullName + "<br>Email: " + email + "<br>Телефон: " + phone,
  })
    .then((message) => {
      alert("Отклик успешно отправлен.");
      $("#responseModal").modal("hide");
    })
    .catch((error) => {
      console.error("Ошибка при отправке отклика:", error);
      alert("Ошибка при отправке отклика.");
    });

  $("#responseModal").modal("hide");
}

// Добавляем обработчик события для отправки формы отклика
document
  .getElementById("responseForm")
  .addEventListener("submit", submitResponse);

// Функция для отображения пагинации
function displayPagination(totalPages, currentPage) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  // Определяем диапазон страниц, который нужно показать
  let startPage = Math.max(1, currentPage - 5);
  let endPage = Math.min(totalPages, currentPage + 5);

  // Добавляем многоточие, если текущая страница не первая
  if (currentPage > 6) {
    const ellipsisItem = createEllipsisItem();
    pagination.appendChild(ellipsisItem);
  }

  // Добавляем кнопки для отображения страниц в диапазоне
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = createPageItem(i, currentPage);
    pagination.appendChild(pageItem);
  }

  // Добавляем многоточие, если текущая страница не последняя
  if (currentPage < totalPages - 5) {
    const ellipsisItem = createEllipsisItem();
    pagination.appendChild(ellipsisItem);
  }

  // Добавляем кнопку "Последняя страница"
  if (currentPage < totalPages - 4) {
    const lastPageItem = createPageItem(totalPages, currentPage);
    pagination.appendChild(lastPageItem);
  }
}
// Функция для создания элемента пагинации для конкретной страницы
function createPageItem(pageNumber, currentPage) {
  const pageItem = document.createElement("li");
  pageItem.classList.add("page-item");
  const pageLink = document.createElement("a");
  pageLink.classList.add("page-link");
  pageLink.textContent = pageNumber;
  pageLink.addEventListener("click", () => {
    loadAndDisplayVacancies(pageNumber);
  });
  if (pageNumber === currentPage) {
    pageItem.classList.add("active");
  }
  pageItem.appendChild(pageLink);
  return pageItem;
}

// Функция для создания элемента многоточия
function createEllipsisItem() {
  const ellipsisItem = document.createElement("li");
  ellipsisItem.classList.add("page-item");
  const ellipsisLink = document.createElement("span");
  ellipsisLink.classList.add("page-link");
  ellipsisLink.textContent = "...";
  ellipsisItem.appendChild(ellipsisLink);
  return ellipsisItem;
}
