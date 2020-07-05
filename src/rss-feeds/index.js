import React from 'react';
import Service from '../service/index';
import Pagination from '../pagination';
import PubSub from 'pubsub-js';


export default class RSSFeeds extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
           rssFeeds: [],
           rssFeedUrl: '',
           showError: false,
           errorMessage: '',
           currentPage: 0,
           recordsPerPage: 3,
           totalPages: []
        }
        this.pageRecords = [] // Array of items to be displayed on page	
    } 

    componentDidMount = () => {
        PubSub.subscribe('update.page', this.updatePageNumber); // Get page number from pagination component
        this.createMyFilter();
        this.createMyReduce();        
    }

    updatePageNumber = (e, pagNum) => {
        this.setState({currentPage: pagNum});
        this.forceUpdate();
    } 

    createMyFilter = () => {
        Array.prototype.myFilter = function(condition, thisArg) {
            let j = 0;        
            this.forEach((el, index) => {
                if (condition.call(thisArg, el, index, this)) {
                    if (index !== j) {
                        this[j] = el;
                    }
                    j++;
                }
            })        
            this.length = j;
            return this;
        }      
    }

    createMyReduce = () => {
          Array.prototype.myReduce = function(fn,initial) {
            let arayEl = this;
            console.log(arayEl);
            let total = initial || 0;
            for(let i=0;i<arayEl.length;i++) {
                total = fn(total,arayEl[i]);
            }
            return total;
        }
    }

    fetchRssFeeds = (event) => {
        event.preventDefault();       
        this.setState({ currentPage: 0});
        if (Service.isValidURL(this.state.rssFeedUrl)) { // If RSS Feed URL is valid
        let data = Service.fetchListOfRssFeeds(this.state.rssFeedUrl);
        data.then(function(feedsData) {
            if(feedsData['status'] === 'ok') {
                this.setState({
                    rssFeeds: feedsData['items'],
                    errorMessage: '',
                    showError: false,
                    totalPages: Array.from(Array(Math.ceil(feedsData['items'].length/3)).keys())
                });
            } else if (feedsData['status'] === 'error') {
                this.setState({
                    rssFeeds: [],
                    errorMessage: feedsData['message'],
                    showError: true,
                    totalPages: []
                });
            }
         }.bind(this));
        } else {
            this.setState({
                rssFeeds: [],
                errorMessage: 'Please enter a valid RSS feed URL',
                showError: true
            }); 
        }
    }  
    
    renderFeedItems = () => {
         /**start myMap */
        Array.prototype.myMap = function(callback) {
            let newArray = [];
            let x = this.length;
            for (let i = 0; i < x; i++) {
              let counter = callback(this[i]);
              newArray.push(counter);
            }
            return newArray;
          };
        /**End myMap */
          
        return this.pageRecords.length > 0 ? 
        this.pageRecords.myMap((item) => {
			return <tr key={item.guid}>
				<td>{item.guid}</td>
				<td>{item.title}</td>	
                <td>{item.author}</td>
                <td>{item.pubDate}</td>
			</tr>
		}) : null
    }

    onChangeRssUrl = (event) => {
        this.setState({rssFeedUrl: event.target.value})
    }

    onHideError = () => {
        this.setState({showError: false});
    }

	render () {   
        this.pageRecords = this.state.rssFeeds.slice(this.state.currentPage*this.state.recordsPerPage, (this.state.currentPage+1)*this.state.recordsPerPage);       
           
		return (
            <div className="container">
                { this.state.showError ?  
               <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error! </strong>{this.state.errorMessage}
                <button type="button" className="close" data-hide="alert" aria-label="Close" onClick={this.onHideError}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            : null}
                <div className="row"> 
                    <form className="form-inline">
                        <div className="form-group mb-2">
                            <input type="text" placeholder="Enter RSS feed url" onChange={this.onChangeRssUrl} className="form-control" id="exampleInputEmail1"/>
                        </div>                        
                        <button type="submit" className="btn btn-success mb-2" onClick={this.fetchRssFeeds}>Submit</button>
                    </form>
                    {this.pageRecords.length > 0 ?  
				        <div className="container-table">
                            <div className="row">
                                <table className="table table-striped table-dark">
                                    <thead>
                                        <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Author Name</th>
                                        <th scope="col">Published Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderFeedItems()}
                                    </tbody>
                                </table>
                                <div><Pagination totalPages={this.state.totalPages}></Pagination></div>
                            </div>
                        </div> 
			        :null}
                </div>
            </div>
            )
	}

}

