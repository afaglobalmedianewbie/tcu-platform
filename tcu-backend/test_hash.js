const bcrypt = require('bcrypt');
const hash = '$2b$12$nin8/xnQFcoQOqJ59DpRnOHnQajN0PdSmb9yQWXzqpzSalJd.vrMO';

const match = bcrypt.compareSync('admin123', hash);
console.log('COMPARE admin123:', match);

const match2 = bcrypt.compareSync('admin', hash);
console.log('COMPARE admin:', match2);
