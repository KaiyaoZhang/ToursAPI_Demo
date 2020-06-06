import React, { Component, Fragment } from 'react';
import { Grid } from 'semantic-ui-react';
import TourListItem from './tourListItem';

class TourList extends Component {
    state = {
        data: []
    }

    componentDidMount = async() => {
        /* fetch('http://127.0.0.1:8000/api/v1/tours')
        .then(res => res.json())
        .then(tours => this.setState({data: tours.data.docs})) */
        const res = await fetch('http://127.0.0.1:8000/api/v1/tours');
        const tours = await res.json();
        
        this.setState({data: tours.data.docs});
      }

    render() {
        return (
            <Fragment>
                {this.state.data.map((el, index) => (
                    <Grid.Column width={5} key={index} style={{marginBottom: '2%'}}>
                        <TourListItem tour={el} />
                    </Grid.Column>
                ))}    
            </Fragment>
        )
    }
};

export default TourList;
