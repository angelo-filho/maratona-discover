const transactions = loadTransactionOfLocal() || []
const balances = loadBalanceOfLocal() || { receive: 0, output: 0, total: 0 }
const transactionBtn = document.querySelector('.transaction-btn a')
const addTransactionDiv = document.querySelector('#add-transaction')
const cancelBtn = document.querySelector('.cancel')
const saveBtn = document.querySelector('.save')

function hideAddTransaction() {
  let body = document.querySelector('body')
  if (addTransactionDiv.classList.contains('hidden')) {
    body.setAttribute('style', 'overflow: hidden')
  } else {
    body.style = ''
  }
  addTransactionDiv.classList.toggle('hidden')
}

transactionBtn.onclick = hideAddTransaction
cancelBtn.onclick = hideAddTransaction

function renderBalance() {
  let cardReceive = document.querySelector('.receive p')
  let cardOutput = document.querySelector('.output p')
  let cardTotal = document.querySelector('.total p')

  cardReceive.innerHTML = ''
  cardOutput.innerHTML = ''
  cardTotal.innerHTML = ''

  let formatReceive = balances.receive.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  let receiveValue = document.createTextNode(formatReceive)

  let formatOutput = balances.output.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  let outputValue = document.createTextNode(formatOutput)

  let formatTotal = balances.total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  let totalValue = document.createTextNode(formatTotal)

  cardReceive.appendChild(receiveValue)
  cardOutput.appendChild(outputValue)
  cardTotal.appendChild(totalValue)
}

renderBalance()

function changeBalance() {
  if (balances) {
    balances.receive = 0
    balances.output = 0
    balances.total = 0

    for (transaction of transactions) {
      if (transaction.value < 0) {
        balances.output -= transaction.value
      } else {
        balances.receive += transaction.value
      }
    }

    balances.total = balances.receive - balances.output
    renderBalance()
  }
}

function addNumber(number) {
  if (number <= 9) {
    return '0' + number
  } else {
    return number
  }
}

function renderTransaction() {
  let tbody = document.querySelector('#data-table tbody')
  tbody.innerHTML = ''
  for (transaction of transactions) {
    let tr = document.createElement('tr')

    let descTd = document.createElement('td')
    descTd.setAttribute('class', 'description')
    let textDesc = document.createTextNode(transaction.description)

    let valueTd = document.createElement('td')
    valueTd.setAttribute('class', transaction.value < 0 ? 'expense' : 'income')
    let valueComplement = transaction.value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
    let textValue = document.createTextNode(valueComplement)

    let dateTd = document.createElement('td')
    let date = new Date(transaction.date)
    let formatedDate = `${addNumber(date.getDate() + 1)}/${addNumber(
      date.getUTCMonth() + 1
    )}/${date.getFullYear()}`
    let textDate = document.createTextNode(formatedDate)

    let removeTd = document.createElement('td')
    removeTd.setAttribute('class', 'remove')
    let transactionIndex = transactions.indexOf(transaction)
    removeTd.setAttribute('onclick', `removeTransaction(${transactionIndex})`)
    let removeBtnEl = document.createElement('img')
    removeBtnEl.setAttribute('src', 'remove.svg')

    removeTd.onclick = removeTransaction

    descTd.appendChild(textDesc)
    tr.appendChild(descTd)
    valueTd.appendChild(textValue)
    tr.appendChild(valueTd)
    dateTd.appendChild(textDate)
    tr.appendChild(dateTd)
    removeTd.appendChild(removeBtnEl)
    tr.appendChild(removeTd)
    tbody.appendChild(tr)
  }
}

renderTransaction()

function addTransaction() {
  const descriptionInp = document.querySelector('#desc')
  const description = descriptionInp.value
  const valueInp = document.querySelector('#val')
  const value = parseFloat(valueInp.value)
  const dateInp = document.querySelector('#date')
  const date = dateInp.value

  if (!description || !value || !date) {
    descriptionInp.value = ''
    valueInp.value = ''
    dateInp.value = ''

    return
  }

  const datas = { description, value, date }

  transactions.push(datas)

  descriptionInp.value = ''
  valueInp.value = ''
  dateInp.value = ''

  hideAddTransaction()
  changeBalance()
  renderTransaction()
  saveToLocal()
}

saveBtn.onclick = addTransaction

function removeTransaction(index) {
  console.log('HI')
  transactions.pop(index)
  changeBalance()
  renderTransaction()
  saveToLocal()
}

function saveToLocal() {
  localStorage.setItem('transactions', JSON.stringify(transactions))
  localStorage.setItem('balances', JSON.stringify(balances))
}

function loadBalanceOfLocal() {
  let storaged = localStorage.getItem('balances')
  return JSON.parse(storaged)
}

function loadTransactionOfLocal() {
  let storaged = localStorage.getItem('transactions')
  return JSON.parse(storaged)
}

window.onclose = saveToLocal
