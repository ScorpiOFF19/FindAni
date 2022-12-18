
const insertPet = (name, city, story, link, image) => {
    document.getElementById ("pets").innerHTML += ` <li class="item">
                <img src="${image}">
                <div>
                    <div>
                        <h1>${city}</h1>
                        <h2>${name.leight !=0 ? name : 'Не известно'}</h2>
                    </div>
                    <p>${story}</p>
                    <a href="${link}">Связаться</a>
                </div>
            </li>`;
}
fetch('pets.json').then(res => res.json()).then(data => {
    data.data.forEach(element => {
        insertPet(element.name, element.city, element.story, element.link, element.image)
    })
})
document.getElementById("search").addEventListener("input", (event) => {
    // event.target.value
    fetch('pets.json').then(res => res.json()).then(data => {
         document.getElementById ("pets").innerHTML = ""
        data.data.forEach(element => {
            if (
                element.name.toLowerCase().includes (event.target.value.toLowerCase()) ||
                element.city.toLowerCase().includes (event.target.value.toLowerCase()) ||
                element.story.toLowerCase().includes (event.target.value.toLowerCase()) ) {
                insertPet(element.name, element.city, element.story, element.link, element.image)
            }
            
        })
    })
})