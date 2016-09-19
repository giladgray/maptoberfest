import * as React from "react";
import * as ReactDOM from "react-dom";

declare function require<T>(packageName: string): T;

require("./index.scss");

console.log("we did it");
