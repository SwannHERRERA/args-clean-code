"use strict";
var Args = /** @class */ (function () {
    function Args(schema) {
        this.schema = schema;
        this.fillMapWithSchema();
    }
    Args.prototype.fillMapWithSchema = function () {
        var _this = this;
        this.schema.split(",").forEach(function (flag) {
            if (flag.length === 1) {
                _this.store.set(flag, false);
            }
            else if (flag[1] === "#") {
                _this.store.set(flag[0], 0);
            }
            else if (flag[1] === "*") {
                _this.store.set(flag[0], "");
            }
            else {
                throw new Error("incorrect schema");
            }
        });
    };
    Args.prototype.parse = function (command) {
        for (var i = 0; i < command.length; i += 1) {
            if (command[i] === " ")
                continue;
            // skip - inside ''
            if (command[i] === "-") {
                var flag = command[i + 1];
                var currentValue = this.store.get(command[i + 1]);
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
    };
    Args.prototype.getNumber = function (flag) {
        if (this.store.has(flag)) {
            var argValue = this.store.get(flag);
            if (typeof argValue === "number") {
                return argValue;
            }
            throw new Error("this is not a number");
        }
        return 0;
    };
    Args.prototype.getBoolean = function (flag) {
        if (this.store.has(flag)) {
            var argValue = this.store.get(flag);
            if (typeof argValue === "boolean") {
                return argValue;
            }
            throw new Error("this is not a boolean");
        }
        return false;
    };
    Args.prototype.getString = function (flag) {
        if (this.store.has(flag)) {
            var argValue = this.store.get(flag);
            if (typeof argValue === "string") {
                return argValue;
            }
            throw new Error("this is not a string");
        }
        return "";
    };
    Args.prototype.addNumber = function (flag, command, start) {
        var regexForNumber = new RegExp("-".concat(flag, " (d+)"), "gm");
        var matchs = regexForNumber.exec(command);
        if (matchs === null)
            return start;
        this.store.set(flag, matchs[matchs.length - 1]);
    };
    Args.prototype.addString = function (flag, command, start) {
        throw new Error("Not implemented");
    };
    Args.prototype.addBoolean = function (flag) {
        this.store.set(flag, true);
    };
    return Args;
}());
var argumentParser = new Args("d,p#,h*");
argumentParser.parse("-d -p 42 -h 'Vincent Vega'");
console.log(argumentParser.getBoolean("d"));
console.log(argumentParser.getNumber("p"));
