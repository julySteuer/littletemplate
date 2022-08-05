"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Template {
    constructor(name, templateNode, root, url) {
        this.name = name;
        this.templateNode = templateNode;
        this.root = root;
        this.url = url;
    }
    render(tempArgs, funcArgs, recvArgs) {
        let elems = this.templateNode.cloneNode(true);
        elems.id = Math.floor(Math.random() * 1000000000).toString() + "_template";
        let elements = new Map();
        let actionElements = [];
        let recivers = new Map();
        for (var i = 0; i < elems.children.length; i++) {
            let elem = elems.children[i];
            checkIfNormal(elem, elements);
            checkIfAction(elem, actionElements);
            checkIfReciver(elem, recvArgs, recivers);
        }
        elements.forEach(elem => {
            executeNormal(elem, tempArgs);
        });
        actionElements.forEach(elem => {
            executeAction(elem, funcArgs, elements, recivers);
        });
        this.childElements = elements;
        this.root.appendChild(elems);
    }
    renderFromRemote(args = null, options = null, funcArgs = null, recvArgs = null, many = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.url != null) {
                if (many == null) {
                    many = false;
                }
                let data = yield fetch(this.url, options);
                let jsonData = yield data.json();
                if (many) {
                    jsonData.forEach((elem) => {
                        this.render(Object.assign(Object.assign({}, elem), args), funcArgs, recvArgs);
                    });
                }
                else {
                    this.render(Object.assign(Object.assign({}, jsonData), args), funcArgs, recvArgs);
                }
            }
        });
    }
    readFromElement(name) {
        var _a;
        let t = (_a = this.childElements) === null || _a === void 0 ? void 0 : _a.get(name);
        return t.innerText;
    }
}
function checkIfAction(child, actionElements) {
    if (child.hasAttribute('temp_func') && child.hasAttribute('temp_dest_id')) {
        actionElements.push(child);
    }
}
function checkIfNormal(child, elements) {
    if (child.hasAttribute('temp_name')) {
        elements.set(child.getAttribute('temp_name'), child);
    }
}
function checkIfReciver(child, recvArgs, recivers) {
    if (child.hasAttribute('temp_recv') && child.hasAttribute('temp_name')) {
        recivers.set(child.getAttribute('temp_name'), recvArgs[child.getAttribute('temp_recv')]);
    }
}
function executeAction(child, funcArgs, templateElements, recivers) {
    let destName = child.getAttribute('temp_dest_id');
    let destFunction = recivers.get(destName);
    let dest = templateElements.get(destName);
    let functionName = child.getAttribute('temp_func');
    child.onclick = () => {
        let data = funcArgs[functionName](dest.innerText);
        if (data == null) {
            console.warn(`Warning: Function ${functionName} does not return anything`);
        }
        dest.innerText = destFunction == null ? data : destFunction(data);
    };
}
function executeNormal(child, tempArgs) {
    let tempName = child.getAttribute('temp_name');
    if (!tempArgs.hasOwnProperty(tempName)) {
        console.error(`Error: args does not contain ${tempName}`);
    }
    else {
        child.innerHTML = tempArgs[tempName];
    }
}
function makeTemplate(templateId, rootName, url) {
    let root = document.getElementById(rootName);
    let template = document.getElementById(templateId);
    let cloned_template = template.cloneNode(true);
    template.remove();
    let newTemplate = new Template(templateId, cloned_template, root, url);
    return newTemplate;
}
