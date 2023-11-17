// ---------- Stop form sending (start) ---------- //
function stopSendForm(e) {
	e.preventDefault(); 
	return false;
};
// ---------- Stop form sending (end) ---------- //

// ---------- Search similar (start) ---------- //
document.querySelector("#mainSearchInput").addEventListener("keyup", function(event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		search();
	}
});
// ---------- Search similar (end) ---------- //

// ---------- Enter click (start) ---------- //
function findSimilar(btnOb) {
	console.log(btnOb)
	let url = btnOb.closest(".repository").querySelector(".repository__title__name").getAttribute('href');
	document.querySelector("#mainSearchInput").value = url;
	search();
}

// ---------- Enter click (end) ---------- //


var keywords = ''	// список ключевых слов


// -- Безполезно если на самой странице не будут отображаться ключевые слова и если их нельзя удалить -- //
/*function del_keyword(element) {
  console.log(element)
  keywords = keywords.filter(function(f) {
    return f !== element
  })
  console.log(keywords)


  document.querySelector('#results__block').innerHTML = ''
  //document.querySelector('#keywords').innerHTML = ''

  var topic = ''
  keywords.forEach((keyword) => {
    topic += keyword + '+';
    //document.querySelector('#keywords').innerHTML 
    //+= '<div class="keyword" onclick="del_keyword(\'' + keyword.trimStart() + '\');"><h4>' + keyword + '</h4></div>'
  })
  topic = topic.slice(0, -1)
  console.log(topic)

  var apiUrlSearch = 'https://api.github.com/search/repositories?q=topic:' + topic + '&sort=stars&order=desc'
  console.log('search apiUrl: ' + apiUrlSearch);

  fetch(apiUrlSearch)
  .then(response => response.json())
  .then(data => {
    console.log(data)

    data.items.forEach((elem) => {
      console.log(elem)
      document.querySelector('#results__block').innerHTML += card(elem)
      //console.log(card(elem))
    })
  })
  .catch(error => console.error(error));}*/


// ---------- Repository card (start) ---------- //
function card(data) {
	// console.log(data)

	let html = `
	
	<div class="repository">
		<div class="repository__descr-block">
			<div class="repository__title">
				<img src="${data.owner.avatar_url}" class="repository__title__avatar">
				<a href="${data.html_url}" class="repository__title__name">${data.full_name}</a>
			</div>
			<p class="repository__descr">${data.description}</p>
			<div class="repository__footer">
				<div class="repository__footer__lang">${data.language}</div>
				<div class="repository__footer__stars">
					<svg viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z" fill="#656D76"></path></svg>
					${data.watchers}
				</div>
				<div class="repository__footer__update">${data.updated_at}</div>
			</div>
		</div>
		<div class="btn search-similar" onclick='findSimilar(this);'>
			<svg class="header__search-form__icon" viewBox="0 0 16 16"><path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"></path></svg>
			Similar
		</div>
		</div>
	</div>`;

  return html;}
// ---------- Repository card (end) ---------- //


// ---------- Search (start) ---------- //
function search() {

  document.querySelector('#results__block').innerHTML = ''
  //document.querySelector('#keywords').innerHTML = ''

  var repoUrl = document.querySelector('#mainSearchInput').value;
  console.log("repoUrl: " + repoUrl);

  var urlParts = repoUrl.split('/');
  var owner = urlParts[3];
  var repo = urlParts[4];
  console.log('owner: ', owner);
  console.log('repo: ', repo);

  var apiUrlTopic = 'https://api.github.com/repos/' + owner + '/' + repo + '/topics';
  console.log('topics apiUrl: ' + apiUrlTopic);

  var data
  fetch(apiUrlTopic)
  .then(response => response.json())
  .then(data => {
    console.log(data)

    var topic = '';
    keywords = data.names
    data.names.forEach((elem) => {
      topic += elem + '+';
      //document.querySelector('#keywords').innerHTML 
      //+= '<div class="keyword" onclick="del_keyword(\'' + elem.trimStart() + '\');"><h4>' + elem + '</h4></div>'
    })
    topic = topic.slice(0, -1)
    console.log(topic)

    var apiUrlSearch = 'https://api.github.com/search/repositories?q=topic:' + topic + '&sort=stars&order=desc'
    console.log('search apiUrl: ' + apiUrlSearch);

    fetch(apiUrlSearch)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      document.querySelector('#CountResults').innerText = data.total_count

      data.items.forEach((elem) => {
        console.log(elem)
        document.querySelector('#results__block').innerHTML += card(elem)
        console.log(card(elem))
      })
    })
    .catch(error => console.error(error));
  })
  .catch(error => console.error(error));

  findSearchSimilarBtns();
  return false;}
// ---------- Search (start) ---------- //
