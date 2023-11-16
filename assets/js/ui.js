const searchForm = document.querySelector("#mainSearchForm");
const searchInput = document.querySelector("#mainSearchInput");
const SearchInputBtnClear = document.querySelector("#mainSearchInputBtnClear");

searchForm.addEventListener('click', () => {
	searchForm.classList.add("focused");
	searchInput.focus();
})

searchInput.addEventListener('blur', () => {
	searchForm.classList.remove("focused");
})

searchInput.addEventListener("input", () => {
	if (searchInput.value != "") {
		SearchInputBtnClear.classList.add("visible");
	} else {
		SearchInputBtnClear.classList.remove("visible");
	}
})

SearchInputBtnClear.addEventListener('click', () => {
	searchInput.value = "";
	SearchInputBtnClear.classList.remove("visible");
})