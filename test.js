const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

const filePath = `./1.jpg`;
const stats = fs.statSync(filePath);
const fileSizeInBytes = stats.size;
const fileStream = fs.createReadStream(filePath);


let count = 0;
for (let i = 0; i < 10; i++) {
    const form = new FormData();

    form.append('image', fileStream, { knownLength: fileSizeInBytes });

    const options = {
        method: 'POST',
        credentials: 'include',
        body: form,
        headers: {
            'Authorization': `Basic QTN6enQyM3F4NWR0alpnZDc0WndPZ29RVlpkc25UUTMyY2ZQeU1TSWh5b0o6YWY4ZWJkMWVkY2E1ZjM5OGRjNDVkZTFlZjhhNmFjZTk0MGRjZjA5YTYyODkzODNkZjYxZDBiZTgwZmE3MzJkMQ==`
        }
    };
    console.log("run..")
    fetch("https://demo.computervision.com.vn/backend/api/v1/request/ocr/cmt/get_infor_all", { ...options })
        .then(async res => {
            console.log("xong.")
            if (res.ok) {
                let body = await res.json()
                if (body.data) {
                    console.log(++count);
                }
                else {
                    console.log("err", body)
                }
                return;
            };
            throw res;
        });
}