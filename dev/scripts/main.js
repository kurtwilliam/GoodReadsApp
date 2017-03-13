// Initialize Firebase
var config = {
    apiKey: "AIzaSyAh0zkAQ0D0JcZzn6-hfmB9Wcsz8BLg0Yw",
    authDomain: "good-reads-ad835.firebaseapp.com",
    databaseURL: "https://good-reads-ad835.firebaseio.com",
    storageBucket: "good-reads-ad835.appspot.com",
    messagingSenderId: "476385763960"
  };
  firebase.initializeApp(config);


const bookApp = {};

bookApp.firebase = function(){
// on submit function, prevent default 
	$('.user').on('submit', function(e){
		e.preventDefault();
		if ('input[name=user]' !== '') {
			bookApp.username = $('input[name=user]').val();
			bookApp.dbRef = firebase.database().ref(bookApp.username);
			bookApp.showData();
			$('.userInput').val('');
		}

				// Append Data to the .headerBottom class div!
		bookApp.dbRef.on('value', function(data){
			if (bookApp.selectBookTitle !== undefined) {

			
			$('chosenBookEl').empty();
			let chosenBookEl = $('<h4 class="chosenBookEl">').html(`${bookApp.selectBookTitle}`);
			let chosenBookDisp = $('.headerBottom').append(chosenBookEl);
			}
		});
	});
};
	
// retrieve information from firebase
bookApp.showData =function() {
	bookApp.dbRef.on('value', (data) => {
	});
}

bookApp.init = function(){
	bookApp.firebase();
	bookApp.events();
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
		bookApp.selectBookTitle = $(this).attr('value');

		bookApp.dbRef.push(bookApp.selectBookTitle);
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
};


bookApp.displayInfo = function(bookData){
	// filter books to only equal the requested author, but broke early
	// let goodReadsObjects = bookData.filter(function(bookArray){
	// 	let authorName = $('#search').val();
	// 	return bookArray.GoodreadsResponse.author.name === authorName;

	// create global variables for most of the book info, then append info to the page upon submission of the author
	bookData.forEach(function(obj){
		const authorsBooks = obj.GoodreadsResponse.author.books.book;
		authorsBooks.forEach(function(book){

			bookApp.displayTitle = book.title;
			bookApp.bookTitle = $('<h3>').html(book.title);
			bookApp.bookDescription = $('<p>').html(book.description);
			
			let bookImage = $('<img>').attr("src", book.image_url);
			if (book.image_url === "https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png") {
				bookImage = $('<img>').attr("src", "../../Assets/cover-img.png");
			}

			// Make add to collection button appear with value of book title, we an call later
			bookApp.bookButton = $(`<button class="chosenBook" value="${book.title}">`).html('<i class="fa fa-plus-circle" aria-hidden="true"></i>').data({
				title: book.title});

			// Make ? button with value of book info, so we can call it later
			bookApp.descriptionButton = $(`<button class="bookDescript" value="<h3>${book.title}</h3><p>${book.description}</p>">`).html('<i class="fa fa-question-circle" aria-hidden="true"></i>');
			let allButtons = $('<div class="bookIcons">').append(bookApp.descriptionButton, bookApp.bookButton);
			let bookDisplay = $('<div class="bookDiv">').append(bookImage, bookApp.bookTitle, allButtons);
			
			$('.booksToDiscover').append(bookDisplay);
		})
	});
	// Make modal appear on ? button click and append title + description
	$('.bookDescript').click(function(e){
		e.preventDefault();
		let thisBookDesc = $(this).val();
		$('.modalInside').append(thisBookDesc);
		$('.modal').removeClass('modalHidden');
	});
	// Make Modal disappear on ? button click
	$('.modal').click(function(e){
		e.preventDefault();

		$('.modal').addClass('modalHidden');
		// modal.style.display = "block";
		// console.log(this);
		$('.modalInside').empty();
	});
};

// Call function and add loading icon
$(function(){
	bookApp.init();

	const body = $('body');

	$(document).on({
		ajaxStart: function() {body.addClass("loading");},
		ajaxStop: function() {body.removeClass("loading");}
	});
});