require('dotenv').config();
const app = require('./index');
const port = process.env.PORT || 4000;

const server = app.listen(port, ()=>console.log(`HMS backend listening on ${port}`));

server.on('error', (err) => {
	if (err && err.code === 'EADDRINUSE') {
		console.error(`Port ${port} is already in use.`);
		// exit so process manager / nodemon can restart cleanly
		process.exit(1);
	}
	console.error('Server error:', err);
});
