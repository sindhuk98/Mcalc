const form = document.getElementById('form')
const input = document.querySelector("#propValue")
const inputDP = document.querySelector("#downPaymentNum")
const inputDPrat = document.querySelector("#downPaymentRat")
const inputInt = document.querySelector("#interest")
const inputYrs = document.querySelector("#years")
const principal = document.getElementById("calc")
const startDate = document.getElementById("startDate")
const AnnualTable = document.getElementById("AnnualTableBody")
const MonthlyTable = document.getElementById("MonthlyTableBody")
var calcArray=[]
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
    var principalValue = parseFloat(principal.value)

    const EMI = Math.round((principalValue * interest * (1 + interest)**months)/(((1+interest)**months)-1)*100)/100
    document.getElementById('EMI').textContent = "EMI: " + formatNumber(EMI);

    document.getElementById('calcMenu').style.display="block"

    document.getElementById('totalPropValue').textContent += formatNumber(input.value)
    document.getElementById('totalPrinValue').textContent += formatNumber(principal.value)
    document.getElementById('totalInterestRate').textContent += formatNumber(inputInt.value) + "%"
    document.getElementById('totalTerm').textContent += formatNumber(inputYrs.value) + "years"
    document.getElementById('totalStartDate').textContent += startDate.value
    var endDate = new Date(startDate.value)
    endDate.setFullYear(endDate.getFullYear() + parseInt(inputYrs.value))
    const endDateStr = endDate.toISOString()
    document.getElementById('totalEndDate').textContent += endDateStr.substring(0,endDateStr.length-14)
    document.getElementById('totalInterestPayments').textContent += formatNumber(Math.round(((EMI * months) - principalValue)*100)/100)
    document.getElementById('totalPayments').textContent += formatNumber(Math.round(EMI * months*100)/100)

    for(i=0; i<months;i++){
        var item=[];
        const interestPayment = Math.round(principalValue*interest*100)/100
        item.push(interestPayment)
        item.push(Math.round((EMI-interestPayment)*100)/100)
        item.push(principalValue-EMI+interestPayment)
        principalValue = principalValue - EMI + interestPayment
        calcArray.push(item)
    }    
}

function resetForm() {
    document.getElementById('calcMenu').style.display="none"
    document.getElementById('EMI').textContent = ""
    document.getElementById('form').reset()
}

function AnnualTableCalc() {
    var rows = parseInt(inputYrs.value);
    var dataHtml = ''
    const date = new Date(startDate.value)
    console.log(date.toISOString().substr(0,4))
    var year = parseInt(date.toISOString().substr(0,4))
    var remainingMonths = parseInt(date.toISOString().substr(5,2))
    var principalRemaining = principal.value
    for (var r = 0; r < rows; r++) {
        var interestPortion=0;
        var principalPortion=0;
        dataHtml+='<tr>'
        for(var i=0;i<12;i++){
            interestPortion += Math.round(calcArray[(r*12)+i][0]*100)/100
            principalPortion += calcArray[(r*12)+i][1]
        }
            dataHtml+='<td>' + year + '</td>' + '<td>' + Math.round(interestPortion*100)/100 + '</td>' + '<td>'+ Math.round(principalPortion*100)/100+'</td>' + '<td>'+Math.round(calcArray[(r*12)+11][2]*100)/100+'</td>'
        year++;
        dataHtml+='</tr>'
    }
    AnnualTable.innerHTML=dataHtml
}

function MonthlyTableCalc() {
    var rows = parseInt(inputYrs.value);
    var dataHtml = ''
    const date = new Date(startDate.value)
    var year = 1
    var remainingMonths = parseInt(date.toISOString().substr(5,2))
    var principalRemaining = principal.value
    for (var r = 0; r < rows*12; r++) {
        dataHtml+='<tr>'
            dataHtml+='<td>' + year + '</td>' + '<td>' + calcArray[r][0] + '</td>' + '<td>'+calcArray[r][1]+'</td>' + '<td>'+Math.round(calcArray[r][2]*100)/100+'</td>'
        year++;
        dataHtml+='</tr>'
    }
    MonthlyTable.innerHTML=dataHtml
}

/*
document.getElementById("startDate").onchange = function () {
    var input = document.getElementById("EMIyears");
    console.log(this.value)
    input.setAttribute("min", this.value);
}
*/

