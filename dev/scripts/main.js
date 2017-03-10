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



// ADD TO COLLECTION BUTTON
// 1. Check if user is signed in!
//	2. If signed in, add to collection
// 3. If not signed in, pop up modal appears
// 4. User chooses to sign in or sign up
// 5. Depending on button press a sign in/up form appears

// user creates acct (enters something for their own key)


const bookApp = {};

bookApp.firebase = function(){
// 	// on submit function, prevent default 
	$('.chosenBook').submit(function(e){
		e.preventDefault();
		$('loginModal').toggleClass('modalHidden');
		// Store data to send to database in a var
		// var chosenBook = 

		// user adds book to their database (send to firebase)
		// dbRef.push('hello!');
		// display on left from firebase
		// button that deletes item from firebase - therefore deleting from our website
	});
};
		// retrieve information from firebase

bookApp.init = function(){
	bookApp.events();
};

const goodreadsKey = '3Hm2ArDCENyN8Hp1Xu8GBQ';

// Upon submission of the form empty the results, style the page (first submission), search the api for results with the value of the users search
bookApp.events = function(){
	$("#userSearch").submit(function(e){
		e.preventDefault();
		$(".booksToDiscover").empty();

		let authorName = $("#search").val();
		// $('header').css("width", "330px");
		$('.header').removeClass('initStyle').addClass('style');
		$('.headerBottom').removeClass('yourBooksHidden').addClass('yourBooks');
		$('main').removeClass('mainHidden');
		$('.signIn').addClass('signInHidden');
		bookApp.findAuthor(authorName);
	});

};

// Make a first call to the API based on the users input (authors name), in submit event above. 
bookApp.findAuthor = function(authorName){
$.ajax({
		url:"http://proxy.hackeryou.com",
		method:"GET",
		dataType:"json",
		data: {
			reqUrl:`https://www.goodreads.com/api/author_url/<${authorName}>`,
			params: {
				id: authorName,
				key: goodreadsKey
			},
			xmlToJSON: true,
		}
	}).then(function(res){
		let authorID = res.GoodreadsResponse.author.id;
		bookApp.findBooks(authorID);
	});
};

// Make a second call to the API to pull the following pages of books, based on bookApp.findBooks
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
		// console.log(res);
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
					res = {
						GoodreadsResponse: {
							Request: res.Request,
							author: res.author
						}
					}
					bookData.unshift(res);
					bookApp.displayInfo(bookData);
				});
		}
		// let author = res.GoodreadsResponse.author.name;
		// let title = res.GoodreadsResponse.author.books.book.title;
		// let image = res.GoodreadsResponse.author.book.book.image_url;
		// bookApp.displayInfo(bookInfo);
		console.log(res);
		};
};


bookApp.displayInfo = function(bookData){
	let goodReadsObjects = bookData.filter(function(bookArray){
		let authorName = $('#search').val();
		return bookArray.GoodreadsResponse.author.name === authorName;
	});
	goodReadsObjects.forEach(function(obj){
		const authorsBooks = obj.GoodreadsResponse.author.books.book;
		authorsBooks.forEach(function(book){

			let bookTitle = $('<h3>').text(book.title);
			console.log
			let bookDescription = $('<p>').text(book.description);
			let bookImage = $('<img>').attr("src", book.image_url);
			let bookButton = $('<button class="chosenBook">').text('Add to Collection');
			let bookDisplay = $('<div class="testDiv">').append(bookTitle, bookImage, bookButton);

			$('.booksToDiscover').append(bookDisplay);
		})
	});
};

$(function(){
	bookApp.init();
});