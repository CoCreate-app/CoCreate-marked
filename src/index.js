import { marked } from 'marked';
import elementPrototype from '@cocreate/element-prototype';
import { queryElements } from '@cocreate/utils';
import Actions from '@cocreate/actions';
import Observer from '@cocreate/observer';
import Prism from "@cocreate/prism"
import 'github-markdown-css/github-markdown.css';
import './index.css';

function init(elements) {
    if (elements && !Array.isArray(elements) && !(elements instanceof HTMLCollection) && !(elements instanceof NodeList))
        elements = [elements]
    if (!elements)
        elements = document.querySelectorAll('[marked], [marked-selector], [marked-closest], [marked-parent], [marked-next], [marked-previous]');
    for (let element of elements) {
        initElement(element);
    }

    const markdownBody = document.querySelector('.markdown-body');
    if (markdownBody) {
        markdownBody.addEventListener('input', function (event) {
            Prism.highlightAll();
        });
    }
}

function initElement(element) {
    element.getValue = () => {
        return marked.parse(elementPrototype.getValue(element));
    }

    const htmlContent = element.getValue()
    let targets = queryElements({ element, prefix: 'marked' });
    if (targets)
        setHtml(targets, htmlContent)
}

function setHtml(elements, htmlContent) {
    for (let element of elements) {
        element.setValue = (value) => {
            elementPrototype.setValue(element, value)
            Prism.highlightAll();
        }

        element.setValue(htmlContent)
    }
    Prism.highlightAll();
}

Actions.init({
    name: "marked",
    endEvent: "marked",
    callback: (action) => {
        // TODO: markedAction
    }
});

Observer.init({
    name: 'CoCreateMarkedAddedNodes',
    observe: ['addedNodes'],
    target: '[marked]',
    callback: function (mutation) {
        init(mutation.target)
    }
})

Observer.init({
    name: 'CoCreateMarkedAttributes',
    observe: ['attributes'],
    attributeName: ['storage', 'database', 'array', 'index', 'object', 'key'],
    // target: selector, // blocks mutations when applied
    callback: function (mutation) {

    }
});


init()