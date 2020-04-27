const stateInfo = {
    "AL": {state:"Alabama", data: []},
    "AK": {state:"Alaska", data: []},
    "AZ": {state:"Arizona", data: []},
    "AR": {state:"Arkansas", data: []},
    "CA": {state:"California", data: []},
    "CO": {state:"Colorado", data: []},
    "CT": {state:"Connecticut", data: []},
    "DE": {state:"Delaware", data: []},
    "FL": {state:"Florida", data: []},
    "GA": {state:"Georgia", data: []},
    "HI": {state:"Hawaii", data: []},
    "ID": {state:"Idaho", data: []},
    "IL": {state:"Illinois", data: []},
    "IN": {state:"Indiana", data: []},
    "IA": {state:"Iowa", data: []},
    "KS": {state:"Kansas", data: []},
    "KY": {state:"Kentucky", data: []},
    "LA": {state:"Louisiana", data: []},
    "ME": {state:"Maine", data: []},
    "MD": {state:"Maryland", data: []},
    "MA": {state:"Massachusetts", data: []},
    "MI": {state:"Michigan", data: []},
    "MN": {state:"Minnesota", data: []},
    "MS": {state:"Mississippi", data: []},
    "MO": {state:"Missouri", data: []},
    "MT": {state:"Montana", data: []},
    "NE": {state:"Nebraska", data: []},
    "NV": {state:"Nevada", data: []},
    "NH": {state:"New Hampshire", data: []},
    "NJ": {state:"New Jersey", data: []},
    "NM": {state:"New Mexico", data: []},
    "NY": {state:"New York", data: []},
    "NC": {state:"North Carolina", data: []},
    "ND": {state:"North Dakota", data: []},
    "OH": {state:"Ohio", data: []},
    "OK": {state:"Oklahoma", data: []},
    "OR": {state:"Oregon", data: []},
    "PA": {state:"Pennsylvania", data: []},
    "RI": {state:"Rhode Island", data: []},
    "SC": {state:"South Carolina", data: []},
    "SD": {state:"South Dakota", data: []},
    "TN": {state:"Tennessee", data: []},
    "TX": {state:"Texas", data: []},
    "UT": {state:"Utah", data: []},
    "VT": {state:"Vermont", data: []},
    "VA": {state:"Virginia", data: []},
    "WA": {state:"Washington", data: []},
    "WV": {state:"West Virginia", data: []},
    "WI": {state:"Wisconsin", data: []},
    "WY": {state:"Wyoming", data: []},
}
const stateMapping = {
    "Alabama": stateInfo["AL"],
    "Alaska": stateInfo["AK"],
    "Arizona": stateInfo["AZ"],
    "Arkansas": stateInfo["AR"],
    "California": stateInfo["CA"],
    "Colorado": stateInfo["CO"],
    "Connecticut": stateInfo["CT"],
    "Delaware": stateInfo["DE"],
    "Florida": stateInfo["FL"],
    "Georgia": stateInfo["GA"],
    "Hawaii": stateInfo["HI"],
    "Idaho": stateInfo["ID"],
    "Illinois": stateInfo["IL"],
    "Indiana": stateInfo["IN"],
    "Iowa": stateInfo["IA"],
    "Kansas": stateInfo["KS"],
    "Kentucky": stateInfo["KY"],
    "Louisiana": stateInfo["LA"],
    "Maine": stateInfo["ME"],
    "Maryland": stateInfo["MD"],
    "Massachusetts": stateInfo["MA"],
    "Michigan": stateInfo["MI"],
    "Minnesota": stateInfo["MN"],
    "Mississippi": stateInfo["MS"],
    "Missouri": stateInfo["MO"],
    "Montana": stateInfo["MT"],
    "Nebraska": stateInfo["NE"],
    "Nevada": stateInfo["NV"],
    "New Hampshire": stateInfo["NH"],
    "New Jersey": stateInfo["NJ"],
    "New Mexico": stateInfo["NM"],
    "New York": stateInfo["NY"],
    "North Carolina": stateInfo["NC"],
    "North Dakota": stateInfo["ND"],
    "Ohio": stateInfo["OH"],
    "Oklahoma": stateInfo["OK"],
    "Oregon": stateInfo["OR"],
    "Pennsylvania": stateInfo["PA"],
    "Rhode Island": stateInfo["RI"],
    "South Carolina": stateInfo["SC"],
    "South Dakota": stateInfo["SD"],
    "Tennessee": stateInfo["TN"],
    "Texas": stateInfo["TX"],
    "Utah": stateInfo["UT"],
    "Vermont": stateInfo["VT"],
    "Virginia": stateInfo["VA"],
    "Washington": stateInfo["WA"],
    "West Virginia": stateInfo["WV"],
    "Wisconsin": stateInfo["WI"],
    "Wyoming": stateInfo["WY"],
}
const filterArray = [
    {filter:'positive', name:'Total Positive Tests'},
    {filter:'positiveIncrease', name:'Positive Increase From Previous Day'},
    {filter:'negative', name:'Total Negative Tests'},
    {filter:'negativeIncrease', name:'Negative Increase From Previous Day'},
    {filter:'recovered', name:'Total Recovered'},
    {filter:'current', name:'Current Cases (if state has recovered count)'},
    {filter:'death', name:'Total Deaths'},
    {filter:'deathIncrease', name:'Total Death Increase From Previous Day'},
    {filter:'hospitalizedCurrently', name:'Total Currently Hospitalized'},
    {filter:'onVentilatorCurrently', name:'Total Currently On Ventilators'},
]
/* State selector */
Object.keys(stateInfo).forEach(x => {
    const option = `<option value=${x}>${stateInfo[x].state}</option>`
    document.querySelector('#selectState').innerHTML += option
})

/* Filter selector */
filterArray.forEach(x => {
    const option = `<option value=${x.filter}>${x.name}</option>`;
    document.querySelector('#selectFilter').innerHTML += option;
})

var covidData;

localStorage.stateName ? localStorage.stateName : localStorage.stateName="PA";
var filterName = "positive"

document.querySelector('#selectState').value = localStorage.stateName;
document.querySelector('#selectFilter').value = filterName;


const getLargest = (data, set) => {
    let arr = []
    data.forEach(day => { if (!isNaN(day[set])) arr.push(day[set]) })
    return Math.max.apply(Math, arr)
}

fetch(`https://covidtracking.com/api/v1/states/current.json`).then(res => res.json()).then((data) => {
    data.forEach(state => {
        if (stateInfo[state.state]) stateInfo[state.state].totalPositive = state.positive
    })
})

function fetchData(state) {
    stateInfo[state].data.forEach(day => day.current = day.positive - day.recovered - day.death)
    covidData = stateInfo[state].data
    buildGraph(filterName)
}

fetch(`https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest`).then(res => res.json()).then((data) => {
    data.data.forEach(state => {
        if (stateMapping[state.State]) stateMapping[state.State].population = state.Population
    })
})
function fetchPopulations() {
}

/* in work */
function fetchEachStates(state) {
    return fetch(`https://covidtracking.com/api/states/daily?state=${state}`).then(res => res.json()).then((data) => {
        stateInfo[state].data = data;
        return data
    })
}
fetch(`https://covidtracking.com/api/states/daily`).then(res => res.json()).then((data) => {
    data.forEach(item => {
        if (stateInfo[item.state]) stateInfo[item.state].data.push(item)
    })
    fetchData(localStorage.stateName)
})


document.querySelector("#selectState").onchange = (e) => {
    if (e.target.value == 'top-ten') {
        filterStates(filterName)
    } else {
        let abr = localStorage.stateName = e.target.value;
        fetchData(abr)
    }
}

document.querySelector("#selectFilter").onchange = (e) => {
    document.querySelector("#filter").innerHTML = e.target.selectedOptions[0].label
    if (document.querySelector("#selectState").value == 'top-ten') {
        filterStates(e.target.value)
    } else {
        buildGraph(e.target.value)
    }
}

window.addEventListener('resize', () => {
    if (document.querySelector("#selectState").value == 'top-ten') {
        filterStates(filterName)
    } else {
        buildGraph(filterName)
    }
})

function buildGraph(filter) {
    filterName = filter;
    var largest = getLargest(covidData, filter);
    var width = document.querySelector("#chart").clientWidth - 155;
    var html = "<b><span>Date</span>–––– <span>Totals</span></b>"
    covidData.map(day => {
        if (isNaN(day[filter])) day[filter] = ''
        const bar = `
        <div>
            <span>${day.date.toString().substr(4,2)}/${day.date.toString().substr(6,2)}/${day.date.toString().substr(0,4)}</span>
            <span>${day[filter]}</span>
            <div class="bar" style="width:${width/largest*day[filter]}px"></div>
            </div>`
        html += bar
    })
    document.querySelector("#chart").innerHTML = html
}

document.querySelector('#top10').onclick = () => {
    document.querySelector("#selectState").value = 'top-ten'
    filterStates(filterName)
}

var statesInOrder;
function filterStates(filter) {
    filterName = filter;
    statesInOrder = [];
    var allStates = []
    var largestForEachState = []
    Object.keys(stateInfo).forEach(state => {
        allStates.push(state)
        let arr = stateInfo[state].data;
        let lg = getLargest(arr, filterName);
        lg = lg / stateInfo[state].population * 1000000
        largestForEachState.push(lg)
    })
    var largest = Math.max.apply(Math, largestForEachState)
    while (statesInOrder.length < 10) {
        let largest = Math.max.apply(Math, largestForEachState)
        let index = largestForEachState.indexOf(largest)
        statesInOrder.push(allStates[index])
        allStates.splice(index,1)
        largestForEachState.splice(index,1)
    }
    topTenGraph(largest)
}

function topTenGraph(largest) {
    document.querySelector("#chart").innerHTML = '<p>Top 10 Filtered by Cases / Million</p>'
    var width = document.querySelector("#chart").clientWidth - 55;
    statesInOrder.forEach(state => {
        var casePerM = getLargest(stateInfo[state].data, filterName) / stateInfo[state].population * 1000000
        var graph = ''
        stateInfo[state].data.forEach(day => {
            let cpm = day[filterName] / stateInfo[state].population  * 1000000;
            let totalWidth = width / largest * cpm;
            totalWidth = (totalWidth > 0) ? totalWidth : 0;
            graph += `<div class="top-ten-bar"><span>${Math.round(cpm)}</span><div style="width:${totalWidth}px"></div></div>`
        })
        const box = `
        <div>
            <h3>${stateInfo[state].state} – ${Math.round(casePerM)} / million</h3>
            <div>
                ${graph}
            </div>
        </div>
        `
        document.querySelector("#chart").innerHTML += box
    })
}
