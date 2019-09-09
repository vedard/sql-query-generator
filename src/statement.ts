import { Dialect } from "./dialect";

export abstract class Statement {
    public operation: string = "";
    public table: string = "";

    public text: string = "";
    public values: any[] = [];
    abstract dialect: Dialect;

    public static fromFactory(dialect: Dialect) {
        switch (dialect) {
            case "mysql":
                return new MysqlStatement();
                
            case "mssql":
                return new MssqlStatement();
                
            default:
            case "postgres":
                return new PostgresStatement();
        }
    }

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

        this.text += ` GROUP BY ${columns.join(', ')}`;
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

    public toString(): string {
    	return this.text;
    }

    abstract limit(limit: number, offset: number): Statement;
}


export class PostgresStatement extends Statement {
    dialect: Dialect = "postgres";

    limit(limit: number, offset: number | undefined): Statement {
        if (!Number.isInteger(limit))
            throw new Error("Limit should be a number");
            
        if (offset != undefined && !Number.isInteger(offset))
            throw new Error("Offset should be a number or undefined");

        this.text += ` LIMIT ${limit}`;

        if (offset){
            this.text += ` OFFSET ${offset}`;
        }

        return this;
    }
}

export class MysqlStatement extends Statement {
    dialect: Dialect = "mysql";

    limit(limit: number, offset: number): Statement {
        if (!Number.isInteger(limit))
            throw new Error("Limit should be a number");
            
        if (offset != undefined && !Number.isInteger(offset))
            throw new Error("Offset should be a number or undefined");


        if (offset){
            this.text += ` LIMIT ${offset}, ${limit}`;
        } else {
            this.text += ` LIMIT ${limit}`;
        }

        return this;
    }
}

export class MssqlStatement extends Statement {
    dialect: Dialect = "mssql";

    limit(limit: number, offset: number): Statement {
       throw new Error("Not Implemented");
    }
}
