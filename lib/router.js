Router.route('/', function() {
    this.render('Index');
}, {
    name: 'index'
});

Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
    extended: false
}));

Router.route('/admin', function() {
    this.render('Admin');
}, {
    name: 'admin'
});

Router.route('/complaint', {
    where: 'server'
}).post(function() {
    console.log(this.request.body);
    this.response.writeHead(200, {
        'Content-type': 'text/json'
    });
    this.response.end(JSON.stringify({
        status: 200,
        success: true
    }));
});
