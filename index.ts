class Template {
    name:string
    templateNode: Node
    root: Node
    url: string | undefined

    constructor(name: string, templateNode: Node, root:Node, url?: string) {
        this.name = name
        this.templateNode = templateNode
        this.root = root
        this.url = url
    }

    render(args: any) {
        let elems = <Element> this.templateNode
        for(var i:number = 0; i < elems.children.length;i++) {
            if (elems.children[i].hasAttribute('temp_name')) {
                let tempName = elems.children[i].getAttribute('temp_name')!
                if (!args.hasOwnProperty(tempName)) {
                    console.error(`Error: args does not contain ${tempName}`)
                }
                elems.children[i].innerHTML = args[tempName]
            }
        }
        this.root.appendChild(this.templateNode)
    }

    async renderFromRemote(options: any) {
        if (this.url != null) {
                let data = await fetch(this.url, options)
                this.render(await data.json())
        }
    }
}

type TemplateHandler = Template[]

function makeTemplate(templates: TemplateHandler, templateId: string, rootName: string, url: string | undefined) {
    let root: HTMLElement = document.getElementById(rootName)!
    let template: HTMLElement = document.getElementById(templateId)!

    let cloned_template:Node = template.cloneNode(true)
    template.remove()
    let newTemplate = new Template(templateId, cloned_template, root, url)
    templates.push(newTemplate)
}