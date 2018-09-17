export class Statement {
    public Operation: string = "";
    public Table: string = "";

    public Text: string = "";
    public Values: any[] = [];

    public join(table: string, fields: Object, type: string = "INNER") {
        let expression = Object.entries(fields).map((v, k) => `${v[0]} = ${v[1]}`);
        this.Text += ` ${type} JOIN ${table} ON ${expression.join(' AND ')}`;
        return this;
    }

    public where(fields: Object) {
        let expression = Object.keys(fields).map((v, k) => `${v} = $${k + this.Values.length + 1}`);
        this.Values = this.Values.concat(Object.values(fields));
        this.Text += ` WHERE ${expression.join(' AND ')}`;
        return this;
    }

    public groubby(columns: string[]) {
        this.Text += ` GROUB BY ${columns.join(', ')}`;
        return this;
    }

    public having(fields: Object){
        let expression = Object.keys(fields).map((v, k) => `${v} = $${k + this.Values.length + 1}`);
        this.Values = this.Values.concat(Object.values(fields));
        this.Text += ` HAVING ${expression.join(' AND ')}`;
        return this;
    }

    public orderby(columns: string[]) {
        this.Text += ` ORDER BY ${columns.join(', ')}`;
        return this;
    }

    public returning(columns: string[]) {
        this.Text += ` RETURNING ${columns.join(', ')}`;
        return this;
    }
}

export function select(table: string, columns: string[]) {
    let statement = new Statement();
    statement.Operation = "SELECT";
    statement.Table = table;
    statement.Text = `SELECT ${columns.join(', ')} FROM ${table}`;
    return statement;
}


export function insert(table: string, fields: Object) {
    let columns = Object.keys(fields)
    let values = Object.values(fields).map((v, k) => `$${k + 1}`);
    let statement = new Statement();
    statement.Operation = "INSERT";
    statement.Table = table;
    statement.Values = Object.values(fields);
    statement.Text = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${values.join(", ")})`;
    return statement;
}

export function update(table: string, fields: Object) {
    let columns = Object.keys(fields).map((v, k) => `${v} = $${k + 1}`);
    let statement = new Statement();
    statement.Operation = "UPDATE";
    statement.Table = table;
    statement.Values = Object.values(fields);
    statement.Text = `UPDATE ${table} SET ${columns.join(", ")}`;
    return statement;
}

export function deletes(table: string): Statement {
    let statement = new Statement();
    statement.Operation = "DELETE";
    statement.Table = table;
    statement.Text = `DELETE FROM ${table}`;
    return statement;
}
