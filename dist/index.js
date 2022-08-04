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
    render(args) {
        let elems = this.templateNode;
        for (var i = 0; i < elems.children.length; i++) {
            if (elems.children[i].hasAttribute('temp_name')) {
                let tempName = elems.children[i].getAttribute('temp_name');
                if (!args.hasOwnProperty(tempName)) {
                    console.error(`Error: args does not contain ${tempName}`);
                }
                elems.children[i].innerHTML = args[tempName];
            }
        }
        this.root.appendChild(this.templateNode);
    }
    renderFromRemote(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.url != null) {
                let data = yield fetch(this.url, options);
                this.render(yield data.json());
            }
        });
    }
}
function makeTemplate(templates, templateId, rootName, url) {
    let root = document.getElementById(rootName);
    let template = document.getElementById(templateId);
    let cloned_template = template.cloneNode(true);
    template.remove();
    let newTemplate = new Template(templateId, cloned_template, root, url);
    templates.push(newTemplate);
}
