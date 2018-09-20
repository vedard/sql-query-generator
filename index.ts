export class Statement {
    public operation: string = "";
    public table: string = "";

    public text: string = "";
    public values: any[] = [];

    public join(table: string, fields: Object, type: string = "INNER") {
        let expression = Object.entries(fields).map((v, k) => `${v[0]} = ${v[1]}`);
        this.text += ` ${type} JOIN ${table} ON ${expression.join(' AND ')}`;
        return this;
    }

    public where(fields: Object, operator: string = '=', separator: string = 'AND') {
        let expression = Object.keys(fields).map((v, k) => `${v} ${operator} $${k + this.values.length + 1}`);
        this.values = this.values.concat(Object.values(fields));
        
        if (expression.length > 1){
            this.text += ` WHERE (${expression.join(` ${separator} `)})`;
        } else {
            this.text += ` WHERE ${expression.join(` ${separator} `)}`;
        }

        return this;
    }

    public and(fields: Object, operator: string = '=', separator: string = 'AND'){
        let expression = Object.keys(fields).map((v, k) => `${v} ${operator} $${k + this.values.length + 1}`);
        this.values = this.values.concat(Object.values(fields));
        if (expression.length > 1){
            this.text += ` AND (${expression.join(` ${separator} `)})`;
        } else {
            this.text += ` AND ${expression.join(` ${separator} `)}`;
        }

        return this;
    }

    public or(fields: Object, operator: string = '=', separator: string = 'AND'){
        let expression = Object.keys(fields).map((v, k) => `${v} ${operator} $${k + this.values.length + 1}`);
        this.values = this.values.concat(Object.values(fields));
        if (expression.length > 1){
            this.text += ` OR (${expression.join(` ${separator} `)})`;
        } else {
            this.text += ` OR ${expression.join(` ${separator} `)}`;
        }

        return this;
    }

    public groupby(columns: string | string[]) {
        if (!Array.isArray(columns)){
            columns = [columns];
        }

        this.text += ` GROUB BY ${columns.join(', ')}`;
        return this;
    }

    public having(fields: Object, operator: string = '=', separator: string = 'AND'){
        let expression = Object.keys(fields).map((v, k) => `${v} ${operator} $${k + this.values.length + 1}`);
        this.values = this.values.concat(Object.values(fields));
        this.text += ` HAVING ${expression.join(` ${separator} `)}`;
        return this;
    }

    public orderby(columns: string | string[]) {
        if (!Array.isArray(columns)){
            columns = [columns];
        }

        this.text += ` ORDER BY ${columns.join(', ')}`;
        return this;
    }

    public returning(columns: string | string[]) {
        if (!Array.isArray(columns)){
            columns = [columns];
        }

        this.text += ` RETURNING ${columns.join(', ')}`;
        return this;
    }
}

export function select(table: string, columns: string | string[]) {
    if (!Array.isArray(columns)){
        columns = [columns];
    }

    let statement = new Statement();
    statement.operation = "SELECT";
    statement.table = table;
    statement.text = `SELECT ${columns.join(', ')} FROM ${table}`;
    return statement;
}


export function insert(table: string, fields: Object) {
    let columns = Object.keys(fields)
    let values = Object.values(fields).map((v, k) => `$${k + 1}`);
    let statement = new Statement();
    statement.operation = "INSERT";
    statement.table = table;
    statement.values = Object.values(fields);
    statement.text = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${values.join(", ")})`;
    return statement;
}

export function update(table: string, fields: Object) {
    let columns = Object.keys(fields).map((v, k) => `${v} = $${k + 1}`);
    let statement = new Statement();
    statement.operation = "UPDATE";
    statement.table = table;
    statement.values = Object.values(fields);
    statement.text = `UPDATE ${table} SET ${columns.join(", ")}`;
    return statement;
}

export function deletes(table: string): Statement {
    let statement = new Statement();
    statement.operation = "DELETE";
    statement.table = table;
    statement.text = `DELETE FROM ${table}`;
    return statement;
}
