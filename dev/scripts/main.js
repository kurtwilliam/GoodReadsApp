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