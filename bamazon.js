const mysql = require('mysql')
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect();

function query(query, callback) {
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        return callback(results);
    });
}

// list id, names, prices
function listItems() {
    query('SELECT item_id, product_name, price FROM products', function (results) {
        results.forEach(function (result) {
            console.log(`id: ${result.item_id}, name: ${result.product_name}, price: $${result.price}`)
        })

        rl.question('\nEnter the ID of the product you wish to purchase: ', function (id) {
            rl.question('\nEnter quantity you wish to purchase: ', function (qty) {
                buyProduct(parseInt(id), parseInt(qty));
            })
        });

    });

}

// prompt qty
function buyProduct(id, quantity) {
    query('SELECT stock_quantity, price FROM products WHERE item_id=' + id, function (results) {
        if (quantity <= results[0].stock_quantity) {
            // update quantity
            query('UPDATE products SET stock_quantity=stock_quantity-' + quantity + ' WHERE item_id=' + id, function (result) { })
            console.log('Price: $' + quantity * results[0].price)
        } else {
            console.log('Insufficient quantity')
        }
        connection.end()
    })
}


listItems();