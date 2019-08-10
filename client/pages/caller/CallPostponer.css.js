import css from 'styled-jsx/css'
export default css
    `
    .postpone-button{
        display: block;
        margin: 0 auto;
        margin-top: 5%;
        cursor: pointer;
        width: 2em;
        transition: transform 0.5s;
    }
    .postpone-button:hover{
        color: #555;
    }
    .postpone-button:active{
        color: #444;
    }
    .postpone-button.hide{
        transform: scale(0);
    }
    .postpone-input{
        background: transparent;
        border: none;
        outline: none;
        color: #555;
        border-bottom: 2px solid #555;
        font-size: 1.25em;
        width: 75%;
        display: block;
        margin: 0 auto;
        text-align: center;
    }
`