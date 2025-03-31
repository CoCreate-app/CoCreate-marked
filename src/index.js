import { marked } from "marked";
import elementPrototype from "@cocreate/element-prototype";
import { queryElements } from "@cocreate/utils";
import Actions from "@cocreate/actions";
import Observer from "@cocreate/observer";
import "github-markdown-css/github-markdown.css";
import "./index.css";

function init(elements) {
	if (
		elements &&
		!Array.isArray(elements) &&
		!(elements instanceof HTMLCollection) &&
		!(elements instanceof NodeList)
	)
		elements = [elements];
	if (!elements)
		elements = document.querySelectorAll(
			"[marked], [marked-selector], [marked-closest], [marked-parent], [marked-next], [marked-previous]"
		);
	for (let element of elements) {
		initElement(element);
	}
}

function initElement(element) {
	// Create a custom renderer for `marked`
	const renderer = new marked.Renderer();
	const options = { renderer };
	// Override the `code` method to generate a <textarea> with type="code" instead of <pre><code>
	let codeTemplate = element.getAttribute("marked-code");
	if (codeTemplate) {
		renderer.code = function (code) {
			// TODO: santize code
			const finalTemplate = codeTemplate
				.replace(/\$\{code\.lang\}/g, code.lang)
				.replace(/\$\{code\.text\}/g, sanitize(code.text));
			return finalTemplate;
		};
	}

	// Use the custom renderer with `marked`
	element.getValue = () => {
		let value = elementPrototype.getValue(element) || "";
		value = marked.parse(value, options);
		return value;
	};

	const htmlContent = element.getValue();
	let targets = queryElements({ element, prefix: "marked" });
	if (targets) setHtml(targets, htmlContent);
}

function setHtml(elements, htmlContent) {
	for (let element of elements) {
		element.setValue = (value) => {
			elementPrototype.setValue(element, value);
		};

		element.setValue(htmlContent);
	}
}

function sanitize(str) {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

Actions.init({
	name: "marked",
	endEvent: "marked",
	callback: (action) => {
		// TODO: markedAction
	}
});

Observer.init({
	name: "CoCreateMarkedAddedNodes",
	types: ["addedNodes"],
	selector: "[marked]",
	callback: function (mutation) {
		init(mutation.target);
	}
});

Observer.init({
	name: "CoCreateMarkedAttributes",
	types: ["attributes"],
	attributeFilter: ["storage", "database", "array", "index", "object", "key"],
	// target: selector, // blocks mutations when applied
	callback: function (mutation) {}
});

init();
