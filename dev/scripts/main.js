// Initialize Firebase
var config = {
    apiKey: "AIzaSyAh0zkAQ0D0JcZzn6-hfmB9Wcsz8BLg0Yw",
    authDomain: "good-reads-ad835.firebaseapp.com",
    databaseURL: "https://good-reads-ad835.firebaseio.com",
    storageBucket: "good-reads-ad835.appspot.com",
    messagingSenderId: "476385763960"
  };
  firebase.initializeApp(config);

// FIREBASE New User Sign Up
// firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
// });

// FIREBASE Existing User Sign In
//firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
// });

// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     // User is signed in.
//     var displayName = user.displayName;
//     var email = user.email;
//     var emailVerified = user.emailVerified;
//     var photoURL = user.photoURL;
//     var isAnonymous = user.isAnonymous;
//     var uid = user.uid;
//     var providerData = user.providerData;
//     // ...
//   } else {
//     // User is signed out.
//     // ...
//   }
// });

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
	$('.user').on('submit', function(e){
		e.preventDefault();
		if ('input[name=user]' !== '') {
			bookApp.username = $('input[name=user]').val();
			console.log(bookApp.username);
			bookApp.dbRef = firebase.database().ref(bookApp.username);
			// bookApp.dbRef.push();
			bookApp.showData();
			$('.userInput').val('');
		}
		
		// Store data to send to database in a var
		// var chosenBook = 

		// user adds book to their database (send to firebase)
		// dbRef.push('hello!');
		// display on left from firebase
		// button that deletes item from firebase - therefore deleting from our website
	});
};
	
// retrieve information from firebase
bookApp.showData =function() {
	bookApp.dbRef.on('value', (data) => {
		// console.log(data.val())
	});
}

bookApp.init = function(){
	bookApp.events();
	bookApp.firebase();
};

const goodreadsKey = '3Hm2ArDCENyN8Hp1Xu8GBQ';

// Upon submission of the form empty the results, style the page (first submission), search the api for results with the value of the users search
bookApp.events = function(){
	$(".userSearch").submit(function(e){
		e.preventDefault();
		$(".booksToDiscover").empty();

		let authorName = $("#search").val();
		$('.header').removeClass('initStyle').addClass('style');
		$('.headerBottom').removeClass('yourBooksHidden').addClass('yourBooks');
		$('main').removeClass('mainHidden');
		$('.userInput').addClass('userFormHidden');
		bookApp.findAuthor(authorName);
		// Prevent submission of homepage search if both fields are empty
		// if ($('') {

		// });
	});

	

	// Click event to add to users collection here
	$('.booksToDiscover').on("click", ".chosenBook", function(e){
		e.preventDefault();
		var bookTitle = $(this).attr('value');
		// console.log("title", bookApp.displayTitle);
		bookApp.dbRef.push(bookTitle);

		// Append Data to the .headerBottom class div!
		bookApp.dbRef.on('value', (data) => {
			let chosenBookEl = $('<h4 class="chosenBookEl">').html(`${bookTitle}`);
			// $('.chosenBookEl').remove();
			console.log(chosenBookEl);
			let chosenBookDisp = $('.headerBottom').append(chosenBookEl);

			// let bookImage = $('<img>').attr("src", book.image_url);
			// bookApp.bookButton = $(`<button class="chosenBook" value="${book.title}">`).html('Add to Collection').data({
			// 	title: book.title,	
			// });
			// let bookDisplay = $('<div class="bookSelect">').append(bookApp.bookTitle, bookImage, bookApp.bookButton);
		});
		// const userCollection = firebase.database().ref('/users');

		// userCollection.push({name: 'Rick Sanchez'});
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
		});
};


bookApp.displayInfo = function(bookData){
	let goodReadsObjects = bookData.filter(function(bookArray){
		let authorName = $('#search').val();
		return bookArray.GoodreadsResponse.author.name === authorName;
	});
	goodReadsObjects.forEach(function(obj){
		const authorsBooks = obj.GoodreadsResponse.author.books.book;
		authorsBooks.forEach(function(book){

			bookApp.displayTitle = book.title;
			bookApp.bookTitle = $('<h3>').html(book.title);
			let bookDescription = $('<p>').html(book.description);
			let bookImage = $('<img>').attr("src", book.image_url);
			bookApp.bookButton = $(`<button class="chosenBook" value="${book.title}">`).html('Add to Collection').data({
				title: book.title,	
			});
			let bookDisplay = $('<div class="bookDiv">').append(bookApp.bookTitle, bookImage, bookApp.bookButton);

			$('.booksToDiscover').append(bookDisplay);
			$('.modal').append(bookApp.bookTitle, bookDescription, bookApp.bookButton);
		})
	});
};

$(function(){
	bookApp.init();
});