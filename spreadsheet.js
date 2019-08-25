const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const fs = require('fs');
const http = require('http');

const creds = require('./client_secret.json');

function onRequest(request, response) {
	response.writeHead(200, {'Content-Type': 'text/php'});
	fs.readFile('./index.php', null, function(error, data) {
		if (error) {
			response.writeHead(404);
			response.write('File not found!');		
		} else {
			response.write(data);
		} 
		response.end();
	});
	response.end();
}

function printPerson(person) {
	console.log(`Date: ${person.date}`);
	console.log(`Name: ${person.name}`);
	console.log(`Date: ${person.phone}`);
	console.log('-------------------');
}

async function accessSpreadsheet() {
	const doc = new GoogleSpreadsheet('12nbc5WujU3EbVVXfuxMwlOD2smXJIB8f0DtrElCO6OY');
	await promisify(doc.useServiceAccountAuth)(creds);
	const info = await promisify(doc.getInfo)();
	const sheet = info.worksheets[0];
	
	const rows = await promisify(sheet.getRows)({
		offset: 1
	});

	rows.forEach(row => {
		printPerson(row);
	})
}

accessSpreadsheet();

http.createServer(onRequest).listen(8000);