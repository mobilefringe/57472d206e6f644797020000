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
        load_more(1, posts);
    } else {
        regularPostList();
    }
    
    show_content();
    
    $('#load_more_posts').click(function(e){
        var i = $('#num_loaded').val();
        load_more(i, posts);
        e.preventDefault();
    });
}

function regularPostList () {
    var posts = getAllPublishedPosts();
    var published_posts = posts.sortBy(function(o){ return moment(o.publish_date) }).reverse();
    renderPosts("#blog_container", "#blog_template", published_posts);
    load_more(1, published_posts);
}

function renderPosts(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = site_json.default_image;
        } else {
            val.post_image = val.image_url;
        }
        
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        } else {
            val.description_short = val.body;
        }
        
        var date_blog = moment(val.publish_date).tz(getPropertyTimeZone());
        val.published_on = date_blog.format('MMM DD, YYYY');
        
        val.counter = counter;
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter = counter + 1;
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}
    
function renderSearchPosts(container, template, collection, search){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = site_json.default_image;
        } else {
            val.post_image = val.image_url;
        }
        
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        } else {
            val.description_short = val.body;
        }

        val.counter = counter;
        var added_val = false;
        if(val.tag !== null && val.tag !== undefined) {
            //search through all the tags with query, if matches render
            $.each( val.tag , function( key2, tag ) {
                if(!added_val){
                    tag = tag.toLowerCase();
                    search = search.toLowerCase();
                    // console.log(key, "tag is", tag , "search is", search);
                    if(tag.indexOf(search) > -1 || search.indexOf(tag) > -1) {
                        console.log("tag is", tag , "search is", search);
                        var rendered = Mustache.render(template_html,val);
                        item_rendered.push(rendered);
                        counter = counter + 1;
                        added_val = true;
                    }
                }
            });
        }
    });
    
    if(item_rendered.length === 0) {
        $("#no_posts").show();
        $("#all_loaded").hide();
    }
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function load_more(num, posts){
    var n = parseInt(num);
    for(i=n; i < n + 4; i++){
        var id = i.toString();
        $('#show_' + id ).fadeIn();
    }
    console.log(i)
    console.log(getAllPublishedPosts().length)
    if(i >= posts){
        $('#loaded_posts').hide();
        $('#all_loaded').show();
    }
    $('#num_loaded').val(i);
}