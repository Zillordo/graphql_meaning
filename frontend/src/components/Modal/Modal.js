import React from 'react';

const modal = props =>(
    <div className="modal">
        <header className="modal__header"><h1>{props.title}</h1></header>
        <section className="modal__content">{props.children}</section>
        <section className="modal__actions">
        {props.canAdd && <button className="butn" onClick={props.onAdd}>Add</button>}
        {props.canCancle && <button className="butn" onClick={props.onCancel}>Cancle</button>}
        </section>
    </div>
);

export default modal;