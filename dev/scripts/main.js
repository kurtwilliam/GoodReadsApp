//on click event on search bar
//search author --> possible Google Autocomplete
//pull author's bibliography --> attempt to avoid redundancy
//bibliography should list:
//book title
//book image
//book synopsis
//select & add book (image) to database --> via FIREBASE
//display chosen books in sidebar

const bookApp = {};

bookApp.init = function(){
	bookApp.findAuthor();
};

const goodreadsKey = '3Hm2ArDCENyN8Hp1Xu8GBQ';

bookApp.findAuthor = function(){
$.ajax({
		url:"http://proxy.hackeryou.com",
		method:"GET",
		dataType:"json",
		data: {
			reqUrl:'https://www.goodreads.com/api/author_url/<ID>',
			params: {
				key: goodreadsKey,
				title: "Orson Scott Card"
			},
			xmlToJSON: !0,
		}
	}).then(function(res){
		const authorID = res.GoodreadsResponse.author.id;
		console.log(authorID);
	});
};

$(function(){
	bookApp.init();
});