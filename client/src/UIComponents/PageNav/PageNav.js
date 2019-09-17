import React from 'react';
import "./PageNav.scss";

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
                <div className="page-director clickable" onClick={()=>{this.goToPage(pageIndex + 1)}}>{">"}</div>
            </div>
            </div>;
    }
}
