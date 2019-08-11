import React from 'react';

export default class PageNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currPage: props.currPage,
            pageCount: props.pageCount,
            goToPage: props.goToPage
        };
    }

    componentDidUpdate(prevProps, prevState, nextContent) {
        if(prevProps.currPage !== this.props.currPage){
            //Perform some operation here
            this.setState({currPage: this.props.currPage});
        }
        if(prevProps.pageCount !== this.props.pageCount){
            //Perform some operation here
            this.setState({pageCount: this.props.pageCount});
        }
    }

    goToPage(p) {
        if(p >= 0 && p < this.state.pageCount)
        this.state.goToPage(p);
    }

    render() {
        const pageIndex = this.state.currPage;
        const pageCount = this.state.pageCount;
        return <div className="page-nav-wrap">
                <style jsx global>{`
                    .list-page-nav
                    {
                    	margin: 1em;
                    	text-align: center;
                    }
                    .list-page-nav div
                    {
                    	display:inline-block;
                    	vertical-align:  middle;
                    }
                    .page-nav-btn.prev
                    {
                    	margin-right: 0;
                    }
                    .page-nav-btn.next
                    {
                    	margin-left: 0;
                    }
                    .page-nav-btn.disabled
                    {
                    	color:#bbb;
                    }
                    .page-nav-btn:not(.disabled):hover
                    {
                    	text-shadow:0px 0px 1px black;
                    }
                    .page-director
                    {
                    	font-size:1.2em;
                    	padding:0 0.25em;
                    	cursor: pointer;
                    }
                    .page-director.curr-page
                    {
                    	text-shadow:0px 0px 1px black;
                    }
                    .page-director:hover
                    {
                    	text-shadow:0px 0px 1px #90278e;
                    }
				`}
                </style>
            <div className="list-page-nav" dir="ltr">
                <div className="page-director clickable" onClick={()=>{this.goToPage(pageIndex - 1)}}>{"<"}</div>
                <div className="page-selection">
                    {pageIndex - 2 > 0 ?
                        <span className="page-director clickable" onClick={()=>{this.goToPage(0)}}>1...</span>
                        : ""
                    }
                    {pageIndex > 1 ?
                        <span className="page-director clickable" onClick={()=>{this.goToPage(pageIndex - 2)}}>{pageIndex - 1}</span>
                        : ""
                    }
                    {pageIndex > 0 ?
                        <span className="page-director clickable" onClick={()=>{this.goToPage(pageIndex - 1)}}>{pageIndex}</span>
                        : ""
                    }
                    <span className="page-director curr-page">{pageIndex + 1}</span>
                    {pageIndex + 1 < pageCount ?
                        <span className="page-director clickable" onClick={()=>{this.goToPage(pageIndex + 1)}}>{pageIndex + 2}</span>
                        : ""
                    }
                    {pageIndex + 2 < pageCount?
                        <span className="page-director clickable" onClick={()=>{this.goToPage(pageIndex + 2)}}>{pageIndex + 3}</span>
                        : ""
                    }
                    {pageIndex + 3 < pageCount ?
                        <span className="page-director clickable" onClick={()=>{this.goToPage(pageCount - 1)}}>{"..." + (pageCount)}</span>
                        : ""
                    }
                </div>
                <div className="page-director clickable" onClick={()=>{this.goToPage(pageIndex - 1)}}>{">"}</div>
            </div>
            </div>;
    }
}
