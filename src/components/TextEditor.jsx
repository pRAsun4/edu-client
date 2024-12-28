import React, { useState, useCallback, useEffect } from "react";
import {
  createEditor,
  Editor,
  Transforms,
  Range,
  Element as SlateElement,
} from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import {
  FaLink,
  FaLinkSlash,
  FaItalic,
  FaUnderline,
  FaBold,
} from "react-icons/fa6";

const Toolbar = ({ editor, hasVariable }) => {
  const toggleMark = (format) => {
    const isActive = CustomEditor.isMarkActive(editor, format);
    Editor.addMark(editor, format, !isActive);
  };

  const toggleLink = () => {
    if (CustomEditor.isLinkActive(editor)) {
      Transforms.unwrapNodes(editor, { match: (n) => n.type === "link" });
    } else {
      const url = prompt("Enter the URL");
      if (url) CustomEditor.wrapLink(editor, url);
    }
  };

  const insertVariable = (variable) => {
    CustomEditor.insertVariable(editor, variable);
  };

  return (
    <div className="toolbar">
      <div className="toolbar__group">
        <button onClick={() => toggleMark("bold")}><FaBold /></button>
        <button onClick={() => toggleMark("italic")}><FaItalic /></button>
        <button onClick={() => toggleMark("underline")}><FaUnderline /></button>
        <button onClick={toggleLink}>
          {CustomEditor.isLinkActive(editor) ? <FaLinkSlash size={20} /> : <FaLink size={20} />}
        </button>
      </div>
      {hasVariable && (
        <select onChange={(e) => insertVariable(e.target.value)}>
          <option value="" disabled>Insert Variable</option>
          <option value="first_name">First Name</option>
          <option value="org_name">Organization Name</option>
          <option value="review_link">Review Link</option>
        </select>
      )}
    </div>
  );
};

const CustomEditor = {
  isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },

  isLinkActive(editor) {
    const [link] = Editor.nodes(editor, { match: (n) => n.type === "link" });
    return !!link;
  },

  wrapLink(editor, url) {
    const isCollapsed = editor.selection && Range.isCollapsed(editor.selection);
    const link = {
      type: "link",
      url,
      children: isCollapsed ? [{ text: url }] : [],
      inline: true,
    };
    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: "end" });
    }
  },

  insertVariable(editor, variable) {
    const variableElement = {
      type: "variable",
      inline: true,
      variable: `{{${variable}}}`,
      children: [{ text: `{{${variable}}}` }],
    };
    Transforms.insertNodes(editor, variableElement);
  },
};

const deserialize = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;

  const processChildNode = (node) => {
    const nodeTypeMap = {
      B: "bold",
      I: "italic",
      U: "underline",
    };

    if (node.nodeName === "A") {
      return {
        type: "link",
        url: node.href,
        inline: true,
        children: [{ text: node.textContent }],
      };
    }

    if (node.nodeName === "SPAN" && /^{{.*}}$/.test(node.textContent)) {
      return {
        type: "variable",
        inline: true,
        variable: node.textContent,
        children: [{ text: node.textContent }],
      };
    }

    if (nodeTypeMap[node.nodeName]) {
      return {
        text: node.textContent,
        [nodeTypeMap[node.nodeName]]: true,
      };
    }

    return { text: node.textContent };
  };

  return Array.from(div.childNodes).map((node) => {
    if (node.nodeName === "P") {
      return {
        type: "paragraph",
        children: Array.from(node.childNodes).map(processChildNode),
      };
    }
    return processChildNode(node);
  });
};

const serialize = (value) => {
  const html = value.map((node) => {
    const children = node.children
      .map((child) => {
        if (child.bold) return `<b>${child.text}</b>`;
        if (child.italic) return `<i>${child.text}</i>`;
        if (child.underline) return `<u>${child.text}</u>`;
        return child.text;
      })
      .join("");

    switch (node.type) {
      case "link":
        return `<a href="${node.url}">${children}</a>`;
      case "variable":
        return `<span>${children}</span>`;
      case "paragraph":
      default:
        return `<p>${children}</p>`;
    }
  });

  return html.join("");
};

export const TextEditor = ({ value: propValue, onChange, hasVariable = false }) => {
  const [editor] = useState(() => withReact(withHistory(createEditor())));
  const [value, setValue] = useState(deserialize(propValue || "<p>Enter some text</p>"));

  useEffect(() => {
    setValue(deserialize(propValue || "<p>Enter some text</p>"));
  }, [propValue]);

  const handleChange = useCallback(
    (newValue) => {
      const htmlContent = serialize(newValue);
      setValue(newValue);
      onChange(htmlContent);
    },
    [onChange]
  );

  return (
    <div className="editor-container">
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <Toolbar editor={editor} hasVariable={hasVariable} />
        <Editable
          className="editor__main min-h-[150px]"
          renderElement={(props) => <Element {...props} />}
          renderLeaf={(props) => <Leaf {...props} />}
          onKeyDown={(e) => {
            if (!e.ctrlKey) return;
            switch (e.key) {
              case "b":
                e.preventDefault();
                toggleMark("bold");
                break;
              case "i":
                e.preventDefault();
                toggleMark("italic");
                break;
              case "u":
                e.preventDefault();
                toggleMark("underline");
                break;
              default:
                break;
            }
          }}
        />
      </Slate>
    </div>
  );
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "link":
      return (
        <a
          href={element.url}
          {...attributes}
          style={{
            color: "blue",
            textDecoration: "underline",
            display: "inline",
          }}
        >
          {children}
        </a>
      );
    case "variable":
      return (
        <span
          {...attributes}
          style={{
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            padding: "0 2px",
            display: "inline",
          }}
        >
          {children}
        </span>
      );
    case "paragraph":
    default:
      return (
        <span {...attributes} style={{ display: "inline" }}>
          {children}
        </span>
      );
  }
};


const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;

  return <span {...attributes}>{children}</span>;
};
