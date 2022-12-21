const serverUrl = "http://109.68.212.59:3001"
const insertPet = (name, city, story, link, image) => {
    if(document.getElementById ("pets")){
        document.getElementById ("pets").innerHTML += ` <li class="item">
                    <img src="${serverUrl}${image}">
                    <div>
                        <div>
                            <h1>${city}</h1>
                            <h2>${name.length !=0 ? name : 'Не известно'}</h2>
                        </div>
                        <p>${story}</p>
                        <a href="${link}">Связаться</a>
                    </div>
                </li>`;
    }
}
if(document.getElementById ("pets")){
    fetch(`${serverUrl}/pet`).then(res => res.json()).then(data => {
        data.forEach(element => {
            insertPet(element.name, element.city, element.story, element.link, element.image)
        })
    })
}
if(document.getElementById("search")){
    document.getElementById("search").addEventListener("input", (event) => {
        fetch(`${serverUrl}/pet?search=${event.target.value}`).then(res => res.json()).then(data => {
             document.getElementById ("pets").innerHTML = ""
            data.forEach(element => {
                insertPet(element.name, element.city, element.story, element.link, element.image)
            })
        })
    })
}
if(document.querySelector("form")){
    document.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        fetch(`${serverUrl}/pet`,{
            method: "POST",
            body: formData
        }).then(res => res.json())
        .then(data => {
            if(data.error){
                alert(data.error)
            }
        }).catch(error => {
            console.log(error);
        })
        event.preventDefault()
    })
}