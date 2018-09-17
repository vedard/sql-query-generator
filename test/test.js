const assert = require('assert');
const sql = require('../dist');

describe('SqlQueryGenerator', function () {
    describe('select()', function(){
        it('1 field', function(){
            let query = sql.select('table', ['id']);
            assert.strictEqual(query.Text, "SELECT id FROM table");
        })

        it('2 fields', function(){
            let query = sql.select('table', ['id', 'name']);
            assert.strictEqual(query.Text, "SELECT id, name FROM table");
        })

        it('with a join', function(){
            let query = sql.select('table', ['id', 'name']).join('other_table', new Map([['table.id', 'other_table.id']]));
            assert.strictEqual(query.Text, "SELECT id, name FROM table INNER JOIN other_table ON table.id = other_table.id");
        })

        it('with a where', function(){
            let query = sql.select('table', ['id', 'name']).where(new Map([['id', 2]]))
            assert.strictEqual(query.Text, "SELECT id, name FROM table WHERE id = $1");
            assert.deepStrictEqual(query.Values, [2]);
        })

        it('with a order by', function(){
            let query = sql.select('table', ['id', 'name']).orderby(["name"])
            assert.strictEqual(query.Text, "SELECT id, name FROM table ORDER BY name");
        })
    });

    describe('insert()', function () {
        it('Single Value', function () {
            let query = sql.insert("table", new Map([['f1', 2,]]));
            assert.strictEqual(query.Text, "INSERT INTO table (f1) VALUES ($1)");
            assert.deepStrictEqual(query.Values, [2]);
        });
        it('Double Value', function () {
            let query = sql.insert("table", new Map([['f1', 2,], ['f2', 'string']]));
            assert.strictEqual(query.Text, "INSERT INTO table (f1, f2) VALUES ($1, $2)");
            assert.deepStrictEqual(query.Values, [2, 'string']);
        });
    });

    describe('update()', function () {
        it('Single value', function () {
            let query = sql.update("table", new Map([['f1', 2]]));
            assert.strictEqual(query.Text, "UPDATE table SET f1 = $1");
            assert.deepStrictEqual(query.Values, [2]);
        });

        it('Double value', function () {
            let query = sql.update("table", new Map([['f1', 2,], ['f2', 'string']]));
            assert.strictEqual(query.Text, "UPDATE table SET f1 = $1, f2 = $2");
            assert.deepStrictEqual(query.Values, [2, 'string']);
        });

        it('single where', function () {
            let query = sql.update("table", new Map([['f1', 2,], ['f2', 'string']])).where(new Map([['f3', 'asdf',]]));
            assert.strictEqual(query.Text, "UPDATE table SET f1 = $1, f2 = $2 WHERE f3 = $3");
            assert.deepStrictEqual(query.Values, [2, 'string', 'asdf']);
        });

        it('Double where', function () {
            let query = sql.update("table", new Map([['f1', 2,], ['f2', 'string']])).where(new Map([['f3', 'asdf',], ['f4', 'asdf']]));
            assert.strictEqual(query.Text, "UPDATE table SET f1 = $1, f2 = $2 WHERE f3 = $3 AND f4 = $4");
            assert.deepStrictEqual(query.Values, [2, 'string', 'asdf', 'asdf']);
        });
    });
});