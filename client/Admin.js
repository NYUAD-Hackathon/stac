Template.Admin.helpers({
    complaints: function() {
        return Complaints.find({}).fetch();
    }
});

Template.Admin.rendered = function() {
    Tracker.autorun(function() {
        var languages = {
            'english' : {
                'timeBuckets': {},
                'count': 0,
                'minTimestamp': null,
                'maxTimestamp': null
            },
            'amharic': {},
            'bengali': {},
            'hindi': {},
            'indonesian': {},
            'malayalam': {},
            'mandarin': {},
            'nepali': {},
            'sinhalese': {},
            'tamil': {},
            'telegu': {},
            'tagalog': {},
            'other': {}
        };
        var cursor = Complaints.find({}, {sort: {timestamp: 1}});
        cursor.forEach(function(d,i,c) {
            var lang = d.language;
            var baseUnit = Math.floor(d.timestamp/(60*60*24));

            if (!languages.hasOwnProperty(lang)) {
                lang = 'other';
            }
            if (!languages[lang].hasOwnProperty('timeBuckets')) {
                languages[lang].timeBuckets = {};
            }
            if (!languages[lang].timeBuckets.hasOwnProperty(baseUnit)) {
                languages[lang].timeBuckets[baseUnit] = [];
            }
            languages[lang].timeBuckets[baseUnit].push(d);
            
            if (languages[lang].minTimestamp == null) {
                languages[lang].minTimestamp = d.timestamp;
                languages[lang].maxTimestamp = d.timestamp;
            }
            if (languages[lang].maxTimestamp < d.timestamp) {
                languages[lang].maxTimestamp = d.timestamp;
            }
        });

        var scale = {
            minX: null,
            minXRounded: null,
            maxX: null,
            maxXRounded: null,
            minY: 0,
            maxY: null
        }
        for (var i in languages) {
            if (scale.minX == null) {
                scale.minX = languages[i].minTimestamp;
            }
            if (scale.maxX == null) {
                scale.maxX = languages[i].maxTimestamp;
            }
            if (scale.minX > languages[i].minTimestamp) {
                scale.minX = languages[i].minTimestamp;
            }
            if (scale.maxX < languages[i].maxTimestamp) {
                scale.maxX = languages[i].maxTimestamp;
            }
        }
        scale.minXRounded = Math.floor(scale.minX/(60*60*24));
        scale.maxXRounded = Math.floor(scale.maxX/(60*60*24));

        var bargraphDataset = [];

        for (var i = scale.minXRounded; i <= scale.maxXRounded; i++) {
            var d = {};
            var totalInBucket = 0;
            for (var j in languages) {
                if (languages[j].hasOwnProperty('timeBuckets') && languages[j].timeBuckets.hasOwnProperty(i)) {
                    d[j] = languages[j].timeBuckets[i];
                    totalInBucket += languages[j].timeBuckets[i].length;
                }
            }
            if (scale.maxY == null) {
                scale.maxY = totalInBucket;
            }
            if (scale.maxY < totalInBucket) {
                scale.maxY = totalInBucket;
            }
            bargraphDataset.push(d);
        }

        var w = 500,
            h = 250;

        var svg = d3.select('#barchart')
            .attr('width', w)
            .attr('height', h+50);

        var xScale = d3.scale.ordinal()
            .domain(d3.range(bargraphDataset.length))
            .rangeRoundBands([0,w],0.1);
        var yScale = d3.scale.linear()
            .domain([0,scale.maxY])
            .range([0,h]);

        console.log(scale);
        console.log(d3.range(bargraphDataset));

        var bars = svg.selectAll('rect')
            .data(bargraphDataset);

        bars.enter()
            .append('rect')
            .attr('x', function(d, i) {
                console.log(xScale(i));
                return xScale(i);
            })
            .attr('y', function(d) {
                var total = 0;
                for (var i in d) {
                    total += d[i].length;
                }
                return h - yScale(total);
            })
            .attr('data-id', function(d) {
                return d._id;
            })
            .attr('width', xScale.rangeBand())
            .attr('height', function(d) {
                var total = 0;
                for (var i in d) {
                    total += d[i].length;
                }
                return yScale(total);
            })
            .attr('fill', function(d) {
                var total = 0;
                return 'rgb(0,0,0)';
            });


        bars.exit();

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,'+h+')')
            .call(xAxis);

        svg.select('.x-axis').selectAll('.tick')
            .selectAll('text')
            .attr('class','date-tick')
            .text(function(text) {
                var date = new Date(0);
                date.setUTCSeconds(scale.minXRounded + parseInt(text) * 60 * 60 * 24);
                var dateString = [date.getDate(),date.getMonth()+1,date.getFullYear()].join(' ')
                return dateString;
            })
            .attr('fill', 'rgb(0,0,0)');

        /**
        cursor.observe({
            'added': function(document) {
                var lang = d.language;
                if (languages.hasOwnProperty(lang)) {
                    languages[lang].push(d); 
                } else {
                    languages['other'].push(d);
                }
            }
        });
        **/
    });
}
