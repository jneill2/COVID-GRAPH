const stateArray = [
    {state:"Alabama", abbreviation: "AL"},
    {state:"Alaska", abbreviation: "AK"},
    {state:"Arizona", abbreviation: "AZ"},
    {state:"Arkansas", abbreviation: "AR"},
    {state:"California", abbreviation: "CA"},
    {state:"Colorado", abbreviation: "CO"},
    {state:"Connecticut", abbreviation: "CT"},
    {state:"Delaware", abbreviation: "DE"},
    {state:"Florida", abbreviation: "FL"},
    {state:"Georgia", abbreviation: "GA"},
    {state:"Hawaii", abbreviation: "HI"},
    {state:"Idaho", abbreviation: "ID"},
    {state:"Illinois", abbreviation: "IL"},
    {state:"Indiana", abbreviation: "IN"},
    {state:"Iowa", abbreviation: "IA"},
    {state:"Kansas", abbreviation: "KS"},
    {state:"Kentucky", abbreviation: "KY"},
    {state:"Louisiana", abbreviation: "LA"},
    {state:"Maine", abbreviation: "ME"},
    {state:"Maryland", abbreviation: "MD"},
    {state:"Massachusetts", abbreviation: "MA"},
    {state:"Michigan", abbreviation: "MI"},
    {state:"Minnesota", abbreviation: "MN"},
    {state:"Mississippi", abbreviation: "MS"},
    {state:"Missouri", abbreviation: "MO"},
    {state:"Montana", abbreviation: "MT"},
    {state:"Nebraska", abbreviation: "NE"},
    {state:"Nevada", abbreviation: "NV"},
    {state:"New Hampshire", abbreviation: "NH"},
    {state:"New Jersey", abbreviation: "NJ"},
    {state:"New Mexico", abbreviation: "NM"},
    {state:"New York", abbreviation: "NY"},
    {state:"North Carolina", abbreviation: "NC"},
    {state:"North Dakota", abbreviation: "ND"},
    {state:"Ohio", abbreviation: "OH"},
    {state:"Oklahoma", abbreviation: "OK"},
    {state:"Oregon", abbreviation: "OR"},
    {state:"Pennsylvania", abbreviation: "PA"},
    {state:"Rhode Island", abbreviation: "RI"},
    {state:"South Carolina", abbreviation: "SC"},
    {state:"South Dakota", abbreviation: "SD"},
    {state:"Tennessee", abbreviation: "TN"},
    {state:"Texas", abbreviation: "TX"},
    {state:"Utah", abbreviation: "UT"},
    {state:"Vermont", abbreviation: "VT"},
    {state:"Virginia", abbreviation: "VA"},
    {state:"Washington", abbreviation: "WA"},
    {state:"West Virginia", abbreviation: "WV"},
    {state:"Wisconsin", abbreviation: "WI"},
    {state:"Wyoming", abbreviation: "WY"},
]
const filterArray = [
    {filter:'positive', name:'Total Positive'},
    {filter:'positiveIncrease', name:'Positive Increase From Previous Day'},
    {filter:'death', name:'Total Deaths'},
    {filter:'deathIncrease', name:'Total Death Increase From Previous Day'}
]
stateArray.forEach(x => {
    const option = `<option value=${x.abbreviation}>${x.state}</option>`
    document.querySelector('#selectState').innerHTML += option
})
filterArray.forEach(x => {
    const option = `<option value=${x.filter}>${x.name}</option>`
    document.querySelector('#selectFilter').innerHTML += option
})

var covidData;

localStorage.stateName ? localStorage.stateName : localStorage.stateName="PA";
// localStorage.filterName ? localStorage.filterName : localStorage.filterName="positive";
var filterName = "positive"

document.querySelector('#selectState').value = localStorage.stateName;
document.querySelector('#selectFilter').value = filterName;


const getLargest = (set) => {
    let arr = []
    covidData.forEach(day => { if (!isNaN(day[set])) arr.push(day[set]) })
    return Math.max.apply(Math, arr)
}

fetchData(localStorage.stateName)
function fetchData(state) {
    fetch(`https://covidtracking.com/api/states/daily?state=${state}`).then(res => res.json()).then((data) => {
        return data
    }).then((data) => {
        console.log(data)
        covidData = data;
        buildGraph(filterName)
    })
}

document.querySelector("#selectState").onchange = (e) => {
    let abr = localStorage.stateName = e.target.value;
    fetchData(abr)
}

document.querySelector("#selectFilter").onchange = (e) => {
    console.log(e)
    document.querySelector("#filter").innerHTML = e.target.selectedOptions[0].label
    buildGraph(e.target.value)
}

document.querySelectorAll("button").forEach(button => {
    button.onclick = (e) => {
        document.querySelector("#filter").innerHTML = e.target.innerHTML;
        buildGraph(e.target.dataset.filter)
    }
})

window.addEventListener('resize', () => {
    buildGraph(filterName)
})

function buildGraph(set) {
    filterName = set;
    var largest = getLargest(set);
    var width = document.querySelector("#chart").clientWidth - 150;
    var html = "<b><span>Date</span>–––– <span>Totals</span></b>"
    covidData.map(day => {
        console.log(day)
        if (isNaN(day[set])) day[set] = ''
        const bar = `
        <div>
            <span>${day.date.toString().substr(4,2)}/${day.date.toString().substr(6,2)}/${day.date.toString().substr(0,4)}</span>
            <span>${day[set]}</span>
            <div class="bar" style="width:${width/largest*day[set]}px"></div>
            </div>`
        html += bar
    })
    document.querySelector("#chart").innerHTML = html
}
