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
export default function(props: IProps) {
    function create(data: IMcTreeData[]) {
        return (
            <ul>
                {
                    data.map(({ title, children, icon, frame, description }) => {
                        return (
                            <li key={title}>
                                <span className={frame} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <i style={{ display: 'inline-block' }} className={`icon-${icon.slice(10)}`}></i>
                                    <div className="tooltip">
                                        <p className='title'>{props.lang[title] ? props.lang[title] : title}</p>
                                        <p className='desc'>{props.lang[description] ? props.lang[description] : description}</p>
                                    </div>
                                </span>
                                {children && children.length ? create(children) : null}
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
    return (
        <div className='mc-tree'>
            {create(props.data)}
        </div>
    );
}