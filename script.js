const fs = require('fs');
const path = require("fs");

//delete every .js file src recursively exclude node_modules
function deleteFolderRecursive(path) {
    if(fs.existsSync(path)){
        //if file
        if(fs.lstatSync(path).isFile()){
            //is .js file
            if(path.endsWith(".js")){
                fs.unlinkSync(path);
            }
        }
        //if folder
        else if(fs.lstatSync(path).isDirectory()){
            //ignore node_modules
            if(path.endsWith("node_modules")){
                return;
            }
            //get all files in folder
            let files = fs.readdirSync(path);
         //loop through files
            for(let i = 0; i < files.length; i++){
                //recursive delete
                deleteFolderRecursive(path + "/" + files[i]);
            }
        }
    }
}

deleteFolderRecursive("./src");