// -------------------------------------------
// USER INTERFACE
// 
const UI=(()=>{

    const listeners={
        inputType: '.ctrl__type',
        inputItem:'.ctrl__item',
        inputValue: '.ctrl__value',
        inputButton: '.ctrl__btn',
        incomeWrapper: '.income__list',
        expenseWrapper: '.expense__list',
        ctrl: '.ctrl',
        moneyValue: '.calc__value',
        incValue: '.calc__income--value',
        expValue: '.calc__expenses--value',
        delTrigger: '.bottom'

    }

    return{
        getInput: ()=>{
            return{
                 type: document.querySelector(listeners.inputType).value,  
                 desc: document.querySelector(listeners.inputItem).value,
                 val: parseFloat(document.querySelector(listeners.inputValue).value) 
           }         
        },
        getListeners:()=>{
            return listeners
        },

        addItem:(object, type)=>{
            let item
            let updItem
            let el

            if (type==='inc') {
                el= listeners.incomeWrapper
                item= '<div class="item" id="inc-*id*"><div class="item__description">*description*</div><div class="item__value">*value*</div><button class="item__delete"><i class="fas fa-trash-alt"></i></button></div> '
            } else if(type==='exp'){
                el= listeners.expenseWrapper
                item= '<div class="item" id="exp-*id*"><div class="item__description">*description*</div><div class="item__value">*value*</div><button class="item__delete"><i class="fas fa-trash-alt"></i></button></div> '
            }

            updItem=item.replace('*id*', `${object.id}` )           
            updItem= updItem.replace('*value*', `${object.value.toLocaleString(undefined, {minimumFractionDigits: 2}) +' €' }` )           
            updItem=updItem.replace('*description*', `${object.description}` )  
            
            document.querySelector(el).insertAdjacentHTML('beforeend', updItem)                                             
                                                                                                            
        },

        clearInputs:()=>{
            let inputs= document.querySelectorAll(`${listeners.inputItem}, ${listeners.inputValue}` )
            
            Array.prototype.forEach.call(inputs, (item)=>{
                item.value=""
                
            })
            inputs[0].focus()
        },

        deleteItem:(uiID)=>{
           let ele= document.getElementById(uiID)
           ele.parentNode.removeChild(ele)

        },


        // showAlert: ()=>{
        //     const div= document.createElement('div')
        //      div.innerHTML='<h3>Please add valid value</h3>'
        //     div.className='error'
        
        //      document.querySelector(listeners.ctrl).appendChild(div)
        //      if(document.querySelector(listeners.ctrl).children.length>2){
        //         document.querySelector(listeners.ctrl).removeChild(div)
        //      }
            
             
        // },
        showMoney:(object)=>{


            document.querySelector(listeners.incValue).innerText=  object.totInc.toLocaleString(undefined, {minimumFractionDigits: 2}) + ' €'
            document.querySelector(listeners.expValue).innerText=  object.totExp.toLocaleString(undefined, {minimumFractionDigits: 2}) + ' €'
            document.querySelector(listeners.moneyValue).innerText= object.money.toLocaleString(undefined, {minimumFractionDigits: 2}) + ' €' 

         
        }
    }
   
})()

// --------------------------------------------
// MONEY CONTROLLER
// 
const moneyControl =(()=>{  

    class Income {
        constructor (id, description, value){
            this.id= id
            this.description= description
            this.value= value
        }
    }
    
    class Expense {
        constructor (id, description, value){
            this.id= id
            this.description= description
            this.value= value
        }
    }

    const calcTotal= (type)=>{
        let sum=0
        base.items[type].forEach(el=>{
            sum += el.value
        })
        base.totals[type] = sum
    }


    let base={
        items:{
            inc:[],
            exp:[]
        },
        totals:{
            inc:0,
            exp:0
        },
        money:0
    }

    return{
        addItem: (type, des, val)=>{
            let newItem
            let ID
            if (base.items[type].length >0) {
                ID= base.items[type][base.items[type].length-1].id +1
            } else{
                ID=0
            }
            
            if (type==='inc') {
                    newItem= new Income(ID, des,val)
            } else if(type ==='exp'){
                    newItem= new Expense(ID,des, val)
            }
            base.items[type].push(newItem)
            return newItem
        },
        testing: ()=>{
            
        },
        calculateBudget:()=>{
            // calculate total income and expenses
            calcTotal('inc')
            calcTotal('exp')

            // calculate budget income - expenses
            base.money= base.totals.inc - base.totals.exp

        },

        delete:(type, id)=>{
            // ID from data structure
            let dataID= base.items[type].map(el=> el.id )
            
            let ind = dataID.indexOf(id)
            
            if(ind !== -1){
                base.items[type].splice(ind,1)
            }
            
        },


        getMoney:()=>{
            return {                
                totInc: base.totals.inc,
                totExp: base.totals.exp,
                money: base.money
            }
        }
    }
       
      
})()


// -----------------------------------------------
// MANIPULATOR
// 
const manipulator= ((monCon, userIn)=>{

    const eventListeners= ()=>{
        const evlisteners = userIn.getListeners()

        document.querySelector(evlisteners.inputButton).addEventListener('click', manAddItem)

        document.addEventListener('keypress', (e)=>{
        if(e.key==="Enter"){
            manAddItem()  
        }
    })

        document.querySelector(evlisteners.delTrigger).addEventListener('click', delItem)
    }

    

    const manAddItem= ()=>{
        // get the field input data
        const input=userIn.getInput()  
        if(input.val && !isNaN(input.val) && input.desc != ""){
            // add the item to the budet controller
       let newItem= monCon.addItem(input.type, input.desc, input.val)

       // add new item to the UI
       userIn.addItem(newItem, input.type)

       // clear fields
       userIn.clearInputs()
       
       // calculate budget
       
       calcMoney()
        }  
      
        
        
    }

    const calcMoney= ()=>{
        // calculate the budget
            monCon.calculateBudget()
        // return budget

            let result= monCon.getMoney()
            

        // display the budget

        userIn.showMoney(result)
    } 

    const delItem=(e)=>{

        // ID from UI
        let item = e.target.parentElement.parentElement.id
        

        if(item){
            let spID= item.split('-')

            let type= spID[0]
    
            let ID= parseInt(spID[1]) 
           
            // delete item from data structure
            monCon.delete(type, ID)
    
            // delete item from UI
            userIn.deleteItem(item)
    
            // update and show new budget
            calcMoney()

        }
       
       
    }
 
    return {
        init: ()=>{
            
            eventListeners()
        }
    }
 
})(moneyControl, UI)
manipulator.init()






