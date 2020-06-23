import { Statement } from "./statement";
import { Dialect } from "./dialect";

let current_dialect: Dialect = "postgres";

export function use(dialect: Dialect) {
    current_dialect = dialect;
}

export function select(table: string, columns: string | string[]) {
    if (!Array.isArray(columns)){
        columns = [columns];
    }

    let statement = Statement.fromFactory(current_dialect);
    statement.operation = "SELECT";
    statement.table = table;
    statement.text = `SELECT ${columns.join(', ')} FROM "${table}"`;
    return statement;
}


export function insert(table: string, fields: Object) {
    let columns = Object.keys(fields)
    let values = Object.values(fields).map((v, k) => `$${k + 1}`);
    let statement = Statement.fromFactory(current_dialect);
    statement.operation = "INSERT";
    statement.table = table;
    statement.values = Object.values(fields);
    statement.text = `INSERT INTO "${table}" (${columns.join(", ")}) VALUES (${values.join(", ")})`;
    return statement;
}

export function update(table: string, fields: Object) {
    let columns = Object.keys(fields).map((v, k) => `${v} = $${k + 1}`);
    let statement = Statement.fromFactory(current_dialect);
    statement.operation = "UPDATE";
    statement.table = table;
    statement.values = Object.values(fields);
    statement.text = `UPDATE "${table}" SET ${columns.join(", ")}`;
    return statement;
}

export function deletes(table: string): Statement {
    let statement = Statement.fromFactory(current_dialect);
    statement.operation = "DELETE";
    statement.table = table;
    statement.text = `DELETE FROM "${table}"`;
    return statement;
}
