const api = 'http://localhost:3057'; 

function copyLink() {
    let text = document.getElementById('link').textContent;
    let textarea = document.createElement('textarea');

    textarea.value = text;
    textarea.style.opacity = "1";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    document.execCommand("copy");

    document.body.removeChild(textarea);
}

function changeContainerContent(link) {
    let main = document.querySelector('main');

    let html = `<div class="main-section">
                    <i class="material-icons">check_circle</i>
                    <h1>Uploaded Successfully!</h1>
                        <div class="display-image" style="background-image: url(${api+'/'+link})"></div>
                    <div class="image-link">
                        <p id="link">${api+'/'+link}</p>
                        <button onclick="copyLink()">Copy Link</button>
                    </div>
                </div>`;
    
    main.innerHTML = html;
} 

function insertLoadingBlock() {
    let main = document.querySelector('main');

    let html = `<div class="loading">
                    <p class="text">Uploading...</p>
                    <div class="progress-el">
                        <progress class="progress is-small is-link" max="100"></progress>
                    </div>
                </div>`;

    main.innerHTML = html;
}

async function uploadImage(file) {
    return new Promise((resolve, reject) => {
        let form = new FormData();

        form.append('file', file);

        fetch(api + '/image', {method: 'POST', body: form})
        .then(async (res) => {
            res.json().then((data) => {
                if(data.code === 201 && data.error === false){
                    resolve(data.data);
                }else {
                    reject(false);
                }
            });
        });
    });
}

async function submitForm(file) {
    insertLoadingBlock();
    let response = await uploadImage(file);

    if(response) {
        changeContainerContent(response)
    }else {
        console.error('Error!');
    }
}

async function dropHandler(ev) {
    ev.preventDefault();

    if(ev.dataTransfer.items) {
        let image = ev.dataTransfer.items[0].getAsFile();

        insertLoadingBlock();
        let response = await uploadImage(image);

        if(response) {
            changeContainerContent(response)
        }else {
            console.error('Error!');
        }

    }
}

function dragOverHandler(ev) {
    ev.preventDefault();
}