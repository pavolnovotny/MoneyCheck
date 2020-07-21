const optionOne = document.querySelector('#option-one')
const optionTwo = document.querySelector('#option-two') 
const valueOne = document.querySelector('#value-one') 
const valueTwo = document.querySelector('#value-two') 
const button = document.querySelector('#button') 
const rateDiv= document.querySelector('#rate')
const dateDiv= document.querySelector('#date')


optionOne.addEventListener('change', exchange)
optionTwo.addEventListener('change', exchange)
valueOne.addEventListener('input', exchange)
valueTwo.addEventListener('input', exchange)

function exchange(){
    let curValOne= optionOne.value
    let curValTwo= optionTwo.value
    
    fetch(`https://api.exchangerate-api.com/v4/latest/${curValOne}`)
    .then(resp=> resp.json())
    .then(data=> {
        const rates=data.rates[curValTwo]
        const date = data.date 
        rateDiv.innerText=`1 ${curValOne} = ${rates} ${curValTwo}`       
        dateDiv.innerText = ` Date: ${date} ` 

        valueTwo.value= (valueOne.value*rates).toFixed(2)

          
    })
    
    button.addEventListener('click', ()=>{
        const temp = optionOne.value
        optionOne.value= optionTwo.value
        optionTwo.value= temp
        exchange()
        exchange()
        
    })
}
exchange()