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

  var data = GetTheSame(repoUrl)
    .then(data => {
      data.forEach((elem) => {
        document.querySelector('#results__block').innerHTML += card(elem)
      })
    })

  //findSearchSimilarBtns();
  return false;
}
// ---------- Search (start) ---------- //
var searchQuery;
var searchFullName;
function ReorderSearch(sender){
  document.querySelector('#results__block').innerHTML = ''
  const [search, order] = sender.value.split('/')
  let href = "https://api.github.com/search/repositories?q=" + searchQuery + (order ? ('&s='+search + '&o=' + order) : "")
  console.log(href)
  fetch(href)
    .then((response) => response.json())
    .then((data) => data.items.filter(repo => repo.full_name != searchFullName))
    .then((data) => {
      data.forEach((elem) => {
        document.querySelector('#results__block').innerHTML += card(elem)
      })
    })
}
async function GetTheSame(href){
  let regexp = /https:\/\/github\.com\/(.*?)\/(.*?)$/
    const [_, ovner, repo] = href.match(regexp)
    let fullName = `${ovner}/${repo}`
    searchFullName = fullName
    let query = await get_search_query(ovner, repo)
    searchQuery = query
    console.log(query)
    const data = await fetch("https://api.github.com/search/repositories?q=" + query)
        .then((response) => response.json())
        .then((data) => data.items)
    return data.filter(repo => repo.full_name != fullName)
}
async function get_search_query(ovner, repo) {
    let data = await ContentCollector.getContent(repo, ovner, "Your_Git_Api_Token");
    let {content, language} = KeyWordsGen.extractKeyWords(data);

    const pom_xml = await fetch(`https://api.github.com/repos/${ovner}/${repo}/contents/pom.xml`)
        .then((response) => response.json())
        .then((data) => data.content ? atob(data.content) : false)
    regexp = /<groupId>(.*?)<\/groupId>|<artifactId>(.*?)<\/artifactId>/g
    const matches = pom_xml ? pom_xml.matchAll(regexp) : []
    let libs = []
    for (const match of matches){
        const lib = (match[1] ?? match[2]).toLowerCase()
        if (libs.includes(lib))
            continue
        libs.push(lib)
    }

    let result = content
        .filter(item => {
            const title = item[Object.keys(item)[0]].toLowerCase()
            if (isNumeric(title))
                return false
            if (title.includes(repo.toLowerCase()) || title.includes(ovner.toLowerCase()))
                return false
            for (const lib of libs)
                if (title.includes(lib))
                    return false
            return true
        })
        .map(item => item[Object.keys(item)[0]])
        .slice(0, 6)
        .join(' OR ')
    result += " language:" + language
    return result
}
function isNumeric(str) {
  if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}
const KeyWordsGen = new class KeyWordsGen {
    extractKeyWords = (data) => {
        let Content = data.content;
        if (!Content) return;
        let stopWords = this.getStopWords();
        stopWords += data.owner;
        //stopWords += data.repo;


        Content.map((letter,index) => Content[index] = letter.toLowerCase());



        let FContent = Content.filter((item) => {
            return !stopWords.includes(item);
        });
        

        let wordCounts = {};

        for (let i = 0; i < FContent.length; i++) {
            let word = FContent[i];
            
            wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1;
        }

        let sortArray = Object.keys(wordCounts).map((key) => ({
            [wordCounts[key]]: key,
        }));

        sortArray.sort((a, b) => {
            let countA = parseInt(Object.keys(a)[0]);
            let countB = parseInt(Object.keys(b)[0]);
            return countB - countA;
        });
        let result = {
            language: data.language,
            owner:data.owner,
            repo: data.repo,
            content:sortArray
        }
        return result;
    };
    getStopWords = () => {
        let stopWords;
        try {
            stopWords = (`a
about
above
across
after
again
against
all
almost
alone
along
already
also
although
always
among
an
and
another
any
anybody
anyone
anything
anywhere
are
area
areas
around
as
ask
asked
asking
asks
at
away
b
back
backed
backing
backs
be
because
become
becomes
became
been
before
began
behind
being
beings
best
better
between
big
both
but
by
c
came
can
cannot
case
cases
certain
certainly
clear
clearly
come
could
d
did
differ
different
differently
do
does
done
down
downed
downing
downs
during
e
each
early
either
end
ended
ending
ends
enough
even
evenly
ever
every
everybody
everyone
everything
everywhere
f
face
faces
fact
facts
far
felt
few
find
finds
first
for
four
from
full
fully
further
furthered
furthering
furthers
g
gave
general
generally
get
gets
give
given
gives
go
going
good
goods
got
great
greater
greatest
group
grouped
grouping
groups
h
had
has
have
having
he
her
herself
here
high
higher
highest
him
himself
his
how
however
i
if
important
in
interest
interested
interesting
interests
into
is
it
its
itself
j
just
k
keep
keeps
kind
knew
know
known
knows
l
large
largely
last
later
latest
least
less
let
lets
like
likely
long
longer
longest
m
made
make
making
man
many
may
me
member
members
men
might
more
most
mostly
mr
mrs
much
must
my
myself
n
necessary
need
needed
needing
needs
never
new
newer
newest
next
no
non
not
nobody
noone
nothing
now
nowhere
number
numbers
o
of
off
often
old
older
oldest
on
once
one
only
open
opened
opening
opens
or
order
ordered
ordering
orders
other
others
our
out
over
p
part
parted
parting
parts
per
perhaps
place
places
point
pointed
pointing
points
possible
present
presented
presenting
presents
problem
problems
put
puts
q
quite
r
rather
really
right
room
rooms
s
said
same
saw
say
says
second
seconds
see
sees
seem
seemed
seeming
seems
several
shall
she
should
show
showed
showing
shows
side
sides
since
small
smaller
smallest
so
some
somebody
someone
something
somewhere
state
states
still
such
sure
t
take
taken
than
that
the
their
them
then
there
therefore
these
they
thing
things
think
thinks
this
those
though
thought
thoughts
three
through
thus
to
today
together
too
took
toward
turn
turned
turning
turns
two
u
under
until
up
upon
us
use
uses
used
v
very
w
want
wanted
wanting
wants
was
way
ways
we
well
wells
went
were
what
when
where
whether
which
while
who
whole
whose
why
will
with
within
without
work
worked
working
works
would
y
year
years
yet
you
young
younger
youngest
your
yours

everyday
today
yesterday
tomorrow
now
then
later
soon
early
late
always
never
often
rarely
sometimes
usually

php
html
twig
c#
java
python
javascript
ruby
swift
kotlin
scala
go
rust
r
perl
lua
typescript
bash
powershell
groovy
fortran
cobol
pascal
ada
lisp
prolog
haskell
erlang
elixir
clojure
dart
f#
julia
shell
assembly
matlab
objective-c
racket
scheme

licensed
licenses
license
https
org
io
github
build
file
image
yml
asf


backend
versatile
feature-rich
dotnet
net6
www
code
community 
maven 
please 
pull 
changes 
user 
issues 
simple 
fork 
branch
framework 
jakarta 
users 
version 
start 
readme 
md 
application 
app 
web 
spring 
boot 
jvm `)
            //console.log(stopWords);
        } catch (e) {
            console.log("Error:", e.stack);
        }
        return stopWords;
    };
}
const ContentCollector = new class ContentCollector {
    getRepositoryInfo = async (owner, repo) => {
        return( new Promise((resolve,reject)=>{
            fetch( `https://api.github.com/repos/${owner}/${repo}`, {headers: {Authorization: `Bearer ${this._authToken}`}})
            .then((response) => response.json())
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                resolve(false);
            });
        }))
    };
    extractWords = (repository) => {
        const keywords = [];
        let nameKeywords;

        try {
             nameKeywords = repository.name.split("-");
        } catch (error) {
            console.log("repository is null");
            return false;
        }
        let description = repository.template_repository?.description ?? repository.description
        const descriptionKeywords = description.match(/\b(\w+)\b/g);

        keywords.push(...nameKeywords, ...descriptionKeywords);

        if (repository.language) {
            keywords.push(repository.language);
            this._repoLanguage = repository.language;
        }

        if (repository.topics) {
            keywords.push(...repository.topics);
        }

        return keywords;
    };
    analyzeRepository = async (owner, repo) => {
        if(!owner ||!repo ) return false;
        const repository = await this.getRepositoryInfo(owner, repo);
        const keywords = this.extractWords(repository);
        return keywords;
    };
    parseReadme = async (owner, repo) => {
        if(!owner ||!repo ) return false;
        return( new Promise((resolve,reject)=>{
            fetch( `https://api.github.com/repos/${owner}/${repo}/readme`, {headers: {Authorization: `Bearer ${this._authToken}`}})
            .then((response) => response.json())
            .then((data) => {
                let readme = Buffer.from(data.content, "base64").toString();
                resolve(readme);
            })
            .catch((error) => {
                resolve(false);
            });
        }))
    };
    GetRepoOwnerByName = (Name) => {
        return( new Promise((resolve,reject)=>{
            fetch(`https://api.github.com/search/repositories?q=${Name}`,  {headers: {Authorization: `Bearer ${this._authToken}`}})
            .then((response) => response.json())
            .then((data) => {
                let findedItem;
                try {
                    findedItem = data.items[0].owner.login;
                } catch (error) {
                    findedItem = false;
                }
                resolve(findedItem);
            })
            .catch((error) => {
                resolve(false);
            });
        }))
    };
    async getContent(RepoName, RepoOwner, AuthToken) {
        let priorityIndex = 4;

        if(!RepoName) return false;
        this._repoName = RepoName;
        this._authToken = AuthToken;

        if(!RepoOwner) 
            this._repoOwner = await this.GetRepoOwnerByName(RepoName);
        else
            this._repoOwner = RepoOwner;
        
        let repoWordsArr = await this.analyzeRepository(this._repoOwner,this._repoName);
        let readmeWords = await this.parseReadme(this._repoOwner,this._repoName);
        var readmeWordsArr = readmeWords ? readmeWords.match(/\b(\w+)\b/g) : [];
        
        //concatinate all data
        let AllContent = repoWordsArr;

        for( let i = 0; i<priorityIndex; i++){
            AllContent = [...AllContent,...repoWordsArr ];
        }
        
        AllContent = [...AllContent, ...readmeWordsArr];

        let result = {
            language: this._repoLanguage,
            owner: this._repoOwner,
            repo: this._repoName,
            content:AllContent
        }
        

        return result;
    }
}