async function getRequest(searchText) {
  if (!searchText.trim()) {
    document.querySelector(".search__autocomplete").innerHTML = "";
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${searchText}&per_page=5`
    );
    const result = await response.json();
    const autocompleteBox = document.querySelector(".search__autocomplete");
    autocompleteBox.innerHTML = "";

    console.log(result.items);

    result.items.slice(0, 5).forEach((repo) => {
      const item = document.createElement("li");
      item.classList.add("search__autocomplete-item");
      item.textContent = repo.name;

      item.dataset.name = repo.name;
      item.dataset.owner = repo.owner.login;
      item.dataset.stars = repo.stargazers_count;

      autocompleteBox.appendChild(item);
    });
  } catch (error) {
    console.error("Error in getRequest:", error);
  }
}

const debounce = (fn, debounceTime) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), debounceTime);
  };
};

document.querySelector(".search__input").addEventListener(
  "keyup",
  debounce(() => {
    const searchText = document.querySelector(".search__input").value.trim();
    getRequest(searchText);
  }, 400)
);

document
  .querySelector(".search__autocomplete")
  .addEventListener("click", function (event) {
    const closestMenuItem = event.target.closest(".search__autocomplete-item");

    if (closestMenuItem) {
      const repoName = closestMenuItem.dataset.name;
      const repoOwner = closestMenuItem.dataset.owner;
      const stars = closestMenuItem.dataset.stars;

      document.querySelector(".search__input").value = "";
      document.querySelector(".search__autocomplete").innerHTML = "";

      const resultItem = document.createElement("div");
      resultItem.classList.add("repo-list__item");
      resultItem.insertAdjacentHTML(
        "beforeend",
        `
      <div>
        <div>Name: ${repoName}</div>
        <div>Owner: ${repoOwner}</div>
        <div>Stars: ${stars}</div>
      </div>
      <div class="repo-list__remove"></div>
    `
      );

      document.querySelector(".repo-list").appendChild(resultItem);

      resultItem
        .querySelector(".repo-list__remove")
        .addEventListener("click", () => {
          resultItem.remove();
        });
    }
  });

document
  .querySelector(".search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });
