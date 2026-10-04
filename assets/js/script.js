'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// GitHub repositories
const repositoriesList = document.querySelector("[data-github-repositories]");
const repositoriesStatus = document.querySelector("[data-github-status]");
const repositoryFilters = document.querySelector("[data-repository-filters]");
const featuredRepositoryNames = [
  "GIFT-ECONOMY",
  "hack_droid",
  "LocalDiffViewer",
  "Scriptorium",
  "SpeedForge",
  "IMDBPlayer-Linux",
  "MP3-Song-Downloader-masstamilan-",
  "TestForge",
  "personel-budget-calculator",
  "GoldPriceTracker"
];

const createRepositoryCard = function (repository) {
  const item = document.createElement("li");
  item.className = "project-item active";
  item.dataset.filterItem = "";
  item.dataset.category = (repository.language || "Other").toLowerCase();

  const link = document.createElement("a");
  link.href = repository.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `View ${repository.name} on GitHub`);

  const preview = document.createElement("figure");
  preview.className = "project-img repo-preview";
  preview.setAttribute("aria-hidden", "true");

  const repositoryIcon = document.createElement("ion-icon");
  repositoryIcon.className = "repo-main-icon";
  repositoryIcon.setAttribute("name", "globe-outline");
  preview.append(repositoryIcon);

  const iconBox = document.createElement("div");
  iconBox.className = "project-item-icon-box";
  const icon = document.createElement("ion-icon");
  icon.setAttribute("name", "eye-outline");
  iconBox.append(icon);
  preview.append(iconBox);

  const title = document.createElement("h3");
  title.className = "project-title repo-title";
  title.textContent = repository.name;

  const description = document.createElement("p");
  description.className = "project-category";
  description.textContent = repository.description || "No description provided.";

  link.append(preview, title, description);
  item.append(link);
  return item;
};

const filterRepositories = function (category) {
  const items = repositoriesList.querySelectorAll("[data-filter-item]");
  items.forEach((item) => {
    item.classList.toggle("active", category === "all" || item.dataset.category === category);
  });
};

const createRepositoryFilters = function (repositories) {
  const languages = [...new Set(repositories.map((repository) => repository.language || "Other"))]
    .sort((first, second) => first.localeCompare(second));

  languages.forEach((language) => {
    const item = document.createElement("li");
    item.className = "filter-item";

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.repositoryFilter = language.toLowerCase();
    button.textContent = language;
    button.addEventListener("click", function () {
      repositoryFilters.querySelector(".active")?.classList.remove("active");
      button.classList.add("active");
      filterRepositories(button.dataset.repositoryFilter);
    });

    item.append(button);
    repositoryFilters.append(item);
  });

  const allFilter = repositoryFilters.querySelector('[data-repository-filter="all"]');
  allFilter.addEventListener("click", function () {
    repositoryFilters.querySelector(".active")?.classList.remove("active");
    allFilter.classList.add("active");
    filterRepositories("all");
  });
};

const loadRepositories = async function () {
  try {
    const response = await fetch("https://api.github.com/users/MARIOREDFOX/repos?per_page=100&sort=updated", {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) {
      throw new Error(`GitHub returned HTTP ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("GitHub returned an unexpected repository list.");
    }

    const originalRepositories = repositories.filter((repository) =>
      repository &&
      repository.fork === false &&
      typeof repository.name === "string" &&
      typeof repository.html_url === "string" &&
      repository.html_url.startsWith("https://github.com/")
    );
    const repositoriesByName = new Map(
      originalRepositories.map((repository) => [repository.name.toLowerCase(), repository])
    );
    const validRepositories = featuredRepositoryNames
      .map((name) => repositoriesByName.get(name.toLowerCase()))
      .filter(Boolean);

    createRepositoryFilters(validRepositories);
    repositoriesList.replaceChildren(...validRepositories.map(createRepositoryCard));

    if (validRepositories.length === 0) {
      repositoriesStatus.textContent = "None of the selected repositories were returned by GitHub. Visit GitHub to view your repositories.";
      return;
    }

    repositoriesStatus.textContent = `Showing ${validRepositories.length} selected repositories.`;
    repositoriesStatus.dataset.state = "loaded";
  } catch (error) {
    repositoriesStatus.dataset.state = "error";
    repositoriesStatus.textContent = `Unable to load repositories from GitHub: ${error.message}. Please try again later or browse them on GitHub.`;
  }
};

loadRepositories();



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}
