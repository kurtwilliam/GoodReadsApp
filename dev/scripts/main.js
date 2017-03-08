const bookApp = {};

const dbRef = firebase.database().ref();

dbRef.push('hello!');

bookApp.init = function(){
	bookApp.findBooks();
};

const goodreadsKey = '3Hm2ArDCENyN8Hp1Xu8GBQ';

bookApp.findBooks = function(){
$.ajax({
		url:"http://proxy.hackeryou.com",
		method:"GET",
		dataType:"json",
		data: {
			reqUrl:'https://www.goodreads.com/search/index.xml',
			params: {
				// q: "Zadie Smith",
				key: goodreadsKey,
				search: "author"
			},
			xmlToJSON: true,
		}
	}).then(function(res){
		const bookInfo = res.GoodreadsResponse.search.results.work;
		
		bookApp.displayInfo(bookInfo);
	});
};

bookApp.displayInfo = function(books) {
	const filteredBooks = books.filter(function(book){
		return book.best_book.author.name === "Zadie Smith"
	});
	filteredBooks.forEach(function(bookInfo){
		// const author = $('<h3>').text(authorInfo.best_book.author.name);
		// const authorName = authorInfo.best_book.author.name;
		const title = $('<h2>').text(bookInfo.best_book.title);
		const image = $('<img>').attr("src", bookInfo.best_book.image_url);

		const bookList = $('<div class="bookDiv">').append(title, image);
		
		$('.booksToDiscover').append(bookList);
		});
	};


$(function(){
	bookApp.init();
});
