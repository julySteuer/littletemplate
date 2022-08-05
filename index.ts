class Template {
    name: string
    templateNode: Node
    root: Node
    url: string | undefined
    childElements: Map<string, Node> | undefined

    constructor(name: string, templateNode: Node, root: Node, url?: string) {
        this.name = name
        this.templateNode = templateNode
        this.root = root
        this.url = url
    }

    render(tempArgs: any, funcArgs: any, recvArgs: any) {
        let elems = <Element>this.templateNode.cloneNode(true)
        elems.id = Math.floor(Math.random() * 1000000000).toString() + "_template";
        let elements: Map<string, HTMLElement> = new Map();
        let actionElements: HTMLElement[] = [];
        let recivers: Map<string, Function> = new Map();
        for (var i: number = 0; i < elems.children.length; i++) {
            let elem = <HTMLElement>elems.children[i]
            checkIfNormal(elem, elements)
            checkIfAction(elem, actionElements)
            checkIfReciver(elem, recvArgs, recivers)
        }
        elements.forEach(elem => {
            executeNormal(elem, tempArgs)
        });

        actionElements.forEach(elem => {
            executeAction(elem, funcArgs, elements, recivers)
        });

        this.childElements = elements
        this.root.appendChild(elems)
    }

    async renderFromRemote(args: any | null = null,options: any | null = null, funcArgs: any = null, recvArgs: any = null, many: boolean | undefined = undefined) {
        if (this.url != null) {
            if (many == null) {
                many = false
            }
            let data = await fetch(this.url, options)
            let jsonData = await data.json()
            if (many) {
                jsonData.forEach((elem: any) => {
                    this.render({...elem, ...args}, funcArgs, recvArgs)
                });
            } else {
                this.render({...jsonData, ...args}, funcArgs, recvArgs)
            }
        }
    }

    readFromElement(name: string): string {
        let t = <HTMLElement>this.childElements?.get(name)!
        return t.innerText;
    }
}

function checkIfAction(child: HTMLElement, actionElements: HTMLElement[]) {
    if (child.hasAttribute('temp_func') && child.hasAttribute('temp_dest_id')) {
            actionElements.push(child)
    }
}

function checkIfNormal(child: HTMLElement, elements: Map<string, HTMLElement>) {
    if (child.hasAttribute('temp_name')) {
        elements.set(child.getAttribute('temp_name')!, child)
    }
}

function checkIfReciver(child: HTMLElement, recvArgs: any,recivers: Map<string, Function>) {
    if (child.hasAttribute('temp_recv') && child.hasAttribute('temp_name')) {
        recivers.set(child.getAttribute('temp_name')!, recvArgs[child.getAttribute('temp_recv')!])
    }
}

function executeAction(child: HTMLElement, funcArgs: any, templateElements: Map<string, Element>, recivers: Map<string, Function>) {
    let destName = child.getAttribute('temp_dest_id')!
    let destFunction: Function | undefined = recivers.get(destName)
    let dest = <HTMLElement>templateElements.get(destName)!
    let functionName: string = child.getAttribute('temp_func')!
    child.onclick = () => {
        let data = funcArgs[functionName](dest.innerText)
        if (data == null) {
            console.warn(`Warning: Function ${functionName} does not return anything`)
        }
        dest.innerText = destFunction == null ? data : destFunction(data)
    }
}

function executeNormal(child: HTMLElement, tempArgs: any) {
    let tempName = child.getAttribute('temp_name')!
    if (!tempArgs.hasOwnProperty(tempName)) {
        console.error(`Error: args does not contain ${tempName}`)
    } else {
        child.innerHTML = tempArgs[tempName]
    }
}

function makeTemplate(templateId: string, rootName: string, url: string | undefined) {
    let root: HTMLElement = document.getElementById(rootName)!
    let template: HTMLElement = document.getElementById(templateId)!

    let cloned_template: Node = template.cloneNode(true)
    template.remove()
    let newTemplate = new Template(templateId, cloned_template, root, url)
    return newTemplate
}