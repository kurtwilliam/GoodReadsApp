

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyAh0zkAQ0D0JcZzn6-hfmB9Wcsz8BLg0Yw",
    authDomain: "good-reads-ad835.firebaseapp.com",
    databaseURL: "https://good-reads-ad835.firebaseio.com",
    storageBucket: "good-reads-ad835.appspot.com",
    messagingSenderId: "476385763960"
  };
  firebase.initializeApp(config);

const dbRef = firebase.database().ref();

dbRef.push('hello!');

const bookApp = {};

bookApp.init = function(){
	bookApp.events();
	bookApp.findBooks();
};

const goodreadsKey = '3Hm2ArDCENyN8Hp1Xu8GBQ';

bookApp.events = function(){
	$("#userSearch").submit(function(e){
		e.preventDefault();
		$(".booksToDiscover").empty();
	let authorName = $("#search").val();

	bookApp.findBooks(authorName);
});
};


bookApp.findBooks = function(authorName){
$.ajax({
		url:"http://proxy.hackeryou.com",
		method:"GET",
		dataType:"json",
		data: {
			reqUrl:'https://www.goodreads.com/search/index.xml',
			params: {
				q: authorName,
				key: goodreadsKey,
				search: "author"
			},
			xmlToJSON: true,
		}
	}).then(function(res){
		let bookInfo = res.GoodreadsResponse.search.results.work;
		bookApp.displayInfo(bookInfo);
	});
};

bookApp.displayInfo = function(books) {
	let filteredBooks = books.filter(function(book){
		let authorName = $("#search").val();
		return book.best_book.author.name === authorName;
	});
	filteredBooks.forEach(function(bookInfo){
		// const author = $('<h3>').text(authorInfo.best_book.author.name);
		// const authorName = authorInfo.best_book.author.name;
		let title = $('<h2>').text(bookInfo.best_book.title);
		let image = $('<img>').attr("src", bookInfo.best_book.image_url);

		let bookList = $('<div class="bookDiv">').append(title, image);
		
		$('.booksToDiscover').append(bookList);
		});
	};


$(function(){
	bookApp.init();
});
