const promise = new Promise((resolve, rejection) => {
    setTimeout(() => {
        resolve('Metodo resolve');
    }, 2000);
});

//promise.then(val => { console.log(val) }).catch(err => { console.log(err) });

async function getData() {
    const data = await promise;
    console.log(data);
}

getData();