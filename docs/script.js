let games = {};
let tags = [];
const selectedTags = new Set();

const tagSearch = document.querySelector('#tag-search');
const dropdown = document.querySelector('#dropdown');
const gameList = document.querySelector('#games-list');
const noMatches = document.querySelector('#no-matches');
const selectedTagsDiv = document.querySelector('#selected-tags');
const gamesContainer = document.querySelector('#games-list');

function displayGames(gameData) {
    Object.keys(gameData).sort().forEach(game => {
        const newGameItem = document.createElement('li');
        newGameItem.classList.add('game-item');
        const gameLink = document.createElement('a');
        gameLink.href = `https://store.steampowered.com/app/${gameData[game].id}`;
        gameLink.target = '_blank';
        gameLink.textContent = game;
        gameLink.title = gameData[game]['launcher'].sort().join(', ');
        newGameItem.appendChild(gameLink);
        gamesContainer.appendChild(newGameItem);
    });
}

function showDropdownTags() {
    const query = tagSearch.value.toLowerCase();
    dropdown.replaceChildren();
    const matches = tags.filter(tag => tag.toLowerCase().includes(query)).slice(0, 10);
    matches.forEach(tag => {
        const option = document.createElement('div');
        option.textContent = tag;
        option.addEventListener('click', () => selectTag(tag));
        dropdown.appendChild(option);
    });
    dropdown.style.display = matches.length ? 'block' : 'none';
}

function selectTag(tag) {
    selectedTags.add(tag);
    updateSelectedTags();
    updateGameList();
    tagSearch.value = '';
    dropdown.replaceChildren();
    dropdown.style.display = 'none';
}

function updateSelectedTags() {
    console.log(`Selected Tags: ${[...selectedTags]}`);
    selectedTagsDiv.replaceChildren();
    selectedTags.forEach(tag => {
        const tagBox = document.createElement('div');
        tagBox.classList.add('tag-box');
        tagBox.textContent = tag;
        const closeBtn = document.createElement('span');
        closeBtn.textContent = ' X';
        closeBtn.addEventListener('click', () => {
            selectedTags.delete(tag);
            updateSelectedTags();
            updateGameList();
        });
        tagBox.appendChild(closeBtn);
        selectedTagsDiv.appendChild(tagBox);
    });
}

function updateGameList() {
    gamesContainer.replaceChildren();
    const filteredGames = Object.keys(games).filter(gameName => 
        [...selectedTags].every(tag => games[gameName].tags.includes(tag))
    ).reduce((filteredObj, gameName) => {
        filteredObj[gameName] = games[gameName];
        return filteredObj;
    }, {});
    console.log(`Found Games: ${Object.keys(filteredGames).length}`);
    if (Object.keys(filteredGames).length) {
        displayGames(filteredGames);
        noMatches.style.display = 'none';
    }
    else {
        noMatches.style.display = 'block';
    }
}

tagSearch.addEventListener('keyup', showDropdownTags);

fetch('data/games.json')
    .then(response => response.json())
    .then(data => {
        games = data['match'];
        tags = data['all tags'];
    }); 