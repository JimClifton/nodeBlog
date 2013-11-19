var module = {

    socket : io.connect('http://localhost:3000'),

    listenForInsert : function () {

        $('#save').click(function () {
            if ($('#post_title').val() == '' || $('#post_content').val() == '') {
                return alert('Please add title and content!');
            }

            var data = {
                title: $('#post_title').val(),
                content: $('#post_content').val(),
                image: $('#post_image').val()
            };

            module.socket.emit('add post', data);

            $('#post_title').val('');
            $('#post_content').val('');
            $('#post_image').val('');

        });

    },

    listenForUpdate : function () {

        $('#update').click(function () {

            if ($('#post_title').val() == '' || $('#post_content').val() == '') {
                return alert('Please add title and content!');
            }

            var data = {
                title: $('#post_title').val(),
                content: $('#post_content').val(),
                image: $('#post_image').val(),
                postId: parseInt($('#postid').val())
            };

            data.title = module.addSlashes(data.title);
            data.content = module.addSlashes(data.content);

            module.socket.emit('update admin post', data);
            
        });

    },

    addSlashes : function (string) {
        return string.replace(/\\/g, '\\\\').
            replace(/\u0008/g, '\\b').
            replace(/\t/g, '\\t').
            replace(/\n/g, '\\n').
            replace(/\f/g, '\\f').
            replace(/\r/g, '\\r').
            replace(/'/g, '\\\'').
            replace(/"/g, '\\"');
    },

    listenForDelete : function () {

        $('#posts span').click(function() {

            var data = {
                id : $(this).attr("id")
            };

            module.socket.emit('delete post', data);

        });
    },

    populateAreas : function () {

        module.socket.on('populate', function(data) {

            var test_posts = '';
                $.each(data, function(i, obj) {
                    test_posts += '<div class="post">',
                    test_posts += '<h4>' + obj.title+ ' </h4>',
                    test_posts += '<p>' + obj.content + '</p>',
                    test_posts += '<span id="' + obj.postid + '">x</span>',
                    test_posts += '</div>';
                });

            var admin_posts = '';
                $.each(data, function(i, obj) {
                    admin_posts += '<div class="post">',
                    admin_posts += '<h4 id="' + obj.postid + '">' + obj.title+ ' </h4>',
                    admin_posts += '</div>';
                });

            var client_posts = '';
                $.each(data, function(i, obj) {
                    client_posts += '<div class="post">',
                    client_posts += '<img src="' + obj.image + '" />',
                    client_posts += '<h4>' + obj.title+ ' </h4>',
                    client_posts += '<p>' + obj.content + '</p>',
                    client_posts += '</div>';
                });

            $('#posts').html(test_posts);
            $('#admin_posts').html(admin_posts);
            $('#blog_posts').html(client_posts);
        
            module.listenForDelete();
            module.listenForPostView();

        });

    },

    listenForPostView : function () {

        $('#admin_posts h4').click(function () {

            var data = {
                postId: parseInt($(this).attr("id"))
            };

            module.socket.emit('view admin post', data);

        });

        module.displayAdminPost();

    },

    displayAdminPost : function () {

        module.socket.on('populateAdminPost', function(data) {
            var admin_post = '';
                $.each(data, function(i, obj) {
                    admin_post += '<div id="admin_post">',
                    admin_post += '<h5>Post Title</h5>',
                    admin_post += '<input type="text" id="post_title" name="post_title" value="' + obj.title + '" />',
                    admin_post += '<h5>Post Content</h5>',
                    admin_post += '<textarea rows="10" id="post_content">' + obj.content + '</textarea>',
                    admin_post += '<input type="text" id="post_image" name="post_image" value="' + obj.image + '" />',
                    admin_post += '<input type="hidden" name="postid" id="postid" value="' + obj.postid + '" />',
                    admin_post += '<div><input type="button" value="Update" id="update" /></div>',
                    admin_post += '</div>';
                });

            $('#view_admin_post').html(admin_post);

            module.listenForUpdate();

        });

    },

}

$(document).ready(function() {
    module.listenForInsert();
    module.populateAreas();
    module.listenForPostView();
});