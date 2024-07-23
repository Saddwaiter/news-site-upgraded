document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/apiKey');
    const { apiKey } = await response.json();
    const blogContainer = document.getElementById("blog-container");
    const searchField = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    async function fetchRandomNews() {
        try {
            const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
            console.log("Fetching random news from URL:", apiUrl);
            const response = await fetch(apiUrl, { credentials: 'same-origin' });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data.articles;
        } catch (error) {
            console.error("Error while fetching random news:", error);
            return [];
        }
    }

    searchButton.addEventListener('click', async () => {
        const query = searchField.value.trim();
        if (query !== "") {
            try {
                const articles = await fetchNewsQuery(query);
                displayBlogs(articles);
            } catch (error) {
                console.error("Error fetching news by query:", error);
            }
        }
    });

    async function fetchNewsQuery(query) {
        try {
            const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apiKey=${apiKey}`;
            console.log("Fetching news by query from URL:", apiUrl);
            const response = await fetch(apiUrl, { credentials: 'same-origin' });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data.articles;
        } catch (error) {
            console.error("Error while fetching news by query:", error);
            return [];
        }
    }

    function displayBlogs(articles) {
        blogContainer.innerHTML = "";
        articles.forEach((article) => {
            if (!article.urlToImage || !article.title) {
                return;
            }

            const blogCard = document.createElement("div");
            blogCard.classList.add("blog-card");

            const img = document.createElement("img");
            img.src = article.urlToImage;
            img.alt = article.title;
            blogCard.appendChild(img);

            const title = document.createElement("h2");
            const description = document.createElement("p");

            const truncatedTitle = article.title.length > 30
                ? article.title.slice(0, 30) + '...'
                : article.title;
            title.textContent = truncatedTitle;
            blogCard.appendChild(title);

            if (article.description) {
                const truncatedDesc = article.description.length > 120
                    ? article.description.slice(0, 120) + '...'
                    : article.description;
                description.textContent = truncatedDesc;
                blogCard.appendChild(description);
            }

            blogCard.addEventListener("click", () => {
                window.open(article.url, "_blank");
            });
            blogContainer.appendChild(blogCard);
        });
    }

    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch (error) {
        console.error("Error while fetching random news:", error);
    }
});
