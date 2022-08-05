# Little Template
## What is Little Template
This Library is focused on Providing a way to take advantage of simple template rendering in the frontend. 

## How to Install
1. Download the file or link it in script tag
````
wget https://raw.githubusercontent.com/julySteuer/littletemplate/master/dist/index.js
````
2. Include in script tag
````html
<script src="https://raw.githubusercontent.com/julySteuer/littletemplate/master/dist/index.js"></script>
````
## Usage
### Getting Started
Clone this project and serve it static with e.g. the visual studio code live server

1. Include the source file
````
<script src="https://raw.githubusercontent.com/julySteuer/littletemplate/master/dist/index.js"></script>
````
2. Create a template
````html
<div id="<your-template-name>">
    <h1 temp_name="title">
    </h1>
    <h2 temp_name="subtitle">
        This is a default subtitle
    </h2>
</div>
````
This can be created everywhere on the dom because the main template is deleted so it is never displayed.
### Important: You need to have javascript enabled otherwise this will not work at all
3. Create root element
````html
<div id="root">
</div>
````
4. Load the template
````js
let template = makeTemplate("<your-template-name>", "root")
````
This creates a template object with a templte id and a root id
5. Render a template
````js
template.render({title:"This is the title", subtitle: "This is the Subtitle"})
````
This should now render the template with the given parameters
