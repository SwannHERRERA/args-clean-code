class Args {
  private schema: string;

  private store: Map<string, string | boolean | number>;
  constructor(schema: string) {
    this.schema = schema;
    this.fillMapWithSchema();
  }

  private fillMapWithSchema() {
    this.schema.split(",").forEach((flag) => {
      if (flag.length === 1) {
        this.store.set(flag, false);
      } else if (flag[1] === "#") {
        this.store.set(flag[0], 0);
      } else if (flag[1] === "*") {
        this.store.set(flag[0], "");
      } else {
        throw new Error("incorrect schema");
      }
    });
  }

  parse(command: string) {
    for (let i = 0; i < command.length; i += 1) {
      if (command[i] === " ") continue;
      // skip - inside ''
      if (command[i] === "-") {
        const flag = command[i + 1];
        const currentValue = this.store.get(command[i + 1]);
        switch (typeof currentValue) {
          case "number":
            this.addNumber(flag, command, i);
            break;
          case "string":
            this.addString(flag, command, i);
            break;
          case "boolean":
            this.addBoolean(flag);
            break;
          default:
            throw new Error("unexpexted type");
        }
      }
    }
  }

  getNumber(flag: string): number {
    if (this.store.has(flag)) {
      const argValue = this.store.get(flag);
      if (typeof argValue === "number") {
        return argValue;
      }
      throw new Error("this is not a number");
    }
    return 0;
  }
  getBoolean(flag: string): boolean {
    if (this.store.has(flag)) {
      const argValue = this.store.get(flag);
      if (typeof argValue === "boolean") {
        return argValue;
      }
      throw new Error("this is not a boolean");
    }
    return false;
  }
  getString(flag: string): string {
    if (this.store.has(flag)) {
      const argValue = this.store.get(flag);
      if (typeof argValue === "string") {
        return argValue;
      }
      throw new Error("this is not a string");
    }
    return "";
  }

  private addNumber(flag: string, command: string, start: number) {
    const regexForNumber = new RegExp(`-${flag} (\d+)`, "gm");
    const matchs = regexForNumber.exec(command);
    if (matchs === null) return start;
    this.store.set(flag, matchs[matchs.length - 1]);
  }

  private addString(flag: string, command: string, start: number) {
    throw new Error("Not implemented");
  }

  private addBoolean(flag: string) {
    this.store.set(flag, true);
  }
}

const argumentParser = new Args("d,p#,h*");

argumentParser.parse(`-d -p 42 -h 'Vincent Vega'`);
console.log(argumentParser.getBoolean("d"));
console.log(argumentParser.getNumber("p"));
