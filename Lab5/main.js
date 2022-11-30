function createAuthorElement(record) {
    let user = record.user || { 'name': { 'first': '', 'last': '' } };
    let authorElement = document.createElement('div');
    authorElement.classList.add('author-name');
    authorElement.innerHTML = user.name.first + ' ' + user.name.last;
    return authorElement;
}

function createUpvotesElement(record) {
    let upvotesElement = document.createElement('div');
    upvotesElement.classList.add('upvotes');
    upvotesElement.innerHTML = record.upvotes;
    return upvotesElement;
}

function createFooterElement(record) {
    let footerElement = document.createElement('div');
    footerElement.classList.add('item-footer');
    footerElement.append(createAuthorElement(record));
    footerElement.append(createUpvotesElement(record));
    return footerElement;
}

function createContentElement(record) {
    let contentElement = document.createElement('div');
    contentElement.classList.add('item-content');
    contentElement.innerHTML = record.text;
    return contentElement;
}

function createListItemElement(record) {
    let itemElement = document.createElement('div');
    itemElement.classList.add('facts-list-item');
    itemElement.append(createContentElement(record));
    itemElement.append(createFooterElement(record));
    return itemElement;
}

function renderRecords(records) {
    let factsList = document.querySelector('.facts-list');
    factsList.innerHTML = '';
    for (let i = 0; i < records.length; i++) {
        factsList.append(createListItemElement(records[i]));
    }
}

function setPaginationInfo(info) {
    document.querySelector('.total-count').innerHTML = info.total_count;
    let start = info.total_count && (info.current_page - 1) * info.per_page + 1;
    document.querySelector('.current-interval-start').innerHTML = start;
    let end = Math.min(info.total_count, start + info.per_page - 1);
    document.querySelector('.current-interval-end').innerHTML = end;
}

function createPageBtn(page, classes = []) {
    let btn = document.createElement('button');
    classes.push('btn');
    for (cls of classes) {
        btn.classList.add(cls);
    }
    btn.dataset.page = page;
    btn.innerHTML = page;
    return btn;
}

function renderPaginationElement(info) {
    let btn;
    let paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    btn = createPageBtn(1, ['first-page-btn']);
    btn.innerHTML = 'Первая страница';
    if (info.current_page == 1) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);

    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('pages-btns');
    paginationContainer.append(buttonsContainer);

    let start = Math.max(info.current_page - 2, 1);
    let end = Math.min(info.current_page + 2, info.total_pages);
    for (let i = start; i <= end; i++) {
        btn = createPageBtn(i, i == info.current_page ? ['active'] : []);
        buttonsContainer.append(btn);
    }

    btn = createPageBtn(info.total_pages, ['last-page-btn']);
    btn.innerHTML = 'Последняя страница';
    if (info.current_page == info.total_pages) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);
}

function downloadData(page = 1, qParam = "") {
    let factsList = document.querySelector('.facts-list');
    let url = new URL(factsList.dataset.url);
    let perPage = document.querySelector('.per-page-btn').value;
    url.searchParams.append('page', page);
    url.searchParams.append('per-page', perPage);
    url.searchParams.append("q", qParam);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        renderRecords(this.response.records);
        setPaginationInfo(this.response['_pagination']);
        renderPaginationElement(this.response['_pagination']);
    };
    xhr.send();
}

function perPageBtnHandler(event) {
    let qParam = document.querySelector('.search-field');
    downloadData(1, qParam.value);
}

function pageBtnHandler(event) {
    let qParam = document.querySelector('.search-field');
    if (event.target.dataset.page) {
        downloadData(event.target.dataset.page, qParam.value);
        window.scrollTo(0, 0);
    }
}

function searchBtnHandler(event) {
    let qParam = document.querySelector('.search-field');
    document.querySelector('.dropdown-list').style.display = "none";
    downloadData(1, qParam.value);
    
}

function createSearchElement(word) {
    let searchForm = document.querySelector('.dropdown-list');
    let elem = document.createElement('p');
    elem.textContent = word;
    searchForm.append(elem);
}

function dropListClickHandler(event) {
    if (event.target.classList.contains("dropdown-list")) return;
    let input = document.querySelector('.search-field');
    input.value = event.target.textContent;
    document.querySelector('.dropdown-list').innerHTML = "";
    document.querySelector('.dropdown-list').style.display = "none";
}

function autoCompleteInput(event) {
    let input = document.querySelector('.search-field');
    let url = 
    new URL('http://cat-facts-api.std-900.ist.mospolytech.ru/autocomplete');
    url.searchParams.append('q', input.value);
    let dropDownList = document.querySelector('.dropdown-list');
    dropDownList.innerHTML = "";
    dropDownList.style.display = "block";
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    
    xhr.send();
    xhr.onload = function () {
        let end = xhr.response.length > 10 ? 10 : xhr.response.length;
        for (let i = 0; i < end; i++) {
            createSearchElement(xhr.response[i]);
        }
        console.log(xhr.response.length);
    };  
}

window.onload = function () {
    downloadData();
    document.querySelector('.pagination').onclick = pageBtnHandler;
    document.querySelector('.per-page-btn').onchange = perPageBtnHandler;
    document.querySelector('.search-btn').onclick = searchBtnHandler;
    document.querySelector('.search-field').oninput = autoCompleteInput;
    let field = document.querySelector('.search-field');
    field.addEventListener('keydown', function(e) {
        if (e.keyCode == 13) downloadData(1, field.value);
        document.querySelector('.dropdown-list').innerHTML = "";
        document.querySelector('.dropdown-list').style.display = "none";
    });
    document.querySelector('.dropdown-list').onclick = dropListClickHandler;
};