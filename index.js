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
    {filter:'positiveIncrease', name:'Positive Increase From Previous Day'},
    {filter:'positive', name:'Total Positive Tests'},
    {filter:'negativeIncrease', name:'Negative Increase From Previous Day'},
    {filter:'negative', name:'Total Negative Tests'},
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
    if (x.filter == localStorage.filterName) document.querySelector("#filter").innerHTML = x.name
})

var covidData;

localStorage.stateName ? localStorage.stateName : localStorage.stateName="top-ten";
localStorage.filterName ? localStorage.filterName : localStorage.filterName="positiveIncrease";
// var localStorage.filterName = "positiveIncrease"

document.querySelector('#selectState').value = localStorage.stateName;
document.querySelector('#selectFilter').value = localStorage.filterName;

const getLargest = (data, set) => {
    let arr = []
    data.forEach(day => { if (!isNaN(day[set])) arr.push(day[set]) })
    return Math.max.apply(Math, arr)
}

function fetchData(state) {
    covidData = stateInfo[state].data
    buildGraph(localStorage.filterName)
}

fetchAllData()
function fetchAllData() {
    console.log('fetched')
    fetch(`https://covidtracking.com/api/v1/states/current.json`).then(res => res.json()).then((data) => {
        data.forEach(state => {
            if (stateInfo[state.state]) stateInfo[state.state].totalPositive = state.positive
        })
    })
    
    fetch(`https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest`).then(res => res.json()).then((data) => {
        data.data.forEach(state => {
            if (stateMapping[state.State]) stateMapping[state.State].population = state.Population
        })
    })
    
    fetch(`https://covidtracking.com/api/v1/states/daily.json`).then(res => res.json()).then((data) => {
        data.forEach(item => {
            if (stateInfo[item.state]) stateInfo[item.state].data.push(item)
        })
        Object.keys(stateInfo).forEach(state => {
            stateInfo[state].data.forEach(day => {
                day.current = day.positive - day.death - day.recovered
            })
        })
        if (localStorage.stateName == "top-ten") { 
            filterStates(localStorage.filterName) 
        } else { 
            fetchData(localStorage.stateName) 
        }
    })
}


document.querySelector("#selectState").onchange = (e) => {
    localStorage.stateName = e.target.value;
    if (e.target.value == 'top-ten') {
        filterStates(localStorage.filterName)
    } else {
        let abr = e.target.value;
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
        filterStates(localStorage.filterName)
    } else {
        if (!covidData) return
        buildGraph(localStorage.filterName)
    }
})

function buildGraph(filter) {
    localStorage.filterName = filter;
    var largest = getLargest(covidData, filter);
    var width = document.querySelector("#chart").clientWidth - 155;
    var html = "<b><span>Date</span>–– <span>Totals</span></b>"
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
    localStorage.stateName = "top-ten"
    document.querySelector("#selectState").value = 'top-ten'
    filterStates(localStorage.filterName)
}

var statesInOrder;
function filterStates(filter) {
    localStorage.filterName = filter;
    statesInOrder = [];
    var allStates = []
    var largestForEachState = []
    var recentForEachState = []
    Object.keys(stateInfo).forEach(state => {
        // console.log(stateInfo[state].data, state)
        allStates.push(state)
        let arr = stateInfo[state].data;
        let lg = getLargest(arr, filter);
        lg = lg / stateInfo[state].population * 1000000
        largestForEachState.push(lg)

        let recent = stateInfo[state].data[0][filter];
        let number = recent / stateInfo[state].population * 1000000
        recentForEachState.push(number)
    })
    var largest = Math.max.apply(Math, largestForEachState)
    while (statesInOrder.length < 10) {
        let largest = Math.max.apply(Math, recentForEachState)
        let index = recentForEachState.indexOf(largest)
        statesInOrder.push(allStates[index])
        allStates.splice(index,1)
        recentForEachState.splice(index,1)
        // console.log(statesInOrder)
    }
    topTenGraph(largest)
}

function topTenGraph(largest) {
    document.querySelector("#chart").innerHTML = '<p>Top 10 Filtered by Current Cases / Million</p>'
    var width = document.querySelector("#chart").clientWidth - 55;
    statesInOrder.forEach(state => {
        // var casePerM = getLargest(stateInfo[state].data, localStorage.filterName) / stateInfo[state].population * 1000000
        var graph = ''
        stateInfo[state].data.forEach(day => {
            let cpm = day[localStorage.filterName] / stateInfo[state].population  * 1000000;
            let totalWidth = width / largest * cpm;
            totalWidth = (totalWidth > 0) ? totalWidth : 0;
            cpm = (!isNaN(cpm)) ? cpm : 0;
            graph += `<div class="top-ten-bar"><span>${Math.round(cpm)}</span><div style="width:${totalWidth}px"></div></div>`
        })
        const box = `
        <div>
            <h3><a onclick="jumpToState('${state}')">${stateInfo[state].state} (cases / million)</a></h3>
            <div>
                ${graph}
            </div>
        </div>
        `
        document.querySelector("#chart").innerHTML += box
    })
}

function jumpToState(state) {
    document.querySelector("#selectState").value = (state);
    fetchData(state)
    // buildGraph(localStorage.filterName)
    window.scrollTo(0,0);
}