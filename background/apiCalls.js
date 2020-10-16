const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

function sendData(data){
    fetch("http://localhost:3000/postData", {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: 'follow'
    })
    .catch(error => console.log('error', error));
};

const requestOptions = {
    method: 'GET'
};

async function getId(){
    const response = await fetch("http://localhost:3000/id", requestOptions)

    if (!response.ok) {
        throw await response.json();
    }

    return response.json();
}
