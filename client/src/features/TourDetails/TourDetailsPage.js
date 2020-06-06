import React, { Component, Fragment } from 'react';
import {Grid, Container} from 'semantic-ui-react';
import TourDetailsHeader from './TourDetailsHeader';

export default class TourDetailsPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            tour: ''
        };
      }
   
    componentDidMount = async () => {
        const name = this.props.match.params.name.replace(/-/g, ' ');
        const res = await fetch(`http://127.0.0.1:8000/api/v1/tours?name=${name}`);
        const tour = await res.json();
        this.setState({tour: tour.data.docs[0]});
    }

    render() {
        return (
            <Fragment>
                <Container style={{width:'90%'}}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={16} textAlign={"center"}>
                                <TourDetailsHeader
                                    tour={this.state.tour}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Fragment>
        )
    }
}
