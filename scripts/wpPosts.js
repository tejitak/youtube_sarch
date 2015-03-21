var async = require('async')
var YouTube = require('youtube-node');
var authConfig = require('../oauth2-config.js');
var wpConfig = require('../wp-config.js');
var wordpress = require( 'wordpress' );
var request = require("request");
var cheerio = require("cheerio");
var dummy = require('../dummy/akb');

var isDebug = false;

// youtube temp for now
var provider = "y";

// initialize youtube client instance
var youTube = new YouTube();
youTube.setKey(authConfig.youtube_browser_app_key);
// initialize wp client instance
var wpClient = wordpress.createClient(wpConfig);


var videoSearch = function(callback){
  youTube.search(wpConfig.keyword, wpConfig.count, function(error, result) {
    if(error){
      console.log(error);
    }else{
      callback(result);
    }
  });
}

var postArticles = function(result){
  if(result && result.items){
    // sort by reverse
    result.items.reverse();
    result.items.forEach(function(item) {
      // some times channel is returned
      //  id: {kind: 'youtube#channel', channelId: 'UCxjXU89x6owat9dA8Z-bzdw' },
      // video will be id: { kind: 'youtube#video', videoId: 'o-Y7kHFJgo8' }
      // check videoId exists or not
      var videoId = item.id.videoId;
      if(videoId){
        console.log("proccess start: " + videoId);
        // wpClient.getPosts({customFields: [{key: "video_id", value: item.id.videoId}]}, ['customFields'], function(err, data){
        var requestUrl = wpConfig.url + provider + "/" + videoId + "/";
        request({url: requestUrl}, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            $ = cheerio.load(body);
            if($("article").length == 1){
              console.log("already exits: " + videoId);
            }else{
              // the id does not exist, here is top page
              postArticle(item);
            }
          }
        });
      }
    });
  }
};

var postArticle = function(item){
    var id = item.id.videoId;
    // console.log("post :" + id);
    wpClient.newPost({
      id: id, 
      title: item.snippet.title,
      status: 'publish', //'publish, draft...',
      content: buildContent(item),
      author: 1,
      customFields: [{key: 'video_id', value: id}, {key: 'provider', value: provider}]
    }, function(){
      console.log("successfully posted: " + id);
    })
};

var buildContent = function(item){
    var snippet = item.snippet,
        title = snippet.title,
        description = snippet.description,
        imageUrl = snippet.thumbnails && snippet.thumbnails.high && snippet.thumbnails.high.url,
        linkUrl = "https://www.youtube.com/watch?v=" + item.id.videoId;
        return description + '<br><br><div><a href="' + linkUrl + '" target="_blank"><img src="' + imageUrl + '"></a></div><div><a href="' + linkUrl + '" target="_blank">' + linkUrl + '</div>'
};

var init = function(){
  if(isDebug){
    postArticles(dummy);
  }else{
    videoSearch(postArticles);
  }
};

init();