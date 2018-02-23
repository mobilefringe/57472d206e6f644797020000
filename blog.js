function renderPostsPageData(){
    //check if tag is attached to path
    var query = window.location.search;
    if(query !== "") {
        $(".load_more").hide();
  
        var tag_name = query.split('=')[1];
        tag_name = tag_name.replace("%20", " ");

        var posts = getAllPublishedPosts();
        var published_posts = posts.sortBy(function(o){ return moment(o.publish_date) }).reverse();
        renderSearchPosts("#blog_container", "#blog_template", published_posts, tag_name);
    } else {
        regularPostList();
    }
    
    show_content();
}

function regularPostList () {
    var posts = getAllPublishedPosts();
    var published_posts = posts.sortBy(function(o){ return moment(o.publish_date) }).reverse();
    renderPosts("#blog_container", "#blog_template", published_posts);
    load_more(1);
}