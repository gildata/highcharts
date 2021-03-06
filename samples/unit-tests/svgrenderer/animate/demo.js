QUnit.test('Animation x-y', function (assert) {

    var div = document.createElement('div');
    document.body.appendChild(div);

    var ren = new Highcharts.Renderer(
        div,
        600,
        400
    );
    var done = assert.async();

    var circ = ren.circle(10, 10, 3)
        .attr({
            fill: 'red'
        })
        .add();

    circ.animate({
        x: 300,
        y: 300
    }, {
        duration: 2000
    });

    setTimeout(function () {
        circ.animate({
            y: 10
        });
    }, 1000);

    setTimeout(function () {
        assert.strictEqual(
            circ.attr('x'),
            300,
            'X went to first destination'
        );
        assert.strictEqual(
            circ.attr('y'),
            10,
            'Y interrupted by second destination'
        );
        document.body.removeChild(div);
        done();
    }, 2500);
});

QUnit.test('Path animation', function (assert) {

    var div = document.createElement('div');
    document.body.appendChild(div);

    var ren = new Highcharts.Renderer(
        div,
        600,
        400
    );
    var done = assert.async();

    var path = ren.path(['M', 10, 30, 'L', 10, 100])
        .attr({
            'stroke-width': 2,
            'stroke': 'blue'
        })
        .add();

    path.animate({
        d: ['M', 300, 330, 'L', 300, 400]
    }, {
        duration: 2000
    });

    setTimeout(function () {
        path.animate({
            d: ['M', 300, 30, 'L', 300, 400]
        }, {
            duration: 100
        });
    }, 1100);

    setTimeout(function () {
        assert.strictEqual(
            path.attr('d'),
            'M 300 30 L 300 400',
            'First animation aborted by shorter second animation'
        );
        document.body.removeChild(div);
        done();
    }, 1500);

});

QUnit.test('Symbol animation', function (assert) {
    var div = document.createElement('div');
    document.body.appendChild(div);

    var ren = new Highcharts.Renderer(
        div,
        600,
        400
    );
    var done = assert.async();

    var symbol = ren.symbol('diamond', 30, 20, 5, 5)
        .attr({
            fill: 'green'
        })
        .add();

    symbol.animate({
        x: 330,
        y: 330
    }, {
        duration: 2000
    });

    setTimeout(function () {
        symbol.animate({
            width: 100,
            height: 100
        });
    }, 1000);

    setTimeout(function () {
        assert.strictEqual(
            symbol.attr('x'),
            330,
            'Final X'
        );
        assert.strictEqual(
            symbol.attr('y'),
            330,
            'Final Y'
        );
        assert.strictEqual(
            symbol.attr('width'),
            100,
            'Final width'
        );
        assert.strictEqual(
            symbol.attr('height'),
            100,
            'Final height'
        );
        document.body.removeChild(div);
        done();
    }, 2500);

});

QUnit.test('Animation x-y, stopped by .attr()', function (assert) {
    var div = document.createElement('div');
    document.body.appendChild(div);

    var ren = new Highcharts.Renderer(
        div,
        600,
        400
    );
    var done = assert.async();

    var circ = ren.circle(10, 10, 3)
        .attr({
            fill: 'red'
        })
        .add();

    circ.animate({
        x: 300,
        y: 300
    }, {
        duration: 1000
    });

    setTimeout(function () {
        circ.attr({
            y: 10
        });
    }, 100);

    setTimeout(function () {
        assert.strictEqual(
            circ.attr('x'),
            300,
            'X went to destination'
        );
        assert.strictEqual(
            circ.attr('y'),
            10,
            'Y interrupted by attr'
        );

        document.body.removeChild(div);
        done();
    }, 1500);
});

QUnit.test('Animation x-y, stopped by .stop()', function (assert) {
    var div = document.createElement('div');
    document.body.appendChild(div);

    var ren = new Highcharts.Renderer(
        div,
        600,
        400
    );
    var done = assert.async();

    var circ = ren.circle(10, 10, 3)
        .attr({
            fill: 'red'
        })
        .add();

    circ.animate({
        x: 300,
        y: 300
    }, {
        duration: 1000
    });

    setTimeout(function () {
        Highcharts.stop(circ, 'y');
    }, 100);

    setTimeout(function () {
        assert.strictEqual(
            circ.attr('x'),
            300,
            'X went to destination'
        );
        assert.notEqual(
            circ.attr('y'),
            300,
            'Y stopped'
        );

        document.body.removeChild(div);
        done();
    }, 1500);
});

QUnit.test('Fill and stroke animation', function (assert) {
    var div = document.createElement('div');
    document.body.appendChild(div);

    var ren = new Highcharts.Renderer(
        div,
        600,
        400
    );
    var done = assert.async();
    var rgbRegex = /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/;

    var circ = ren.circle(200, 200, 100)
        .attr({
            fill: 'rgba(255,255,255,1)',
            stroke: 'rgba(255,255,255,1)',
            'stroke-width': '10px'
        })
        .add();

    circ.animate({
        fill: 'rgba(255,0,0,1)',
        stroke: 'rgba(0,0,255,1)'
    }, {
        duration: 1000
    });

    setTimeout(function () {

        // Fill
        assert.notEqual(
            circ.attr('fill'),
            'rgba(255,255,255,1)',
            'Fill unlike start'
        );
        assert.notEqual(
            circ.attr('fill'),
            'rgba(255,0,0,1)',
            'Fill unlike end'
        );
        assert.ok(
            rgbRegex.test(circ.attr('fill')),
            'Fill is color'
        );

        // Stroke
        assert.notEqual(
            circ.attr('stroke'),
            'rgba(255,255,255,1)',
            'Stroke unlike start'
        );
        assert.notEqual(
            circ.attr('stroke'),
            'rgba(0,0,255,1)',
            'Stroke unlike end'
        );
        assert.ok(
            rgbRegex.test(circ.attr('stroke')),
            'Stroke is color'
        );

        Highcharts.stop(circ);

        document.body.removeChild(div);
        done();
    }, 500);
});

QUnit.test('Fill and stroke animation for series points (#6776)', function (assert) {
    assert.expect(8);

    var div = document.createElement('div');
    div.style.width = '600px';
    document.body.appendChild(div);


    var chart = Highcharts.chart(div, {
            chart: {
                animation: true
            },
            series: [{
                type: 'column',
                data: [1, 2],
                pointPadding: 0,
                groupPAdding: 0,

                borderColor: 'rgb(255,0,0)',
                color: 'rgb(255,255,255)',
                states: {
                    hover: {
                        borderColor: 'rgb(255,255,255)',
                        color: 'rgb(255,0,0)'
                    }
                }
            }]
        }),
        done = assert.async(),
        point = chart.series[0].points[0].graphic;

    // hover over the point
    chart.series[0].points[0].setState('hover');

    setTimeout(function () {
        assert.notEqual(
            point.attr('fill'),
            'rgb(255,255,255)',
            'Fill unlike start'
        );
        assert.notEqual(
            point.attr('fill'),
            'rgb(255,0,0)',
            'Fill unlike end'
        );
        assert.notEqual(
            point.attr('stroke'),
            'rgb(255,255,255)',
            'Stroke unlike end'
        );
        assert.notEqual(
            point.attr('stroke'),
            'rgb(255,0,0)',
            'Stroke unlike start'
        );

        setTimeout(function () {
            chart.series[0].points[0].setState('');

            setTimeout(function () {
                assert.notEqual(
                    point.attr('fill'),
                    'rgb(255,255,255)',
                    'Fill unlike end'
                );
                assert.notEqual(
                    point.attr('fill'),
                    'rgb(255,0,0)',
                    'Fill unlike start'
                );
                assert.notEqual(
                    point.attr('stroke'),
                    'rgb(255,255,255)',
                    'Stroke unlike start'
                );
                assert.notEqual(
                    point.attr('stroke'),
                    'rgb(255,0,0)',
                    'Stroke unlike end'
                );
                done();
            }, 250);
        }, 500);
    }, 250);
});


QUnit.test('Fill and stroke animation for series points in 3D (#6776)', function (assert) {
    assert.expect(4);

    var div = document.createElement('div');
    div.style.width = '600px';
    document.body.appendChild(div);


    var chart = Highcharts.chart(div, {
            chart: {
                animation: true,
                options3d: {
                    enabled: true
                }
            },
            series: [{
                type: 'column',
                data: [1, 2],
                pointPadding: 0,
                groupPAdding: 0,

                borderColor: 'rgb(255,0,0)',
                color: 'rgb(255,255,255)',
                states: {
                    hover: {
                        borderColor: 'rgb(255,255,255)',
                        color: 'rgb(255,0,0)'
                    }
                }
            }]
        }),
        done = assert.async(),
        point = chart.series[0].points[0].graphic;

    // hover over the point
    chart.series[0].points[0].setState('hover');

    setTimeout(function () {
        assert.notEqual(
            point.attr('fill'),
            'rgb(255,255,255)',
            'Fill unlike start'
        );
        assert.notEqual(
            point.attr('fill'),
            'rgb(255,0,0)',
            'Fill unlike end'
        );

        setTimeout(function () {
            //controller.trigger('mouseover', 450, 250);
            chart.series[0].points[0].setState('');

            setTimeout(function () {
                assert.notEqual(
                    point.attr('fill'),
                    'rgb(255,255,255)',
                    'Fill unlike end'
                );
                assert.notEqual(
                    point.attr('fill'),
                    'rgb(255,0,0)',
                    'Fill unlike start'
                );
                done();
            }, 250);
        }, 500);
    }, 250);
});