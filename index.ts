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

    /*
                let tempName = elems.children[i].getAttribute('temp_name')!
                if (!tempArgs.hasOwnProperty(tempName)) {
                    console.error(`Error: args does not contain ${tempName}`)
                }
                elems.children[i].innerHTML = tempArgs[tempName]
                name_element.set(tempName, elems.children[i]) 
    */
    render(tempArgs: any, funcArgs: any) {
        let elems = <Element>this.templateNode
        let elements: Map<string, HTMLElement> = new Map();
        let actionElements: HTMLElement[] = [];
        for (var i: number = 0; i < elems.children.length; i++) {
            let elem = <HTMLElement>elems.children[i]
            checkIfNormal(elem, elements)
            checkIfAction(elem, actionElements)
        }

        elements.forEach(elem => {
            executeNormal(elem, tempArgs)
        });

        actionElements.forEach(elem => {
            executeAction(elem, funcArgs, elements)
        });

        this.childElements = elements
        this.root.appendChild(this.templateNode)
    }

    async renderFromRemote(options: any, funcArgs: any) {
        if (this.url != null) {
            let data = await fetch(this.url, options)
            this.render(await data.json(), funcArgs)
        }
    }

    readFromElement(name: string): string {
        let t = <HTMLElement>this.childElements?.get(name)!
        return t.innerText;
    }
}

function checkIfAction(child: HTMLElement, actionElements: HTMLElement[]) {
    if (child.hasAttribute('temp_func')) {
        if (child.hasAttribute('temp_dest_id')) {
            actionElements.push(child)
        }
    }
}

function checkIfNormal(child: HTMLElement, elements: Map<string, HTMLElement>) {
    if (child.hasAttribute('temp_name')) {
        elements.set(child.getAttribute('temp_name')!, child)
    }
}

function executeAction(child: HTMLElement, funcArgs: any, templateElements: Map<string, Element>) {
    let destName = child.getAttribute('temp_dest_id')!
    let dest = <HTMLElement>templateElements.get(destName)!
    let functionName: string = child.getAttribute('temp_func')!
    child.onclick = () => {
        let data = funcArgs[functionName]()
        console.log(data)
        if (data == null) {
            console.warn(`Warning: Function ${functionName} does not return anything`)
        }
        dest.innerText = data
    }
}

function executeNormal(child: HTMLElement, tempArgs: any) {
    let tempName = child.getAttribute('temp_name')!
    if (!tempArgs.hasOwnProperty(tempName)) {
        console.error(`Error: args does not contain ${tempName}`)
    }
    child.innerHTML = tempArgs[tempName]
}

type TemplateHandler = Template[]

function makeTemplate(templates: TemplateHandler, templateId: string, rootName: string, url: string | undefined) {
    let root: HTMLElement = document.getElementById(rootName)!
    let template: HTMLElement = document.getElementById(templateId)!

    let cloned_template: Node = template.cloneNode(true)
    template.remove()
    let newTemplate = new Template(templateId, cloned_template, root, url)
    templates.push(newTemplate)
}