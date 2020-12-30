const init = async () => {
    document.addEventListener("DOMContentLoaded", function () {
        const body = document.querySelector("body");

        // Burger
        const burger = document.querySelector(".burger"),
            nav = document.querySelector(".navbar"),
            navLinks = nav.querySelectorAll("a");
        
        burger.addEventListener("click", function () {
            toggleClass(burger, "is-active");
            toggleClass(nav, "is-active");
        });

        navLinks.forEach(link => {
            link.addEventListener("click", function () {
                if (burger.classList.contains("is-active")) {
                    toggleClass(burger, "is-active");
                    toggleClass(nav, "is-active");
                }
            });
        });

        // Utilities
        const utilitiesDiv = document.querySelector(".utilities");

        // Theme
        const themeBtn = utilitiesDiv.querySelector(".theme");
        updateTheme();

        themeBtn.addEventListener("click", function () {
            const DBTheme = localStorage.getItem("theme") || "light";
            if (DBTheme === "light") localStorage.setItem("theme", "dark");
            else localStorage.setItem("theme", "light");
            updateTheme();
        });

        function updateTheme () {
            const bodyTheme = body.getAttribute("data-theme") || "light";
            const DBTheme = localStorage.getItem("theme") || "light";

            if (DBTheme === "dark" && bodyTheme !== "dark") {
                body.setAttribute("data-theme", "dark");
                themeBtn.innerHTML = "<i class=\"fas fa-sun\"></i>";
            } else if (DBTheme === "light" && bodyTheme !== "light") {
                body.setAttribute("data-theme", "light");
                themeBtn.innerHTML = "<i class=\"fas fa-moon\"></i>";
            }
        }

        makeSearch();
    });

    function toggleClass(element, className) {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        } else {
            element.classList.add(className);
        }
    }

    async function makeSearch() {
        const searchData = await fetch("search.json");
        const data = await searchData.json();
        const textbox = document.getElementById("search-box");
        const results = document.getElementById("search-results");
        const fuse = new Fuse(data, {
            includeScore: true,
            keys: ['name']
        });
        textbox.addEventListener("change", textboxhandle);
        textbox.addEventListener("keydown", textboxhandle);
        textbox.addEventListener("keyup", textboxhandle);
        textbox.addEventListener("keypress", textboxhandle);
        function textboxhandle() {
            const val = textbox.value.trim();
            if(val.length) {
                const items = fuse.search(val);
                let resHtml = "";
                if(items.length) {
                    items.sort((a, b) => b.score - a.score).forEach(({ item }) => {
                        resHtml += `<p onclick="this.querySelector('a').click()">${item.name}${item.url}</p>`;
                    });
                } else {
                    resHtml += "<p>No result</p>"
                }
                results.innerHTML = resHtml;
                results.style.display = "block";
            } else {
                results.innerHTML = "";
                results.style.display = "none";
            }
        }
    }
}

init();