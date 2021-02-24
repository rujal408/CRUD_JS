
class Datas {
    constructor() {
        this.data = []
        this.editMode = false
        this.id = null
        this.updateDomElement()
    }

    fetchData = async () => {
        let data = []
        if (!JSON.parse(localStorage.getItem('data'))) {
            const fetching = await fetch('./data.json')
            data = await fetching.json()
            localStorage.setItem('data', JSON.stringify(data.features))
        }
        this.data = JSON.parse(localStorage.getItem('data'))
    }

    addData = (name, address) => {

        if (name.length > 0 && address.length > 0) {
            const id = this.getId()
            const datas = JSON.parse(localStorage.getItem('data'))
            datas.push({ id: id, name: name, address: address })
            localStorage.setItem('data', JSON.stringify(datas))
            this.data = JSON.parse(localStorage.getItem('data'))
            this.addDomElement([id, name, address])
        }
    }

    addDomElement = (data) => {
        const table = document.getElementsByTagName('table')[0]
        const tr = this.getTableRow(data)
        table.appendChild(tr)
    }

    updateDomElement = async () => {
        await this.fetchData();
        const arra = ['id', 'name', 'address', 'action']
        const demo = document.getElementById("demo")
        const table = document.createElement('table')
        const tHead = document.createElement('tr')
        for (const x of arra) {
            const th = document.createElement('th')
            th.innerText = x.toUpperCase()
            tHead.appendChild(th)
        }
        table.appendChild(tHead)
        arra.pop()

        for (const x of this.data) {
            const tr = this.getTableRow([x.id, x.name, x.address])
            table.appendChild(tr)
        }
        demo.appendChild(table)
    }

    editData = (id) => {
        const requiredData = JSON.parse(localStorage.getItem('data'))
        const index = requiredData.findIndex(x => x.id === id)
        document.getElementById('name').value = requiredData[index].name
        document.getElementById('address').value = requiredData[index].address
        this.editMode = true
        this.id = id
    }

    deleteData = (id) => {
        const totalData = JSON.parse(localStorage.getItem('data'))
        const index = totalData.findIndex(x => x.id === id)
        totalData.splice(index, 1)
        localStorage.setItem('data', JSON.stringify(totalData))
        const table = document.getElementsByTagName('table')[0]
        table.removeChild(document.getElementById(id))
    }

    updateData = (name, address) => {
        const totalData = JSON.parse(localStorage.getItem('data'))
        const index = totalData.findIndex(x => x.id === this.id)
        totalData.splice(index, 1, { id: totalData[index].id, name: name, address: address })
        localStorage.setItem('data', JSON.stringify(totalData))
        const table = document.getElementsByTagName('table')[0]
        const tr = this.getTableRow([totalData[index].id, name, address])
        table.replaceChild(tr, document.getElementById(totalData[index].id))
        this.editMode = false
        this.id = null
    }

    getTableRow = (data) => {
        const tr = document.createElement('tr')
        tr.id = data[0]
        for (const x of data) {
            const th = document.createElement('td')
            th.innerText = x
            tr.appendChild(th)
        }
        const tdAction = document.createElement('td')
        tdAction.style.display = "flex"
        tdAction.style.justifyContent = "space-evenly"
        const editButton = document.createElement('button')
        editButton.innerText = "Edit"
        editButton.addEventListener("click", () => this.editData(data[0]))
        tdAction.appendChild(editButton)

        const deleteButton = document.createElement('button')
        deleteButton.innerText = "Delete"
        deleteButton.addEventListener("click", () => this.deleteData(data[0]))
        tdAction.appendChild(deleteButton)
        tr.appendChild(tdAction)
        return tr
    }

    getId = () => {
        return this.data.reduce((a, c) => a > c.id ? a : c.id) + 1
    }
}

var datas = new Datas()

function submitData(event) {
    event.preventDefault()
    let name = document.getElementById('name').value
    let address = document.getElementById('address').value
    if (datas.editMode === false) {
        datas.addData(name, address)
    } else {
        datas.updateData(name, address)
    }
    document.getElementById('myForm').reset()
}







