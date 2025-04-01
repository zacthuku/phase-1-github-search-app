document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const repoList = document.getElementById("repos-list");
    const searchTypeToggle = document.getElementById("search-type-toggle");
    let searchType = "users"; // Default search type
  
    // Toggle between searching users and repos
    searchTypeToggle.addEventListener("click", () => {
      searchType = searchType === "users" ? "repositories" : "users";
      searchTypeToggle.textContent = `Search for ${searchType === "users" ? "Users" : "Repositories"}`;
    });
  
    form.addEventListener("submit", event => {
      event.preventDefault();
      const query = searchInput.value;
      userList.innerHTML = "";
      repoList.innerHTML = "";
      
      if (searchType === "users") {
        searchUsers(query);
      } else {
        searchRepositories(query);
      }
    });
  
    function searchUsers(query) {
      fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: { Accept: "application/vnd.github.v3+json" }
      })
        .then(response => response.json())
        .then(data => {
          data.items.forEach(user => {
            const li = document.createElement("li");
            li.innerHTML = `
              <img src="${user.avatar_url}" width="50" height="50" />
              <a href="${user.html_url}" target="_blank">${user.login}</a>
              <button data-username="${user.login}">View Repos</button>
            `;
            userList.appendChild(li);
  
            li.querySelector("button").addEventListener("click", () => {
              fetchUserRepos(user.login);
            });
          });
        });
    }
  
    function fetchUserRepos(username) {
      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: { Accept: "application/vnd.github.v3+json" }
      })
        .then(response => response.json())
        .then(repos => {
          repoList.innerHTML = "";
          repos.forEach(repo => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
            repoList.appendChild(li);
          });
        });
    }
  
    function searchRepositories(query) {
      fetch(`https://api.github.com/search/repositories?q=${query}`, {
        headers: { Accept: "application/vnd.github.v3+json" }
      })
        .then(response => response.json())
        .then(data => {
          repoList.innerHTML = "";
          data.items.forEach(repo => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name} (by ${repo.owner.login})</a>`;
            repoList.appendChild(li);
          });
        });
    }
  });
  