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
    /*
                let tempName = elems.children[i].getAttribute('temp_name')!
                if (!tempArgs.hasOwnProperty(tempName)) {
                    console.error(`Error: args does not contain ${tempName}`)
                }
                elems.children[i].innerHTML = tempArgs[tempName]
                name_element.set(tempName, elems.children[i])
    */
    render(tempArgs, funcArgs) {
        let elems = this.templateNode;
        let elements = new Map();
        let actionElements = [];
        for (var i = 0; i < elems.children.length; i++) {
            let elem = elems.children[i];
            checkIfNormal(elem, elements);
            checkIfAction(elem, actionElements);
        }
        elements.forEach(elem => {
            executeNormal(elem, tempArgs);
        });
        actionElements.forEach(elem => {
            executeAction(elem, funcArgs, elements);
        });
        this.childElements = elements;
        this.root.appendChild(this.templateNode);
    }
    renderFromRemote(options, funcArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.url != null) {
                let data = yield fetch(this.url, options);
                this.render(yield data.json(), funcArgs);
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
    if (child.hasAttribute('temp_func')) {
        if (child.hasAttribute('temp_dest_id')) {
            actionElements.push(child);
        }
    }
}
function checkIfNormal(child, elements) {
    if (child.hasAttribute('temp_name')) {
        elements.set(child.getAttribute('temp_name'), child);
    }
}
function executeAction(child, funcArgs, templateElements) {
    let destName = child.getAttribute('temp_dest_id');
    let dest = templateElements.get(destName);
    let functionName = child.getAttribute('temp_func');
    child.onclick = () => {
        let data = funcArgs[functionName]();
        console.log(data);
        if (data == null) {
            console.warn(`Warning: Function ${functionName} does not return anything`);
        }
        dest.innerText = data;
    };
}
function executeNormal(child, tempArgs) {
    let tempName = child.getAttribute('temp_name');
    if (!tempArgs.hasOwnProperty(tempName)) {
        console.error(`Error: args does not contain ${tempName}`);
    }
    child.innerHTML = tempArgs[tempName];
}
function makeTemplate(templates, templateId, rootName, url) {
    let root = document.getElementById(rootName);
    let template = document.getElementById(templateId);
    let cloned_template = template.cloneNode(true);
    template.remove();
    let newTemplate = new Template(templateId, cloned_template, root, url);
    templates.push(newTemplate);
}
