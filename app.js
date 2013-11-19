var app = require('express')(),
	server = require('http').createServer(app),
  	io = require('socket.io').listen(server),
	db_helper = require("./db_helper.js");

server.listen(3000);

app.configure(function(){
	app.set("view engine", "jade");
});

app.get('/', function (req, res) {
	res.render("home");
});

app.get('/posts', function (req, res) {
	res.render("posts");
});

app.get('/admin', function (req, res) {
	res.render("admin");
});

io.sockets.on('connection', function(socket) {

	function getPosts () {
		db_helper.get_posts(function(posts) {
			io.sockets.emit('populate', posts);
		});
	}

	socket.on('add post', function(data) {
		db_helper.add_posts(data, function(lastId) {
			getPosts();
		});
	});

	socket.on('delete post', function(data) {
		db_helper.delete_posts(data, function() {
			getPosts();
		});
	});

	socket.on('view admin post', function(data) {
		db_helper.view_admin_posts(data, function(results) {
			socket.emit('populateAdminPost', results);
		});
	});

	socket.on('update admin post', function(data) {
		db_helper.update_admin_posts(data, function(results) {
			getPosts();
		});
	});

	getPosts();

});