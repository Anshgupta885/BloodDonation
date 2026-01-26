const app = require('./src/app');
const dotenv = require('dotenv');
dotenv.config();

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
