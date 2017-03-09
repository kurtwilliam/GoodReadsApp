

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
};

const goodreadsKey = '3Hm2ArDCENyN8Hp1Xu8GBQ';

bookApp.events = function(){
	$("#userSearch").submit(function(e){
		e.preventDefault();
		$(".booksToDiscover").empty();
	let authorName = $("#search").val();

	bookApp.findAuthor(authorName);
});
};


bookApp.findAuthor = function(authorName){
$.ajax({
		url:"http://proxy.hackeryou.com",
		method:"GET",
		dataType:"json",
		data: {
			reqUrl:`https://www.goodreads.com/api/author_url/<${authorName}>`,
			params: {
				id: authorName,
				key: goodreadsKey,
			},
			xmlToJSON: true,
		}
	}).then(function(res){
		let authorID = res.GoodreadsResponse.author.id;
		bookApp.findBooks(authorID);
	});
};

bookApp.getMoreBooks = function(authorID,pageNum) {
	return $.ajax({
		url:"http://proxy.hackeryou.com",
		method:"GET",
		dataType:"json",
		data: {
			reqUrl:'https://www.goodreads.com/author/list.xml',
			params: {
				id: authorID,
				key: goodreadsKey,
				page: pageNum
			},
			xmlToJSON: true,
		}
	});
};

bookApp.findBooks = function(authorID){
	$.ajax({
		url:"http://proxy.hackeryou.com",
		method:"GET",
		dataType:"json",
		data: {
			reqUrl:'https://www.goodreads.com/author/list.xml',
			params: {
				id: authorID,
				key: goodreadsKey
			},
			xmlToJSON: true,
		}
	}).then(function(res){
		res = res.GoodreadsResponse;
		const totalBooks = res.author.books.total;
		const pageNums = Math.ceil(totalBooks/30);
		if(totalBooks < 30) {

		}
		else {
			//run a call until currentPage === pageNum
			//then get all the data
			const pageCalls = [];
			for(let i = 2; i <= pageNums; i++) {
				pageCalls.push( bookApp.getMoreBooks( authorID, i ) )
			}
			$.when(...pageCalls)
				.then((...bookData) => {
					bookData = bookData.map(books => books[0])
					console.log(bookData);
				});
		}
		// let author = res.GoodreadsResponse.author.name;
		// let title = res.GoodreadsResponse.author.books.book.title;
		// let image = res.GoodreadsResponse.author.book.book.image_url;
		// bookApp.displayInfo(bookInfo);
		console.log(res);
	});
};


// bookApp.displayInfo = function(books) {
// 	// let filteredBooks = books.filter(function(book){
// 	// 	let authorName = $("#search").val();
// 	// 	return book.best_book.author.name === authorName;
// 	// });
// 	filteredBooks.forEach(function(bookInfo){
// 		// const author = $('<h3>').text(authorInfo.best_book.author.name);
// 		// const authorName = authorInfo.best_book.author.name;
// 		let titleDisp = $('<h2>').text(title);
// 		let imagDisp = $('<img>').attr("src", image);

// 		let bookList = $('<div class="bookDiv">').append(titleDisp, imageDisps);
		
// 		$('.booksToDiscover').append(bookList);
// 		});
// 	};


$(function(){
	bookApp.init();
});
