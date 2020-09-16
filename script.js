const form = document.getElementById('form')
const input = document.querySelector("#propValue")
const inputDP = document.querySelector("#downPaymentNum")
const inputDPrat = document.querySelector("#downPaymentRat")
const inputInt = document.querySelector("#interest")
const inputYrs = document.querySelector("#years")
const principal = document.getElementById("calc")
const startDate = document.getElementById("startDate")
var flag = true

console.log(inputDP.value)
input.addEventListener('input', updateValue);
inputDP.addEventListener('input', updateValue);
inputDPrat.addEventListener('input', updateValue);
inputDPrat.addEventListener('input', updateValue);
form.addEventListener('submit',callback)

function updateValue(e) { //redesign for principal input
    var downPymt = 0
    var propVal = 0
    var rat = 0
    var prin = 0;
    if(input.value) {propVal = parseFloat(input.value)}
    if(inputDP.value) {downPymt = parseFloat(inputDP.value)}
    if(inputDPrat.value) {rat = parseFloat(inputDPrat.value)}
    if(principal.value) {prin = parseFloat(principal.value)}
    if(e.target===inputDPrat) {
        downPymt = parseFloat(e.target.value)*propVal/100
        inputDP.value = downPymt
    }   else if(e.target===inputDP) {
        flag = false;
        inputDPrat.value = (downPymt/propVal)*100
    }   else if (e.target===input && flag) {
        downPymt = parseFloat(rat)*propVal/100
        inputDP.value = downPymt 
    }   else {
        inputDPrat.value = (downPymt/propVal)*100
    }
    
    console.log(propVal - downPymt)
    principal.value = propVal - downPymt;
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

function callback(e) {
    document.getElementById("submit1").disabled=true
    const interest = parseFloat(inputInt.value)/100/12;
    const months = parseInt(inputYrs.value)*12
    const principalValue = parseFloat(principal.value)

    const EMI = Math.round((principalValue * interest * (1 + interest)**months)/(((1+interest)**months)-1)*100)/100
    document.getElementById('EMI').textContent = "EMI: " + formatNumber(EMI);

    document.getElementById('calcMenu').style.display="block"

    document.getElementById('totalPropValue').textContent += formatNumber(input.value)
    document.getElementById('totalPrinValue').textContent += formatNumber(principal.value)
    document.getElementById('totalInterestRate').textContent += formatNumber(inputInt.value) + "%"
    document.getElementById('totalTerm').textContent += formatNumber(inputYrs.value)
    document.getElementById('totalStartDate').textContent += startDate.value
    var endDate = new Date(startDate.value)
    endDate.setFullYear(endDate.getFullYear() + parseInt(inputYrs.value))
    const endDateStr = endDate.toISOString()
    document.getElementById('totalEndDate').textContent += endDateStr.substring(0,endDateStr.length-14)
    document.getElementById('totalInterestPayments').textContent += formatNumber(Math.round(((EMI * months) - principalValue)*100)/100)
    document.getElementById('totalPayments').textContent += formatNumber(EMI * months)

    

}

function funcOverall() {
    document.getElementById('totalPropValue').textContent += input.value
}

/*
document.getElementById("startDate").onchange = function () {
    var input = document.getElementById("EMIyears");
    console.log(this.value)
    input.setAttribute("min", this.value);
}
*/

