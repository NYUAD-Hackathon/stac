Router.route('/', function() {
    this.render('Index');
}, {
    name: 'index'
});

Router.route('/admin', function() {
    this.render('Admin');
}, {
    name: 'admin'
});

Router.route('/complaint', {
    where: 'server'
}).post(function() {
    console.log(this.request.body);
    var post = this.request.body;
    //save here
    //Complaints.insert({
    //  key: value
    //}, function() {
    //});
    Complaints.insert({
        callDuration: post.CallDuration,
        recordingUrl: post.RecordingUrl,
        phoneNumber: post.From,
        language: post.Language,
        category: post.Category,
        timestamp: post.Timestamp
    });
    this.response.writeHead(200, {
        'Content-type': 'text/json'
    });
    this.response.end(JSON.stringify({
        status: 200,
        success: true
    }));
});
