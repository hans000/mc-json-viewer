import React from "react";

export interface IMcTreeData {
    title: string;
    description: string;
    frame: string;
    icon: string;
    children: IMcTreeData[]
}
interface IProps {
    data: IMcTreeData[];
    lang: { [name: string]: string }
}
export default function (props: IProps) {
    function create(data: IMcTreeData[]): any {
        return /*#__PURE__*/React.createElement("ul", null, data.map(({
            title,
            children,
            icon,
            frame,
            description
        }) => {
        return /*#__PURE__*/React.createElement("li", {
            key: title
        }, /*#__PURE__*/React.createElement("span", {
            className: frame,
            style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
            }
        }, /*#__PURE__*/React.createElement("i", {
            style: {
            display: 'inline-block'
            },
            className: `icon-${icon.slice(10)}`
        }), /*#__PURE__*/React.createElement("div", {
            className: "tooltip"
        }, /*#__PURE__*/React.createElement("p", {
            className: "title"
        }, props.lang[title] ? props.lang[title] : title), /*#__PURE__*/React.createElement("p", {
            className: "desc"
        }, props.lang[description] ? props.lang[description] : description))), children && children.length ? create(children) : null);
        }));
    }

    return /*#__PURE__*/React.createElement("div", {
        className: "mc-tree"
    }, create(props.data));
}