var mysql = require('mysql'),
    MYSQL_USERNAME = 'root',
    MYSQL_PASSWORD = '';

var client = mysql.createConnection({
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
});

client.query('USE db1');

exports.add_posts = function(data, callback) {
 client.query("insert into blog_posts (userid, title, content, image) values (?,?,?,?)", [1, data.title, data.content, data.image], function(err, info) {
    callback(info.insertId);
    console.log('Post : ' + data.title + ' : ' + data.content + ' : ' + data.image);
  });
}

exports.update_admin_posts = function(data, callback) {
  var query = "update blog_posts set title = '"+data.title+"', content = '"+data.content+"', image='"+data.image+"' where postid = " + data.postId;
  client.query(query, [data.title, data.content, data.image], function(err, results, info) {
    callback(results);
  });
}

exports.get_posts = function(callback) {
  client.query("select * from blog_posts order by postid DESC", function(err, results, fields) {
    callback(results);
  });
}

exports.view_admin_posts = function(data, callback) {
  client.query("select * from blog_posts where postid = " + data.postId, function(err, results, fields) {
    callback(results);
  });
}

exports.delete_posts = function(data, callback) {
 client.query("delete from blog_posts where postid = " + data.id, function(err, info) {
    callback(info);
    console.log('Id = ' + data.postid);
  });
}