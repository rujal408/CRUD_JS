const modal = document.getElementById('modal')

class Datas {
    constructor() {
        this.data = []
        this.editMode = false
        this.id = null
        this.updateDomElement()
    }

    fetchData = async () => {
        if (!JSON.parse(localStorage.getItem('data'))) {
            const fetching = await fetch('./data.json')
            const data = await fetching.json()
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

    deletePermission = (id) => {
        this.id = id
        this.openModal()
    }

    deleteAll = () => {
        this.id = null
        this.openModal()
    }

    openModal = () => {
        modal.classList.remove('remove');
        modal.classList.add('show')
        modal.firstElementChild.classList.add('animate')
        modal.firstElementChild.classList.remove('deanimate')
    }

    confirmDelete = () => {
        let totalData = JSON.parse(localStorage.getItem('data'))
        const table = document.getElementsByTagName('table')[0]

        if (!this.id) {
            localStorage.setItem('data', JSON.stringify([]))
            while (table.childNodes[1]) {
                table.removeChild(table.childNodes[1])
            }
            this.data = []
        } else {
            const index = totalData.findIndex(x => x.id === this.id)
            totalData.splice(index, 1)
            localStorage.setItem('data', JSON.stringify(totalData))
            table.removeChild(document.getElementById(this.id))
        }
        this.data = totalData
        this.id = null
    }

    cancelDelete = () => {
        this.id = null
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
        this.data = totalData
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
        deleteButton.addEventListener("click", () => this.deletePermission(data[0]))
        tdAction.appendChild(deleteButton)
        tr.appendChild(tdAction)
        return tr
    }

    getId = () => {
        return this.data.reduce((a, c) => a > c.id ? a : c.id, 0) + 1
    }
}

var datas = new Datas()

function submitData(event) {
    event.preventDefault()
    let name = document.getElementById('name').value
    let address = document.getElementById('address').value
    if (!datas.editMode) {
        datas.addData(name, address)
    } else {
        datas.updateData(name, address)
    }
    document.getElementById('myForm').reset()
}

function confirmDelete(e) {
    e.preventDefault()
    setTimeout(() => {
        datas.confirmDelete()
    }, 500)
    removeModal()
}

function cancelDelete(e) {
    e.preventDefault()
    removeModal()
    datas.cancelDelete()
}

function deleteAll(e) {
    e.preventDefault()
    datas.deleteAll()
}

window.onclick = function (e) {
    if (e.target === modal) {
        removeModal()
        datas.id = null
    }
}

function removeModal() {
    setTimeout(() => {
        modal.classList.add('remove')
        modal.classList.remove('show')
    }, 500)
    modal.firstElementChild.classList.add('deanimate')
    modal.firstElementChild.classList.remove('animate')
}

modal.classList.add('remove')
