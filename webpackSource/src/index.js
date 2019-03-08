import a from "@/a";
// import b from "./b";
// import c from "./c";
// import test from './assets/1.jpg'

import("./lazy/lazy-a")
    .then(moduleA => {
        console.log(moduleA)
    });