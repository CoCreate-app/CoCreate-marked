import { marked } from 'marked';
import Prism from "@cocreate/prism"


const markdown = `
# This is a heading

Here is some regular text.

\`\`\`javascript
console.log('Hello, world!');
\`\`\`

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Example</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
\`\`\`

\`\`\`css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
}
h1 {
    color: #333;
}
\`\`\`
`;

// Convert markdown to HTML using marked
const htmlContent = marked.parse(markdown);

// Set the converted HTML content
// document.getElementById('content').innerHTML = htmlContent;

// Highlight code blocks using Prism.js
Prism.highlightAll();