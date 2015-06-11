function plot(data) {

    $('#container').highcharts({

        title: {
            text: 'Ao longo do tempo'
        },

        subtitle: {
            text: '(passe o mouse sobre o nome de uma pessoa para destacá-la)'
        },

        data: {
            table: data,
            parsed: function (table) {
                // Find last usefull row
                $.each(table[0], function (i, cell) {
                        if (cell == "&nbsp;") {
                            lastLine = i - 1
                            return false
                        }
                })
                $.each(table, function (i, column) {
                    column.splice(lastLine + 1)
                    console.log(column)
                    $.each(column, function (i, cell) {
                        if (cell == "&nbsp;") {
                            column[i] = 0
                        }
                    });
                });
                window.alldata = table.slice()
                table.splice(1, 2);
            },
            startRow: 1
        },

        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        chart: {
            type: "column"
        },

        yAxis: {
            tickInterval: 2
        }

    },

    function (chart) {
        window.chart = chart
        $(chart.series).each(function (i, serie) {
            serie.colorOriginal = serie.color
            $(serie.legendItem.element).hover(function () {
                highlight(chart.series, serie.index, true);
            }, function () {
                highlight(chart.series, serie.index, false);
            });
        });

        function highlight(series, index, hide) {
            $(series).each(function (i, serie) {
                if (i != index) {
                    $(serie.data).each(function (i, data) {
                        data.update({
                            "color": (hide ? "#D4D4D4" : serie.colorOriginal)
                        }, false)
                    })
                }
            });
            window.chart.redraw()
        }
    });
}

function sumTotals(table) {
    totals = []
    names = []
    $(table).each(function (i, column) {
        total = 0
        $(column).each(function (i, cell) {
            total += cell
        });
        totals.push([column.name, total])
    });
    totals.sort(function (a, b) {return b[1] - a[1]})
    $(totals).each(function (i, line) {
        names.push(line[0])
    })
    return [totals, names]
}

function plotTotalsYear() {
    table = window.alldata.slice()
    table.splice(0, 3);
    $(table).each(function(i, column) {
        ncolumn = column.slice()
        ncolumn.splice(0, 5)
        ncolumn.name = column.name
        table[i] = ncolumn
    })
    totals = sumTotals(table)

    $('#containerY').highcharts({

        title: {
            text: 'Total por pessoa no ano atual'
        },

        chart: {
            type: "bar"
        },

        xAxis: {
            categories: totals[1],
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b>: <b>' + this.y + '</b>';
            }
        },

        yAxis: {
            tickInterval: 1
        },

        series: [{
            data: totals[0],
            showInLegend: false
        }]

    });
}

function plotTotals() {
    table = window.alldata.slice()
    table.splice(0, 3);
    totals = sumTotals(table)

    $('#containerT').highcharts({

        title: {
            text: 'Total por pessoa'
        },

        chart: {
            type: "bar"
        },

        xAxis: {
            categories: totals[1],
        },

        yAxis: {
            tickInterval: 1
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b>: <b>' + this.y + '</b>';
            }
        },

        series: [{
            data: totals[0],
            showInLegend: false
        }]

    });
}

function run() {
    $.ajax({
        url: 'https://ethercalc.org/presenca-conselho-okbr.html',
        dataType: "text",
        success: function (data) {
            mytable = $("#mytable")
            mytable.html(data)
            table = mytable.children()[0]
            plot(table);
            plotTotalsYear();
            plotTotals();
        },
        error: function () {
            alert('Erro ao tentar carregar dados!');
        }
    });
}

$(function () {
    run()
});

