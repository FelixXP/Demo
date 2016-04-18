var http = require("http");
var cheerio = require("cheerio");
var baseUrl = "http://www.imooc.com/learn/";
var videoIds = [348,637];


function filterChapters(html){
	var $ = cheerio.load(html);
	var chapters = $(".chapter");
	var title = $(".hd h2").text();
	var number = parseInt($($(".meta-value strong")[3]).text().trim(),10);
	var courseData = {
		title: title,
		number: number,
		videos: [],

	};
	// courseData = {
	// 	title:title,
	// 	number:number,
	// 	videos:[{
	// 		chapterTitle:'',
	// 		videos:[
	// 			title=>''
	// 			id=>''
	// 		],
	// 	}],
	// }

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

		courseData.videos.push(chapterData);
	});

	return courseData;
}

function printCourseInfo(coursesDate){
	coursesDate.forEach(function(courseData){
		console.log(courseData.number + "人学过" +courseData.title +"\n");

	});
	coursesDate.forEach(function(courseData){
		console.log("###" + courseData.title + "\n");
		courseData.videos.forEach(function(item){
			var chapterTitle = item.chapterTitle;
			console.log(chapterTitle + "\n");

			item.videos.forEach(function(item){
				console.log("[" + item.id + "]" + item.title + "\n");
			});
		});
		
	});
}

function getPageAsync(url){
	return new Promise(function(resolve,reject){
		console.log("正在爬取");
		http.get(url,function(res){
			var html = "";
			res.on("data",function(data){
				html += data;
			});
			res.on("end",function(){
				resolve(html);
			});
		}).on("error",function(e){
			reject(e);
			// console.log("获取数据出错");
		});
	});
}

var fetchCourseArray = [];
videoIds.forEach(function(id){
	fetchCourseArray.push(getPageAsync(baseUrl  + id));
});


Promise.all(fetchCourseArray).then(function(pages){
	var courseData = [];

	pages.forEach(function(html){
		var courses = filterChapters(html);
		courseData.push(courses);
	});

	courseData.sort(function(a,b){
		return a.number < b.number;
	})

	printCourseInfo(courseData);
});


// chreeio中 each的规范用法是 elem.each(function(index,item){//code});
// 而forEach() 的规范用法是 elem.forEach(fuction(item){//code});
// 函数名大小写敏感