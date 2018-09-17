export class Statement {
    public Operation: string = "";
    public Table: string = "";

    public Text: string = "";
    public Values: any[] = [];

    public join(table: string, fields: Map<string, string>, type: string = "INNER") {
        let expression = Array.from(fields.entries(), (v, k) => { return `${v[0]} = ${v[1]}` });
        this.Text += ` ${type} JOIN ${table} ON ${expression.join(' AND ')}`;
        return this;
    }

    public where(fields: Map<string, string>) {
        let expression = Array.from(fields.keys(), (v, k) => { return `${v} = $${k + this.Values.length + 1}` });
        this.Values = this.Values.concat(Array.from(fields.values()));
        this.Text += ` WHERE ${expression.join(' AND ')}`;
        return this;
    }

    public orderby(fields: string[]){ 
        this.Text += ` ORDER BY ${fields.join(', ')}`;
        return this;

    }

    public returning(fields: string[]) {
        this.Text += ` RETURNING ${fields.join(', ')}`;
        return this;
    }
}

export function select(table: string, fields: string[] ) {
    let statement = new Statement();
    statement.Operation = "SELECT";
    statement.Table = table;
    statement.Text = `SELECT ${fields.join(', ')} FROM ${table}`;
    return statement; 
}


export function insert(table: string, fields: Map<string, string>) {
    let columns = Array.from(fields.keys());
    let values = Array.from({length: fields.size}, (v, k)=>{return `$${k + 1}`;})
    let statement = new Statement();
    statement.Operation = "INSERT";
    statement.Table = table;
    statement.Values = Array.from(fields.values()); 
    statement.Text = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${values.join(", ")})`;
    return statement;
}

export function update(table: string, fields: Map<string, string>, where_fields: Map<string, string>) {
    let columns = Array.from(fields.keys(), (v, k) => { return `${v} = $${k + 1}` });
    let statement = new Statement();
    statement.Operation = "UPDATE";
    statement.Table = table;
    statement.Values = Array.from(fields.values()); 
    statement.Text = `UPDATE ${table} SET ${columns.join(", ")}`;
    return statement;
}

export function deletes(table: string): Statement{
    let statement = new Statement();
    statement.Operation = "DELETE";
    statement.Table = table;
    statement.Text = `DELETE FROM ${table}`;
    return statement;
}
