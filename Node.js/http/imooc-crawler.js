// var http = require("http");
// var url = "http://www.imooc.com/view/623";

// http.get(url,function(res){
// 	var html = "";
// 	res.on("data",function(data){
// 		html += data;
// 	});
// 	res.on("end",function(){
// 		console.log(html);
// 	});
// }).on("error",function(){
// 	console.log("获取数据出错");
// });
// console.log("\n-------\n"+videos+"\n-------\n ");

var http = require("http");
var cheerio = require("cheerio");
var url = "http://www.imooc.com/learn/348";

function filterChapters(html){
	var $ = cheerio.load(html);
	var chapters = $(".chapter");
	var courseDate = [];

	chapters.each(function(idnex,item){
		var chapter = $(item);
		var chapterTitle = chapter.find("strong").text();
		var videos = chapter.find(".video").children("li");
		var chapterData = {
			chapterTitle: chapterTitle,
			videos: []
		};
		videos.each(function(index,item){
			var video = $(item).find(".studyvideo");
			var videoTitle = video.text();
			var id = video.attr("href").split("video/")[1];

			chapterData.videos.push({
				title: videoTitle,
				id: id
			});
		});

		courseDate.push(chapterData);
	});

	return courseDate;
}

function printCourseInfo(courseDate){
		 // console.log("\n-------\n"+Array.forEach+"\n-------\n ");
	courseDate.forEach(function(item){
		var chapterTitle = item.chapterTitle;
		console.log(chapterTitle + "\n");

		item.videos.forEach(function(item){
			console.log("[" + item.id + "]" + item.title + "\n");
		});
	});
}
http.get(url,function(res){
	var html = "";
	res.on("data",function(data){
		html += data;
	});
	res.on("end",function(){
		var courseData = filterChapters(html);
		printCourseInfo(courseData);
	});
}).on("error",function(){
	console.log("获取数据出错");
});

// chreeio中 each的规范用法是 elem.each(function(index,item){//code});
// 而forEach() 的规范用法是 elem.forEach(fuction(item){//code});
// 函数名大小写敏感