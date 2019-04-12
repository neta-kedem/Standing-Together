import css from 'styled-jsx/css'
export default css`
    .contribution-options{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        
    }
    .contribution-button{
        width: 3.2em;
        height: 3.2em;
        padding-top: 0.3em;
        padding: 0.3em 0.1em 0 0.1em;
        border-radius: 0.2em;
        color: white;
        background-color: #932581;
        margin: 2.5%;
        cursor: pointer;
        font-size: 1.75em;
        text-align: center;
        transition: background-color 0.1s;
    }
    .contribution-button:hover{
        background-color: #601a55;
    }
    .contribution-button:active{
        background-color: #47133e;
    }
    .contribution-iframe{
        border: none;
        width: 100%;
        height: 70vh;
    }
    .close-payment-form{
        cursor: pointer;
        font-weight: bold;
        display: inline-block;
        white-space: nowrap;
    }
    .close-payment-form-icon{
        display: inline-block;
        vertical-align: middle;
        margin-left: 5%;
        background-color: #c00;
        color: #eee;
        padding: 0.2em;
    }
    .close-payment-form-label{
        vertical-align: middle;
        display: inline-block;
    }
    .close-payment-form:hover .close-payment-form-icon{
        background-color: #a00;
    }
    .close-payment-form:active .close-payment-form-icon{
        background-color: #800;
    }
`