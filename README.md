# sql-query-generator

## Usage

```js
// Import
> const sql = require('sql-query-generator')

// Every function return a statement object containing the following information
> sql.update("account", {email: "test@example.com", phone: "555-5555-5555"}).where({id: 1})
Statement {
  operation: 'UPDATE',
  table: 'account',
  text: 'UPDATE account SET email = $1, phone = $2 WHERE id = $3',
  values: [ 'test@example.com', '555-5555-5555', 1 ] 
}
```

### Select

```js
> sql.select("account", "*").text
'SELECT * FROM account'

> sql.select("account", ["id", "email", "phone"]).text
'SELECT id, email, phone FROM account'

> sql.select("account", "id, email, phone").text
'SELECT id, email, phone FROM account'
```

### Insert

``` js
> sql.insert("account", { id:1, "email": "test@example.com", "phone": "555-5555-5555" }).text
'INSERT INTO account (id, email, phone) VALUES ($1, $2, $3)'

> sql.insert("account", {id:2}).returning("*").text
'INSERT INTO account (id) VALUES ($1) RETURNING *'
```

### Update

``` js
> sql.update("account", {email: "test@example.com", phone: "555-5555-5555"}).where({id: 1}).text
'UPDATE account SET email = $1, phone = $2 WHERE id = $3'
```

### Delete

``` js
> sql.deletes("delete").where({id: 1}).text
'DELETE FROM delete WHERE id = $1'
```

### Where

``` js
> sql.select("account", "*").where({email: "test@example.com"}).text
'SELECT * FROM account WHERE email = $1'

> sql.select("account", "*").where({email: "%@example.com"}, 'LIKE').text
'SELECT * FROM account WHERE email LIKE $1'

> sql.select("account", "*").where({email: "test@example.com", id: 1}).text
'SELECT * FROM account WHERE (email = $1 AND id = $2)'

> sql.select("account", "*").where({email: "test@example.com", id: 1}, "=", "OR").text
'SELECT * FROM account WHERE (email = $1 OR id = $2)'

> sql.select("account", "*").where({email: "test@example.com", id: 1}).or({phone: '%5555%'}, 'LIKE').text
'SELECT * FROM account WHERE (email = $1 AND id = $2) OR phone LIKE $3'

> sql.select("account", "*").where({email: "test@example.com", phone: '555-5555-5555'}, '=', 'OR').and({id: 0}, '>').text
'SELECT * FROM account WHERE (email = $1 OR phone = $2) AND id > $3'
```

### Order by

``` js
> sql.select("account", "*").orderby("email").text
'SELECT * FROM account ORDER BY email'

> sql.select("account", "*").orderby(["email DESC", "phone"]).text
'SELECT * FROM account ORDER BY email DESC, phone'
```

### Limit

``` js
> sql.select("account", "*").orderby("email").limit(200).text
'SELECT * FROM account ORDER BY email LIMIT 200'

> sql.select("account", "*").orderby("email").limit(200, 200).text
'SELECT * FROM account ORDER BY email LIMIT 200 OFFSET 200'
```
