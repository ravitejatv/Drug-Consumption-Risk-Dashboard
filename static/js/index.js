var url = "http://127.0.0.1:5050";

var columnDesc = { 'age': 'Age', 'gender': 'Gender', 'education': 'Education', 'country': 'Country', 'ethnicity': 'Ethnicity', 'nscore': 'Nscore', 'escore': 'Escore', 'oscore': 'Oscore', 'ascore': 'Ascore', 'cscore': 'Cscore', 'alcohol': 'Alcohol', 'amphet': 'Amphet', 'amyl': 'Amyl', 'benzos': 'Benzos', 'caff': 'Caffeine', 'cannabis': 'Cannabis', 'choc': 'Chocolate', 'coke': 'Cocaine', 'crack': 'Crack', 'ecstacy': 'Ecstacy', 'heroin': 'Heroin', 'ketamine': 'Ketamine', 'legalh': 'Legal highs', 'lsd': 'LSD', 'meth': 'Meth', 'mushrooms': 'Mushrooms', 'nicotine': 'Nicotine', 'semer': 'Semeron', 'vsa': 'VSA' }
var drugs = ['alcohol', 'amphet', 'amyl', 'benzos', 'caff', 'cannabis', 'choc', 'coke', 'crack', 'ecstacy', 'heroin', 'ketamine', 'legalh', 'lsd', 'meth', 'mushrooms', 'nicotine', 'semer', 'vsa']
var drug_desc = ['Alcohol', 'Amphet', 'Amyl', 'Benzos', 'Caffeine', 'Cannabis', 'Chocolate', 'Cocaine', 'Crack', 'Ecstacy', 'Heroin', 'Ketamine', 'Legal highs', 'LSD', 'Meth', 'Mushrooms', 'Nicotine', 'Semeron', 'VSA']
var scores = ['nscore', 'escore', 'oscore', 'ascore', 'cscore']
data = []
categories = []
columns = []

function init() {
    getPlotsData()
    getMDSPlotData()
}
init();

window.onresize = function(event) {
    document.location.reload(true);
}

var href = window.location.href.split("/")
var html_location = href[href.length - 1]


function getDropdownData(columns) {
    var select = d3.select('#barhistselect')
        .on('change', start_barhistplot);

    select.selectAll('#barhistselect')
        .data(columns)
        .enter()
        .append('option')
        .attr('value', function(d) {
            return d;
        })
        .text(function(d) {
            return columnDesc[d];
        })
        .property("selected", function(d) {
            return columnDesc[0];
        });


    var select = d3.select('#scatselect')
        .on('change', start_scatterplots);

    select.selectAll('#scatselect')
        .data(columns.filter(x => !scores.includes(x)))
        .enter()
        .append('option')
        .attr('value', function(d) {
            return d;
        })
        .text(function(d) {
            return columnDesc[d];
        })
        .property("selected", function(d) {
            return columnDesc[0];
        });
}

function getPlotsData() {
    $.getJSON(url + '/getPlotsData', {

    }, function(d) {
        data = JSON.parse(d['data']);
        categories = JSON.parse(d['categories']);
        columns = JSON.parse(d['columns']);
        getDropdownData(columns)
        generate_plots()
    });
}

function getMDSPlotData() {
    $.getJSON(url + '/getMDSPlotData', {

    }, function(d) {
        generate_mdsplot(JSON.parse(d['dataX']), JSON.parse(d['dataY']), JSON.parse(d['columns']))
    });
}

function generate_plots() {
    start_barhistplot()
    start_scatterplots()
    start_pcpplot()
    start_earthplot()
}

function start_barhistplot(barhisdata = data) {
    selectValue = d3.select('#barhistselect').property('value');
    selectedIndex = columns.indexOf(selectValue)
    selectedData = barhisdata.map(d => d[selectedIndex]);
    if (categories[selectedIndex] == 'cat') {
        generate_barplot(selectedData, columnDesc[selectValue]);
    } else if (categories[selectedIndex] == 'num') {
        generate_hisplot(selectedData, columnDesc[selectValue]);
    }
}

function start_scatterplots(scatterdata = data) {
    selectValue = d3.select('#scatselect').property('value');
    selectedIndex = columns.indexOf(selectValue)
    selectedData = scatterdata.map(d => d[selectedIndex]);
    scoreData = []
    scoreCols = ['nscore', 'escore', 'oscore', 'ascore', 'cscore']
    scoreColsDesc = ['nscore', 'escore', 'oscore', 'ascore', 'cscore']
    for (var i = 0; i < scoreCols.length; i++) {
        scoreColsDesc.push(columnDesc[scoreCols[i]])
    }
    for (var i = 0; i < scoreCols.length; i++) {
        scoreData.push(scatterdata.map(d => d[columns.indexOf(scoreCols[i])]))
    }
    generate_scatterplot(selectedData, scoreData, columnDesc[selectValue], scoreColsDesc)
}

function start_pcpplot() {
    pcpColumns = columns.filter(function(val) {
        return scores.indexOf(val) == -1;
    });
    pcpData = []
    for (var i = 0; i < data.length; i++) {
        pcpData[i] = data[i].slice(0, 5);
        x = data[i].slice(10, 29);
        for (var j = 0; j < x.length; j++)
            pcpData[i].push(x[j])
    }
    pcpCategories = categories;
    pcpCategories = categories.slice(0, 5);
    x = categories.slice(10, 29);
    for (var j = 0; j < x.length; j++)
        pcpCategories.push(x[j])
    generate_pcpplot(pcpData, pcpCategories, pcpColumns);
}

function start_earthplot() {
    generate_earthplot(data, columns);
}


function extractColumn(arr, column) {
    return arr.map(x => x[column])
}

function colorRoll(idx) {
    var colorlist = [
        '#FF3633', '#335EFF', '#F933FF', '#48FF23', '#FFFF23',
        '#DA23FF', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
        '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
        '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
    ]
    return colorlist[idx % colorlist.length];
}