import React from 'react';
import PropTypes from 'prop-types';
import PubSub from 'pubsub-js';

export default class Pagination extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
            currentPage: 0,
            recordsPerPage: 3,
            totalPages: props.totalPages
        }
    }
    /**When user click on page number Previous | 1 | 2 | 3 | 4 | Next */
    changePage = (pageNumber) => {
        this.setState({currentPage: pageNumber});
        PubSub.publish('update.page', pageNumber); // Send updated page number back to the parent rss-feed component
    }
     /**When user click on previous page link */
    previousPage = () => {      
        let curPage = this.state.currentPage;
        if (curPage > 0) {
            curPage--;
            this.setState({currentPage: curPage});
        }
        PubSub.publish('update.page', curPage); // Send updated page number back to the parent rss-feed component
    }
     /**When user click on next page link */
    nextPage = () => {
        let curPage = this.state.currentPage;       
        if (curPage < this.state.totalPages.length-1) {
            curPage++;
            this.setState({currentPage: curPage});
        }
        PubSub.publish('update.page', curPage); // Send updated page number back to the parent rss-feed component
    }

    renderPagination() {
        const enabledPrevButton = this.state.currentPage > 0; // to enable previous button
        const disableNextButton = this.state.currentPage === this.state.totalPages.length-1; // to enable next button
       
        return (
            <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              <li className={"page-item " + (enabledPrevButton ? '' : 'disabled')}>
                <a className="page-link" onClick={() => this.previousPage()} href="#" >Previous</a>
              </li>
               {this.state.totalPages.map(d => <li className="page-item" key={d} onClick={() => this.changePage(d)}><a className="page-link" href="#">{d+1}</a></li>)}
              <li className={"page-item " + (disableNextButton ? 'disabled' : '')}>
                <a className="page-link next-button" onClick={() => this.nextPage()} href="#">Next</a>
              </li>
            </ul>            
          </nav>
        );
      }

	render () {                   
		return ( 
        <div className="row">                  
            {this.state.totalPages.length > 0 ?  
                <div className="container-table">
                    <div className="row">                       
                        <div>{this.renderPagination()}</div>
                    </div>
                </div> 
            :null}
        </div>)
	}

}
Pagination.propTypes = {
    totalPages: PropTypes.array
}

