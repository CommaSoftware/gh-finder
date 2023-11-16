// ---------- Search Form (start) ---------- //
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
// ---------- Search Form (end) ---------- //


// ---------- Transform header (start) ---------- //
const tempBtn = document.querySelector("#BtnChooseRepo");
const body = document.querySelector("body");

searchInput.addEventListener('keyup', (e) => {
	if (e.keyCode === 13) {
		body.classList.add("searching");
  }
})

// ---------- Transform header (end) ---------- //