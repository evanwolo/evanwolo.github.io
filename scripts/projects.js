const githubUsername = "evanwolo";

const projects = [
    { name: "Fantasy Sports Platform", tech: ["Java", "Spring"], description: "A customizable fantasy baseball platform.", repo: `https://github.com/${githubUsername}/fantasy-sports-platform` },
    { name: "Blockchain in Rust", tech: ["Rust"], description: "A Rust-based blockchain implementation.", repo: `https://github.com/${githubUsername}/blockchain-in-rust` },
    { name: "Crypto Wallet", tech: ["Blockchain"], description: "Secure wallet for STM32 with Rust integration.", repo: `https://github.com/${githubUsername}/crypto-wallet` },
    { name: "Audio DAW", tech: ["Rust"], description: "Command-line DAW for MIDI and analog input.", repo: `https://github.com/${githubUsername}/audio-daw` },
];

let filters = {
    searchQuery: "",
    tech: [],
    mode: "inclusive" // "inclusive" or "exclusive"
};

function extractUniqueTechnologies() {
    const techSet = new Set();
    projects.forEach(proj => {
        proj.tech.forEach(t => techSet.add(t));
    });
    return Array.from(techSet);
}

function displayFilters() {
    const filtersContainer = document.getElementById("filters-container");
    filtersContainer.innerHTML = ""; // Clear previous filters

    // Add "All" filter button
    const allButton = document.createElement("button");
    allButton.textContent = "All";
    allButton.onclick = () => filterProjects("all", allButton);
    filtersContainer.appendChild(allButton);

    const uniqueTechnologies = extractUniqueTechnologies();
    uniqueTechnologies.forEach(tech => {
        const filterButton = document.createElement("button");
        filterButton.textContent = tech;
        filterButton.onclick = () => toggleFilter(tech, filterButton);
        filtersContainer.appendChild(filterButton);
    });

    // Add toggle button for inclusive/exclusive mode
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "Toggle Mode (Inclusive)";
    toggleButton.onclick = () => toggleMode(toggleButton);
    filtersContainer.appendChild(toggleButton);
}

function displayProjects() {
    const container = document.getElementById("projects-container");
    container.innerHTML = ""; // Clear previous projects

    const filteredProjects = projects.filter(proj => {
        const matchesSearch = proj.name.toLowerCase().startsWith(filters.searchQuery.toLowerCase());
        if (filters.tech.length === 0 || filters.tech.includes("all")) {
            return matchesSearch;
        }

        const matchesTech = filters.tech.every(t => proj.tech.includes(t));
        const matchesTechExclusive = filters.tech.some(t => proj.tech.includes(t));

        return matchesSearch && (filters.mode === "inclusive" ? matchesTech : matchesTechExclusive);
    });

    filteredProjects.forEach(proj => {
        const card = document.createElement("div");
        card.classList.add("project-card");
        card.innerHTML = `
            <h3><a href="${proj.repo}" target="_blank">${proj.name}</a></h3>
            <p>${proj.description}</p>
            <p><strong>Tech:</strong> ${proj.tech.join(', ')}</p>
        `;
        container.appendChild(card);
    });
}

function toggleFilter(tech, button) {
    // Deselect "All" filter if any other filter is selected
    const allButton = document.querySelector("#filters-container button:first-child");
    if (filters.tech.includes("all")) {
        filters.tech = filters.tech.filter(t => t !== "all");
        allButton.classList.remove("selected-filter");
    }

    if (filters.tech.includes(tech)) {
        filters.tech = filters.tech.filter(t => t !== tech);
        button.classList.remove("selected-filter");
    } else {
        filters.tech.push(tech);
        button.classList.add("selected-filter");
    }
    displayProjects();
}

function filterProjects(tech, button) {
    if (tech === "all") {
        filters.tech = [];
        const filterButtons = document.querySelectorAll("#filters-container button");
        filterButtons.forEach(btn => btn.classList.remove("selected-filter"));
        button.classList.add("selected-filter");
    } else {
        toggleFilter(tech, button);
    }
    displayProjects();
}

function toggleMode(button) {
    filters.mode = filters.mode === "inclusive" ? "exclusive" : "inclusive";
    button.textContent = `Toggle Mode (${filters.mode.charAt(0).toUpperCase() + filters.mode.slice(1)})`;
    displayProjects();
}

// Function to handle search input
function handleSearch(event) {
    filters.searchQuery = event.target.value;
    displayProjects();
}

// Attach event listener to search bar
document.getElementById("search-bar").addEventListener("input", handleSearch);

// Load all projects and filters on page load
window.onload = () => {
    displayFilters();
    displayProjects();
};