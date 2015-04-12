Template.Admin.helpers({
    complaints: function() {
        return Complaints.find({}).fetch();
    }
});

var filter = new ReactiveVar({});

var filterHash = {
    language: [],
    category: []
};

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

Template.Admin.events({
    'change .ln-select': function(e) {
        if (e.target.checked) {
            var i = filterHash.language.indexOf(e.target.value)
            if (i == -1) {
                filterHash.language.push(e.target.value);
            }
        } else {
            var i = filterHash.language.indexOf(e.target.value);
            console.log('i',i);
            if (i != -1) {
                filterHash.language.splice(i,1);
            }
        } 
        console.log(filterHash);
        var f = filter.get();
        if (filterHash.language.length > 0) {
            f.language = {$in: filterHash.language};
        } else {
            f = {};
        }
        filter.set(f);
        console.log(e.target.value);
        console.log(e.target.checked);
    }
});

Template.Admin.rendered = function() {

    Tracker.autorun(function() {
        var f = filter.get();
        console.log(f);
        if (!isEmpty(f)) {
            var min_complaint = Complaints.findOne(f, {sort: {timestamp: 1}});
            var max_complaint = Complaints.findOne(f, {sort: {timestamp: -1}});
        } else {
            var min_complaint = Complaints.findOne({}, {sort: {timestamp: 1}});
            var max_complaint = Complaints.findOne({}, {sort: {timestamp: -1}});
        }

        if (!isEmpty(min_complaint) && !isEmpty(max_complaint)) {
            var scale = {
                minX: min_complaint.timestamp,
                minXRounded: null,
                maxX: max_complaint.timestamp,
                maxXRounded: null,
                minY: 0,
                maxY: null
            }
        } else { 
            var scale = {
                minX: 0,
                minXRounded: null,
                maxX: 0,
                maxXRounded: null,
                minY: 0,
                maxY: null
            }
        }
        scale.minXRounded = Math.floor(scale.minX/(60*60*24));
        scale.maxXRounded = Math.floor(scale.maxX/(60*60*24));

        var bargraphDataset = [];

        for (var i = scale.minXRounded; i <= scale.maxXRounded; i++) {
            var d = {};
            var totalInBucket = 0;
            if (!isEmpty(f)) {
                var bucket_cursor = Complaints.find({language: f, timestamp: {$gt: i*24*60*60, $lt: (i+1)*24*60*60}});
            } else {
                var bucket_cursor = Complaints.find({timestamp: {$gt: i*24*60*60, $lt: (i+1)*24*60*60}});
            }
            var bucket_dataset = bucket_cursor.fetch();
            totalInBucket = bucket_cursor.count();
            if (scale.maxY == null) {
                scale.maxY = totalInBucket;
            }
            if (scale.maxY < totalInBucket) {
                scale.maxY = totalInBucket;
            }

            bargraphDataset.push(bucket_dataset);
        }

        var w = 700,
            h = 250;

        var svg = d3.select('#barchart')
            .attr('width', w+100)
            .attr('height', h+100);

        var xScale = d3.scale.ordinal()
            .domain(d3.range(bargraphDataset.length))
            .rangeRoundBands([0,w],0.1);
        var yScale = d3.scale.linear()
            .domain([0,scale.maxY])
            .range([0,h]);

        var bars = svg.selectAll('rect')
            .data(bargraphDataset);

        bars.enter()
            .append('rect')
            .attr('x', function(d, i) {
                return xScale(i) + 40;
            })
            .attr('y', function(d) {
                return h - yScale(d.length);
            })
            .attr('data-id', function(d) {
                return d._id;
            })
            .attr('width', xScale.rangeBand())
            .attr('height', function(d) {
                return yScale(d.length);
            })
            .attr('fill', function(d) {
                var total = 0;
                return 'rgb(0,0,0)';
            });

        bars.transition()
            .duration(500)
            .attr('x', function(d, i) {
                return xScale(i) + 40; 
            })
            .attr('y', function(d) {
                return h - yScale(d.length);
            })
            .attr('width', xScale.rangeBand())
            .attr('height', function(d) {
                return yScale(d.length);
            })
            .attr('fill', function(d) {
                var total = 0;
                return 'rgb(0,0,0)';
            });

        bars.exit()
            .transition()
            .duration(500)
            .attr('x', -xScale.rangeBand())
            .remove();

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(40,'+h+')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', 'translate(40,0)')
            .call(yAxis);

        svg.select('.x-axis').selectAll('.tick')
            .selectAll('text')
            .attr('class','tick-text')
            .attr('transform', 'translate(0,25)')
            .text(function(text) {
                var date = new Date(0);
                date.setUTCSeconds(scale.minXRounded + parseInt(text) * 60 * 60 * 24);
                var dateString = [date.getDate(),date.getMonth()+1,date.getFullYear()].join('/')
                return dateString;
            })
            .attr('fill', 'rgb(0,0,0)');

        svg.select('.y-axis').selectAll('.tick')
            .selectAll('text')
            .text(function(text) {
                return scale.maxY - parseInt(text);
            });

    });
}
